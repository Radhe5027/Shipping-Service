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
        {#if !isAdmin}
          <button class="delete-button" on:click={() => deleteShipment(shipment.id)}>Delete</button>
        {/if}
      </div>
    {/each}
  </div>
{/if}

<style>
  .delete-button {
    margin-top: 10px;
    padding: 5px 10px;
    background-color: #d9534f;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .delete-button:hover {
    background-color: #c9302c;
  }

  .status-buttons button {
    margin-right: 10px;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .status-buttons button:hover {
    opacity: 0.8;
  }

  .status-buttons button:nth-child(1) {
    background-color: #5bc0de;
  }
  
  .status-buttons button:nth-child(2) {
    background-color: #f0ad4e;
  }

  .status-buttons button:nth-child(3) {
    background-color: #5cb85c;
  }
</style>
