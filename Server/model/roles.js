// Import Sequelize to access Sequelize functionality and DataTypes
const Sequelize = require("sequelize");

// Export a function that defines the "roles" model in Sequelize
module.exports = function (sequelize, DataTypes) {
  // Define the "roles" model
  return sequelize.define(
    "roles",
    {
      // Define the 'id' field for the 'roles' table
      id: {
        autoIncrement: true, // This will automatically increment the id for each new record
        type: DataTypes.INTEGER, // The id will be of type INTEGER
        allowNull: false, // The id cannot be NULL
        primaryKey: true, // The id will be the primary key of the table
      },
      // Define the 'role_name' field for the 'roles' table
      role_name: {
        type: DataTypes.STRING(20), // The 'role_name' will be a string with a maximum length of 20 characters
        allowNull: false, // The 'role_name' cannot be NULL
      },
    },
    {
      // Additional options for the 'roles' model
      sequelize, // The Sequelize instance associated with this model
      tableName: "roles", // The name of the table in the database
      schema: "public", // The schema where the table is located (for PostgreSQL)
      timestamps: false, // This tells Sequelize not to automatically add 'createdAt' and 'updatedAt' columns
      indexes: [
        {
          name: "roles_pkey", // The name of the index
          unique: true, // The index will be unique, ensuring no duplicate values in the 'id' column
          fields: [
            { name: "id" }, // The field (column) to apply the index on
          ],
        },
      ],
    }
  );
};
