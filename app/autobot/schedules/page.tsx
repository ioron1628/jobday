"use client";

import React, { useEffect, useState } from 'react';
import ScheduleCard from "@/components/autobot/ScheduleCard";
import type { Schedule } from "@/types/autobot";

const AutobotSchedules: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/autobot/schedules');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Schedule[] = await response.json();
        setSchedules(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleViewDetails = (schedule: Schedule) => {
    // Implement navigation to schedule details page
    console.log("View details for schedule", schedule.id);
    // Example: router.push(`/autobot/schedules/${schedule.id}`);
  };

  const handleToggleEnabled = async (schedule: Schedule) => {
    console.log(`Toggling schedule ${schedule.id}`);
    try {
      const response = await fetch(`/api/autobot/schedules/${schedule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !schedule.enabled }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setSchedules(prevSchedules => prevSchedules.map(s => s.id === schedule.id ? { ...s, enabled: !s.enabled } : s));
      alert(`Schedule ${schedule.id} toggled!`);
    } catch (err: any) {
      console.error("Failed to toggle schedule:", err);
      alert(`Failed to toggle schedule ${schedule.id}: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading schedules...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">AutoBot Schedules</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedules.map((schedule) => (
          <ScheduleCard key={schedule.id} schedule={schedule} onViewDetails={handleViewDetails} onToggleEnabled={handleToggleEnabled} />
        ))}
      </div>
      {schedules.length === 0 && (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          No schedules found. Create a new schedule to automate tasks!
        </div>
      )}
    </div>
  );
};

export default AutobotSchedules;
