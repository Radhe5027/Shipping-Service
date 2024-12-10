<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import Header from '../header/header.svelte';
  
    let trackingId = '';
    let shipmentDetails = null;
    let errorMessage = '';
  
    // Handle form submission
    async function trackShipment() {
      if (!trackingId) {
        errorMessage = "Please enter a tracking ID";
        return;
      }
      try {
        const response = await fetch(`http://localhost:3000/api/shipping/${trackingId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Use token from localStorage for authentication
          },
        });
  
        const data = await response.json();
        if (response.ok) {
          shipmentDetails = data.shipment;
        } else {
          errorMessage = data.error;
        }
      } catch (error) {
        errorMessage = 'Error tracking the shipment';
      }
    }
  </script>

  
  <Header/>
  
  <main>
    <h1>Track Your Shipment</h1>
  
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
          <p><strong>Receiver:</strong> {shipmentDetails.reciver_name}</p>
          <p><strong>Status:</strong> {shipmentDetails.status}</p>
          <p><strong>Address:</strong> {shipmentDetails.reciver_address}</p>
        </div>
      {/if}
  
      {#if errorMessage}
        <div class="error">{errorMessage}</div>
      {/if}
    </div>
  </main>
  
  <style>
    /* General Body Styling */
    body {
      font-family: 'Roboto', sans-serif;
      background-color: #f4f4f4;
      color: #333;
      margin: 0;
      padding: 0;
    }
  
    main {
      padding: 30px;
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
  
    h1 {
      font-size: 36px;
      margin-bottom: 20px;
      color: #333;
    }
  
    /* Container and Flexbox Layout */
    .track-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 500px;
      margin: 0 auto;
    }
  
    .input-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: 20px;
    }
  
    .tracking-input {
      padding: 12px;
      font-size: 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      flex-grow: 1;
      margin-right: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
  
    .tracking-input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
    }
  
    .track-button {
      padding: 12px 20px;
      background-color: #007bff;
      color: #fff;
      font-size: 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
  
    .track-button:hover {
      background-color: #0056b3;
    }
  
    /* Shipment Details Styling */
    .shipment-details {
      background-color: #ffffff;
      border: 1px solid #ddd;
      color: rgb(0, 47, 255);
      font-weight: bold;
      border-radius: 8px;
      padding: 20px;
      margin-top: 20px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      text-align: left;
      width: 100%;
      max-width: 500px;
    }
  
    .shipment-details p {
      margin-bottom: 10px;
      font-size: 16px;
    }
  
    .shipment-details strong {
      color: #333;
    }
  
    /* Error Message Styling */
    .error {
      color: #d9534f;
      font-size: 16px;
      margin-top: 20px;
    }
  
    /* Responsive Design */
    @media (max-width: 768px) {
      .input-group {
        flex-direction: column;
      }
  
      .tracking-input {
        margin-bottom: 10px;
        width: 100%;
      }
  
      .track-button {
        width: 100%;
      }
  
      .shipment-details {
        width: 100%;
      }
    }
  </style>
  