<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import Header from "../header/header.svelte";
</script>

<Header/>

<main>
  <section class="unique">
    <h2>What Makes Us Unique?</h2>
    <p>We always deliver more than expected.</p>

    <div class="boxes">
      <div class="box box-1">
        
      </div>
      <div class="box box-2">
        
      </div>
      <div class="box box-3">
        
      </div>
    </div>
  </section>

  <section class="processes-section">
    <h2>Welcome to ShiftPacker</h2>
    <h3>Our Processes</h3>
    <div class="process-flow">
      <div class="process-step">
        <div class="circle">1</div>
        <div class="process-text">
          <h4>Create New Shipment</h4>
          <p>Get started by creating your shipment.</p>
        </div>
        <div class="arrow">→</div>
      </div>

      <div class="process-step">
        <div class="circle">2</div>
        <div class="process-text">
          <h4>Track Your Shipment</h4>
          <p>Monitor the status of your shipment in real-time.</p>
        </div>
        <div class="arrow">→</div>
      </div>

      <div class="process-step">
        <div class="circle">3</div>
        <div class="process-text">
          <h4>Packed and Delivered</h4>
          <p>Your shipment will be packed and delivered to your address.</p>
        </div>
      </div>
    </div>
  </section>
</main>

<style>
  main {
    font-family: Arial, sans-serif;
    padding: 20px;
    background-color: #ffffff;
    color: black;
  }

  .unique {
    text-align: center;
    margin-bottom: 40px;
  }

  .boxes {
    display: flex;
    justify-content: center;
    gap: 30px;
  }

  .box {
    border: 2px solid #ddd;
    padding: 20px;
    height: 90px;
    flex: 1;
    text-align: center;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    position: relative;
    color: white; /* Text color for contrast */
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  

  .processes-section {
    text-align: center;
    margin-top: 40px;
  }

  .process-flow {
    display: flex;
    justify-content: center;
    gap: 50px;
    align-items: center;
    margin-top: 30px;
  }

  .process-step {
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 18px;
    position: relative;
  }

  .circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #007bff;
    color: white;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .process-text {
    font-size: 16px;
    max-width: 200px;
  }

  .arrow {
    font-size: 24px;
  }

  /* Background images for each box */
  .box-1 {
    background-image: url('src/assets/24-hour-service-3d-text-background_1017-38077.jpg');
  }

  .box-2 {
    background-image: url('src/assets/check-mark-with-review-stars_78370-1123.jpg');
  }

  .box-3 {
    background-image: url('src/assets/fast-free-delivery-logo_1308-49056.avif');
  }
</style>
