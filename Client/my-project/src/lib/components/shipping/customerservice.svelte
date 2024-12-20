<script>
    import { onMount } from "svelte";  // Import the 'onMount' lifecycle function from Svelte, which is used to run code when the component is mounted (rendered) on the page.
    import Header from "../header/header.svelte";  // Import a custom 'Header' component from the specified relative path to use it in this component.

    let currentRoute = "home";  // Define a reactive variable 'currentRoute' and set its initial value to "home". This will track the current active route/page.

    // Define a 'navigate' function to change the current route when a navigation event occurs.
    const navigate = (route) => {
        currentRoute = route;  // Update the value of 'currentRoute' to the new route passed as an argument.
        window.scrollTo(0, 0);  // Scroll to the top of the page (coordinates 0,0) whenever a new route is selected, ensuring smooth navigation.
    };
</script>


<Header />  <!-- Render the Header component, which is imported earlier in the script. This could contain global navigation or branding. -->

<header>  
    <h1>Customer Service</h1>  <!-- Main heading for the page, showing that this is the customer service section. -->
    <p>We're here to help with all your queries!</p>  <!-- A short tagline describing the customer service offering. -->
</header>

<nav>  <!-- Navigation bar that contains buttons to navigate between different routes/pages. -->
    <button on:click={() => navigate("home")}>Home</button>  <!-- Button to navigate to the "home" route. The `navigate` function is called on click. -->
    <button on:click={() => navigate("faq")}>FAQs</button>  <!-- Button to navigate to the "faq" route. -->
    <button on:click={() => navigate("emailSupport")}>Email Support</button>  <!-- Button to navigate to the "emailSupport" route. -->
    <button on:click={() => navigate("callSupport")}>Call Support</button>  <!-- Button to navigate to the "callSupport" route. -->
</nav>

<main class="container">  <!-- The main content container. The content changes dynamically based on the current route. -->
    {#if currentRoute === "home"}  <!-- Conditional rendering for the "home" route. -->
        <section>
            <h2>Welcome to Customer Support</h2>  <!-- Heading for the home section of customer support. -->
            <p>
                Need help? Explore our FAQs or contact us via email or toll-free
                number. We're dedicated to assisting you 24/7.
            </p>
        </section>
    {/if}

    {#if currentRoute === "faq"}  <!-- Conditional rendering for the "faq" route. -->
        <section>
            <h2>FAQs</h2>  <!-- Heading for the FAQs section. -->
            <ul class="faq-list">
                <li on:click={() => navigate("createShipment")}>  <!-- Navigate to "createShipment" when clicked. -->
                    <span>📦</span> How to create a shipment?
                </li>
                <li on:click={() => navigate("orderDelivery")}>  <!-- Navigate to "orderDelivery" when clicked. -->
                    <span>🚚</span> When will the order be delivered?
                </li>
                <li on:click={() => navigate("trackOrder")}>  <!-- Navigate to "trackOrder" when clicked. -->
                    <span>🔍</span> How can I track my order?
                </li>
            </ul>
        </section>
    {/if}

    {#if currentRoute === "createShipment"}  <!-- Conditional rendering for the "createShipment" route. -->
        <section>
            <h2>How to create a shipment?</h2>  <!-- Heading for the "createShipment" section. -->
            <p>
                To create a shipment, log in to your account, click on "Create" in
                the header section, and fill in the required details, including the
                receiver's and sender's information. Click "fetch latitude and
                longitude" to auto-fetch based on input address, then click on "Create
                Shipment" to complete the process.
            </p>
            <button on:click={() => navigate("faq")}>Back to FAQs</button>  <!-- Button to go back to the "faq" route. -->
        </section>
    {/if}

    {#if currentRoute === "orderDelivery"}  <!-- Conditional rendering for the "orderDelivery" route. -->
        <section>
            <h2>When will the order be delivered?</h2>  <!-- Heading for the "orderDelivery" section. -->
            <p>
                The delivery time depends on the selected shipping method. Standard
                shipping takes 5-7 business days, while express shipping takes 1-2
                business days. Check your email for the estimated delivery date.
            </p>
            <button on:click={() => navigate("faq")}>Back to FAQs</button>  <!-- Button to go back to the "faq" route. -->
        </section>
    {/if}

    {#if currentRoute === "trackOrder"}  <!-- Conditional rendering for the "trackOrder" route. -->
        <section>
            <h2>How can I track my order?</h2>  <!-- Heading for the "trackOrder" section. -->
            <p>
                You can track your order by visiting the "Track" section on our
                website. Enter your tracking ID to view the current status of your
                package and the order details.
            </p>
            <button on:click={() => navigate("faq")}>Back to FAQs</button>  <!-- Button to go back to the "faq" route. -->
        </section>
    {/if}

    {#if currentRoute === "emailSupport"}  <!-- Conditional rendering for the "emailSupport" route. -->
        <section>
            <h2>Email Support</h2>  <!-- Heading for the "emailSupport" section. -->
            <p>
                Reach out to us via email at
                <a href="mailto:support@example.com">support@example.com</a>. We aim to
                respond to all queries within 24 hours.
            </p>
        </section>
    {/if}

    {#if currentRoute === "callSupport"}  <!-- Conditional rendering for the "callSupport" route. -->
        <section>
            <h2>Call Support</h2>  <!-- Heading for the "callSupport" section. -->
            <p>
                Our toll-free number <strong>1-800-555-5555</strong> is available
                24/7. Feel free to contact us for any assistance you need.
            </p>
        </section>
    {/if}
</main>

<footer>  <!-- Footer of the page with some additional information. -->
    <p>
        © 2024 Customer Support | Need help?
        <a href="mailto:support@example.com">Email Us</a>  <!-- Link to email customer support. -->
    </p>
</footer>


<style>
    .container {
        max-width: 900px;
        padding: 10px;
        font-family: Arial, sans-serif;
    }

    header {
        text-align: center;
        background: linear-gradient(to right, #b783ee, #cfafaf);
        color: white;
        padding: 20px 10px;
        margin-bottom: 20px;
        border-radius: 8px;
    }

    header h1 {
        margin: 0;
        font-size: 2.5rem;
    }

    header p {
        font-size: 1.2rem;
        margin-top: 10px;
    }

    nav {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-bottom: 30px;
    }

    nav button {
        padding: 12px 25px;
        background-color: #4313c7;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        transition: transform 0.3s, background-color 0.3s;
    }

    nav button:hover {
        background-color: #4a0fbf;
        transform: translateY(-2px);
    }

    .faq-list {
        list-style: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .faq-list li {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: #f5f7fa;
        cursor: pointer;
        transition: box-shadow 0.3s, transform 0.3s;
    }

    .faq-list li:hover {
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transform: translateY(-3px);
    }

    .faq-list span {
        font-size: 1.5rem;
    }

    footer {
        text-align: center;
        margin-top: 40px;
        padding: 20px;
        background-color: #a159ee;
        color: rgb(0, 0, 0);
        border-radius: 8px;
    }

    footer a {
        color: #000000;
        text-decoration: none;
    }

    footer a:hover {
        text-decoration: underline;
    }
</style>
