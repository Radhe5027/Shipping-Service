<script>
  // Importing necessary components for navigation and header
  import {navigate} from 'svelte-routing';  // Used for page navigation
  import Header from "../header/header.svelte";  // Importing Header component
</script>

<!-- Include the Header component -->
<Header/>

<main>
  <!-- Hero section with a welcoming message and a call-to-action button -->
  <section class="hero">
    <div class="hero-content">
      <h1>Welcome to RapidRoute</h1>  <!-- Main heading -->
      <p>Your trusted partner in fast and reliable shipping solutions.</p>  <!-- Subheading -->
      <button on:click={() => navigate('/create')}>Create Shipment</button>  <!-- Button that navigates to the "Create Shipment" page -->
    </div>
  </section>

  <!-- Section describing what makes the service unique -->
  <section class="unique">
    <h2>What Makes Us Unique?</h2>
    <p>We always deliver more than expected.</p>

    <!-- Container for unique selling points -->
    <div class="boxes">
      <div class="box box-1"></div>
      <div class="box box-2"></div>
      <div class="box box-3"></div>
    </div>
  </section>

  <!-- Section describing the processes -->
  <section class="processes-section">
    <h2>Our Processes</h2>
    <div class="process-flow">
      <!-- Step 1: Create New Shipment -->
      <div class="process-step">
        <div class="circle">1</div>  <!-- Circle with step number -->
        <div class="process-text">
          <h4>Create New Shipment</h4>  <!-- Step title -->
          <p>Get started by creating your shipment.</p>  <!-- Step description -->
        </div>
      </div>

      <!-- Step 2: Track Shipment -->
      <div class="process-step">
        <div class="circle">2</div>  <!-- Circle with step number -->
        <div class="process-text">
          <h4>Track Your Shipment</h4>  <!-- Step title -->
          <p>Monitor the status of your shipment in real-time.</p>  <!-- Step description -->
        </div>
      </div>

      <!-- Step 3: Packed and Delivered -->
      <div class="process-step">
        <div class="circle">3</div>  <!-- Circle with step number -->
        <div class="process-text">
          <h4>Packed and Delivered</h4>  <!-- Step title -->
          <p>Your shipment will be packed and delivered to your address.</p>  <!-- Step description -->
        </div>
      </div>
    </div>
  </section>
</main>

<style>
  /* Hero section styling */
  .hero {
    background: linear-gradient(to right, rgba(0, 123, 255, 0.6), rgba(0, 200, 255, 0.6)), url('src/assets/service-5.jpg') no-repeat center center/cover;
    padding: 10px 300px;  /* Spacing inside the hero section */
    text-align: center;
    color: white;  /* Text color */
    animation: slideDown 1s ease-out;
    display: flex;
    justify-content: center;  /* Centers content horizontally */
    align-items: center;  /* Centers content vertically */
    flex-direction: column;  /* Aligns items vertically */
    margin-top: 65px;  /* Top margin */
    height: 50vh;  /* Sets the height of the hero section to 50% of the viewport */
  }

  /* Styling for content inside the hero section */
  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  /* Main heading in hero section */
  .hero-content h1 {
    font-size: 3rem;
    margin-bottom: 5px;
    font-weight: bold;
  }

  /* Paragraph text in hero section */
  .hero-content p {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  /* Button styling in hero section */
  .hero-content button {
    padding: 15px 30px;
    font-size: 1.2rem;
    border: none;
    background-color: #007bff;  /* Blue background color */
    color: white;
    border-radius: 25px;  /* Rounded button corners */
    cursor: pointer;
    transition: background-color 0.3s;
  }

  /* Button hover effect */
  .hero-content button:hover {
    background-color: #0056b3;  /* Darker blue on hover */
  }

  /* Unique section styling */
  .unique {
    text-align: center;
    margin: 50px 0;  /* Vertical margin */
  }

  /* Container for the boxes in the unique section */
  .boxes {
    display: flex;
    justify-content: space-between;
    gap: 20px;  /* Space between boxes */
    height: 150px;
    object-fit: scale-down;
    margin-top: 20px;
  }

  /* Box styling for each unique selling point */
  .box {
    flex: 1;
    min-width: 200px;  /* Minimum width of the box */
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);  /* Light shadow */
    transition: transform 0.3s, box-shadow 0.3s;
    color: white;
    text-align: center;
  }

  /* Box hover effect */
  .box:hover {
    transform: scale(1.05);  /* Slightly enlarge box */
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);  /* Darker shadow on hover */
  }

  /* Individual box backgrounds */
  .box-1 {
    background: url('src/assets/24-hour-service-3d-text-background_1017-38077.jpg') no-repeat center/contain;
  }

  .box-2 {
    background: url('src/assets/check-mark-with-review-stars_78370-1123.jpg') no-repeat center/contain;
  }

  .box-3 {
    background: url('src/assets/fast-free-delivery-logo_1308-49056.avif') no-repeat center/contain;
  }

  /* Processes section styling */
  .processes-section {
    text-align: center;
    padding: 50px 20px;  /* Padding for top and bottom */
  }

  /* Container for process steps */
  .process-flow {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 30px;
    flex-wrap: wrap;  /* Allows wrapping of steps on smaller screens */
  }

  /* Individual process step styling */
  .process-step {
    text-align: center;
    flex: 1;
    min-width: 200px;  /* Minimum width of each process step */
    max-width: 300px;  /* Maximum width of each process step */
    padding: 10px;
    transition: transform 0.3s;
  }

  /* Process step hover effect */
  .process-step:hover {
    transform: translateY(-10px);  /* Move step up on hover */
  }

  /* Circle styling for process steps */
  .circle {
    width: 50px;
    height: 50px;
    margin: 0 auto 10px;
    border-radius: 50%;
    background-color: #007bff;  /* Blue background for the circle */
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  }

  /* Text styling for process steps */
  .process-text h4 {
    margin: 10px 0 5px;
    font-size: 1.2rem;
  }

  /* Paragraph text styling for process steps */
  .process-text p {
    font-size: 1rem;
    color: #555;
  }
</style>
