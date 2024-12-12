<script>
  import {onMount} from 'svelte';
  import {Router, Route, navigate} from 'svelte-routing';
  import Signup from "./lib/components/auth/signup.svelte";
  import Signin from './lib/components/auth/signin.svelte';
  import Home from './lib/components/dashboard/home.svelte';
  import Create from './lib/components/shipping/create.svelte';
  import Customerservice from './lib/components/shipping/customerservice.svelte';
  import Track from './lib/components/shipping/track.svelte';
  import View from './lib/components/shipping/view.svelte';




  onMount(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect to SignIn page
    } else {
      navigate("/dashboard"); // If token exists, redirect to Dashboard
    }
  });


</script>





<main class = "main-content ">
  <Router>
    <div>
      <Route path = '/' component = {Signin}/>
      <Route path = '/signup' component ={Signup} />
      <Route path = '/create' component = {Create} />
      <Route path = '/track' component = {Track} />
      <Route path = '/view' component = {View} />
      <Route path = '/customerservice' component = {Customerservice} />
      <Route path = '/dashboard' component = {Home} />
      

    </div>
  </Router>
  
</main>




<style>
   .main-content {
      padding: 1rem;
  }

</style>
