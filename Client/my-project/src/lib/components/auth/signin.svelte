<script>
  // Importing the 'navigate' function from svelte-routing to navigate between pages
  import { navigate } from 'svelte-routing';

  // Declare state variables for holding email, password, and messages (success or error)
  let email = "";
  let password = "";
  let message = null;
  let error = null;

  // Function to handle the sign-in process when the user clicks the "Sign In" button
  const signin = async () => {
    try {
      // Reset any previous messages or errors before starting the sign-in process
      error = null;
      message = null;

      // Check if both email and password are provided, if not, show an error message
      if (!email || !password) {
        error = "Email and password are required"; // Set error message if inputs are missing
        return; // Exit the function if validation fails
      }

      // Send a POST request to the login API with the email and password entered by the user
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // Send email and password in the body as JSON
      });

      // Parse the response from the API into JSON
      const data = await response.json();

      // Check if the response is not OK (login failed), display an error message
      if (!response.ok) {
        error = data.error || "Sign-in failed"; // Set the error message from the API or a default one

        // If user is not found, navigate to the signup page for registration
        if (data.error === "User not found") {
          navigate("/signup"); // Redirect to signup page if user does not exist
        }
      } else {
        // If login is successful, store the returned token in local storage
        message = data.message; // Display success message from the API
        localStorage.setItem("token", data.token); // Save token for future requests
        navigate("/dashboard"); // Navigate to the dashboard page after successful login
      }
    } catch (err) {
      // Catch any unexpected errors that occur during the sign-in process
      error = "An unexpected error occurred"; // Show a generic error message
      console.error(err); // Log the error to the console for debugging
    }
  };

  // Function to navigate to the signup page if the user needs to register
  const signup = function signup() {
    navigate('/signup'); // Redirect to the signup page when called
  }
</script>

<!-- Form container for the sign-in page -->
<div class="form-container">
  <h1>Sign In</h1>

  <!-- Email input field where user enters their email -->
  <div class="field">
    <label for="email">Email</label>
    <input
      type="email"
      id="email"
      bind:value={email}  
      placeholder="Enter your email"
    />
  </div>

  <!-- Password input field where user enters their password -->
  <div class="field">
    <label for="password">Password</label>
    <input
      type="password"
      id="password"
      bind:value={password}  
      placeholder="Enter your password"
    />
  </div>

  <!-- Button that triggers the sign-in process when clicked -->
  <button on:click={signin}>Sign In</button>

  <!-- Display success or error messages if available -->
  {#if message}
    <p class="message">{message}</p> <!-- Show success message if login is successful -->
  {/if}
  {#if error}
    <p class="error">{error}</p> <!-- Show error message if login fails -->
  {/if}

  <!-- Link to navigate to signup page if the user does not have an account -->
  <div class="signup-link">
    <p>Don't have an account? <button on:click={signup}>Register</button></p>
  </div>
</div>

<!-- Styling for the form container and its elements -->
<style>
  /* Styling for the form container, adding box-shadow and hover effects */
  .form-container {
    max-width: 400px;
    width: 100%;
    padding: 30px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15); /* Adds shadow */
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease; /* Smooth hover effect */
  }

  /* Hover effect to slightly lift the form when hovered over */
  .form-container:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2); /* Change shadow on hover */
  }

  /* Center-aligned heading with specific font style */
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

  /* Focus effect for input fields when they are clicked */
  .field input:focus {
    border-color: #0984e3;
    background-color: #ffffff;
    outline: none;
  }

  /* Styling for the submit button with a smooth hover effect */
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

  /* Button hover effect */
  .form-container button:hover {
    background-color: #74b9ff;
    transform: translateY(-2px); /* Lift the button slightly when hovered */
  }

  /* Styling for success and error messages */
  .form-container .message, .form-container .error {
    font-size: 14px;
    text-align: center;
    margin-top: 15px;
  }

  /* Success message styling (green color) */
  .message {
    color: #2ecc71;
  }

  /* Error message styling (red color) */
  .error {
    color: #e74c3c;
  }

  /* Link to navigate to signup page */
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

  /* Hover effect for signup link button */
  .signup-link button:hover {
    text-decoration: underline;
  }

  /* Remove focus outline from signup button */
  .signup-link button:focus {
    outline: none;
  }
</style>
