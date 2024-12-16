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
    <img src="/src/assets/logo.png" alt="RapidRoute Logo" class="logo-image" />
    <h1>RapidRoute</h1>
  </div>
  <nav>
    <ul>
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
        <a on:click={handleLogout}>
          <img src="https://cdn-icons-png.flaticon.com/128/3329/3329438.png" alt="Logout" class="nav-icon" /> Logout
        </a>
      </li>
    </ul>
  </nav>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 5px;
    background: linear-gradient(90deg, rgba(255, 193, 7, 0.9), rgba(255, 87, 34, 0.9));
    color: white;
    width: 100%;
    height: 80px; /* Fixed height for the header */
    position: fixed; /* Keep it fixed at the top */
    top: 0;
    left: 0;
    z-index: 1000; /* Ensure it stays above other content */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }

  .logo-image {
    width: 80px;
    height: 80px;
    border-radius: 40px;
  }

  .logo h1 {
    font-size: 1.8rem;
    margin: 0;
    font-weight: bold;
    color: #fff;
  }

  nav ul {
    list-style: none;
    display: flex;
    gap: 18px;
    margin: 0;
    margin-right: 15px;
    padding: 0;
  }

  nav ul li {
    display: flex;
    align-items: center;
  }

  nav ul li a {
    text-decoration: none;
    color: #fff;
    font-weight: 500;
    display: flex;
    align-items: center;
    transition: transform 0.2s, color 0.2s;
  }

  nav ul li a:hover {
    transform: scale(1.1);
    color: #ffe082;
  }

  .nav-icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }

  /* Add padding to the page content to avoid overlap with the fixed header */
  main {
    padding-top: 100px; /* Offset equal to the header height + some extra padding */
  }
</style>
