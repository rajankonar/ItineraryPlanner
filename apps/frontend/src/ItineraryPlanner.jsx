import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function ItineraryPlanner() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateItinerary = async () => {
    if (!from || !to) return;
    setLoading(true);

    //const res = await fetch("http://localhost:3001/api/itinerary", {
    const res = await fetch("https://itinerary-planner-server.vercel.app/api/itinerary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";

    const days = content.split(/Day \d+/).slice(1).map((part, index) => ({
      day: index + 1,
      title: `Day ${index + 1}`,
      description: part.trim(),
    }));

    setItinerary(days);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Itinerary Planner</h1>
      <div className="flex flex-col gap-4 mb-4">
        <Input
          placeholder="From (e.g., Navi Mumbai)"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <Input
          placeholder="To (e.g., Goa)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <Button onClick={generateItinerary} disabled={loading}>
          {loading ? "Generating..." : "Generate Itinerary"}
        </Button>
      </div>

      {itinerary && (
        <div className="space-y-4">
          {itinerary.map((item) => (
            <motion.div
              key={item.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-md">
                <CardContent className="p-4">
                  <h2 className="font-semibold text-lg mb-2">{item.title}</h2>
                  <p>{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}