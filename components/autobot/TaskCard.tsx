import React from 'react';
import { Task } from '../../types/autobot';

interface TaskCardProps {
  task: Task;
  onViewDetails: (task: Task) => void;
  onRunTask?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onViewDetails, onRunTask }) => {
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "running":
        return "bg-blue-500";
      case "failed":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{task.title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-2">Agent ID: {task.agent_id}</p>
        {task.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm">{task.description}</p>
        )}
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Created: {new Date(task.created_at).toLocaleString()}</p>
        {task.completed_at && (
          <p className="text-gray-600 dark:text-gray-400 text-sm">Completed: {new Date(task.completed_at).toLocaleString()}</p>
        )}
      </div>
      <div className="mt-6 flex space-x-3">
        <button
          onClick={() => onViewDetails(task)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          View Details
        </button>
        {onRunTask && task.status === "pending" && (
          <button
            onClick={() => onRunTask(task)}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Run Now
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

