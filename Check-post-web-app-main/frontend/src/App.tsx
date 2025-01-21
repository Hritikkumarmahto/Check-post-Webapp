import React, { useState } from "react";
import { FileUpload } from "./components/FileUpload";
import { AnalysisResults } from "./components/AnalysisResults";
import { BarChart } from "lucide-react";
import { ThemeToggle } from "./components/ThemeToggle";
import type { AnalysisResult, FileStatus } from "./types";
import AppIcon from "./assets/app-icon.svg";

const apiUrl = import.meta.env.VITE_API_URL;
//const apiUrl = "https://check-post-webapp-api.vercel.app";


function App() {
  const [fileStatus, setFileStatus] = useState<FileStatus>("idle");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (files: File[]) => {
    if (files.length === 0) return;

    setFileStatus("uploading");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      
      const response = await fetch(`${apiUrl}api/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to analyze file" }));
        throw new Error(errorData.error || "Failed to analyze file");
      }

      setFileStatus("analyzing");
      const result = await response.json();

      if (!result.sentiment || !result.suggestions) {
        throw new Error("Invalid response from server");
      }

      setAnalysisResult({
        sentiment: result.sentiment,
        suggestions: result.suggestions,
        text: result.text,
      });
      setFileStatus("complete");
    } catch (error) {
      console.error("Error processing file:", error);
      setError(
        error instanceof Error ? error.message : "Failed to process file"
      );
      setFileStatus("error");
      setAnalysisResult(null);
    }
  };

  const handleClear = () => {
    setAnalysisResult(null);
    setFileStatus("idle");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ThemeToggle />
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={AppIcon} alt="Check Post Icon" className="w-8 h-8" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              Check Post
            </h1>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Social Media Content Analyzer
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Upload your content and get instant insights to improve engagement
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <FileUpload 
            onFileSelect={handleFileSelect} 
            onClear={handleClear}
            status={fileStatus} 
          />
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {analysisResult && fileStatus === "complete" && (
          <AnalysisResults result={analysisResult} />
        )}
      </div>
    </div>
  );
}

export default App;
