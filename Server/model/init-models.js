// Import necessary Sequelize components and model definitions
// DataTypes is used to define column types in models (e.g., STRING, INTEGER, DATE)
var DataTypes = require("sequelize").DataTypes;

// Import individual models (roles, shipment locations, shipments, users)
// Each model is a separate file that defines the schema and relations for a table.
var _roles = require("./roles");
var _shipment_locations = require("./shipment_locations");
var _shipments = require("./shipments");
var _users = require("./users");

function initModels(sequelize) {
  // Initialize each model by passing the Sequelize instance and DataTypes
  // This links the Sequelize instance to the model definitions, allowing the models to interact with the database.
  var roles = _roles(sequelize, DataTypes);
  var shipment_locations = _shipment_locations(sequelize, DataTypes);
  var shipments = _shipments(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  // Define relationships between models (associations)

  // A user belongs to a role (each user has one role)
  users.belongsTo(roles, { as: "role", foreignKey: "role_id" });

  // A role can have many users (a role is assigned to many users)
  roles.hasMany(users, { as: "users", foreignKey: "role_id" });

  // A shipment location belongs to a shipment (each location is associated with one shipment)
  shipment_locations.belongsTo(shipments, {
    as: "shipment", // Alias used to access the relationship
    foreignKey: "shipment_id", // Column in shipment_locations table that links to shipments
  });

  // A shipment can have many shipment locations (a shipment can be linked to multiple locations)
  shipments.hasMany(shipment_locations, {
    as: "shipment_locations", // Alias used to access the relationship
    foreignKey: "shipment_id", // Column in shipments table that links to shipment_locations
  });

  // A shipment belongs to a user (sender of the shipment)
  shipments.belongsTo(users, { as: "sender", foreignKey: "sender_id" });

  // A user can have many shipments (a user can send multiple shipments)
  users.hasMany(shipments, { as: "shipments", foreignKey: "sender_id" });

  // Return an object containing all the models with their associations set up
  // This allows these models to be used for querying the database.
  return {
    roles,
    shipment_locations,
    shipments,
    users,
  };
}

// Export the initModels function to make it accessible in other parts of the application
module.exports = initModels;
// Alternatively, export initModels as both default and named export
module.exports.initModels = initModels;
module.exports.default = initModels;
