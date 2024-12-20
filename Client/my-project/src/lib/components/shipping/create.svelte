<script>
  // Importing necessary modules from Svelte and jwt-decode
  import { onMount } from "svelte"; // for lifecycle management
  import { jwtDecode } from "jwt-decode"; // to decode JWT tokens
  import Header from '../header/header.svelte'; // Importing header component

  // Defining initial shipment data structure
  let shipmentData = {
    reciver_name: "",
    reciver_address: {
      street: "",
      city: "",
      state: "",
      country: "India", // Default country set to India
      postal_code: "",
    },
    sender_address: {
      street: "",
      city: "",
      state: "",
      country: "India", // Default country set to India
      postal_code: "",
    },
    sender_latitude: "",
    sender_longitude: "",
    reciver_latitude: "",
    reciver_longitude: "",
    status: "Placed", // Default shipment status
    tracking_id: `SHIP-${Date.now()}`, // Generating tracking ID based on current timestamp
  };

  // Initializing additional variables
  let sender_id = null; // For storing sender's ID from decoded token
  let error = ""; // To store any error messages
  let addressErrors = { sender: "", receiver: "" }; // To track address errors separately for sender and receiver
  let loading = false; // To manage loading state for fetching geolocation

  // onMount is called when the component is mounted in the DOM
  onMount(() => {
    // Checking if a token is present in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decoding the token to extract sender ID
        const decoded = jwtDecode(token);
        sender_id = decoded.id; // Extract sender's ID from decoded token
      } catch (err) {
        console.error("Failed to decode token:", err);
        error = "Invalid token. Please log in again."; // Error handling if token is invalid
      }
    } else {
      error = "User not logged in."; // If no token, show login error
    }
  });

  // Function to combine address fields into a string for geocoding
  function combineAddress(address) {
    return `${address.street}, ${address.city}, ${address.state}, ${address.country}, ${address.postal_code}`;
  }

  // Function to fetch latitude and longitude for a given address using Google Geocoding API
  async function fetchLatLong(address) {
    try {
      // Making API request to Google Maps Geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}` // Google Maps API key from environment variable
      );
      const data = await response.json();
      // If geocoding is successful, return latitude and longitude
      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        console.error("Geocoding error:", data.status);
        addressErrors[type] = `Invalid address: ${data.status}`; // Set address error if geocoding fails
        return null;
      }
    } catch (err) {
      console.error("Error fetching geolocation:", err);
      addressErrors[type] = "Error fetching geolocation."; // Error handling if geolocation fetch fails
      return null;
    }
  }

  // Function to autofill latitude and longitude for both sender and receiver
  async function autoFillLatLong() {
    loading = true; // Set loading to true when geolocation fetch starts
    addressErrors = {sender : "", reciver: ""}; // Clear previous address errors
    const senderAddress = combineAddress(shipmentData.sender_address);
    const receiverAddress = combineAddress(shipmentData.reciver_address);

    // Fetch sender's location
    const senderLocation = await fetchLatLong(senderAddress);
    if (senderLocation) {
      shipmentData.sender_latitude = senderLocation.latitude;
      shipmentData.sender_longitude = senderLocation.longitude;
    } else {
      error = "Failed to fetch sender's location."; // If sender's location fetch fails
      return;
    }

    // Fetch receiver's location
    const receiverLocation = await fetchLatLong(receiverAddress);
    if (receiverLocation) {
      shipmentData.reciver_latitude = receiverLocation.latitude;
      shipmentData.reciver_longitude = receiverLocation.longitude;
    } else {
      error = "Failed to fetch receiver's location."; // If receiver's location fetch fails
    }
  }

  // Function to handle shipment creation
  async function createShipment() {
    const token = localStorage.getItem("token");
    if (!token) {
      error = "User not logged in."; // Error if user is not logged in
      return;
    }

    if (!sender_id) {
      error = "Sender ID is missing. Please log in."; // Error if sender ID is missing
      return;
    }

    // Check if all location data is present
    if (
      !shipmentData.sender_latitude ||
      !shipmentData.sender_longitude ||
      !shipmentData.reciver_latitude ||
      !shipmentData.reciver_longitude
    ) {
      error = "Location data is incomplete. Please ensure valid addresses."; // Error if location data is incomplete
      return;
    }

    // Serialize addresses into strings for sending in the API request
    const serializedSenderAddress = combineAddress(shipmentData.sender_address);
    const serializedReceiverAddress = combineAddress(shipmentData.reciver_address);

    try {
      // Making API request to create the shipment
      const shipmentRes = await fetch("http://localhost:3000/api/shipping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Sending token in Authorization header
        },
        body: JSON.stringify({
          ...shipmentData,
          sender_address: serializedSenderAddress,
          reciver_address: serializedReceiverAddress,
          sender_id,
        }),
      });

      // Error handling for unsuccessful shipment creation
      if (!shipmentRes.ok) {
        const shipmentError = await shipmentRes.json();
        console.log("Shipment creation error:", shipmentError);
        error = shipmentError.error || "Failed to create shipment.";
        return;
      }

      const { shipment } = await shipmentRes.json();
      alert(`Shipment created successfully! Tracking ID: ${shipment.tracking_id}`); // Success message after shipment creation

      // Resetting form data after successful shipment creation
      shipmentData = {
        reciver_name: "",
        reciver_address: {
          street: "",
          city: "",
          state: "",
          country: "India", // Resetting country to default value
          postal_code: "",
        },
        sender_address: {
          street: "",
          city: "",
          state: "",
          country: "India", // Resetting country to default value
          postal_code: "",
        },
        sender_latitude: "",
        sender_longitude: "",
        reciver_latitude: "",
        reciver_longitude: "",
        status: "Placed", // Resetting status to default
        tracking_id: `SHIP-${Date.now()}`, // Generating a new tracking ID
      };
    } catch (err) {
      console.error("Error creating shipment:", err);
      error = "Server error. Please try again later."; // Error handling for server issues
    }
  }
