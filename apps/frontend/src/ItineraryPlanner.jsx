import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function ItineraryPlanner() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ from: "", to: "" });
  const [shakeFrom, setShakeFrom] = useState(false);
  const [shakeTo, setShakeTo] = useState(false);
  const generateItinerary = async () => {
    setTripData(null)
    const newErrors = {
      from: from.trim() === "" ? "Please enter a starting location" : "",
      to: to.trim() === "" ? "Please enter a destination" : "",
    };
    setErrors(newErrors);

    if (newErrors.from) {
      setShakeFrom(true);
      setTimeout(() => setShakeFrom(false), 600);
    }

    if (newErrors.to) {
      setShakeTo(true);
      setTimeout(() => setShakeTo(false), 600);
    }

    if (newErrors.from || newErrors.to) return;

    setLoading(true);
    if (!from || !to) return;
    setLoading(true);
    const apiUrl =
      location.hostname === "localhost" || location.hostname === "127.0.0.1"
        ? "http://localhost:3001/api/itinerary"
        : "https://itinerary-planner-server.vercel.app/api/itinerary";
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to }),
      });

      const data = await res.json();
      if (res.status == 200) {
        //const content = data.choices?.[0]?.message?.content || "";
        //let jsonContent = content.replace("```json", "").replace("```", "");

        let jsonContent = data.replace("```json", "").replaceAll("```", "");
        jsonContent = JSON.parse(jsonContent);
        setTripData(jsonContent);
      }
    } catch (error) {
      alert("Something went wrong, please try again!");
    }
    setLoading(false);
    setFrom("");
    setTo("");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Itinerary Planner</h1>
      <div className="flex flex-col gap-4 mb-4">
        <motion.div
          animate={shakeFrom ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.6 }}
        >
          <Input
            placeholder="From (e.g., Navi Mumbai)"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setErrors((prev) => ({ ...prev, from: "" }));
            }}
            className={errors.from ? "border-red-500" : ""}
          />
          {errors.from && (
            <p className="text-red-500 text-sm mt-1">{errors.from}</p>
          )}
        </motion.div>

        <motion.div
          animate={shakeTo ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.6 }}
        >
          <Input
            placeholder="To (e.g., Goa)"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setErrors((prev) => ({ ...prev, to: "" }));
            }}
            className={errors.to ? "border-red-500" : ""}
          />
          {errors.to && (
            <p className="text-red-500 text-sm mt-1">{errors.to}</p>
          )}
        </motion.div>
        <Button onClick={generateItinerary} disabled={loading}>
          {loading ? "Generating..." : "Generate Itinerary"}
        </Button>
      </div>
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-4 h-4 bg-primary rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            Loading your trip plan...
          </p>
        </div>
      )}
      {tripData && (
        <div className="space-y-4">
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <h1 className="text-3xl font-bold text-center mb-6">
              Your Road Trip Itinerary
            </h1>

            {tripData.itinerary.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="mb-4 shadow-md">
                  <CardHeader>
                    <CardTitle>
                      {day.day}: {day.start} → {day.end}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      <strong>Route :</strong> {day.route}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong> Distance :</strong> {day.distance}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong> Driving Time :</strong> {day.drivingTime}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <strong>Activities:</strong>
                      <ul className="list-disc list-inside ml-4">
                        {day.activities.map((activity, i) => (
                          <li key={i}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <strong>Food Suggestions:</strong>
                      {day?.foodSuggestions?.breakfast?.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-1">
                            🍳 Breakfast
                          </h3>
                          <ul className="list-disc list-inside text-muted-foreground">
                            {day?.foodSuggestions?.breakfast.map(
                              (item, idx) => (
                                <li key={idx}>{item}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                      {day?.foodSuggestions?.lunch?.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-1">🍱 Lunch</h3>
                          <ul className="list-disc list-inside text-muted-foreground">
                            {day?.foodSuggestions?.lunch.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {day?.foodSuggestions?.dinner?.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-1">
                            🍛 Dinner
                          </h3>
                          <ul className="list-disc list-inside text-muted-foreground">
                            {day?.foodSuggestions?.dinner.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <strong>Stay Suggestions:</strong>
                      <ul className="list-disc list-inside ml-4">
                        {day.staySuggestions.map((stay, i) => (
                          <li key={i}>{stay}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-lg mt-10">
                <CardHeader>
                  <CardTitle>Packing Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    {tripData.packingTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="shadow-lg mt-6">
                <CardHeader>
                  <CardTitle>Travel Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    {tripData.notes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
