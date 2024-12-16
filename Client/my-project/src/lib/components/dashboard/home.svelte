<script>
  import {navigate} from 'svelte-routing';
  import Header from "../header/header.svelte";
</script>

<Header/>

<main>
  <section class="hero">
    <div class="hero-content">
      <h1>Welcome to RapidRoute</h1>
      <p>Your trusted partner in fast and reliable shipping solutions.</p>
      <button on:click={() => navigate('/create')}>Create Shipment</button>
    </div>
  </section>

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
    <h2>Our Processes</h2>
    <div class="process-flow">
      <div class="process-step">
        <div class="circle">1</div>
        <div class="process-text">
          <h4>Create New Shipment</h4>
          <p>Get started by creating your shipment.</p>
        </div>
      </div>

      <div class="process-step">
        <div class="circle">2</div>
        <div class="process-text">
          <h4>Track Your Shipment</h4>
          <p>Monitor the status of your shipment in real-time.</p>
        </div>
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
  .hero {
    background: linear-gradient(to right, rgba(0, 123, 255, 0.6), rgba(0, 200, 255, 0.6)), url('src/assets/service-5.jpg') no-repeat center center/cover;
    padding: 10px 300px;
    text-align: center;
    color: white;
    animation: slideDown 1s ease-out;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 65px;
    height: 50vh; /* Ensures the hero section takes full viewport height */
}

.hero-content {
    display: flex;
    flex-direction: column; /* Stack content vertically */
    align-items: center; /* Center text horizontally */
    justify-content: center; /* Center text vertically */
    text-align: center;
}

.hero-content h1 {
    font-size: 3rem;
    margin-bottom: 5px;
    font-weight: bold;
}

.hero-content p {
    font-size: 1.5rem;
    margin-bottom: 10px;
}

.hero-content button {
    padding: 15px 30px;
    font-size: 1.2rem;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 25px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.hero-content button:hover {
    background-color: #0056b3;
}


  .unique {
    text-align: center;
    margin: 50px 0;
  }

  .boxes {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    height: 150px;
    object-fit: scale-down;
    margin-top: 20px;
  }

  .box {
    flex: 1;
    min-width: 200px;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    color: white;
    text-align: center;
  }

  .box:hover {
    transform: scale(1.05);
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
  }

  .box-1 {
    background: url('src/assets/24-hour-service-3d-text-background_1017-38077.jpg') no-repeat center/contain;
  }

  .box-2 {
    background: url('src/assets/check-mark-with-review-stars_78370-1123.jpg') no-repeat center/contain;
  }

  .box-3 {
    background: url('src/assets/fast-free-delivery-logo_1308-49056.avif') no-repeat center/contain;
  }

  .processes-section {
    text-align: center;
    padding: 50px 20px;
  }

  .process-flow {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 30px;
    flex-wrap: wrap;
  }

  .process-step {
    text-align: center;
    flex: 1;
    min-width: 200px;
    max-width: 300px;
    padding: 10px;
    transition: transform 0.3s;
  }

  .process-step:hover {
    transform: translateY(-10px);
  }

  .circle {
    width: 50px;
    height: 50px;
    margin: 0 auto 10px;
    border-radius: 50%;
    background-color: #007bff;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  }

  .process-text h4 {
    margin: 10px 0 5px;
    font-size: 1.2rem;
  }

  .process-text p {
    font-size: 1rem;
    color: #555;
  }
</style>
