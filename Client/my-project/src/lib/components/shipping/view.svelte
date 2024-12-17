<script>
  import { onMount } from 'svelte';
  import Header from '../header/header.svelte';
  import { jwtDecode } from 'jwt-decode';

  let shipments = [];
  let errorMessage = '';
  let isLoading = true;
  let isAdmin = false;
  let role_id = null;

  async function fetchShipments() {
    const token = localStorage.getItem('token');
    if (!token) {
      errorMessage = 'You must be logged in to view shipments.';
      isLoading = false;
      return;
    }

    try {
      const decoded = jwtDecode(token);
      role_id = decoded.role_id;
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
        errorMessage = data.error || 'Kindly create shipment to view.';
        isLoading = false;
        return;
      }

      const data = await response.json();
      shipments = data.shipments || [];
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
  <h3>📦 My Shipments</h3>
  <div class="shipments-container">
    {#each shipments as shipment}
      <div class="shipment-card">
        <div class="card-header">
          <h4>Tracking ID: <span>{shipment.tracking_id}</span></h4>
          <span class="badge status-{shipment.status.replace(/\s+/g, '-').toLowerCase()}">
            {shipment.status}
          </span>
        </div>

        <div class="card-body">
          <p><strong>Receiver:</strong> {shipment.reciver_name}</p>
          <p><strong>Sender:</strong> {shipment.sender.username}</p>
          <p><strong>Reciver Address:</strong> {shipment.reciver_address}</p>
          <p><strong>Sender Address:</strong>{shipment.sender_address}</p>
          <p><strong>Created On:</strong> {new Date(shipment.created_at).toLocaleString()}</p>
        </div>

        {#if isAdmin}
          <div class="card-footer">
            <div class="status-buttons">
              <button on:click={() => updateShipmentStatus(shipment.id, 'Placed')}>Placed</button>
              <button on:click={() => updateShipmentStatus(shipment.id, 'In Transit')}>In Transit</button>
              <button on:click={() => updateShipmentStatus(shipment.id, 'Delivered')}>Delivered</button>
            </div>
            <button class="delete-button" on:click={() => deleteShipment(shipment.id)}>🗑 Delete</button>
          </div>
        {/if}
      </div>
    {/each}
  </div>
{/if}

<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

  * {
    box-sizing: border-box;
  }

  h3 {
    text-align: center;
    color: #2c3e50;
    margin-top: 20px;
    font-size: 2em;
    font-weight: 700;
    margin-top: 70px;
  }

  .loading,
  .error-message {
    text-align: center;
    font-size: 1.3em;
    margin-top: 20px;
  }

  .error-message {
    color: #e74c3c;
  }

  .shipments-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 20px;
    padding: 20px;
  }

  .shipment-card {
    background: linear-gradient(135deg, #ffffff, #f9f9f9);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    width: 350px;
    transition: transform 0.3s ease;
  }

  .shipment-card:hover {
    transform: translateY(-5px);
  }

  .card-header {
    background-color: #2c3e50;
    color: #fff;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-header h4 {
    margin: 0;
    font-size: 1em;
  }

  .badge {
    padding: 5px 10px;
    border-radius: 8px;
    font-size: 0.8em;
    font-weight: bold;
    text-transform: capitalize;
  }

  .status-placed {
    background-color: #3498db;
    color: #fff;
  }

  .status-in-transit {
    background-color: #f39c12;
    color: #fff;
  }

  .status-delivered {
    background-color: #2ecc71;
    color: #fff;
  }

  .card-body {
    padding: 15px;
    line-height: 1.6;
  }

  .card-footer {
    padding: 5px;
    border-top: 1px solid #ececec;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .status-buttons button {
    background-color: #2980b9;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 8px 5px;
    margin-right: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .status-buttons button:hover {
    background-color: #1a5276;
  }

  .delete-button {
    background-color: #e74c3c;
    color: white;
    padding: 8px 10px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .delete-button:hover {
    background-color: #c0392b;
  }
</style>
