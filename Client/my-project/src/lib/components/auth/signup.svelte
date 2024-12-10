<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
  
  
    let username = "";
    let email = "";
    let password = "";
    let confirmPassword = "";
    let role = "user"; // Default role
    let message = null; // For success or error messages
    let error = null;
  
    const signup = async () => {
      try {
        error = null;
        message = null;
  
        if (!username || !email || !password || !confirmPassword) {
          error = "All fields are required";
          return;
        }
  
        if (password !== confirmPassword) {
          error = "Passwords do not match";
          return;
        }
  
        const response = await fetch("http://localhost:3000/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password, confirmPassword, role }),
        });
  
        const data = await response.json();
        if (!response.ok) {
          error = data.error || "Signup failed";
        } else {
          message = data.message;
          // Optionally clear form fields after successful signup
          username = "";
          email = "";
          password = "";
          confirmPassword = "";
          role = "user";

          navigate("/login");
        }
      } catch (err) {
        error = "An unexpected error occurred";
        console.error(err);
      }
    };
  </script>
  
  <style>
    .form-container {
      max-width: 400px;
      margin: auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      font-family: Arial, sans-serif;
    }
  
    .form-container h1 {
      text-align: center;
      margin-bottom: 20px;
    }
  
    .form-container .field {
      margin-bottom: 15px;
    }
  
    .form-container .field label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
  
    .form-container .field input,
    .form-container .field select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
    }
  
    .form-container button {
      width: 100%;
      padding: 10px;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
  
    .form-container button:hover {
      background-color: #0056b3;
    }
  
    .form-container .message {
      margin-top: 15px;
      font-size: 14px;
      color: green;
      text-align: center;
    }
  
    .form-container .error {
      margin-top: 15px;
      font-size: 14px;
      color: red;
      text-align: center;
    }
  </style>
  
  <div class="form-container">
    <h1>Sign Up</h1>
  
    <div class="field">
      <label for="username">Username</label>
      <input type="text" id="username" bind:value={username} placeholder="Enter your username" />
    </div>
  
    <div class="field">
      <label for="email">Email</label>
      <input type="email" id="email" bind:value={email} placeholder="Enter your email" />
    </div>
  
    <div class="field">
      <label for="password">Password</label>
      <input type="password" id="password" bind:value={password} placeholder="Enter your password" />
    </div>
  
    <div class="field">
      <label for="confirmPassword">Confirm Password</label>
      <input type="password" id="confirmPassword" bind:value={confirmPassword} placeholder="Confirm your password" />
    </div>
  
    <div class="field">
      <label for="role">Role</label>
      <select id="role" bind:value={role}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  
    <button on:click={signup}>Sign Up</button>
  
    {#if message}
      <p class="message">{message}</p>
    {/if}
    {#if error}
      <p class="error">{error}</p>
    {/if}
  </div>
  