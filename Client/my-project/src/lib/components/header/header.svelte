<script>
  import { navigate } from "svelte-routing"; // Import the navigate function from svelte-routing for handling navigation

  // Function to handle navigation to different paths
  const handleNavigation = (path) => {
    navigate(path); // Navigate to the provided path
  };

  // Function to handle user logout
  function handleLogout() {
    localStorage.removeItem("token"); // Remove the 'token' from localStorage to log the user out
    navigate("/"); // Navigate to the home page after logout
  }
</script>

<header>
  <div class="logo" on:click={() => handleNavigation("/")}> <!-- Click on logo navigates to the home page -->
    <img src="/src/assets/logo.png" alt="RapidRoute Logo" class="logo-image" />
    <h1>RapidRoute</h1> <!-- Display the logo and app name -->
  </div>
  
  <!-- Navigation bar -->
  <nav>
    <ul>
      <!-- Navigation items that trigger different routes when clicked -->
      <li>
        <a on:click={() => handleNavigation("/dashboard")}>
          <img src="https://cdn-icons-png.flaticon.com/128/2948/2948025.png" alt="Home" class="nav-icon" /> Home
        </a>
      </li>
      <li>
        <a on:click={() => handleNavigation("/track")}>
          <img src="https://cdn-icons-png.flaticon.com/128/563/563372.png" alt="Track" class="nav-icon" /> Track
        </a>
      </li>
      <li>
        <a on:click={() => handleNavigation("/create")}>
          <img src="https://cdn-icons-png.flaticon.com/128/15538/15538244.png" alt="Create" class="nav-icon" /> Create
        </a>
      </li>
      <li>
        <a on:click={() => handleNavigation("/view")}>
          <img src="https://cdn-icons-png.flaticon.com/128/11635/11635393.png" alt="View" class="nav-icon" /> View
        </a>
      </li>
      <li>
        <a on:click={() => handleNavigation("/customerservice")}>
          <img src="https://cdn-icons-png.flaticon.com/128/4961/4961759.png" alt="Customer Service" class="nav-icon" /> Customer Service
        </a>
      </li>
      <li>
        <a on:click={handleLogout}> <!-- Logout link -->
          <img src="https://cdn-icons-png.flaticon.com/128/3329/3329438.png" alt="Logout" class="nav-icon" /> Logout
        </a>
      </li>
    </ul>
  </nav>
</header>

<style>
  /* Style for the header section */
  header {
    display: flex;
    justify-content: space-between; /* Space out logo and navigation links */
    align-items: center; /* Align items vertically in the center */
    padding: 15px 5px; /* Padding for spacing */
    background: linear-gradient(90deg, rgba(255, 193, 7, 0.9), rgba(255, 87, 34, 0.9)); /* Gradient background */
    color: white;
    width: 100%;
    height: 80px; /* Fixed height for the header */
    position: fixed; /* Keep it fixed at the top */
    top: 0;
    left: 0;
    z-index: 1000; /* Ensure it stays above other content */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Add shadow for better visibility */
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px; /* Space between logo image and text */
    cursor: pointer; /* Cursor changes to pointer on hover */
  }

  .logo-image {
    width: 80px;
    height: 80px;
    border-radius: 40px; /* Make the logo image circular */
  }

  .logo h1 {
    font-size: 1.8rem;
    margin: 0; /* Remove margin around the title */
    font-weight: bold;
    color: #fff; /* White color for the text */
  }

  nav ul {
    list-style: none; /* Remove list bullets */
    display: flex; /* Display navigation items in a row */
    gap: 18px; /* Space between each navigation item */
    margin: 0;
    margin-right: 15px; /* Space on the right */
    padding: 0;
  }

  nav ul li {
    display: flex;
    align-items: center; /* Align icons and text in the center */
  }

  nav ul li a {
    text-decoration: none; /* Remove underline from links */
    color: #fff; /* White color for links */
    font-weight: 500;
    display: flex;
    align-items: center; /* Align icon and text */
    transition: transform 0.2s, color 0.2s; /* Smooth transitions for hover effects */
  }

  nav ul li a:hover {
    transform: scale(1.1); /* Slight zoom effect on hover */
    color: #ffe082; /* Change color on hover */
  }

  .nav-icon {
    width: 24px;
    height: 24px;
    margin-right: 8px; /* Space between the icon and text */
  }

  /* Style to prevent the header from overlapping the page content */
  main {
    padding-top: 100px; /* Offset the content to avoid overlap with the header */
  }
</style>
