<script>
  import { onMount } from 'svelte';
  import Header from '../header/header.svelte';
  import { jwtDecode } from 'jwt-decode'; // Import jwt-decode to decode the token

  let shipments = [];
  let errorMessage = '';
  let isLoading = true;
  let isAdmin = false; // Default is false
  let role_id = null;

  async function fetchShipments() {
    const token = localStorage.getItem('token');
    if (!token) {
      errorMessage = 'You must be logged in to view shipments.';
      isLoading = false;
      return;
    }

    try {
      const decoded = jwtDecode(token); // Decode token
      role_id = decoded.role_id; // Extract role_id from decoded token

      // Check if user is admin (role_id = 2)
      isAdmin = role_id === 2;

      const response = await fetch('http://localhost:3000/api/shipping', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        errorMessage = data.error || 'Failed to fetch shipments';
        isLoading = false;
        return;
      }

      const data = await response.json();
      if (data.shipments && data.shipments.length > 0) {
        shipments = data.shipments;
      } else {
        errorMessage = 'No shipments found!';
      }
      isLoading = false;
    } catch (error) {
      console.error('Error fetching shipments:', error);
      errorMessage = 'Failed to fetch shipments';
      isLoading = false;
    }
  }

  async function updateShipmentStatus(id, status) {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/shipping/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Failed to update shipment status');
        return;
      }
      alert('Shipment status updated successfully');
      fetchShipments();
    } catch (error) {
      console.error('Error updating shipment status:', error);
    }
  }

  async function deleteShipment(id) {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/api/shipping/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Failed to delete shipment');
        return;
      }
      alert('Shipment deleted successfully');
      fetchShipments();
    } catch (error) {
      console.error('Error deleting shipment:', error);
    }
  }

  onMount(() => {
    fetchShipments();
  });
</script>

<Header />

{#if isLoading}
  <p class="loading">Loading shipments...</p>
{:else if errorMessage}
  <p class="error-message">{errorMessage}</p>
{:else}
  <h3>My Shipments</h3>
  <div class="shipments-container">
    {#each shipments as shipment}
      <div class="shipment-item">
        <div class="shipment-header">
          <strong>Tracking ID:</strong> {shipment.tracking_id}
        </div>
        <div class="shipment-details">
          <span><strong>Receiver Name:</strong> {shipment.reciver_name}</span>
          <span><strong>Status:</strong>
            {#if isAdmin}
              <div class="status-buttons">
                <button on:click={() => updateShipmentStatus(shipment.id, "Placed")}>Placed</button>
                <button on:click={() => updateShipmentStatus(shipment.id, "In Transit")}>In Transit</button>
                <button on:click={() => updateShipmentStatus(shipment.id, "Delivered")}>Delivered</button>
              </div>
            {:else}
              {shipment.status}
            {/if}
          </span>
          <span><strong>Receiver Address:</strong> {shipment.reciver_address}</span>
          <span><strong>Shipment Created On:</strong> {new Date(shipment.created_at).toLocaleString()}</span>
        </div>
        
        <button class="delete-button" on:click={() => deleteShipment(shipment.id)}>Delete</button>
      </div>
    {/each}
  </div>
{/if}

<style>
  /* General styling */
  .loading, .error-message {
    text-align: center;
    font-size: 1.2em;
    margin-top: 20px;
  }

  .error-message {
    color: #d9534f;
  }

  h3 {
    text-align: center;
    font-size: 2.5em;
    margin-bottom: 50px;
    color: #2c3e50;
    font-weight: 600;
    margin-top: -100px;
  }

  /* Container for the shipments */
  .shipments-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin: 0 auto;
    max-width: 1200px;
  }

  /* Individual shipment card */
  .shipment-item {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .shipment-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  .shipment-header {
    font-size: 1.1em;
    color: #34495e;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .shipment-details span {
    display: block;
    margin-bottom: 8px;
    color: #7f8c8d;
    font-size: 1em;
  }

  /* Delete button */
  .delete-button {
    margin-top: 15px;
    padding: 10px 20px;
    background-color: #e74c3c;
    color: white;
    font-size: 1em;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 100%;
    text-align: center;
  }

  .delete-button:hover {
    background-color: #c0392b;
  }

  /* Status buttons */
  .status-buttons button {
    padding: 8px 16px;
    font-size: 1em;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-right: 8px;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  .status-buttons button:hover {
    opacity: 0.85;
    transform: scale(1.05);
  }

  .status-buttons button:nth-child(1) {
    background-color: #3498db; /* Placed */
  }

  .status-buttons button:nth-child(2) {
    background-color: #f39c12; /* In Transit */
  }

  .status-buttons button:nth-child(3) {
    background-color: #2ecc71; /* Delivered */
  }
</style>

