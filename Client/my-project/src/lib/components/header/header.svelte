<script>
    import { navigate } from "svelte-routing"; // For navigation
  
    const handleNavigation = (path) => {
      navigate(path);
    };

    function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }
  </script>
  
  <header>
    <div class="logo" on:click={() => handleNavigation("/")}>
      <h1>Swift Ship</h1> <!-- Your logo here -->
    </div>
    <nav>
      <ul>
        <li><a on:click={() => handleNavigation("/dashboard")}>Home</a></li>
        <li><a on:click={() => handleNavigation("/track")}>Track</a></li>
        <li><a on:click={() => handleNavigation("/create")}>Create</a></li>
        <li><a on:click={() => handleNavigation("/view")}>View</a></li>
        <li><a on:click={() => handleNavigation("/customer-service")}>Customer Service</a></li>
        <li><a on:click={handleLogout}>Logout</a></li>

      </ul>
    </nav>
  </header>
  
  <style>
    header {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      background-color: #333;
      color: white;
    }
    .logo h1 {
      cursor: pointer;
    }
    nav ul {
      list-style: none;
      display: flex;
      gap: 20px;
    }
    nav ul li {
      cursor: pointer;
    }
    nav ul li a {
      text-decoration: none;
      color: white;
    }
  </style>