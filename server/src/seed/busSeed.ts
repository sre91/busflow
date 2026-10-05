import "dotenv/config";

import connectDatabase from "../config/database.js";
import Bus from "../models/Bus.js";

type Route = {
  source: string;
  destination: string;
  basePrice: number;
  duration: string;
};

const routes: Route[] = [
  // ============================================================
  // SOUTH INDIA
  // ============================================================

  {
    source: "Chennai",
    destination: "Bangalore",
    basePrice: 699,
    duration: "8 hours",
  },
  {
    source: "Bangalore",
    destination: "Chennai",
    basePrice: 699,
    duration: "8 hours",
  },
  {
    source: "Chennai",
    destination: "Hyderabad",
    basePrice: 799,
    duration: "11 hours",
  },
  {
    source: "Hyderabad",
    destination: "Chennai",
    basePrice: 799,
    duration: "11 hours",
  },
  {
    source: "Chennai",
    destination: "Coimbatore",
    basePrice: 499,
    duration: "9 hours",
  },
  {
    source: "Coimbatore",
    destination: "Chennai",
    basePrice: 499,
    duration: "9 hours",
  },
  {
    source: "Chennai",
    destination: "Madurai",
    basePrice: 549,
    duration: "10 hours",
  },
  {
    source: "Madurai",
    destination: "Chennai",
    basePrice: 549,
    duration: "10 hours",
  },
  {
    source: "Chennai",
    destination: "Trichy",
    basePrice: 449,
    duration: "6 hours",
  },
  {
    source: "Trichy",
    destination: "Chennai",
    basePrice: 449,
    duration: "6 hours",
  },
  {
    source: "Bangalore",
    destination: "Hyderabad",
    basePrice: 699,
    duration: "10 hours",
  },
  {
    source: "Hyderabad",
    destination: "Bangalore",
    basePrice: 699,
    duration: "10 hours",
  },
  {
    source: "Bangalore",
    destination: "Mysore",
    basePrice: 399,
    duration: "3 hours",
  },
  {
    source: "Mysore",
    destination: "Bangalore",
    basePrice: 399,
    duration: "3 hours",
  },
  {
    source: "Bangalore",
    destination: "Mangalore",
    basePrice: 599,
    duration: "7 hours",
  },
  {
    source: "Mangalore",
    destination: "Bangalore",
    basePrice: 599,
    duration: "7 hours",
  },
  {
    source: "Bangalore",
    destination: "Goa",
    basePrice: 799,
    duration: "10 hours",
  },
  {
    source: "Goa",
    destination: "Bangalore",
    basePrice: 799,
    duration: "10 hours",
  },
  {
    source: "Hyderabad",
    destination: "Vijayawada",
    basePrice: 499,
    duration: "7 hours",
  },
  {
    source: "Vijayawada",
    destination: "Hyderabad",
    basePrice: 499,
    duration: "7 hours",
  },
  {
    source: "Hyderabad",
    destination: "Visakhapatnam",
    basePrice: 699,
    duration: "9 hours",
  },
  {
    source: "Visakhapatnam",
    destination: "Hyderabad",
    basePrice: 699,
    duration: "9 hours",
  },
  {
    source: "Hyderabad",
    destination: "Tirupati",
    basePrice: 599,
    duration: "8 hours",
  },
  {
    source: "Tirupati",
    destination: "Hyderabad",
    basePrice: 599,
    duration: "8 hours",
  },
  {
    source: "Chennai",
    destination: "Tirupati",
    basePrice: 399,
    duration: "4 hours",
  },
  {
    source: "Tirupati",
    destination: "Chennai",
    basePrice: 399,
    duration: "4 hours",
  },
  {
    source: "Kochi",
    destination: "Bangalore",
    basePrice: 699,
    duration: "10 hours",
  },
  {
    source: "Bangalore",
    destination: "Kochi",
    basePrice: 699,
    duration: "10 hours",
  },
  {
    source: "Kochi",
    destination: "Chennai",
    basePrice: 799,
    duration: "11 hours",
  },
  {
    source: "Chennai",
    destination: "Kochi",
    basePrice: 799,
    duration: "11 hours",
  },
  {
    source: "Kozhikode",
    destination: "Bangalore",
    basePrice: 649,
    duration: "8 hours",
  },
  {
    source: "Bangalore",
    destination: "Kozhikode",
    basePrice: 649,
    duration: "8 hours",
  },
  {
    source: "Trivandrum",
    destination: "Kochi",
    basePrice: 449,
    duration: "5 hours",
  },
  {
    source: "Kochi",
    destination: "Trivandrum",
    basePrice: 449,
    duration: "5 hours",
  },

  // ============================================================
  // WEST INDIA
  // ============================================================

  {
    source: "Mumbai",
    destination: "Pune",
    basePrice: 349,
    duration: "4 hours",
  },
  {
    source: "Pune",
    destination: "Mumbai",
    basePrice: 349,
    duration: "4 hours",
  },
  {
    source: "Mumbai",
    destination: "Ahmedabad",
    basePrice: 699,
    duration: "8 hours",
  },
  {
    source: "Ahmedabad",
    destination: "Mumbai",
    basePrice: 699,
    duration: "8 hours",
  },
  {
    source: "Mumbai",
    destination: "Goa",
    basePrice: 799,
    duration: "10 hours",
  },
  {
    source: "Goa",
    destination: "Mumbai",
    basePrice: 799,
    duration: "10 hours",
  },
  {
    source: "Pune",
    destination: "Bangalore",
    basePrice: 899,
    duration: "12 hours",
  },
  {
    source: "Bangalore",
    destination: "Pune",
    basePrice: 899,
    duration: "12 hours",
  },
  {
    source: "Pune",
    destination: "Hyderabad",
    basePrice: 799,
    duration: "10 hours",
  },
  {
    source: "Hyderabad",
    destination: "Pune",
    basePrice: 799,
    duration: "10 hours",
  },
  {
    source: "Pune",
    destination: "Goa",
    basePrice: 699,
    duration: "9 hours",
  },
  {
    source: "Goa",
    destination: "Pune",
    basePrice: 699,
    duration: "9 hours",
  },
  {
    source: "Ahmedabad",
    destination: "Surat",
    basePrice: 399,
    duration: "4 hours",
  },
  {
    source: "Surat",
    destination: "Ahmedabad",
    basePrice: 399,
    duration: "4 hours",
  },
  {
    source: "Ahmedabad",
    destination: "Vadodara",
    basePrice: 349,
    duration: "2 hours 30 minutes",
  },
  {
    source: "Vadodara",
    destination: "Ahmedabad",
    basePrice: 349,
    duration: "2 hours 30 minutes",
  },
  {
    source: "Mumbai",
    destination: "Nashik",
    basePrice: 449,
    duration: "4 hours",
  },
  {
    source: "Nashik",
    destination: "Mumbai",
    basePrice: 449,
    duration: "4 hours",
  },

  // ============================================================
  // NORTH INDIA
  // ============================================================

  {
    source: "Delhi",
    destination: "Bangalore",
    basePrice: 1899,
    duration: "42 hours",
  },
  {
    source: "Bangalore",
    destination: "Delhi",
    basePrice: 1899,
    duration: "42 hours",
  },
  {
    source: "Delhi",
    destination: "Mumbai",
    basePrice: 1499,
    duration: "24 hours",
  },
  {
    source: "Mumbai",
    destination: "Delhi",
    basePrice: 1499,
    duration: "24 hours",
  },
  {
    source: "Delhi",
    destination: "Jaipur",
    basePrice: 399,
    duration: "5 hours",
  },
  {
    source: "Jaipur",
    destination: "Delhi",
    basePrice: 399,
    duration: "5 hours",
  },
  {
    source: "Delhi",
    destination: "Agra",
    basePrice: 349,
    duration: "4 hours",
  },
  {
    source: "Agra",
    destination: "Delhi",
    basePrice: 349,
    duration: "4 hours",
  },
  {
    source: "Delhi",
    destination: "Lucknow",
    basePrice: 699,
    duration: "9 hours",
  },
  {
    source: "Lucknow",
    destination: "Delhi",
    basePrice: 699,
    duration: "9 hours",
  },
  {
    source: "Delhi",
    destination: "Chandigarh",
    basePrice: 499,
    duration: "5 hours",
  },
  {
    source: "Chandigarh",
    destination: "Delhi",
    basePrice: 499,
    duration: "5 hours",
  },
  {
    source: "Delhi",
    destination: "Dehradun",
    basePrice: 499,
    duration: "6 hours",
  },
  {
    source: "Dehradun",
    destination: "Delhi",
    basePrice: 499,
    duration: "6 hours",
  },
  {
    source: "Delhi",
    destination: "Amritsar",
    basePrice: 599,
    duration: "8 hours",
  },
  {
    source: "Amritsar",
    destination: "Delhi",
    basePrice: 599,
    duration: "8 hours",
  },
  {
    source: "Delhi",
    destination: "Shimla",
    basePrice: 699,
    duration: "9 hours",
  },
  {
    source: "Shimla",
    destination: "Delhi",
    basePrice: 699,
    duration: "9 hours",
  },
  {
    source: "Jaipur",
    destination: "Udaipur",
    basePrice: 599,
    duration: "7 hours",
  },
  {
    source: "Udaipur",
    destination: "Jaipur",
    basePrice: 599,
    duration: "7 hours",
  },
  {
    source: "Jaipur",
    destination: "Jodhpur",
    basePrice: 549,
    duration: "6 hours",
  },
  {
    source: "Jodhpur",
    destination: "Jaipur",
    basePrice: 549,
    duration: "6 hours",
  },
  {
    source: "Delhi",
    destination: "Varanasi",
    basePrice: 899,
    duration: "11 hours",
  },
  {
    source: "Varanasi",
    destination: "Delhi",
    basePrice: 899,
    duration: "11 hours",
  },
  {
    source: "Lucknow",
    destination: "Varanasi",
    basePrice: 499,
    duration: "6 hours",
  },
  {
    source: "Varanasi",
    destination: "Lucknow",
    basePrice: 499,
    duration: "6 hours",
  },

  // ============================================================
  // CENTRAL INDIA
  // ============================================================

  {
    source: "Mumbai",
    destination: "Indore",
    basePrice: 899,
    duration: "12 hours",
  },
  {
    source: "Indore",
    destination: "Mumbai",
    basePrice: 899,
    duration: "12 hours",
  },
  {
    source: "Bhopal",
    destination: "Indore",
    basePrice: 449,
    duration: "4 hours",
  },
  {
    source: "Indore",
    destination: "Bhopal",
    basePrice: 449,
    duration: "4 hours",
  },
  {
    source: "Delhi",
    destination: "Bhopal",
    basePrice: 999,
    duration: "12 hours",
  },
  {
    source: "Bhopal",
    destination: "Delhi",
    basePrice: 999,
    duration: "12 hours",
  },
  {
    source: "Nagpur",
    destination: "Hyderabad",
    basePrice: 699,
    duration: "8 hours",
  },
  {
    source: "Hyderabad",
    destination: "Nagpur",
    basePrice: 699,
    duration: "8 hours",
  },
  {
    source: "Nagpur",
    destination: "Mumbai",
    basePrice: 799,
    duration: "10 hours",
  },
  {
    source: "Mumbai",
    destination: "Nagpur",
    basePrice: 799,
    duration: "10 hours",
  },
  {
    source: "Raipur",
    destination: "Nagpur",
    basePrice: 499,
    duration: "6 hours",
  },
  {
    source: "Nagpur",
    destination: "Raipur",
    basePrice: 499,
    duration: "6 hours",
  },

  // ============================================================
  // EAST INDIA
  // ============================================================

  {
    source: "Kolkata",
    destination: "Bhubaneswar",
    basePrice: 699,
    duration: "8 hours",
  },
  {
    source: "Bhubaneswar",
    destination: "Kolkata",
    basePrice: 699,
    duration: "8 hours",
  },
  {
    source: "Kolkata",
    destination: "Patna",
    basePrice: 799,
    duration: "10 hours",
  },
  {
    source: "Patna",
    destination: "Kolkata",
    basePrice: 799,
    duration: "10 hours",
  },
  {
    source: "Kolkata",
    destination: "Ranchi",
    basePrice: 599,
    duration: "7 hours",
  },
  {
    source: "Ranchi",
    destination: "Kolkata",
    basePrice: 599,
    duration: "7 hours",
  },
  {
    source: "Kolkata",
    destination: "Guwahati",
    basePrice: 999,
    duration: "18 hours",
  },
  {
    source: "Guwahati",
    destination: "Kolkata",
    basePrice: 999,
    duration: "18 hours",
  },
  {
    source: "Bhubaneswar",
    destination: "Visakhapatnam",
    basePrice: 599,
    duration: "7 hours",
  },
  {
    source: "Visakhapatnam",
    destination: "Bhubaneswar",
    basePrice: 599,
    duration: "7 hours",
  },
  {
    source: "Patna",
    destination: "Varanasi",
    basePrice: 449,
    duration: "5 hours",
  },
  {
    source: "Varanasi",
    destination: "Patna",
    basePrice: 449,
    duration: "5 hours",
  },

  // ============================================================
  // NORTHEAST INDIA
  // ============================================================

  {
    source: "Guwahati",
    destination: "Shillong",
    basePrice: 399,
    duration: "3 hours 30 minutes",
  },
  {
    source: "Shillong",
    destination: "Guwahati",
    basePrice: 399,
    duration: "3 hours 30 minutes",
  },
  {
    source: "Guwahati",
    destination: "Agartala",
    basePrice: 899,
    duration: "12 hours",
  },
  {
    source: "Agartala",
    destination: "Guwahati",
    basePrice: 899,
    duration: "12 hours",
  },
  {
    source: "Guwahati",
    destination: "Gangtok",
    basePrice: 799,
    duration: "10 hours",
  },
  {
    source: "Gangtok",
    destination: "Guwahati",
    basePrice: 799,
    duration: "10 hours",
  },
];

