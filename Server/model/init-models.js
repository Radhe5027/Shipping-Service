var DataTypes = require("sequelize").DataTypes;
var _roles = require("./roles");
var _shipment_locations = require("./shipment_locations");
var _shipments = require("./shipments");
var _users = require("./users");

function initModels(sequelize) {
  var roles = _roles(sequelize, DataTypes);
  var shipment_locations = _shipment_locations(sequelize, DataTypes);
  var shipments = _shipments(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  users.belongsTo(roles, { as: "role", foreignKey: "role_id" });
  roles.hasMany(users, { as: "users", foreignKey: "role_id" });
  shipment_locations.belongsTo(shipments, {
    as: "shipment",
    foreignKey: "shipment_id",
  });
  shipments.hasMany(shipment_locations, {
    as: "shipment_locations",
    foreignKey: "shipment_id",
  });
  shipments.belongsTo(users, { as: "sender", foreignKey: "sender_id" });
  users.hasMany(shipments, { as: "shipments", foreignKey: "sender_id" });

  return {
    roles,
    shipment_locations,
    shipments,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
