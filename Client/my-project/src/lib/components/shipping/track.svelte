<script>
  // Import necessary functions from Svelte
  import { onMount } from 'svelte'; // Lifecycle function for performing actions when the component is mounted
  import { tick } from 'svelte'; // Function to trigger a reactivity update
  import Header from '../header/header.svelte'; // Importing a header component

  // Declare variables to store shipment data, error messages, map object, etc.
  let trackingId = ''; // Tracking ID to fetch shipment details
  let shipmentDetails = null; // Shipment details object to store fetched data
  let shipmentLocations = []; // List of shipment locations (coordinates)
  let errorMessage = ''; // Error message to display when issues occur
  let map; // Google Map object
  let googleMapsLoaded = false; // Boolean flag to check if Google Maps API is loaded
  let distance = null; // Distance between sender and receiver

  // Default URLs for icons to represent sender, receiver, and shipment status
  const iconUrl = 'https://cdn-icons-png.flaticon.com/128/9279/9279555.png'; // Default icon for shipment status
  const recicon = 'https://cdn-icons-png.flaticon.com/128/14090/14090489.png'; // Receiver icon
  const senicon = "https://cdn-icons-png.flaticon.com/128/2776/2776067.png"; // Sender icon

  // Function to track a shipment using the provided tracking ID
  async function trackShipment() {
    // Check if tracking ID is provided, if not, show an error message
    if (!trackingId) {
      errorMessage = "Please enter a tracking ID";
      return;
    }
    try {
      // Fetch shipment details from the server using the tracking ID
      const response = await fetch(`http://localhost:3000/api/shipping/${trackingId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Authorization header with token
        },
      });

      const data = await response.json(); // Parse the response as JSON

      if (response.ok) {
        // If the response is successful, assign shipment details and locations
        shipmentDetails = data.shipment;
        shipmentLocations = data.locations;
        errorMessage = ''; // Clear error message
        await initializeMap(); // Initialize map if shipment data is successfully fetched
      } else {
        // Handle errors from the server
        errorMessage = data.error || "Error fetching shipment details.";
        shipmentDetails = null;
        shipmentLocations = [];
      }
    } catch (error) {
      // Catch any network or other errors during the fetch process
      console.error("Error tracking shipment:", error.message);
      errorMessage = "Error tracking the shipment"; // Display a generic error message
      shipmentDetails = null;
      shipmentLocations = [];
    }
  }

  // Function to initialize the Google Map with sender and receiver locations
  async function initializeMap() {
    await tick(); // Ensure Svelte's reactivity system is up to date

    const mapDiv = document.getElementById('map'); // Get the map div from the DOM
    if (!mapDiv) {
      console.error("Map div not found!"); // Log an error if the div is not found
      return;
    }

    // Ensure shipment details and locations exist before proceeding
    if (!shipmentDetails || !shipmentLocations.length) {
      console.error("Shipment details or locations are missing.");
      return;
    }

    // Create latitude and longitude objects for sender and receiver
    const senderLatLng = {
      lat: parseFloat(shipmentDetails.sender_latitude),
      lng: parseFloat(shipmentDetails.sender_longitude),
    };
    const receiverLatLng = {
      lat: parseFloat(shipmentLocations[0]?.latitude || 0),
      lng: parseFloat(shipmentLocations[0]?.longitude || 0),
    };

    // Check if sender or receiver coordinates are invalid
    if (senderLatLng.lat === 0 && senderLatLng.lng === 0) {
      console.warn("Sender coordinates are invalid or missing.");
    }
    if (receiverLatLng.lat === 0 && receiverLatLng.lng === 0) {
      console.warn("Receiver coordinates are invalid or missing.");
    }

    // Initialize the map centered around the sender location
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

    // Add markers for sender and receiver locations on the map
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

    // Create DirectionsService and DirectionsRenderer to calculate the route
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Define the route request from sender to receiver
    const request = {
      origin: senderLatLng,
      destination: receiverLatLng,
      travelMode: google.maps.TravelMode.DRIVING, // Mode of travel (driving)
    };

    // Request the route and handle the response
    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result); // Render the route on the map

        // Calculate and store the distance
        const route = result.routes[0].legs[0];
        distance = route.distance.text; // Distance in human-readable format

        // Add a marker based on the shipment status
        if (shipmentDetails.status === "Placed") {
          placeOrderPlacedMarker(senderLatLng); // Order placed
        } else if (shipmentDetails.status === "In Transit") {
          placeInTransitMarker(route); // Shipment in transit
        } else if (shipmentDetails.status === "Delivered") {
          placeDeliveredMarker(receiverLatLng); // Delivered
        }
      } else {
        console.error('Directions request failed due to ' + status); // Log errors from DirectionsService
      }
    });

    // Function to place a marker for "Order Placed" status at the sender's location
    function placeOrderPlacedMarker(position) {
      const statusMarker = new google.maps.Marker({
        position: position,
        map: map,
        icon: {
          url: iconUrl,
          scaledSize: new google.maps.Size(32, 32),
        },
        title: `Shipment Status: Order Placed`,
      });

      const statusInfo = new google.maps.InfoWindow({
        content: `<div><strong>Status</strong><br>Order Placed</div>`,
      });

      statusMarker.addListener("click", () => statusInfo.open(map, statusMarker)); // Display info on marker click
    }

    // Function to place a marker for "In Transit" status at the midpoint of the route
    function placeInTransitMarker(route) {
      const totalDistance = route.distance.value; // Total distance in meters
      const midpointDistance = totalDistance * 0.5; // 50% of the way

      let cumulativeDistance = 0;
      let markerPosition = null;

      // Loop through the route steps and find the midpoint
      for (let step of route.steps) {
        const stepDistance = step.distance.value; // Distance of the current step
        cumulativeDistance += stepDistance;

        if (cumulativeDistance >= midpointDistance) {
          const segmentRatio = (midpointDistance - (cumulativeDistance - stepDistance)) / stepDistance;
          const lat = step.path[0].lat() + (step.path[1].lat() - step.path[0].lat()) * segmentRatio;
          const lng = step.path[0].lng() + (step.path[1].lng() - step.path[0].lng()) * segmentRatio;

          markerPosition = { lat, lng };
          break;
        }
      }

      const statusMarker = new google.maps.Marker({
        position: markerPosition,
        map: map,
        icon: {
          url: iconUrl,
          scaledSize: new google.maps.Size(32, 32),
        },
        title: `Shipment Status: In Transit`,
      });

      const statusInfo = new google.maps.InfoWindow({
        content: `<div><strong>Status</strong><br>In Transit</div>`,
      });

      statusMarker.addListener("click", () => statusInfo.open(map, statusMarker)); // Display info on marker click
    }

    // Function to place a marker for "Delivered" status at the receiver's location
    function placeDeliveredMarker(position) {
      const statusMarker = new google.maps.Marker({
        position: position,
        map: map,
        icon: {
          url: iconUrl,
          scaledSize: new google.maps.Size(32, 32),
        },
        title: `Shipment Status: Delivered`,
      });

      const statusInfo = new google.maps.InfoWindow({
        content: `<div><strong>Status</strong><br>Delivered</div>`,
      });

      statusMarker.addListener("click", () => statusInfo.open(map, statusMarker)); // Display info on marker click
    }
  }

  // Function to load the Google Maps API if not already loaded
  async function loadGoogleMapsAPI() {
    if (window.google && window.google.maps) {
      googleMapsLoaded = true; // If already loaded, set flag to true
      return Promise.resolve(); // Resolve promise
    }
    if (!googleMapsLoaded) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script'); // Create script element to load API
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
        script.async = true;
        script.onload = () => {
          googleMapsLoaded = true; // Set flag to true once loaded
          resolve(); // Resolve the promise
        };
        script.onerror = () => reject(new Error('Failed to load Google Maps API')); // Reject if there's an error
        document.head.appendChild(script); // Append script to head to start loading
      });
    }
  }

  // Lifecycle function to load Google Maps API when the component is mounted
  onMount(async () => {
    try {
      await loadGoogleMapsAPI(); // Attempt to load the Google Maps API
    } catch (error) {
      console.error('Failed to load Google Maps API:', error.message); // Log error if API fails to load
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
        <p><strong>Distance:</strong> {distance}</p>
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