const operators = [
  "BlueLine Travels",
  "GreenRide Express",
  "Royal Roadways",
  "CityLink Travels",
  "Southern Star Travels",
  "MetroRide",
  "National Express",
  "IndiaConnect Travels",
];

const busTypes = ["AC Sleeper", "AC Seater", "Non-AC Seater"];

const departureTimes = [
  "06:30 AM",
  "08:00 AM",
  "02:00 PM",
  "06:30 PM",
  "08:00 PM",
  "09:30 PM",
  "10:30 PM",
];

const generateBuses = () => {
  const buses = [];

  for (const route of routes) {
    for (let i = 0; i < 3; i++) {
      const busType = busTypes[i];

      let price = route.basePrice;

      if (busType === "AC Sleeper") {
        price += 300;
      }

      if (busType === "AC Seater") {
        price += 150;
      }

      const totalSeats = busType === "AC Sleeper" ? 36 : 40;

      const availableSeats =
        10 + ((i + route.source.length + route.destination.length) % 22);

      buses.push({
        operator: operators[i % operators.length],
        busType,
        source: route.source,
        destination: route.destination,
        departureTime:
          departureTimes[(i + route.source.length) % departureTimes.length],
        arrivalTime: "06:30 AM",
        duration: route.duration,
        price,
        rating: Number((4.1 + i * 0.3).toFixed(1)),
        totalSeats,
        availableSeats,
      });
    }
  }

  return buses;
};

const seedBuses = async () => {
  try {
    await connectDatabase();

    await Bus.deleteMany({});

    const buses = generateBuses();

    await Bus.insertMany(buses);

    console.log(`🌱 ${buses.length} India-wide buses seeded successfully`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Bus seeding failed:", error);

    process.exit(1);
  }
};

seedBuses();
