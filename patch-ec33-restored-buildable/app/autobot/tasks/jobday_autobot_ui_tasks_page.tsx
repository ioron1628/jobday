"use client";

import React, { useEffect, useState } from 'react';
import TaskCard from "@/components/autobot/TaskCard";
import type { Task } from "@/types/autobot";

const AutobotTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/autobot/tasks');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Task[] = await response.json();
        setTasks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleViewDetails = (task: Task) => {
    // Implement navigation to task details page
    console.log("View details for task", task.id);
    // Example: router.push(`/autobot/tasks/${task.id}`);
  };

  const handleRunTask = async (task: Task) => {
    console.log("Running task", task.id);
    try {
      const response = await fetch(`/api/autobot/tasks/${task.id}/run`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Optionally refresh tasks or update status optimistically
      setTasks(prevTasks => prevTasks.map(t => t.id === task.id ? { ...t, status: 'running' } : t));
      alert(`Task ${task.title} started successfully!`);
    } catch (err: any) {
      console.error("Failed to run task:", err);
      alert(`Failed to run task ${task.title}: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">AutoBot Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onViewDetails={handleViewDetails} onRunTask={handleRunTask} />
        ))}
      </div>
      {tasks.length === 0 && (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          No tasks found. Create a new task to get started!
        </div>
      )}
    </div>
  );
};

export default AutobotTasks;
