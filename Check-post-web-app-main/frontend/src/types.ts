export interface AnalysisResult {
  sentiment: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
  };
  suggestions?: string[];
  text?: string;
}

export interface FileUploadResponse {
  text: string;
  fileName: string;
  fileType: string;
}

export type FileStatus = 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';