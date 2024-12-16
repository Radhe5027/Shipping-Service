<script>
  import { onMount } from 'svelte';
  import { tick } from 'svelte';
  import Header from '../header/header.svelte';

  let trackingId = '';
  let shipmentDetails = null;
  let shipmentLocations = [];
  let errorMessage = '';
  let map;
  let googleMapsLoaded = false;

  const iconUrl = 'https://cdn-icons-png.flaticon.com/128/9279/9279555.png'; 
  const recicon = 'https://cdn-icons-png.flaticon.com/128/14090/14090489.png';
  const senicon = "https://cdn-icons-png.flaticon.com/128/2776/2776067.png";

  async function trackShipment() {
    if (!trackingId) {
      errorMessage = "Please enter a tracking ID";
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/api/shipping/${trackingId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        shipmentDetails = data.shipment;
        shipmentLocations = data.locations;
        errorMessage = '';
        await initializeMap();
      } else {
        errorMessage = data.error || "Error fetching shipment details.";
        shipmentDetails = null;
        shipmentLocations = [];
      }
    } catch (error) {
      console.error("Error tracking shipment:", error.message);
      errorMessage = "Error tracking the shipment";
      shipmentDetails = null;
      shipmentLocations = [];
    }
  }

  async function initializeMap() {
    await tick();
    const mapDiv = document.getElementById('map');
    if (!mapDiv) {
      console.error("Map div not found!");
      return;
    }

    if (!shipmentDetails || !shipmentLocations.length) {
    console.error("Shipment details or locations are missing.");
    return;
  }

    const senderLatLng = {
      lat: parseFloat(shipmentDetails.sender_latitude),
      lng: parseFloat(shipmentDetails.sender_longitude),
    };
    const receiverLatLng = {
    lat: parseFloat(shipmentLocations[0]?.latitude || 0),
    lng: parseFloat(shipmentLocations[0]?.longitude || 0),
  };

  if (senderLatLng.lat === 0 && senderLatLng.lng === 0) {
    console.warn("Sender coordinates are invalid or missing.");
  }
  if (receiverLatLng.lat === 0 && receiverLatLng.lng === 0) {
    console.warn("Receiver coordinates are invalid or missing.");
  }

    map = new google.maps.Map(mapDiv, {
      center: senderLatLng,
      zoom: 8,
    });


    // Define bounds to include both sender and receiver locations
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(senderLatLng);
    bounds.extend(receiverLatLng);

    // Fit the map to the bounds
    map.fitBounds(bounds);

    // Add sender and receiver markers
  const senderMarker = new google.maps.Marker({
    position: senderLatLng,
    map: map,
    icon: {
      url: senicon,
      scaledSize: new google.maps.Size(32, 32), // Small icon size
    },
    title: "Sender Location",
  });

  const receiverMarker = new google.maps.Marker({
    position: receiverLatLng,
    map: map,
    icon: {
      url: recicon,
      scaledSize: new google.maps.Size(32, 32), // Small icon size
    },
    title: "Receiver Location",
  });

    // Place the dynamic status marker
    let statusPosition = senderLatLng; // Default to sender
    if (shipmentDetails.status === "In Transit") {
      statusPosition = {
        lat: (senderLatLng.lat + receiverLatLng.lat) / 2,
        lng: (senderLatLng.lng + receiverLatLng.lng) / 2,
      };
    } else if (shipmentDetails.status === "Delivered") {
      statusPosition = receiverLatLng;
    }

    const statusMarker = new google.maps.Marker({
    position: statusPosition,
    map: map,
    icon: {
      url: iconUrl,
      scaledSize: new google.maps.Size(32, 32), // Small icon size
    },
    title: `Shipment Status: ${shipmentDetails.status}`,
  });

  // Add info windows for interactivity
  const senderInfo = new google.maps.InfoWindow({
    content: `<div><strong>Sender</strong><br>${shipmentDetails.sender_address}</div>`,
  });
  const receiverInfo = new google.maps.InfoWindow({
    content: `<div><strong>Receiver</strong><br>${shipmentDetails.reciver_address}</div>`,
  });
  const statusInfo = new google.maps.InfoWindow({
    content: `<div><strong>Status</strong><br>${shipmentDetails.status}</div>`,
  });

  senderMarker.addListener("click", () => senderInfo.open(map, senderMarker));
  receiverMarker.addListener("click", () => receiverInfo.open(map, receiverMarker));
  statusMarker.addListener("click", () => statusInfo.open(map, statusMarker));


    // Draw a line connecting sender to receiver
  const pathCoordinates = [senderLatLng, receiverLatLng];
  new google.maps.Polyline({
    path: pathCoordinates,
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 5,
    map: map,
  });
}

  async function loadGoogleMapsAPI() {
    if (window.google && window.google.maps) {
      googleMapsLoaded = true;
      return Promise.resolve();
    }
    if (!googleMapsLoaded) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
        script.async = true;
        script.onload = () => {
          googleMapsLoaded = true;
          resolve();
        };
        script.onerror = () => reject(new Error('Failed to load Google Maps API'));
        document.head.appendChild(script);
      });
    }
  }

  onMount(async () => {
    try {
      await loadGoogleMapsAPI();
    } catch (error) {
      console.error('Failed to load Google Maps API:', error.message);
    }
  });
</script>

<Header/>

<main class = "main">
  <h1>Track Shipment</h1>
  <div class="track-container">
    <div class="input-group">
      <input
        type="text"
        placeholder="Enter your tracking number"
        bind:value={trackingId}
        class="tracking-input"
      />
      <button on:click={trackShipment} class="track-button">Track</button>
    </div>

    {#if shipmentDetails}
      <div class="shipment-details">
        <p><strong>Tracking ID:</strong> {shipmentDetails.tracking_id}</p>
        <p><strong>Receiver Name:</strong> {shipmentDetails.reciver_name}</p>
        <p><strong>Status:</strong> {shipmentDetails.status}</p>
        <p><strong>Reciver Address:</strong> {shipmentDetails.reciver_address}</p>
      </div>
      <div id="map" class="map-container"></div>
    {/if}

    {#if errorMessage}
      <div class="error">{errorMessage}</div>
    {/if}
  </div>
</main>

<style>.main {
  font-family: 'Arial', sans-serif;
  color: black;
  margin-top: 63px;
  text-align: center; /* Centers the content horizontally */
  padding: 20px; /* Adds padding around the content */
}

.main h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px; /* Adds space below the heading */
}

  .track-container {
    text-align: center;
    margin-top: 60px;
  }
  .tracking-input {
    padding: 10px;
    font-size: 16px;
    width: 300px;
  }
  .track-button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }
  .shipment-details {
    margin-top: 20px;
  }
  .map-container {
    width: 100%;
    height: 500px;
    margin-top: 20px;
   
  }
  .error {
    color: red;
    margin-top: 20px;
  }
</style>
