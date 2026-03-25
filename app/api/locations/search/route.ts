import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Location from "@/app/models/Location"; 

export async function GET(req: NextRequest) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Grab the search text ("q") and selected countries from the URL
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q"); 
    const countriesParam = searchParams.get("countries"); 

    if (!query) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Search for anything starting with the query (case-insensitive)
    const dbQuery: any = {
      name: { $regex: `^${query}`, $options: "i" },
      type: { $in: ["city", "airport"] } // We only want to populate cities and airports in the dropdown
    };

    // Filter by country if the user selected them on the Create Page
    if (countriesParam) {
      const selectedCountries = countriesParam.split(",");
      dbQuery.countryName = { $in: selectedCountries };
    }

    // Limit to 15 so the frontend doesn't lag
    const results = await Location.find(dbQuery)
      .limit(15)
      .select("name type airportCode countryName stateName -_id")
      .lean();

    return NextResponse.json({ success: true, data: results });

  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to search locations" }, { status: 500 });
  }
}