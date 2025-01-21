import { Buffer } from 'buffer';
import { GeminiImageService } from './geminiImageService.js';
import { GeminiPDFService } from './geminiPDFService.js';

interface AnalysisResult {
  text: string;
  analysis: {
    description: string;
    sentiment: { 
      score: number; 
      label: string;
    };
    suggestions: string[];
    summary?: string;  // Optional field for PDF analysis
  };
}

export class FileProcessor {
  private geminiImageService: GeminiImageService;
  private geminiPDFService: GeminiPDFService;

  constructor() {
    this.geminiImageService = new GeminiImageService();
    this.geminiPDFService = new GeminiPDFService();
  }

  async extractText(file: Buffer, mimeType: string): Promise<AnalysisResult> {
    try {
      // For images
      if (mimeType.startsWith('image/')) {
        const analysis = await this.geminiImageService.analyzeImage(file);
        return {
          text: analysis.description,
          analysis: {
            description: analysis.description,
            sentiment: analysis.sentiment,
            suggestions: analysis.suggestions
          }
        };
      }

      // For PDFs
      if (mimeType === 'application/pdf') {
        const analysis = await this.geminiPDFService.analyzePDF(file);
        return {
          text: analysis.text,
          analysis: {
            description: analysis.summary,     //.substring(0, 200), // First 200 chars as description
            sentiment: analysis.sentiment,
            suggestions: analysis.suggestions,
          }
        };
      }

      throw new Error(`Unsupported file type: ${mimeType}`);
    } catch (error) {
      console.error('File processing error:', error);
      
      // Provide a more informative error response
      const errorMessage = error instanceof Error ? error.message : 'File processing failed';
      throw new Error(`File analysis failed: ${errorMessage}`);
    }
  }

  validateFile(file: Express.Multer.File): { valid: boolean; error?: string } {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 20 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.mimetype)) {
      return {
        valid: false,
        error: 'Invalid file type. Only PDF, JPEG, and PNG files are allowed.'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size exceeds 20MB limit.'
      };
    }

    return { valid: true };
  }

  getFileType(mimeType: string): 'image' | 'pdf' | 'unknown' {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    return 'unknown';
  }
}