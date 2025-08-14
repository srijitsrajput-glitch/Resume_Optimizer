import React from 'react';
import { CheckCircle, AlertTriangle, Target, Building2 } from 'lucide-react';
import { Analysis } from '../types/resume';

interface AnalysisSectionProps {
  analysis: Analysis;
}

const companies = [
  { name: 'Google', color: 'bg-blue-500' },
  { name: 'Microsoft', color: 'bg-green-500' },
  { name: 'Amazon', color: 'bg-orange-500' },
  { name: 'Meta', color: 'bg-blue-600' },
  { name: 'Apple', color: 'bg-gray-800' }
];

export const AnalysisSection: React.FC<AnalysisSectionProps> = ({ analysis }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Strengths */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <CheckCircle className="text-green-500" size={24} />
          <h3 className="text-xl font-bold text-gray-800">Strengths</h3>
        </div>
        <div className="space-y-3">
          {analysis.strengths.map((strength, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
              <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
              <p className="text-sm text-green-800">{strength}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Improvements */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="text-amber-500" size={24} />
          <h3 className="text-xl font-bold text-gray-800">Areas for Improvement</h3>
        </div>
        <div className="space-y-3">
          {analysis.improvements.map((improvement, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <Target className="text-amber-500 mt-0.5 flex-shrink-0" size={16} />
              <p className="text-sm text-amber-800">{improvement}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Company-Specific Recommendations */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <Building2 className="text-blue-500" size={24} />
          <h3 className="text-xl font-bold text-gray-800">Company-Specific Optimization</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {companies.map((company) => (
            <div key={company.name} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className={`w-3 h-3 rounded-full ${company.color}`}></div>
                <h4 className="font-semibold text-gray-800">{company.name}</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                {(analysis.companySpecific[company.name] || []).map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};