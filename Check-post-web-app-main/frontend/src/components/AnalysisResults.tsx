import { ThumbsUp, ThumbsDown, Lightbulb, FileText } from 'lucide-react';
import type { AnalysisResult } from '../types';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  if (!result.sentiment) return null;

  const getSentimentIcon = () => {
    switch (result.sentiment.label) {
      case 'positive':
        return <ThumbsUp className="w-6 h-6 text-green-500" />;
      case 'negative':
        return <ThumbsDown className="w-6 h-6 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {result.text && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4 mb-4">
            <FileText className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Content Analysis
            </h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{result.text}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4 mb-4">
          {getSentimentIcon()}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Sentiment Analysis
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                result.sentiment.score > 50 ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${result.sentiment.score }%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {Math.round(result.sentiment.score )}%
          </span>
        </div>
      </div>

      {result.suggestions && result.suggestions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4 mb-4">
            <Lightbulb className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Engagement Suggestions
            </h3>
          </div>
          <ul className="space-y-2">
            {result.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">•</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}