// Import Sequelize to access Sequelize functionality and DataTypes
const Sequelize = require("sequelize");
const { underscoredIf } = require("sequelize/lib/utils"); // Helper to decide if column names should be underscored

// Export a function that defines the "users" model in Sequelize
module.exports = function (sequelize, DataTypes) {
  // Define the "users" model
  return sequelize.define(
    "users", // Model name
    {
      // Define the 'id' field for the 'users' table
      id: {
        autoIncrement: true, // Automatically increments the 'id' value for each new user
        type: DataTypes.INTEGER, // The 'id' will be an integer
        allowNull: false, // The 'id' cannot be NULL
        primaryKey: true, // This field will be the primary key for the table
      },
      // Define the 'username' field for the user's username
      username: {
        type: DataTypes.STRING(100), // The 'username' will be a string of up to 100 characters
        allowNull: false, // The 'username' cannot be NULL
      },
      // Define the 'email' field for the user's email address
      email: {
        type: DataTypes.STRING(255), // The 'email' will be a string of up to 255 characters
        allowNull: false, // The 'email' cannot be NULL
      },
      // Define the 'password' field for the user's password
      password: {
        type: DataTypes.STRING(255), // The 'password' will be a string of up to 255 characters
        allowNull: false, // The 'password' cannot be NULL
      },
      // Define the 'role_id' field to reference the 'roles' table
      role_id: {
        type: DataTypes.INTEGER, // The 'role_id' will be an integer
        allowNull: true, // The 'role_id' can be NULL if not specified
        defaultValue: 1, // Default value for 'role_id' is 1 (e.g., a default role such as "user")
        references: {
          model: "roles", // This field refers to the 'roles' table
          key: "id", // It references the 'id' field of the 'roles' model
        },
      },
    },
    {
      sequelize, // The Sequelize instance associated with this model
      tableName: "users", // The name of the table in the database
      schema: "public", // The schema where the table is located (for PostgreSQL)
      timestamps: true, // Automatically manage 'createdAt' and 'updatedAt' fields
      createdAt: "created_at", // Custom name for the 'createdAt' column in DB
      updatedAt: false, // Disable Sequelize from managing the 'updatedAt' field
      underscored: true, // Use snake_case column names (e.g., 'created_at' instead of 'createdAt')
      indexes: [
        {
          name: "users_pkey", // The name of the index for the primary key
          unique: true, // The index will enforce uniqueness of the 'id' field
          fields: [{ name: "id" }], // The 'id' field will be indexed
        },
      ],
    }
  );
};
