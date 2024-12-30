<script>
  // Import required Svelte lifecycle methods and components
  import { onMount } from 'svelte'; // Executes a function when the component is mounted
  import { tick } from 'svelte'; // Waits for the DOM to update before proceeding
  import Header from '../header/header.svelte'; // Importing a reusable header component

  // Define variables for data and states
  let trackingId = ''; // Stores the tracking ID entered by the user
  let shipmentDetails = null; // Holds shipment details fetched from the server
  let shipmentLocations = []; // Stores locations related to the shipment
  let errorMessage = ''; // Displays error messages to the user
  let map; // Google Maps instance
  let googleMapsLoaded = false; // Tracks if Google Maps API is loaded
  let distance = null; // Distance between sender and receiver locations
  let statusMarker = null; // Marker representing the shipment's status on the map
  let animationInterval = null; // Interval for animating the marker movement

  // URLs for different map markers
  const iconUrl = 'https://cdn-icons-png.flaticon.com/128/1048/1048329.png'; // Icon for shipment status marker
  const recicon = 'https://cdn-icons-png.flaticon.com/128/14090/14090489.png'; // Icon for receiver marker
  const senicon = 'https://cdn-icons-png.flaticon.com/128/2776/2776067.png'; // Icon for sender marker

  // Function to fetch and display shipment details
  async function trackShipment() {
    // If tracking ID is empty, display an error
    if (!trackingId) {
      errorMessage = "Please enter a tracking ID";
      return;
    }
    try {
      // Make an API request to fetch shipment data
      const response = await fetch(`http://localhost:3000/api/shipping/${trackingId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token for authorization
        },
      });

      const data = await response.json(); // Parse the JSON response

      // If the request is successful, update data and initialize the map
      if (response.ok) {
        shipmentDetails = data.shipment;
        shipmentLocations = data.locations;
        errorMessage = '';
        await initializeMap(); // Render the map with the fetched details
      } else {
        // Handle API errors
        errorMessage = data.error || "Error fetching shipment details.";
        shipmentDetails = null;
        shipmentLocations = [];
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error tracking shipment:", error.message);
      errorMessage = "Error tracking the shipment";
      shipmentDetails = null;
      shipmentLocations = [];
    }
  }

  // Function to animate the shipment marker along the route
  function moveMarkerAlongRoute(route, startRatio) {
    clearAnimation(); // Clear any existing animations
    const path = route.steps.flatMap(step => step.path); // Extract path points from the route
    const totalPoints = path.length;

    // Calculate the starting index for the animation
    const startIndex = Math.floor(totalPoints * startRatio);
    let currentIndex = startIndex;

    // Create a new marker at the starting position
    statusMarker = new google.maps.Marker({
      position: path[currentIndex],
      map: map,
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(32, 32), // Set the icon size
      },
      title: `Shipment Status: ${shipmentDetails.status}`, // Add a tooltip with the status
    });

    // Animate the marker along the route
    animationInterval = setInterval(() => {
      if (currentIndex >= totalPoints - 1) {
        //clearAnimation(); // Stop animation when the end is reached
        return;
      }
      currentIndex++;
      statusMarker.setPosition(path[currentIndex]); // Move marker to the next point
    }, 500); // Speed of animation in milliseconds
  }

  // Function to place a marker at the delivered location
  function placeDeliveredMarker(position) {
    clearAnimation(); // Stop any ongoing animations
    statusMarker = new google.maps.Marker({
      position: position,
      map: map,
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(32, 32),
      },
      title: `Shipment Status: Delivered`, // Tooltip for the delivered status
    });
  }

  // Function to clear animations and markers
  function clearAnimation() {
    if (animationInterval) {
      clearInterval(animationInterval); // Clear the animation interval
      animationInterval = null;
    }
    if (statusMarker) {
      statusMarker.setMap(null); // Remove the marker from the map
      statusMarker = null;
    }
  }

  // Function to initialize and render the map
  async function initializeMap() {
    await tick(); // Wait for the DOM to update
    const mapDiv = document.getElementById('map'); // Get the map container element
    if (!mapDiv) {
      console.error("Map div not found!");
      return;
    }

    // Validate shipment data
    if (!shipmentDetails || !shipmentLocations.length) {
      console.error("Shipment details or locations are missing.");
      return;
    }

    // Define sender and receiver coordinates
    const senderLatLng = {
      lat: parseFloat(shipmentDetails.sender_latitude),
      lng: parseFloat(shipmentDetails.sender_longitude),
    };
    const receiverLatLng = {
      lat: parseFloat(shipmentLocations[0]?.latitude || 0),
      lng: parseFloat(shipmentLocations[0]?.longitude || 0),
    };

    // Initialize the Google Map
    map = new google.maps.Map(mapDiv, {
      center: senderLatLng,
      zoom: 8,
    });

    // Adjust the map bounds to fit sender and receiver
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(senderLatLng);
    bounds.extend(receiverLatLng);
    map.fitBounds(bounds);

    // Place markers for sender and receiver
    new google.maps.Marker({
      position: senderLatLng,
      map: map,
      icon: {
        url: senicon,
        scaledSize: new google.maps.Size(32, 32),
      },
      title: "Sender Location",
    });

    new google.maps.Marker({
      position: receiverLatLng,
      map: map,
      icon: {
        url: recicon,
        scaledSize: new google.maps.Size(32, 32),
      },
      title: "Receiver Location",
    });

    // Request and display the route between sender and receiver
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const request = {
      origin: senderLatLng,
      destination: receiverLatLng,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    // Handle route data and marker placement
    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result); // Render the route on the map
        const route = result.routes[0].legs[0];
        distance = route.distance.text; // Save the distance

        // Place or animate markers based on shipment status
        if (shipmentDetails.status === "Placed") {
          moveMarkerAlongRoute(route, 0); // Start from sender
        } else if (shipmentDetails.status === "In Transit") {
          moveMarkerAlongRoute(route, 0.5); // Start from halfway
        } else if (shipmentDetails.status === "Delivered") {
          placeDeliveredMarker(receiverLatLng); // Mark as delivered
        }
      } else {
        console.error('Directions request failed due to ' + status);
      }
    });
  }

  // Function to load the Google Maps API
  async function loadGoogleMapsAPI() {
    // If already loaded, resolve immediately
    if (window.google && window.google.maps) {
      googleMapsLoaded = true;
      return Promise.resolve();
    }
    // Load the Google Maps API script
    if (!googleMapsLoaded) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
        script.async = true; // Load asynchronously
        script.onload = () => {
          googleMapsLoaded = true;
          resolve();
        };
        script.onerror = () => reject(new Error('Failed to load Google Maps API'));
        document.head.appendChild(script);
      });
    }
  }

  // Load the Google Maps API when the component is mounted
  onMount(async () => {
    try {
      await loadGoogleMapsAPI();
    } catch (error) {
      console.error('Failed to load Google Maps API:', error.message);
    }
  });
</script>


<Header/>

<main class="main">
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

