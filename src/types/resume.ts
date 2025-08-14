export interface ResumeData {
  rawText: string;
  sections: {
    contact?: string;
    summary?: string;
    experience?: string;
    education?: string;
    skills?: string;
    achievements?: string;
  };
  metrics: {
    totalWords: number;
    keywordDensity: number;
    readabilityScore: number;
  };
}

export interface ATSScore {
  overall: number;
  breakdown: {
    formatting: number;
    keywords: number;
    experience: number;
    skills: number;
    achievements: number;
  };
}

export interface Analysis {
  strengths: string[];
  improvements: string[];
  roleSpecificInsights: string[];
  companySpecific: {
    [company: string]: string[];
  };
}

export interface Role {
  id: string;
  title: string;
  category: 'IT' | 'Non-IT';
  description: string;
  keySkills: string[];
  keywords: string[];
  experienceRequirements: string[];
  commonTools: string[];
}

export interface RoleAnalysis {
  roleMatch: number;
  missingSkills: string[];
  strongAreas: string[];
  recommendations: string[];
}