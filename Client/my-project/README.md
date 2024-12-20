# Svelte + Vite

This template should help get you started developing with Svelte in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Need an official Svelte framework?

Check out [SvelteKit](https://github.com/sveltejs/kit#readme), which is also powered by Vite. Deploy anywhere with its serverless-first approach and adapt to various platforms, with out of the box support for TypeScript, SCSS, and Less, and easily-added support for mdsvex, GraphQL, PostCSS, Tailwind CSS, and more.

## Technical considerations

**Why use this over SvelteKit?**

- It brings its own routing solution which might not be preferable for some users.
- It is first and foremost a framework that just happens to use Vite under the hood, not a Vite app.

This template contains as little as possible to get started with Vite + Svelte, while taking into account the developer experience with regards to HMR and intellisense. It demonstrates capabilities on par with the other `create-vite` templates and is a good starting point for beginners dipping their toes into a Vite + Svelte project.

Should you later need the extended capabilities and extensibility provided by SvelteKit, the template has been structured similarly to SvelteKit so that it is easy to migrate.

**Why `global.d.ts` instead of `compilerOptions.types` inside `jsconfig.json` or `tsconfig.json`?**

Setting `compilerOptions.types` shuts out all other types not explicitly listed in the configuration. Using triple-slash references keeps the default TypeScript setting of accepting type information from the entire workspace, while also adding `svelte` and `vite/client` type information.

**Why include `.vscode/extensions.json`?**

Other templates indirectly recommend extensions via the README, but this file allows VS Code to prompt the user to install the recommended extension upon opening the project.

**Why enable `checkJs` in the JS template?**

It is likely that most cases of changing variable types in runtime are likely to be accidental, rather than deliberate. This provides advanced typechecking out of the box. Should you like to take advantage of the dynamically-typed nature of JavaScript, it is trivial to change the configuration.

**Why is HMR not preserving my local component state?**

HMR state preservation comes with a number of gotchas! It has been disabled by default in both `svelte-hmr` and `@sveltejs/vite-plugin-svelte` due to its often surprising behavior. You can read the details [here](https://github.com/sveltejs/svelte-hmr/tree/master/packages/svelte-hmr#preservation-of-local-state).

If you have state that's important to retain within a component, consider creating an external store which would not be replaced by HMR.

{
"name": "my-project", // The name of your project, which is used for identification purposes.
"private": true, // Marks the project as private, which prevents accidental publishing to public registries like npm.
"version": "0.0.0", // The current version of your project. Typically updated as the project evolves (e.g., "1.0.0").
"type": "module", // Specifies that the project uses ECMAScript modules (ESM). This allows using `import` and `export` syntax.

"scripts": { // Defines custom commands that can be run from the terminal.
"dev": "vite", // Runs the Vite development server, enabling fast development with live reloading.
"build": "vite build", // Builds the project for production, optimizing code for performance.
"preview": "vite preview" // Previews the built project locally, allowing you to check the production version before deployment.
},

"devDependencies": { // Lists development dependencies that are only needed during the development process.
"@sveltejs/vite-plugin-svelte": "^5.0.0", // Vite plugin to integrate Svelte with Vite, enabling fast Svelte component compilation.
"svelte": "^5.2.7", // The core Svelte framework for building reactive user interfaces.
"vite": "^6.0.1" // Vite is a fast build tool and development server that supports modern JavaScript features and optimizations.
},

"dependencies": { // Lists runtime dependencies that are needed when the app is running in production.
"dotenv": "^16.4.7", // Loads environment variables from a `.env` file, useful for managing secrets like API keys.
"googleapis": "^144.0.0", // The Google API client library to interact with Google services such as Google Drive, Sheets, etc.
"jwt-decode": "^4.0.0", // A library for decoding JWT (JSON Web Tokens), commonly used for handling user authentication.
"maplibre-gl": "^4.7.1", // A library for rendering interactive maps using MapLibre GL, based on OpenStreetMap data.
"svelte-routing": "^2.13.0", // Provides routing functionality for Svelte apps, allowing you to handle page navigation.
"vite-plugin-env-compatible": "^2.0.1" // A Vite plugin that ensures compatibility with environment variables during build and development.
}
}

```js
// store.js
// An extremely simple external store
import { writable } from "svelte/store";
export default writable(0);
```
