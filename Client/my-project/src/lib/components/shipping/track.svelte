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

<style>
  /* General Reset */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .main {
    margin: 80px auto;
    text-align: center;
    max-width: 900px;
    padding: 30px;
    background: white;
    box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
  }

  .main h1 {
    font-size: 3rem;
    font-weight: 700;
    background: linear-gradient(to right, #ff416c, #ff4b2b);
    -webkit-background-clip: text;
    color: transparent;
    margin-bottom: 20px;
  }

  .track-container {
    margin-top: 40px;
    animation: fadeInUp 1s ease;
  }

  .input-group {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 30px;
  }

  .tracking-input {
    padding: 12px 16px;
    font-size: 18px;
    width: 350px;
    border: 2px solid #ddd;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.3s ease-in-out;
  }

  .tracking-input:focus {
    border-color: #ff4b2b;
    box-shadow: 0px 0px 8px rgba(255, 75, 43, 0.3);
  }

  .track-button {
    padding: 12px 24px;
    font-size: 18px;
    font-weight: 600;
    color: white;
    background: linear-gradient(to right, #ff416c, #ff4b2b);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  }

  .track-button:hover {
    transform: scale(1.05);
    background: linear-gradient(to right, #ff4b2b, #ff416c);
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.25);
  }

  .shipment-details {
    background: #fef9f9;
    border: 2px solid #ffe0e0;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    animation: fadeInUp 1s ease-in-out;
  }

  .shipment-details p {
    margin: 10px 0;
    font-size: 18px;
    color: #333;
  }

  .shipment-details strong {
    color: #ff4b2b;
  }

  .map-container {
    width: 100%;
    height: 450px;
    margin-top: 30px;
    border: 2px solid #ff4b2b;
    border-radius: 12px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    animation: zoomIn 1s ease-in-out;
  }

  .error {
    color: #ff4b2b;
    font-weight: bold;
    margin-top: 20px;
    animation: fadeIn 0.5s ease;
  }

  /* Keyframe Animations */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes zoomIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>

