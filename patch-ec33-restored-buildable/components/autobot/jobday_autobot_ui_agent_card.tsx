import React from 'react';
import type { Agent } from "@/types/autobot";

interface AgentCardProps {
  agent: Agent;
  onViewDetails: (agent: Agent) => void;
  onRunTask: (agent: Agent) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onViewDetails, onRunTask }) => {
  const getStatusColor = (status: Agent["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{agent.name}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(agent.status)}`}>
            {agent.status}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-2">Type: {agent.type}</p>
        {agent.last_run && (
          <p className="text-gray-600 dark:text-gray-400 text-sm">Last Run: {new Date(agent.last_run).toLocaleString()}</p>
        )}
        {agent.next_run && (
          <p className="text-gray-600 dark:text-gray-400 text-sm">Next Run: {new Date(agent.next_run).toLocaleString()}</p>
        )}
      </div>
      <div className="mt-6 flex space-x-3">
        <button
          onClick={() => onViewDetails(agent)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          View Details
        </button>
        <button
          onClick={() => onRunTask(agent)}
          disabled={agent.status !== "active"}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Run Task
        </button>
      </div>
    </div>
  );
};

export default AgentCard;
