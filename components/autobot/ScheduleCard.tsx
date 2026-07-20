import React from 'react';
import type { Schedule } from "@/types/autobot";

interface ScheduleCardProps {
  schedule: Schedule;
  onViewDetails: (schedule: Schedule) => void;
  onToggleEnabled: (schedule: Schedule) => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule, onViewDetails, onToggleEnabled }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{schedule.cron_expression}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${schedule.enabled ? 'bg-green-500' : 'bg-red-500'}`}>
            {schedule.enabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-2">Agent ID: {schedule.agent_id}</p>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Created: {new Date(schedule.created_at).toLocaleString()}</p>
      </div>
      <div className="mt-6 flex space-x-3">
        <button
          onClick={() => onViewDetails(schedule)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          View Details
        </button>
        <button
          onClick={() => onToggleEnabled(schedule)}
          className={`flex-1 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${schedule.enabled ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'} text-white`}
        >
          {schedule.enabled ? 'Disable' : 'Enable'}
        </button>
      </div>
    </div>
  );
};

export default ScheduleCard;

