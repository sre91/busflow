import "dotenv/config";

import connectDatabase from "../config/database.js";
import Bus from "../models/Bus.js";
import Seat from "../models/Seat.js";

const generateSeats = async () => {
  try {
    await connectDatabase();

    const buses = await Bus.find();

    if (buses.length === 0) {
      console.log("⚠️ No buses found. Seed buses first.");
      process.exit(0);
    }

    await Seat.deleteMany({});

    const seats = [];

    for (const bus of buses) {
      const totalSeats = bus.totalSeats;

      for (let i = 1; i <= totalSeats; i++) {
        seats.push({
          busId: bus._id,
          seatNumber: `A${i}`,
          seatType: bus.busType.includes("Sleeper") ? "sleeper" : "seater",
          status: "available",
          price: bus.price,
        });
      }
    }

    await Seat.insertMany(seats);

    console.log(`💺 ${seats.length} seats seeded successfully`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seat seeding failed:", error);

    process.exit(1);
  }
};

generateSeats();
