<script>
    import { onMount } from 'svelte';
    import Header from '../header/header.svelte';
  
    let shipments = [];
    let errorMessage = '';
    let isLoading = true;
  
    // Function to fetch shipments
    async function fetchShipments() {
      const token = localStorage.getItem('token');  // Get the token from localStorage
  
      // Check if token exists
      if (!token) {
        errorMessage = 'You must be logged in to view shipments.';
        isLoading = false;
        return;
      }
  
      try {
        const response = await fetch('http://localhost:3000/api/shipping', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          // Handle any errors returned by the backend (403 or 500)
          const data = await response.json();
          errorMessage = data.error || 'Failed to fetch shipments';
          isLoading = false;
          return;
        }
  
        const data = await response.json();
  
        // Check if the response contains shipments
        if (data.shipments && data.shipments.length > 0) {
          shipments = data.shipments;
        } else {
          errorMessage = 'No shipments found!';
        }
        isLoading = false;
      } catch (error) {
        // Handle network errors
        console.error('Error fetching shipments:', error);
        errorMessage = 'Failed to fetch shipments';
        isLoading = false;
      }
    }
  
    // Fetch shipments on component mount
    onMount(() => {
      fetchShipments();
    });
  </script>
  
<Header/>
  

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
            <span><strong>Status:</strong> {shipment.status}</span>
            <span><strong>Receiver Address:</strong> {shipment.reciver_address}</span>
            <span><strong>Created At:</strong> {new Date(shipment.created_at).toLocaleString()}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}


  <style>
    /* Base Styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Arial', sans-serif;
    }
  
    body {
      background-color: #f4f7fa;
      padding: 20px;
    }
  
    h3 {
      color: #333;
      margin-bottom: 20px;
      text-align: center;
    }
  
    /* Loading and Error Messages */
    p {
      font-size: 16px;
      color: #777;
      text-align: center;
      padding: 10px;
    }
  
    .error-message {
      color: #d9534f;
      font-weight: bold;
    }
  
    .loading {
      font-size: 18px;
      color: #007bff;
    }
  
    /* Shipments Container */
    .shipments-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 20px;
    }
  
    /* Shipment List Styles */
    .shipment-item {
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      width: 100%;
      max-width: 800px;
      margin: 10px 0;
      padding: 20px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
  
    .shipment-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
  
    .shipment-header {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
  
    .shipment-details {
      font-size: 16px;
      margin-top: 10px;
      color: #555;
    }
  
    .shipment-details strong {
      color: #333;
    }
  
    .shipment-details span {
      display: block;
      margin-top: 5px;
    }
  
    /* Responsive Styles */
    @media (max-width: 768px) {
      .shipment-item {
        width: 90%;
      }
    }
  </style>
  