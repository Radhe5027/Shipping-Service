<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import Header from "../header/header.svelte";
    let isTrackBoxVisible = false;
    let isCreateModalVisible = false;
  
    const handleTrackClick = () => {
      isTrackBoxVisible = !isTrackBoxVisible;
    };
  
    const handleCreateClick = () => {
      isCreateModalVisible = !isCreateModalVisible;
    };
  
    const handleTrackSubmit = (trackingNumber) => {
      // Redirect to track order page with tracking number
      navigate(`/track-order/${trackingNumber}`);
    };
  
    const handleCreateSubmit = (formData) => {
      // Handle create shipment logic here (e.g., send to backend)
      console.log(formData);
      isCreateModalVisible = false; // Close modal after submit
    };
  </script>

  <Header/>
  
  <main>
    <section>
      <h2>What Makes Us Unique?</h2>
      <p>We always deliver more than expected.</p>
  
      <div class="boxes">
        <div class="box">
          <h3>24x7 Support</h3>
          <p>Our support team is available round the clock for any issues.</p>
        </div>
        <div class="box">
          <h3>5-Star Rated</h3>
          <p>We pride ourselves on being the top-rated service provider in the industry.</p>
        </div>
        <div class="box">
          <h3>Fast Delivery</h3>
          <p>We guarantee fast delivery times with complete reliability.</p>
        </div>
      </div>
  
      <h2>Welcome to ShiftPacker</h2>
      <!-- Insert images and company text here -->
  
      <h3>Our Processes</h3>
      <div class="processes">
        <div class="process">
          <h4>Create New Shipment</h4>
          <p>Get started by creating your shipment.</p>
        </div>
        <div class="process">
          <h4>Track Your Shipment</h4>
          <p>Monitor the status of your shipment in real-time.</p>
        </div>
        <div class="process">
          <h4>Packed and Delivered</h4>
          <p>Your shipment will be packed and delivered to your address.</p>
        </div>
      </div>
    </section>
  
    <!-- Track Box -->
    {#if isTrackBoxVisible}
      <div class="track-box">
        <h3>Track Your Shipment</h3>
        <input type="text" placeholder="Enter your tracking number" bind:this={trackingNumber} />
        <button on:click={() => handleTrackSubmit(trackingNumber)}>Track</button>
      </div>
    {/if}
  
    <!-- Create Modal -->
    {#if isCreateModalVisible}
      <div class="modal">
        <h3>Create Shipment</h3>
        <form on:submit|preventDefault={handleCreateSubmit}>
          <label for="reciverName">Receiver Name</label>
          <input type="text" id="reciverName" name="reciverName" required />
          
          <label for="reciverAddress">Receiver Address</label>
          <input type="text" id="reciverAddress" name="reciverAddress" required />
          
          <button type="submit">Create</button>
        </form>
      </div>
    {/if}
  </main>
  
  <style>
    .boxes {
      display: flex;
      gap: 10px;
    }
    .box {
      border: 1px solid #ddd;
      padding: 10px;
      flex: 1;
    }
    .processes {
      display: flex;
      gap: 10px;
    }
    .process {
      border: 1px solid #ddd;
      padding: 10px;
      flex: 1;
    }
    .track-box {
      border: 1px solid #ddd;
      padding: 10px;
      margin-top: 20px;
    }
    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      padding: 20px;
      border: 1px solid #ddd;
    }
  </style>
  