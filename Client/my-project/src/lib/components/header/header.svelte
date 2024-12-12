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
      <li><a on:click={() => handleNavigation("/dashboard")}><img src="https://cdn-icons-png.flaticon.com/128/2948/2948025.png" alt="Home" class="nav-icon"/> Home</a></li>
      <li><a on:click={() => handleNavigation("/track")}><img src="https://cdn-icons-png.flaticon.com/128/563/563372.png" alt="Track" class="nav-icon"/> Track</a></li>
      <li><a on:click={() => handleNavigation("/create")}><img src="https://cdn-icons-png.flaticon.com/128/15538/15538244.png" alt="Create" class="nav-icon"/> Create</a></li>
      <li><a on:click={() => handleNavigation("/view")}><img src="https://cdn-icons-png.flaticon.com/128/11635/11635393.png" alt="View" class="nav-icon"/> View</a></li>
      <li><a on:click={() => handleNavigation("/customer-service")}><img src="https://cdn-icons-png.flaticon.com/128/4961/4961759.png" alt="Customer Service" class="nav-icon"/> Customer Service</a></li>
      <li><a on:click={handleLogout}><img src="https://cdn-icons-png.flaticon.com/128/3329/3329438.png" alt="Logout" class="nav-icon"/> Logout</a></li>
    </ul>
  </nav>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: rgb(255, 255, 255);
    color: rgb(3, 3, 3);
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
    color: rgb(0, 0, 0);
    display: flex;
    align-items: center;
  }

  .nav-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
</style>
