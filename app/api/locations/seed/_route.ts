// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import fs from "fs";
// import path from "path";
// import Location from "@/app/models/Location"; 

// export async function GET() {
//   try {
//     // 1. Connect to MongoDB
//     if (mongoose.connection.readyState !== 1) {
//       await mongoose.connect(process.env.MONGODB_URL as string);
//     }

//     // 2. Locate the JSON files in your 'data' folder
//     const dataDir = path.join(process.cwd(), "data");
//     const countriesRaw = fs.readFileSync(path.join(dataDir, "countries.json"), "utf8");
//     const citiesRaw = fs.readFileSync(path.join(dataDir, "cities.json"), "utf8");
//     const airportsRaw = fs.readFileSync(path.join(dataDir, "airports.json"), "utf8");

//     const countriesData = JSON.parse(countriesRaw);
//     const citiesData = JSON.parse(citiesRaw);
//     const airportsData = JSON.parse(airportsRaw);

//     // 3. Clear old data to prevent duplicates if you run this twice
//     await Location.deleteMany({});
//     const locationsToInsert: any[] = [];

//     // Format Countries
//     countriesData.forEach((c: any) => {
//       locationsToInsert.push({
//         name: c.name,
//         type: "country",
//         countryName: c.name,
//         countryCode: c.iso2,
//       });
//     });

//     // Format Airports (Filtering out invalid ones)
//     Object.values(airportsData).forEach((a: any) => {
//       if (a.iata && a.iata !== "\\N") { 
//         locationsToInsert.push({
//           name: `${a.name} (${a.iata})`,
//           type: "airport",
//           countryName: a.country,
//           stateName: a.city,
//           airportCode: a.iata,
//         });
//       }
//     });

//     // Format Cities
//     citiesData.forEach((c: any) => {
//       locationsToInsert.push({
//         name: c.name,
//         type: "city",
//         countryName: c.country_name,
//         stateName: c.state_name,
//       });
//     });

//     // 4. Upload everything to MongoDB
//     await Location.insertMany(locationsToInsert, { ordered: false });

//     return NextResponse.json({
//       success: true,
//       message: `Successfully seeded ${locationsToInsert.length} locations into MongoDB!`,
//     });

//   } catch (error: any) {
//     console.error("Seeding Error:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }































import { NextResponse } from "next/server";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Location from "@/app/models/Location"; 

// Disable timeout for this route because it's a heavy operation
export const maxDuration = 300; 

export async function GET() {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const dataDir = path.join(process.cwd(), "data");
    
    // 1. Clear existing data
    await Location.deleteMany({});
    console.log("Emptying database...");

    const BATCH_SIZE = 2000; // We will upload 2,000 at a time

    async function processInBatches(dataArray: any[], type: string) {
      for (let i = 0; i < dataArray.length; i += BATCH_SIZE) {
        const batch = dataArray.slice(i, i + BATCH_SIZE);
        const formattedBatch = batch.map(item => {
          if (type === 'country') return {
            name: item.name,
            type: "country",
            countryName: item.name,
            countryCode: item.iso2
          };
          if (type === 'airport') return {
            name: `${item.name} (${item.iata})`,
            type: "airport",
            countryName: item.country,
            stateName: item.city,
            airportCode: item.iata
          };
          if (type === 'city') return {
            name: item.name,
            type: "city",
            countryName: item.country_name,
            stateName: item.state_name
          };
        }).filter(item => item !== undefined);

        await Location.insertMany(formattedBatch, { ordered: false });
        console.log(`Uploaded ${i + formattedBatch.length} ${type}s...`);
      }
    }

    // 2. Process Countries
    const countries = JSON.parse(fs.readFileSync(path.join(dataDir, "countries.json"), "utf8"));
    await processInBatches(countries, 'country');

    // 3. Process Airports
    const airportsRaw = JSON.parse(fs.readFileSync(path.join(dataDir, "airports.json"), "utf8"));
    const airportsArray = Object.values(airportsRaw).filter((a: any) => a.iata && a.iata !== "\\N");
    await processInBatches(airportsArray, 'airport');

    // 4. Process Cities (The Biggest File)
    const cities = JSON.parse(fs.readFileSync(path.join(dataDir, "cities.json"), "utf8"));
    await processInBatches(cities, 'city');

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully in small batches!"
    });

  } catch (error: any) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

