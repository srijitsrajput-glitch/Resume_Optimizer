import React from 'react';
import { ATSScore } from '../types/resume';

interface ScoreCardProps {
  score: ATSScore;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">ATS Score</h2>
        <div className="relative">
          <div className="w-32 h-32 mx-auto mb-4">
            <div className="relative w-full h-full">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2.512 * score.overall} 251.2`}
                  className={`transition-all duration-1000 ease-out ${getScoreColor(score.overall)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-3xl font-bold ${getScoreColor(score.overall)}`}>
                  {score.overall}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(score.breakdown).map(([category, value]) => (
          <div key={category} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 capitalize">
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <div className="flex items-center space-x-2 flex-1 ml-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(value)} transition-all duration-1000 ease-out`}
                  style={{ width: `${value}%` }}
                ></div>
              </div>
              <span className={`text-sm font-semibold w-8 text-right ${getScoreColor(value)}`}>
                {value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};