<script>
  import { onMount } from 'svelte'; // Importing Svelte's lifecycle hook for executing logic after the component is mounted.
  import { Router, Route, navigate } from 'svelte-routing'; // Importing router-related components and `navigate` for navigation.
  
  // Importing the Svelte components for different routes.
  import Signup from "./lib/components/auth/signup.svelte";
  import Signin from './lib/components/auth/signin.svelte';
  import Home from './lib/components/dashboard/home.svelte';
  import Create from './lib/components/shipping/create.svelte';
  import Customerservice from './lib/components/shipping/customerservice.svelte';
  import Track from './lib/components/shipping/track.svelte';
  import View from './lib/components/shipping/view.svelte';

  // `onMount` runs logic when the component is mounted to the DOM.
  onMount(() => {
    const token = localStorage.getItem("token"); // Retrieve the authentication token from localStorage.

    if (!token) {
      // If no token exists, navigate to the SignIn page ("/").
      navigate("/");
    } else {
      // If a token exists, navigate to the Dashboard ("/dashboard").
      navigate("/dashboard");
    }
  });
</script>

<main class="main-content">
  <!-- Main container for the application content -->
  <Router>
    <!-- Router component manages different routes within the application -->
    <div>
      <!-- Defining routes for the application -->
      <Route path="/" component={Signin} /> <!-- Route for SignIn page -->
      <Route path="/signup" component={Signup} /> <!-- Route for Signup page -->
      <Route path="/create" component={Create} /> <!-- Route for Create Shipping page -->
      <Route path="/track" component={Track} /> <!-- Route for Tracking page -->
      <Route path="/view" component={View} /> <!-- Route for Viewing shipments -->
      <Route path="/customerservice" component={Customerservice} /> <!-- Route for Customer Service -->
      <Route path="/dashboard" component={Home} /> <!-- Route for Dashboard -->
    </div>
  </Router>
</main>

<style>
  /* Styling for the main content container */
  .main-content {
    padding: 1rem; /* Add padding around the content */
  }
</style>
