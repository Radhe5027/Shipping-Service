<script>
  import { navigate } from 'svelte-routing';

  // Variables to store user input for the signup form
  let username = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  let message = null;  // For success message
  let error = null;    // For error messages

  // Hardcoded user role for now, can be changed as needed
  const role = "user"; 

  // Function to validate the password based on given criteria
  const validatePassword = (password) => {
    // Regex checks for at least 1 uppercase letter, 1 digit, 1 special character, and minimum 8 characters
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  // Function to handle the signup process
  const signup = async () => {
    try {
      // Reset messages before starting signup process
      error = null;
      message = null;

      // Validate if all fields are filled
      if (!username || !email || !password || !confirmPassword) {
        error = "All fields are required";
        return;  // Exit the function if any field is missing
      }

      // Check if password and confirmPassword match
      if (password !== confirmPassword) {
        error = "Passwords do not match";
        return;  // Exit if passwords don't match
      }

      // Validate the password against the regex pattern
      if (!validatePassword(password)) {
        error = "Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character";
        return;  // Exit if password is invalid
      }

      // Send the signup data to the API for processing
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, confirmPassword, role }),
      });

      // Get the response data and handle success or failure
      const data = await response.json();
      if (!response.ok) {
        error = data.error || "Signup failed";  // Display any error from the API
      } else {
        message = data.message;  // Display success message
        // Reset the form fields
        username = "";
        email = "";
        password = "";
        confirmPassword = "";

        // Redirect to login page after successful signup
        navigate("/"); 
      }
    } catch (err) {
      // Handle any unexpected errors during signup
      error = "An unexpected error occurred";
      console.error(err);  // Log the error for debugging purposes
    }
  };

  // Function to handle login navigation (called when the user clicks the login button)
  const login = function() {
    navigate('/');  // Redirect to the login page
  }
</script>

<!-- Signup Form UI -->
<div class="form-container">
  <h1>Create an Account</h1>

  <!-- Username input field -->
  <div class="field">
    <label for="username">Username</label>
    <input type="text" id="username" bind:value={username} placeholder="Enter your username" />
  </div>

  <!-- Email input field -->
  <div class="field">
    <label for="email">Email</label>
    <input type="email" id="email" bind:value={email} placeholder="Enter your email" />
  </div>

  <!-- Password input field -->
  <div class="field">
    <label for="password">Password</label>
    <input type="password" id="password" bind:value={password} placeholder="Enter your password" />
  </div>

  <!-- Confirm Password input field -->
  <div class="field">
    <label for="confirmPassword">Confirm Password</label>
    <input type="password" id="confirmPassword" bind:value={confirmPassword} placeholder="Confirm your password" />
  </div>

  <!-- Signup button -->
  <button on:click={signup}>Sign Up</button>

  <!-- Success message display -->
  {#if message}
    <p class="message">{message}</p>
  {/if}
  <!-- Error message display -->
  {#if error}
    <p class="error">{error}</p>
  {/if}

  <!-- Link to login page if already registered -->
  <div class="sigin-link">
    <p>Already Registered? Kindly login <button on:click={login}>Login</button></p>
  </div>
</div>

<style>
  /* Style for the form container */
  .form-container {
    max-width: 450px;
    margin: auto;
    padding: 40px;
    background: linear-gradient(135deg, #fff, #f8f9fa);
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
  }

  /* Style for the heading */
  .form-container h1 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 20px;
    font-weight: 700;
    font-size: 1.8rem;
  }

  /* Style for input fields and labels */
  .form-container .field {
    margin-bottom: 20px;
  }

  .form-container .field label {
    display: block;
    font-size: 0.9rem;
    margin-bottom: 5px;
    color: #2c3e50;
    font-weight: 600;
  }

  .form-container .field input{
    width: 100%;
    padding: 12px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    color: black;
    background-color: #ecf0f1;
    transition: 0.3s;
  }

  /* Focus state for inputs */
  .form-container .field input:focus{
    outline: none;
    border-color: #3498db;
    background-color: #fff;
  }

  /* Style for the signup button */
  .form-container button {
    width: 100%;
    padding: 12px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;
  }

  /* Hover effect for the signup button */
  .form-container button:hover {
    background-color: #2980b9;
  }

  /* Success message style */
  .form-container .message {
    margin-top: 20px;
    font-size: 1rem;
    color: #27ae60;
    text-align: center;
    font-weight: 600;
  }

  /* Error message style */
  .form-container .error {
    margin-top: 20px;
    font-size: 1rem;
    color: #e74c3c;
    text-align: center;
    font-weight: 600;
  }

  /* Responsive styling for small screens */
  @media (max-width: 480px) {
    .form-container {
      padding: 20px;
      width: 90%;
    }

    .form-container h1 {
      font-size: 1.6rem;
    }

    .form-container button {
      font-size: 1rem;
    }
  }
</style>