</script>

<Header /> <!-- Include header component -->

<div class="container">
  <h2>Create Shipment</h2>
  <!-- Display error message if any -->
  {#if error}
    <p style="color: red;">{error}</p>
  {/if}
  <!-- Form for shipment creation -->
  <form on:submit|preventDefault={createShipment}>
    <!-- Receiver Name input field -->
    <div>
      <label>Receiver Name:</label>
      <input type="text" bind:value={shipmentData.reciver_name} required />
    </div>

    <!-- Receiver Address input fields -->
    <div>
      <label>Receiver Address:</label>
      <input type="text" bind:value={shipmentData.reciver_address.street} placeholder="Street" required />
      <input type="text" bind:value={shipmentData.reciver_address.city} placeholder="City" required />
      <input type="text" bind:value={shipmentData.reciver_address.state} placeholder="State" required />
      <input type="text" bind:value={shipmentData.reciver_address.country} placeholder="Country" required />
      <input type="text" bind:value={shipmentData.reciver_address.postal_code} placeholder="Postal Code" required />
      {#if addressErrors.receiver}
        <p class="error">{addressErrors.receiver}</p>
      {/if}
    </div>

    <!-- Sender Address input fields -->
    <div>
      <label>Sender Address:</label>
      <input type="text" bind:value={shipmentData.sender_address.street} placeholder="Street" required />
      <input type="text" bind:value={shipmentData.sender_address.city} placeholder="City" required />
      <input type="text" bind:value={shipmentData.sender_address.state} placeholder="State" required />
      <input type="text" bind:value={shipmentData.sender_address.country} placeholder="Country" required />
      <input type="text" bind:value={shipmentData.sender_address.postal_code} placeholder="Postal Code" required />
      {#if addressErrors.sender}
        <p class="error">{addressErrors.sender}</p>
      {/if}
    </div>

    <!-- Display loading indicator while fetching geolocation -->
    {#if loading}
      <p>Loading...</p>
    {/if}

    <!-- Buttons to fetch latitude/longitude and submit form -->
    <button type="button" on:click={autoFillLatLong}>
      Fetch Latitude and Longitude
    </button>
    <button type="submit">Create Shipment</button>
  </form>
</div>

<style>
  .container {
    max-width: 600px;
    margin-top: 20px;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  label {
    font-weight: bold;
    margin-top: 10px;
    display: block;
  }
  input {
    width: 100%;
    padding: 8px;
    margin: 5px 0;
    color: black;
    font-weight: bold;
    background-color: white;
    border: 1px solid #000000;
    border-radius: 5px;
  }
  .error {
    color: red;
    font-size: 0.9em;
  }
  button {
    padding: 10px 15px;
    margin: 10px 0;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }
</style>
