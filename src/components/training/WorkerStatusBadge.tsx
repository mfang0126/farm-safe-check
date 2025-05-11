
import React from 'react';

interface WorkerStatusBadgeProps {
  status: string;
}

const WorkerStatusBadge = ({ status }: WorkerStatusBadgeProps) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
      status === 'active' ? 'bg-green-100 text-green-800' : 
      status === 'leave' ? 'bg-yellow-100 text-yellow-800' :
      'bg-gray-100 text-gray-800'
    }`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default WorkerStatusBadge;
