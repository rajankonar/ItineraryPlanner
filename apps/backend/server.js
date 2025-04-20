import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
let corsOptions = {
  origin: [
    "http://localhost:5174",
    "https://itinerary-planner-ochre.vercel.app",
  ],
};
app.use(cors(corsOptions));
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/api/itinerary", async (req, res) => {
  const { from, to } = req.body;
  const data = await groq.chat.completions
    .create({
      messages: [
        {
          role: "system",
          content:
            "You are a travel assistant that builds day-by-day road trip itineraries of the closest fastest route.",
        },
        {
          role: "user",
          content: `Plan a road trip itinerary in english language from ${from} to ${to}, driving up to 7 hours per day. Include stops and day-wise descriptions and provide data only as json object, directly share object{} like in below format
                    {
                      "packingTips":"things to carray and packing tips in array",
                      "notes: "give notes in array",
                      "itinerary":"provide array of day wise object like 
                      {day: "which day", "start":"start location","end": "end location","drivingTime":"give driving time taken in day 1",
                      "distance":"give distance","activities": "share activities in array",
                      "foodSuggestions":"give famous food suggestions from famous hotels in that location in object like {"breakfast":"breakfast in array with only names like 
                      ["1st best food in best hotel in location","2nd best food in best hotel in location","3rd best food in best hotel in location"]"
                      ,"lunch":"lunch in array","dinner": "dinner in array"}","route": "give route", "staySuggestions":"give stay suggestions in array"}"
                    }
                    and give data in proper format and translate the values in english
                    
                    `,
        },
      ],
      model: "llama-3.3-70b-versatile",
    })
    .then((chatCompletion) => {
      //console.log(chatCompletion.choices[0]?.message?.content || "");
      res.json(chatCompletion.choices[0]?.message?.content || "");
    });

  // const response = await fetch(
  //   "https://openrouter.ai/api/v1/chat/completions",
  //   {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${process.env.AGENTICA_API_KEY}`,
  //       "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
  //       "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       model: "agentica-org/deepcoder-14b-preview:free",
  //       messages: [
  //         {
  //           role: "system",
  //           content:
  //             "You are a travel assistant that builds day-by-day road trip itineraries.",
  //         },
  //         {
  //           role: "user",
  //           content: `Plan a road trip itinerary in english language from ${from} to ${to}, driving up to 8.5 hours per day. Include stops and day-wise descriptions and provide data only as json object, directly share object{} like in below format
  //           {
  //             "packingTips":"things to carray and packing tips in array",
  //             "notes: "give notes in array",
  //             "itinerary":"provide array of day wise object like
  //             {day: "which day", "start":"start location","end": "end location","drivingTime":"give driving time taken in day 1",
  //             "distance":"give distance","activities": "share activities in array",
  //             "foodSuggestions":"give food suggestions in object like {"breakfast":"give breakfast in array","lunch":"lunch in array","dinner": "dinner in array"}","route": "give route", "staySuggestions":"give stay suggestions in array"}"
  //           }
  //           and give data in proper format and translate the values in english

  //           `,
  //         },
  //       ],
  //     }),
  //   }
  // );
  //const data = await response.json();
  //res.json(data);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server ready on http://localhost:${PORT}`);
});
