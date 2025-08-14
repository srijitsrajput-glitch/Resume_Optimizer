import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isProcessing, error }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 scale-105' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={`
            p-4 rounded-full transition-all duration-300
            ${isDragActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
          `}>
            {isProcessing ? (
              <div className="animate-spin">
                <FileText size={32} />
              </div>
            ) : (
              <Upload size={32} />
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {isProcessing ? 'Analyzing Resume Content...' : 'Upload Your Resume'}
            </h3>
            <p className="text-gray-600">
              {isDragActive 
                ? 'Drop your PDF here...' 
                : 'Drag & drop your PDF resume or click to browse for analysis'
              }
            </p>
            <p className="text-sm text-gray-500 mt-1">PDF files with selectable text, up to 10MB</p>
          </div>
        </div>
        
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-blue-600 font-medium">Extracting and analyzing resume content...</span>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="text-red-500" size={20} />
          <span className="text-red-700">{error}</span>
        </div>
      )}
    </div>
  );
};