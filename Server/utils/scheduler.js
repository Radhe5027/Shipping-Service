const cron = require("node-cron");
const { shipments } = require("../database/db").models;
const { Op } = require("sequelize");

// Scheduler to update shipment statuses
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    // Update "Placed" to "In Transit" after 30 minutes
    const updatedInTransit = await shipments.update(
      { status: "In Transit", updated_at: now }, // Update status and timestamp
      {
        where: {
          status: "Placed",
          created_at: {
            [Op.lte]: new Date(now - 30 * 60 * 1000), // 30 minutes ago
          },
        },
      }
    );

    // Update "In Transit" to "Delivered" after another 30 minutes
    const updatedDelivered = await shipments.update(
      { status: "Delivered", updated_at: now }, // Update status and timestamp
      {
        where: {
          status: "In Transit",
          updated_at: {
            [Op.lte]: new Date(now - 30 * 60 * 1000), // 30 minutes ago
          },
        },
      }
    );

    console.log(
      `Updated ${updatedInTransit[0]} shipments to 'In Transit' and ${updatedDelivered[0]} shipments to 'Delivered'.`
    );
  } catch (error) {
    console.error("Error updating shipment statuses:", error.message);
  }
});
