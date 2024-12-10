const Sequelize = require("sequelize");
const { underscoredIf } = require("sequelize/lib/utils");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "users",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
        references: {
          model: "roles",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "users",
      schema: "public",
      timestamps: true,
      createdAt: "created_at", // Map createdAt to created_at in DB
      updatedAt: false, // disable Sequelize from managing updated_at
      underscored: true, // Use snake_case columns (created_at instead of createdAt)
      indexes: [
        {
          name: "users_pkey",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
