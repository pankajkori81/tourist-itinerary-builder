// import { NextRequest, NextResponse } from "next/server";
// import mongoose from "mongoose";
// import Location from "@/app/models/Location"; 

// export async function GET(req: NextRequest) {
//   try {
//     if (mongoose.connection.readyState !== 1) {
//       await mongoose.connect(process.env.MONGODB_URI as string);
//     }

//     // Grab the search text ("q") and selected countries from the URL
//     const { searchParams } = new URL(req.url);
//     const query = searchParams.get("q"); 
//     const countriesParam = searchParams.get("countries"); 

//     if (!query) {
//       return NextResponse.json({ success: true, data: [] });
//     }

//     // Search for anything starting with the query (case-insensitive)
//     const dbQuery: any = {
//       name: { $regex: `^${query}`, $options: "i" },
//       type: { $in: ["city", "airport"] } // We only want to populate cities and airports in the dropdown
//     };

//     // Filter by country if the user selected them on the Create Page
//     if (countriesParam) {
//       const selectedCountries = countriesParam.split(",");
//       dbQuery.countryName = { $in: selectedCountries };
//     }

//     // Limit to 15 so the frontend doesn't lag
//     const results = await Location.find(dbQuery)
//       .limit(15)
//       .select("name type airportCode countryName stateName -_id")
//       .lean();

//     return NextResponse.json({ success: true, data: results });

//   } catch (error: any) {
//     console.error("Search API Error:", error);
//     return NextResponse.json({ success: false, error: "Failed to search locations" }, { status: 500 });
//   }
// }


























import { NextRequest, NextResponse } from "next/server";

// Static ISO-code lookup — see explanation below on why this is fine to keep static.
const COUNTRY_CODE_TO_NAME: Record<string, string> = {
  IN: "India", LK: "Sri Lanka", MV: "Maldives", NP: "Nepal", BT: "Bhutan", BD: "Bangladesh",
  GB: "United Kingdom", FR: "France", DE: "Germany", CH: "Switzerland", IT: "Italy", AT: "Austria", GR: "Greece",
  ES: "Spain", PT: "Portugal", NL: "Netherlands", BE: "Belgium", IE: "Ireland", HR: "Croatia",
  AE: "United Arab Emirates", SA: "Saudi Arabia", QA: "Qatar", OM: "Oman", TR: "Turkey", JO: "Jordan",
  US: "United States of America", CA: "Canada", MX: "Mexico",
  TH: "Thailand", VN: "Vietnam", SG: "Singapore", MY: "Malaysia", ID: "Indonesia", PH: "Philippines",
  AU: "Australia", NZ: "New Zealand", FJ: "Fiji",
  ZA: "South Africa", EG: "Egypt", MA: "Morocco", KE: "Kenya", TZ: "Tanzania",
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const countriesParam = searchParams.get("countries");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ success: true, data: [] });
    }

    const apiRes = await fetch(`https://countries.dev/cities?q=${encodeURIComponent(query)}`);
    if (!apiRes.ok) throw new Error(`Cities API returned ${apiRes.status}`);

    const rawData = await apiRes.json();
    const cities = Array.isArray(rawData) ? rawData : rawData?.data || rawData?.cities || [];

    let results = cities.map((c: any) => {
      const countryCode = c.countryCode || c.country_code || "";
      return {
        name: c.name || "",
        type: "city",
        countryName: COUNTRY_CODE_TO_NAME[countryCode] || countryCode,
        stateName: c.adminRegion || c.admin1 || c.region || "",
      };
    }).filter((r: any) => r.name);

    if (countriesParam) {
      const selectedCountries = countriesParam.split(",").map((c) => c.trim());
      results = results.filter((r: any) => selectedCountries.includes(r.countryName));
    }

    results = results.slice(0, 15);

    return NextResponse.json({ success: true, data: results });

  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to search locations" }, { status: 500 });
  }
}