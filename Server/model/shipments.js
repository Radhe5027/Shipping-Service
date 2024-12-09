const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shipments', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tracking_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "shipments_tracking_id_key"
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    reciver_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    reciver_address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("Placed","In Transit","Delivered"),
      allowNull: false,
      defaultValue: "Placed"
    }
  }, {
    sequelize,
    tableName: 'shipments',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "shipments_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "shipments_tracking_id_key",
        unique: true,
        fields: [
          { name: "tracking_id" },
        ]
      },
    ]
  });
};
