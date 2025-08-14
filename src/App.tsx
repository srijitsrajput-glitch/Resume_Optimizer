import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { RoleSelector } from './components/RoleSelector';
import { RoleAnalysisCard } from './components/RoleAnalysisCard';
import { ScoreCard } from './components/ScoreCard';
import { AnalysisSection } from './components/AnalysisSection';
import { ResumeAnalyzer } from './services/resumeAnalyzer';
import { ResumeData, ATSScore, Analysis, Role, RoleAnalysis } from './types/resume';
import { Target, Zap, Users, TrendingUp } from 'lucide-react';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [atsScore, setATSScore] = useState<ATSScore | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [roleAnalysis, setRoleAnalysis] = useState<RoleAnalysis | null>(null);

  const analyzer = new ResumeAnalyzer();

  const handleFileUpload = async (file: File) => {
    if (!selectedRole) {
      setError('Please select a target role before uploading your resume.');
      return;
    }

    if (!selectedRole) {
      setError('Please select a target role before uploading your resume.');
      return;
    }

    setIsProcessing(true);
    setError(undefined);

    try {
      const text = await analyzer.extractTextFromPDF(file);
      const resumeData = analyzer.analyzeResume(text);
      const score = analyzer.calculateATSScore(resumeData, selectedRole);
      const analysisResult = analyzer.generateAnalysis(resumeData, score, selectedRole);
      const roleAnalysisResult = analyzer.analyzeRoleMatch(resumeData, selectedRole);

      setResumeData(resumeData);
      setATSScore(score);
      setAnalysis(analysisResult);
      setRoleAnalysis(roleAnalysisResult);
    } catch (err) {
      console.error('Resume processing error:', err);
      setError('Failed to process resume. Please ensure it\'s a valid PDF file with selectable text.');
    } finally {
      setIsProcessing(false);
    }
  };

  const features = [
    {
      icon: <Target className="text-blue-600" size={24} />,
      title: 'ATS Optimization',
      description: 'Get detailed scoring based on what top companies\' ATS systems look for'
    },
    {
      icon: <Zap className="text-green-600" size={24} />,
      title: 'Instant Analysis',
      description: 'Receive comprehensive feedback within seconds of upload'
    },
    {
      icon: <Users className="text-purple-600" size={24} />,
      title: 'Company-Specific Tips',
      description: 'Tailored recommendations for Google, Microsoft, Amazon, and more'
    },
    {
      icon: <TrendingUp className="text-orange-600" size={24} />,
      title: 'Performance Tracking',
      description: 'Monitor improvements and track your resume optimization progress'
    }
  ];

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setError(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Target className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                PM Resume Optimizer
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              Tailored for Top-Tier Companies
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!resumeData ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Optimize Your Resume for Any Role
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Select your target role and get tailored resume analysis with actionable feedback. 
                Our advanced system researches role-specific requirements and optimizes your resume for ATS systems.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {features.map((feature, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-lg mb-4 mx-auto">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Role Selection */}
            <RoleSelector 
              selectedRole={selectedRole} 
              onRoleSelect={handleRoleSelect}
            />

            {/* Upload Section */}
            {selectedRole && (
              <FileUpload 
                onFileUpload={handleFileUpload} 
                isProcessing={isProcessing} 
                error={error}
              />
            )}
          </>
        ) : (
          <>
            {/* Results Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Resume Analysis Complete</h2>
              <p className="text-gray-600">Here's how your resume performs and how to improve it</p>
              <button
                onClick={() => {
                  setResumeData(null);
                  setATSScore(null);
                  setAnalysis(null);
                  setRoleAnalysis(null);
                }}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Analyze Another Resume
              </button>
            </div>

            {/* Results Grid */}
            <div className="space-y-8">
              {/* Role Analysis */}
              {roleAnalysis && selectedRole && (
                <RoleAnalysisCard roleAnalysis={roleAnalysis} selectedRole={selectedRole} />
              )}

              {/* ATS Score */}
              {atsScore && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="flex justify-center lg:justify-end">
                    <ScoreCard score={atsScore} />
                  </div>
                  
                  {/* Resume Stats */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Resume Statistics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-blue-800 font-medium">Total Words</span>
                        <span className="text-2xl font-bold text-blue-600">{resumeData.metrics.totalWords}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-green-800 font-medium">Keyword Density</span>
                        <span className="text-2xl font-bold text-green-600">
                          {resumeData.metrics.keywordDensity.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="text-purple-800 font-medium">Readability Score</span>
                        <span className="text-2xl font-bold text-purple-600">
                          {Math.round(resumeData.metrics.readabilityScore)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Analysis Results */}
              {analysis && <AnalysisSection analysis={analysis} />}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© 2025 Resume Optimizer. Tailored analysis for IT and Non-IT professionals.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;