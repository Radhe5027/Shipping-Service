<script>
  import { onMount } from 'svelte';
  import { tick } from 'svelte';

  let trackingId = '';
  let shipmentDetails = null;
  let shipmentLocations = [];
  let errorMessage = '';
  let map;
  let googleMapsLoaded = false;

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
    console.log("Fetched Data:", data); // Debugging API response

    if (response.ok) {
      shipmentDetails = data.shipment;
      shipmentLocations = data.locations;
      console.log("Shipment Locations:", shipmentLocations); // Debugging locations
      errorMessage = '';
      await initializeMap(); // Ensure map is initialized after DOM updates
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
  await tick(); // Wait for DOM updates
  const mapDiv = document.getElementById('map');
  if (!mapDiv) {
    console.error("Map div not found!");
    return;
  }

  if (!google || !google.maps) {
    console.error("Google Maps API is not loaded");
    return;
  }

  const defaultLocation = { lat: 0, lng: 0 };

  map = new google.maps.Map(mapDiv, {
    center: shipmentLocations.length
      ? { lat: shipmentLocations[0].latitude, lng: shipmentLocations[0].longitude }
      : defaultLocation,
    zoom: 10,
  });

  console.log("Map initialized with center:", map.getCenter());

  shipmentLocations.forEach((location, index) => {
    console.log("Adding marker at:", location);
    new google.maps.Marker({
      position: { lat: location.latitude, lng: location.longitude },
      map: map,
      title: `Location ${index + 1}`,
    });
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
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBhgZBIQiUkedZJdBPnEIpGy3ChBuhwLnw';
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
      console.log('Google Maps API loaded');
    } catch (error) {
      console.error('Failed to load Google Maps API:', error.message);
    }
  });
</script>

<main>
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
        <p><strong>Receiver:</strong> {shipmentDetails.reciver_name}</p>
        <p><strong>Status:</strong> {shipmentDetails.status}</p>
        <p><strong>Address:</strong> {shipmentDetails.reciver_address}</p>
      </div>

      <div id="map" class="map-container"></div>
    {/if}

    {#if errorMessage}
      <div class="error">{errorMessage}</div>
    {/if}
  </div>
</main>

<style>
  .track-container {
    text-align: center;
    margin-top: 20px;
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
