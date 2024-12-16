<script>
  // Importing the 'navigate' function from svelte-routing for page navigation
  import { navigate } from 'svelte-routing';
  
  // Declaring state variables to hold input values and display messages or errors
  let email = "";
  let password = "";
  let message = null;
  let error = null;

  // Function to handle the sign-in process
  const signin = async () => {
    try {
      // Reset any previous messages or errors
      error = null;
      message = null;

      // Check if both email and password are provided, if not, set an error
      if (!email || !password) {
        error = "Email and password are required";
        return;
      }

      // Send a POST request to the login API with the email and password
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Parse the response from the API
      const data = await response.json();

      // If the response is not OK, display the error message
      if (!response.ok) {
        error = data.error || "Sign-in failed";

        // If user is not found, redirect to the signup page
        if (data.error === "User not found") {
          navigate("/signup");
        }
      } else {
        // If login is successful, store the token in local storage and navigate to dashboard
        message = data.message;
        localStorage.setItem("token", data.token); // Save token in localStorage
        navigate("/dashboard"); // Redirect to dashboard on success
      }
    } catch (err) {
      // Catch any unexpected errors and display a message
      error = "An unexpected error occurred";
      console.error(err);
    }
  };

  // Function to navigate to the signup page if the user needs to register
  const signup = function signup() {
    navigate('/signup');
  }
</script>


<div class="form-container">
  <h1>Sign In</h1>

  <!-- Email input field -->
  <div class="field">
    <label for="email">Email</label>
    <input
      type="email"
      id="email"
      bind:value={email}
      placeholder="Enter your email"
    />
  </div>

  <!-- Password input field -->
  <div class="field">
    <label for="password">Password</label>
    <input
      type="password"
      id="password"
      bind:value={password}
      placeholder="Enter your password"
    />
  </div>

  <!-- Sign in button -->
  <button on:click={signin}>Sign In</button>

  <!-- Display success or error messages -->
  {#if message}
    <p class="message">{message}</p>
  {/if}
  {#if error}
    <p class="error">{error}</p>
  {/if}

  <!-- Link to navigate to signup page if user does not have an account -->
  <div class="signup-link">
    <p>Don't have an account? <button on:click={signup}>Register</button></p>
  </div>
</div>



<style>
  /* Styling for the form container with box-shadow and hover effects */
  .form-container {
    max-width: 400px;
    width: 100%;
    padding: 30px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease;
  }

  /* Hover effect for the form container */
  .form-container:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }

  /* Heading styling */
  h1 {
    text-align: center;
    color: #333;
    font-size: 2.4em;
    margin-bottom: 20px;
    font-weight: 700;
  }

  /* Styling for each input field */
  .field {
    margin-bottom: 20px;
    color: black;
  }

  .field label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #495057;
  }

  .field input {
    width: 100%;
    padding: 12px;
    border: 2px solid #ced4da;
    border-radius: 8px;
    font-size: 16px;
    background-color: #f8f9fa;
    color: #333;
    transition: all 0.3s ease;
  }

  /* Focus effect for input fields */
  .field input:focus {
    border-color: #0984e3;
    background-color: #ffffff;
    outline: none;
  }

  /* Styling for the submit button */
  .form-container button {
    width: 100%;
    padding: 14px;
    background-color: #0984e3;
    color: rgb(0, 0, 0);
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }

  /* Hover effect for the submit button */
  .form-container button:hover {
    background-color: #74b9ff;
    transform: translateY(-2px);
  }

  /* Styling for messages (success/error) */
  .form-container .message, .form-container .error {
    font-size: 14px;
    text-align: center;
    margin-top: 15px;
  }

  /* Success message styling */
  .message {
    color: #2ecc71;
  }

  /* Error message styling */
  .error {
    color: #e74c3c;
  }

  /* Link to signup page if the user does not have an account */
  .signup-link {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
  }

  .signup-link button {
    color: #0984e3;
    background: none;
    border: none;
    font-weight: 600;
    cursor: pointer;
  }

  /* Hover effect for signup link */
  .signup-link button:hover {
    text-decoration: underline;
  }

  /* Styling to remove focus outline from signup link button */
  .signup-link button:focus {
    outline: none;
  }
</style>