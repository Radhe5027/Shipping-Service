// Correctly import Sequelize and DataTypes
const { Sequelize, DataTypes } = require("sequelize");
const initModels = require("../model/init-models");

// Initialize Sequelize with the database credentials
const sequelize = new Sequelize("Shipping_Service", "postgres", "8908576665", {
  host: "localhost",
  dialect: "postgres", // Use the appropriate dialect for your database
});

const models = initModels(sequelize);

// Sync the database (this will ensure all models are created in the database)
sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch((err) => console.log("Error syncing database:", err));

// Export the sequelize instance and models
module.exports = {
  sequelize,
  models,
};
