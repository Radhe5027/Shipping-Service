<script>
    import {jwtDecode} from 'jwt-decode';
    import {onMount} from "svelte";
  
    let shipmentData = {
      reciver_name: "",
      reciver_address: "",
      status: "Placed",
      tracking_id: `SHIP-${Date.now()}`,
    };
    let sender_id = null; // Will hold the extracted sender_id
    let error = "";
  
    // Decode the token to get sender_id
    onMount(() => {
      const token = localStorage.getItem("token"); // Assuming token is stored in local storage
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
      if (!sender_id) {
        error = "Sender ID is missing. Please log in.";
        return;
      }
  
      const data = { ...shipmentData, sender_id };
  
      try {
        const res = await fetch("http://localhost:3000/api/shipping", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
  
        if (!res.ok) {
          const { error: errMessage } = await res.json();
          error = errMessage || "Failed to create shipment.";
          return;
        }
  
        const { shipment } = await res.json();
        alert(`Shipment created successfully: Tracking ID - ${shipment.tracking_id}`);
        shipmentData = {
          reciver_name: "",
          reciver_address: "",
          status: "Placed",
          tracking_id: `SHIP-${Date.now()}`,
        };
      } catch (err) {
        error = "Server error. Please try again later.";
      }
    }
  </script>
  
  <div>
    <h2>Create Shipment</h2>
    {#if error}
      <p style="color: red;">{error}</p>
    {/if}
    <form
      on:submit|preventDefault={createShipment}
    >
      <label>
        Receiver Name:
        <input type="text" bind:value={shipmentData.reciver_name} required />
      </label>
      <label>
        Receiver Address:
        <textarea bind:value={shipmentData.reciver_address} required></textarea>
      </label>
      <label>
        Status:
        <select bind:value={shipmentData.status}>
          <option value="Placed">Placed</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
        </select>
      </label>
      <button type="submit">Create Shipment</button>
    </form>
  </div>
  