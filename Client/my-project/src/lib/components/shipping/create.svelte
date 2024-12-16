<script>
  import { onMount } from "svelte";
  import { jwtDecode } from "jwt-decode";
  import Header from '../header/header.svelte';

  let shipmentData = {
    reciver_name: "",
    reciver_address: {
      street: "",
      city: "",
      state: "",
      country: "India",
      postal_code: "",
    },
    sender_address: {
      street: "",
      city: "",
      state: "",
      country: "India",
      postal_code: "",
    },
    sender_latitude: "",
    sender_longitude: "",
    reciver_latitude: "",
    reciver_longitude: "",
    status: "Placed",
    tracking_id: `SHIP-${Date.now()}`,
  };

  let sender_id = null;
  let error = "";
  let addressErrors = { sender: "", receiver: "" };
  let loading = false;

  onMount(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        sender_id = decoded.id; // Adjust based on payload structure
      } catch (err) {
        console.error("Failed to decode token:", err);
        error = "Invalid token. Please log in again.";
      }
    } else {
      error = "User not logged in.";
    }
  });

  function combineAddress(address) {
    return `${address.street}, ${address.city}, ${address.state}, ${address.country}, ${address.postal_code}`;
  }

  async function fetchLatLong(address) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        console.error("Geocoding error:", data.status);
        addressErrors[type] = `Invalid address: ${data.status}`;
        return null;
      }
    } catch (err) {
      console.error("Error fetching geolocation:", err);
      addressErrors[type] = "Error fetching geolocation.";
      return null;
    }
  }

  async function autoFillLatLong() {
    loading = true;
    addressErrors = {sender : "", reciver: ""};
    const senderAddress = combineAddress(shipmentData.sender_address);
    const receiverAddress = combineAddress(shipmentData.reciver_address);

    // Fetch sender's location
    const senderLocation = await fetchLatLong(senderAddress);
    if (senderLocation) {
      shipmentData.sender_latitude = senderLocation.latitude;
      shipmentData.sender_longitude = senderLocation.longitude;
    } else {
      error = "Failed to fetch sender's location.";
      return;
    }

    // Fetch receiver's location
    const receiverLocation = await fetchLatLong(receiverAddress);
    if (receiverLocation) {
      shipmentData.reciver_latitude = receiverLocation.latitude;
      shipmentData.reciver_longitude = receiverLocation.longitude;
    } else {
      error = "Failed to fetch receiver's location.";
    }
  }

  async function createShipment() {
    const token = localStorage.getItem("token");
    if (!token) {
      error = "User not logged in.";
      return;
    }

    if (!sender_id) {
      error = "Sender ID is missing. Please log in.";
      return;
    }

    if (
      !shipmentData.sender_latitude ||
      !shipmentData.sender_longitude ||
      !shipmentData.reciver_latitude ||
      !shipmentData.reciver_longitude
    ) {
      error = "Location data is incomplete. Please ensure valid addresses.";
      return;
    }

    // Serialize addresses into strings
    const serializedSenderAddress = combineAddress(shipmentData.sender_address);
    const serializedReceiverAddress = combineAddress(shipmentData.reciver_address);

    try {
      const shipmentRes = await fetch("http://localhost:3000/api/shipping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...shipmentData,
          sender_address: serializedSenderAddress,
          reciver_address: serializedReceiverAddress,
          sender_id,
        }),
      });

      if (!shipmentRes.ok) {
        const shipmentError = await shipmentRes.json();
        console.log("Shipment creation error:", shipmentError);
        error = shipmentError.error || "Failed to create shipment.";
        return;
      }

      const { shipment } = await shipmentRes.json();
      alert(`Shipment created successfully! Tracking ID: ${shipment.tracking_id}`);

      // Reset form
      shipmentData = {
        reciver_name: "",
        reciver_address: {
          street: "",
          city: "",
          state: "",
          country: "India",
          postal_code: "",
        },
        sender_address: {
          street: "",
          city: "",
          state: "",
          country: "India",
          postal_code: "",
        },
        sender_latitude: "",
        sender_longitude: "",
        reciver_latitude: "",
        reciver_longitude: "",
        status: "Placed",
        tracking_id: `SHIP-${Date.now()}`,
      };
    } catch (err) {
      console.error("Error creating shipment:", err);
      error = "Server error. Please try again later.";
    }
  }
</script>

<Header />

<div class = "container">
  <h2>Create Shipment</h2>
  {#if error}
    <p style="color: red;">{error}</p>
  {/if}
  <form on:submit|preventDefault={createShipment}>
    <div>
    <label> Receiver Name: </label>
      <input type="text" bind:value={shipmentData.reciver_name} required />
    </div>
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


    <div>
    <label> Sender Address:</label>
      <input type="text" bind:value={shipmentData.sender_address.street} placeholder="Street" required />
      <input type="text" bind:value={shipmentData.sender_address.city} placeholder="City" required />
      <input type="text" bind:value={shipmentData.sender_address.state} placeholder="State" required />
      <input type="text" bind:value={shipmentData.sender_address.country} placeholder="Country" required />
      <input type="text" bind:value={shipmentData.sender_address.postal_code} placeholder="Postal Code" required />
      {#if addressErrors.sender}
        <p class="error">{addressErrors.sender}</p>
      {/if}
    </div>
    {#if loading}
      <p>Loading...</p>
    {/if}
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
