import { mount } from "svelte"; // Importing a hypothetical `mount` function from Svelte (though Svelte typically doesn't have this method).
import "./app.css"; // Importing the CSS file to style the application.
import App from "./App.svelte"; // Importing the main Svelte component (root component of the application).

// Mounting the `App` component to a DOM element with the id 'app'.
const app = mount(App, {
  target: document.getElementById("app"), // Targeting the HTML element where the app will be rendered.
});

// Exporting the `app` instance so it can be reused or accessed elsewhere in the project if needed.
export default app;
