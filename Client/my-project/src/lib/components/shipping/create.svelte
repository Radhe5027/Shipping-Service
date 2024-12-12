<script>
  import { onMount } from "svelte";
  import { jwtDecode } from "jwt-decode";
  import Header from "../header/header.svelte";

  let shipmentData = {
    reciver_name: "",
    reciver_address: "",
    status: "Placed",
    tracking_id: `SHIP-${Date.now()}`,
    sender_address: "",
    sender_latitude: "",
    sender_longitude: "",
  };

  let locationData = {
    latitude: "",
    longitude: "",
  };

  let sender_id = null; // User's unique identifier
  let error = "";

  // Decode the token to extract user details
  onMount(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        sender_id = decoded.id; // Adjust based on the payload structure
      } catch (err) {
        console.error("Failed to decode token:", err);
        error = "Invalid token. Please log in again.";
      }
    } else {
      error = "User not logged in.";
    }
  });

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

    // Validate latitude and longitude
    if (!locationData.latitude || !locationData.longitude) {
      error = "Latitude and longitude are required.";
      return;
    }

    try {
      // Create the shipment
      const shipmentRes = await fetch("http://localhost:3000/api/shipping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...shipmentData, sender_id }),
      });

      if (!shipmentRes.ok) {
        const shipmentError = await shipmentRes.json();
        console.log("Shipment creation error:", shipmentError);
        error = shipmentError.error || "Failed to create shipment.";
        return;
      }

      const { shipment } = await shipmentRes.json();

      // Create the location entry
      const locationRes = await fetch(
        `http://localhost:3000/api/shipping/${shipment.id}/location`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(locationData),
        }
      );

      if (!locationRes.ok) {
        const locationError = await locationRes.json();
        console.log("Location creation error:", locationError);
        error = locationError.error || "Failed to create shipment location.";
        return;
      }

      alert(
        `Shipment and location created successfully! Tracking ID: ${shipment.tracking_id}`
      );

      // Reset form
      shipmentData = {
        reciver_name: "",
        reciver_address: "",
        status: "Placed",
        tracking_id: `SHIP-${Date.now()}`,
        sender_address: "",
        sender_latitude: "",
        sender_longitude: "",
      };

      locationData = {
        latitude: "",
        longitude: "",
      };
    } catch (err) {
      console.error("Error creating shipment and location:", err);
      error = "Server error. Please try again later.";
    }
  }
</script>

<Header />

<div>
  <h2>Create Shipment</h2>
  {#if error}
    <p style="color: red;">{error}</p>
  {/if}
  <form on:submit|preventDefault={createShipment}>
    <label>
      Receiver Name:
      <input type="text" bind:value={shipmentData.reciver_name} required />
    </label>
    <label>
      Receiver Address:
      <textarea bind:value={shipmentData.reciver_address} required></textarea>
    </label>
    <label>
      Sender Address:
      <textarea bind:value = {shipmentData.sender_address} required></textarea>
    </label>
    <label>
      Sender Latitude:
      <textarea bind:value = {shipmentData.sender_latitude} required></textarea>
    </label>
    <label>
      Sender Longitude:
      <textarea bind:value = {shipmentData.sender_longitude} required></textarea>
    </label>
    <label>
      Latitude:
      <input type="number" bind:value={locationData.latitude} step="any" required />
    </label>
    <label>
      Longitude:
      <input type="number" bind:value={locationData.longitude} step="any" required />
    </label>
    <button type="submit">Create Shipment</button>
  </form>
</div>
