<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
  
    let email = "";
    let password = "";
    let message = null; // For success or error messages
    let error = null;
  
    const signin = async () => {
      try {
        error = null;
        message = null;
  
        if (!email || !password) {
          error = "Email and password are required";
          return;
        }
  
        const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
        if (!response.ok) {
          error = data.error || "Sign-in failed";
        } else {
          message = data.message;
          //store the JWT token
          localStorage.setItem("token", data.token);
          // Redirect or show additional content for signed-in users
          navigate("/dashboard");
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

  .form-container .field input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }

  .form-container button {
    width: 100%;
    padding: 10px;
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }

  .form-container button:hover {
    background-color: #218838;
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
  <h1>Sign In</h1>

  <div class="field">
    <label for="email">Email</label>
    <input
      type="email"
      id="email"
      bind:value={email}
      placeholder="Enter your email"
    />
  </div>

  <div class="field">
    <label for="password">Password</label>
    <input
      type="password"
      id="password"
      bind:value={password}
      placeholder="Enter your password"
    />
  </div>

  <button on:click={signin}>Sign In</button>

  {#if message}
    <p class="message">{message}</p>
  {/if}
  {#if error}
    <p class="error">{error}</p>
  {/if}
</div>

