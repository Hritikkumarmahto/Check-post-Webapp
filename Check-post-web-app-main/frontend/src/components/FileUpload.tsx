import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Image as ImageIcon, FileText } from 'lucide-react';
import { FileStatus } from '../types';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  onClear: () => void;  // New prop for clearing analysis results
  status: FileStatus;
}

export function FileUpload({ onFileSelect, onClear, status }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^(image\/(jpeg|png)|application\/pdf)$/)) {
      setError('Please upload a valid image (JPG/PNG) or PDF file');
      return;
    }

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setError('File size must be less than 20MB');
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview URL for both images and PDFs
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: false
  });

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect([selectedFile]);
    }
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    onClear(); // Call the new onClear prop to clear analysis results
  };

  if (status === 'uploading' || status === 'analyzing') {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-12 h-12 mb-4 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-lg font-medium text-blue-700 dark:text-blue-400">
          {status === 'uploading' ? 'Uploading file...' : 'Analyzing content...'}
        </p>
      </div>
    );
  }

  if (selectedFile && previewUrl) {
    return (
      <div className="space-y-4">
        <div className="relative">
          {selectedFile.type.startsWith('image/') ? (
            // Image Preview
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-64 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
            />
          ) : (
            // PDF Preview
            <div className="w-full h-64 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <object
                data={previewUrl}
                type="application/pdf"
                className="w-full h-full"
              >
                <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-800">
                  <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    PDF Preview
                  </p>
                </div>
              </object>
            </div>
          )}
          <button
            onClick={handleReset}
            className="absolute top-2 right-2 p-1 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedFile.type.startsWith('image/') ? (
              <ImageIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
            <span className="text-sm text-gray-600 dark:text-gray-400">{selectedFile.name}</span>
          </div>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Analyze {selectedFile.type.startsWith('image/') ? 'Image' : 'PDF'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`w-full p-8 border-2 border-dashed rounded-lg transition-colors ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className="w-12 h-12 mb-4 text-gray-400 dark:text-gray-500" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
            Drag & drop files here, or click to select
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Supports PDF, JPG, and PNG files (max 20MB)
          </p>
        </div>
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}

export default FileUpload;