const { Sequelize } = require();
const sequelize = new Sequelize("Shipping_Service", "postgres", "8908576665", {
  host: "localhost",
  dialect: "postgres",
});

// Function to test the database connection
async function testConnection() {
  try {
    await sequelize.authenticate(); // Attempt to connect to the database
    console.log("Connection has been established successfully."); // Success message
  } catch (error) {
    console.error("Unable to connect to the database:", error); // Error message
  }
}

testConnection();
module.exports = sequelize;
