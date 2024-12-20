// Correctly import Sequelize and DataTypes
// Sequelize is an ORM (Object Relational Mapper) for Node.js, which simplifies interaction with SQL databases.
// DataTypes are used to define the types of columns in the models (e.g., STRING, INTEGER).
const { Sequelize, DataTypes } = require("sequelize");

// Load environment variables from the .env file
// This loads variables defined in the .env file into process.env, so they can be accessed in the code.
require("dotenv").config();

// Import the initModels function from the model initialization file
// The initModels function initializes the models by linking them with the Sequelize instance
// and defines associations between models (like one-to-many, many-to-many relationships).
const initModels = require("../model/init-models");

// Retrieve the database password from the environment variables
// The password is stored in the .env file for security purposes, instead of hardcoding it in the source code.
const dbPassword = process.env.DB_PASSWORD;

// Initialize Sequelize with the database credentials
// The Sequelize instance is created by providing the database name, username, password, and options.
// - "Shipping_Service": the name of the database
// - "postgres": the username used to access the database
// - dbPassword: the password retrieved from the .env file
// - host: the address of the database (localhost for local development)
// - dialect: the type of database used (PostgreSQL in this case)
const sequelize = new Sequelize("Shipping_Service", "postgres", dbPassword, {
  host: "localhost", // Specify the host where the database is running (localhost for local development)
  dialect: "postgres", // Use PostgreSQL as the database dialect (other options include mysql, sqlite, etc.)
});

// Call the initModels function to initialize models with the Sequelize instance
// This function returns an object containing all the models and their associations with Sequelize.
// The models are used to interact with the database tables.
const models = initModels(sequelize);

// Sync the database (this will ensure all models are created in the database)
// The sequelize.sync() method checks if the defined models (tables) already exist in the database.
// - If the table does not exist, it will create the table according to the model definition.
// - If the table already exists, it will update the table schema based on model changes.
sequelize
  .sync() // Sync the models with the database
  .then(() => console.log("Database synced")) // If sync is successful, log the success message
  .catch((err) => console.log("Error syncing database:", err)); // If an error occurs, log the error message

// Export the sequelize instance and models for use in other parts of the application
// By exporting the Sequelize instance (which is required for making database queries) and the models
// (which contain the definitions of the database tables and their relationships),
// other parts of the application can easily interact with the database.
module.exports = {
  sequelize, // Export the Sequelize instance to allow database queries in other files
  models, // Export the models object which contains all the models and their relationships
};
