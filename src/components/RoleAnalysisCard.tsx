import React from 'react';
import { Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { RoleAnalysis, Role } from '../types/resume';

interface RoleAnalysisCardProps {
  roleAnalysis: RoleAnalysis;
  selectedRole: Role;
}

export const RoleAnalysisCard: React.FC<RoleAnalysisCardProps> = ({ roleAnalysis, selectedRole }) => {
  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Needs Improvement';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Target className="text-blue-600" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Role Match Analysis</h2>
          <p className="text-gray-600">How well your resume matches {selectedRole.title}</p>
        </div>
      </div>

      {/* Match Score */}
      <div className="text-center mb-8">
        <div className="relative w-32 h-32 mx-auto mb-4">
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
              strokeDasharray={`${2.512 * roleAnalysis.roleMatch} 251.2`}
              className={`transition-all duration-1000 ease-out ${getMatchColor(roleAnalysis.roleMatch)}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${getMatchColor(roleAnalysis.roleMatch)}`}>
              {roleAnalysis.roleMatch}%
            </span>
            <span className="text-xs text-gray-500 mt-1">Match</span>
          </div>
        </div>
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          roleAnalysis.roleMatch >= 80 ? 'bg-green-100 text-green-800' :
          roleAnalysis.roleMatch >= 60 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {getMatchLabel(roleAnalysis.roleMatch)}
        </div>
      </div>

      {/* Analysis Sections */}
      <div className="space-y-6">
        {/* Strong Areas */}
        {roleAnalysis.strongAreas.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="text-green-500" size={20} />
              <h3 className="font-semibold text-gray-800">Strong Areas</h3>
            </div>
            <div className="space-y-2">
              {roleAnalysis.strongAreas.map((area, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
                  <span className="text-sm text-green-800">{area}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        {roleAnalysis.missingSkills.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="text-amber-500" size={20} />
              <h3 className="font-semibold text-gray-800">Missing Key Skills</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {roleAnalysis.missingSkills.map((skill, index) => (
                <div key={index} className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <span className="text-sm text-amber-800 font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {roleAnalysis.recommendations.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="text-blue-500" size={20} />
              <h3 className="font-semibold text-gray-800">Role-Specific Recommendations</h3>
            </div>
            <div className="space-y-3">
              {roleAnalysis.recommendations.map((recommendation, index) => (
                <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};