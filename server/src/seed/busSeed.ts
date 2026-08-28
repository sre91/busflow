import "dotenv/config";

import connectDatabase from "../config/database.js";
import Bus from "../models/Bus.js";

const seedBuses = async () => {
  try {
    await connectDatabase();

    await Bus.deleteMany({});

    await Bus.insertMany([
      {
        operator: "BlueLine Travels",
        busType: "AC Sleeper",
        source: "Chennai",
        destination: "Bangalore",
        departureTime: "10:30 PM",
        arrivalTime: "06:30 AM",
        duration: "8 hours",
        price: 899,
        rating: 4.6,
        totalSeats: 40,
        availableSeats: 18,
      },
      {
        operator: "GreenRide Express",
        busType: "AC Seater",
        source: "Chennai",
        destination: "Bangalore",
        departureTime: "08:00 PM",
        arrivalTime: "05:30 AM",
        duration: "9 hours 30 minutes",
        price: 749,
        rating: 4.4,
        totalSeats: 40,
        availableSeats: 24,
      },
      {
        operator: "CityLink Travels",
        busType: "Non-AC Seater",
        source: "Chennai",
        destination: "Bangalore",
        departureTime: "07:00 AM",
        arrivalTime: "04:00 PM",
        duration: "9 hours",
        price: 599,
        rating: 4.2,
        totalSeats: 45,
        availableSeats: 31,
      },
      {
        operator: "Royal Roadways",
        busType: "AC Sleeper",
        source: "Chennai",
        destination: "Bangalore",
        departureTime: "09:45 PM",
        arrivalTime: "06:00 AM",
        duration: "8 hours 15 minutes",
        price: 999,
        rating: 4.8,
        totalSeats: 36,
        availableSeats: 12,
      },
    ]);

    console.log("🌱 Bus data seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("❌ Bus seeding failed:", error);

    process.exit(1);
  }
};

seedBuses();
