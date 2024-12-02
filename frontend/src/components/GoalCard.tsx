import React from 'react';

interface GoalCardProps {
  name: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string; // Optional deadline
  isAchieved: boolean;
}

const GoalCard: React.FC<GoalCardProps> = ({
  name,
  targetValue,
  currentValue,
  unit,
  deadline,
  isAchieved,
}) => {
  // Calculate progress percentage
  const progressPercentage = Math.min((currentValue / targetValue) * 100, 100);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 ">{name}</h3>

      <div className="mt-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span>
            {currentValue}/{targetValue} {unit}
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
          <div
            className={`h-3 rounded-full ${
              isAchieved ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Deadline */}
      {deadline && (
        <p className="mt-2 text-sm text-gray-500">
          Deadline: {new Date(deadline).toLocaleDateString()}
        </p>
      )}

      {/* Status */}
      <p
        className={`mt-2 text-sm font-semibold ${
          isAchieved ? 'text-green-600' : 'dark:text-yellow-500'
        }`}
      >
        {isAchieved ? 'Goal Achieved!' : 'In Progress'}
      </p>
    </div>
  );
};

export default GoalCard;
