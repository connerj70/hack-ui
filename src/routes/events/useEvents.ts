// src/hooks/useEvents.ts

import { useState, useEffect, useCallback } from "react";
import { EventDetails } from "@/routes/events/page";

const useEvents = (currentUser: any) => {
  const [data, setData] = useState<EventDetails[]>([]);

  const fetchData = useCallback(async () => {
    if (!currentUser) return;

    try {
      const jwt = await currentUser.getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/event/events`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result.events);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      alert("Failed to fetch events.");
    }
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteEvent = useCallback(
    async (eventId: string) => {
      if (!currentUser) {
        alert("User not authenticated.");
        return;
      }

      try {
        const jwt = await currentUser.getIdToken();
        const response = await fetch(`${import.meta.env.VITE_API_URL}/event/events/${eventId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to delete event: ${response.statusText}`);
        }

        // Optionally, you can await response.json() if needed
        setData((prevData) => prevData.filter((e) => e.id.id !== eventId));
      } catch (error) {
        console.error("Failed to delete event:", error);
        alert("Failed to delete event.");
      }
    },
    [currentUser]
  );

  return { data, fetchData, deleteEvent };
};

export default useEvents;
