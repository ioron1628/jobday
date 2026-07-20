"use client";

import React, { useEffect, useState } from 'react';
import AgentCard from "@/components/autobot/AgentCard";
import type { Agent } from "@/types/autobot";

const AutobotDashboard: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/autobot/agents');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Agent[] = await response.json();
        setAgents(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const handleViewDetails = (agent: Agent) => {
    // Implement navigation to agent details page
    console.log("View details for", agent.name);
    // Example: router.push(`/autobot/agents/${agent.id}`);
  };

  const handleRunTask = (agent: Agent) => {
    // Implement logic to trigger a task for the agent
    console.log("Run task for", agent.name);
    // Example: call an API to run a task
  };

  if (loading) {
    return <div className="text-center py-8">Loading agents...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">AutoBot Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onViewDetails={handleViewDetails} onRunTask={handleRunTask} />
        ))}
      </div>
      {agents.length === 0 && (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          No AutoBots found. Create your first agent to get started!
        </div>
      )}
    </div>
  );
};

export default AutobotDashboard;
