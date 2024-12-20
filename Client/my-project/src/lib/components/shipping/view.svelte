<script>
  // Import necessary functions and components from Svelte
  import { onMount } from 'svelte'; // onMount lifecycle function is used for running code when the component is first mounted
  import Header from '../header/header.svelte'; // Importing the Header component
  import { jwtDecode } from 'jwt-decode'; // Importing a function to decode JWT tokens

  // Declare reactive variables to manage shipments, error messages, loading state, and user roles
  let shipments = []; // Holds the list of shipments
  let errorMessage = ''; // Holds any error messages to be displayed
  let isLoading = true; // Tracks the loading state (whether data is being fetched)
  let isAdmin = false; // Determines if the user has an admin role
  let role_id = null; // Holds the user's role ID (decoded from the JWT)

  // Function to fetch shipments from the API
  async function fetchShipments() {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    if (!token) {
      errorMessage = 'You must be logged in to view shipments.'; // If no token is found, set error message
      isLoading = false; // Set loading state to false
      return; // Exit the function if there's no token
    }

    try {
      const decoded = jwtDecode(token); // Decode the JWT token to get user details
      role_id = decoded.role_id; // Extract role ID from the decoded token
      isAdmin = role_id === 2; // Set isAdmin to true if the role ID is 2 (indicating admin)

      // Fetch the shipment data from the API
      const response = await fetch('http://localhost:3000/api/shipping', {
        method: 'GET', // GET method to fetch shipments
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in the Authorization header
          'Content-Type': 'application/json', // Specify the content type
        },
      });

      if (!response.ok) { // If the response is not ok, handle the error
        const data = await response.json(); // Parse the JSON response
        errorMessage = data.error || 'Kindly create shipment to view.'; // Set error message from response
        isLoading = false; // Set loading state to false
        return; // Exit the function if there was an error
      }

      const data = await response.json(); // Parse the JSON response for successful fetch
      shipments = data.shipments || []; // Set the shipments array with the fetched data
      isLoading = false; // Set loading state to false
    } catch (error) {
      console.error('Error fetching shipments:', error); // Log any errors that occur
      errorMessage = 'Failed to fetch shipments'; // Set the error message
      isLoading = false; // Set loading state to false
    }
  }

  // Function to update the status of a shipment
  async function updateShipmentStatus(id, status) {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    try {
      const response = await fetch(`http://localhost:3000/api/shipping/${id}/status`, {
        method: 'PUT', // PUT method to update shipment status
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in the Authorization header
          'Content-Type': 'application/json', // Specify the content type
        },
        body: JSON.stringify({ status }), // Send the status in the request body
      });

      if (!response.ok) { // If the response is not ok, handle the error
        const data = await response.json(); // Parse the JSON response
        alert(data.error || 'Failed to update shipment status'); // Show error message in alert
        return; // Exit the function if there was an error
      }
      alert('Shipment status updated successfully'); // Show success message in alert
      fetchShipments(); // Refresh the shipment list after update
    } catch (error) {
      console.error('Error updating shipment status:', error); // Log any errors
    }
  }

  // Function to delete a shipment
  async function deleteShipment(id) {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    try {
      const response = await fetch(`http://localhost:3000/api/shipping/${id}`, {
        method: 'DELETE', // DELETE method to remove shipment
        headers: {
          'Content-Type': 'application/json', // Specify the content type
          'Authorization': `Bearer ${token}`, // Include token in the Authorization header
        },
      });

      if (!response.ok) { // If the response is not ok, handle the error
        const data = await response.json(); // Parse the JSON response
        alert(data.error || 'Failed to delete shipment'); // Show error message in alert
        return; // Exit the function if there was an error
      }
      alert('Shipment deleted successfully'); // Show success message in alert
      fetchShipments(); // Refresh the shipment list after deletion
    } catch (error) {
      console.error('Error deleting shipment:', error); // Log any errors
    }
  }

  // Fetch shipments when the component is mounted
  onMount(() => {
    fetchShipments(); // Call fetchShipments when the component is mounted
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
          </div>
        {/if}
          <div>
            <button class="delete-button" on:click={() => deleteShipment(shipment.id)}>🗑 Delete</button>
          </div>
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
    padding: 8px 10px;
    margin-right: 10px;
    margin-left: 10px;
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
