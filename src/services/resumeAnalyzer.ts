import { ResumeData, ATSScore, Analysis } from '../types/resume';
import { Role, RoleAnalysis } from '../types/resume';

export class ResumeAnalyzer {
  private pmKeywords = [
    'product management', 'product strategy', 'roadmap', 'stakeholder',
    'cross-functional', 'agile', 'scrum', 'user experience', 'ux',
    'metrics', 'kpis', 'analytics', 'data-driven', 'market research',
    'user research', 'product launch', 'go-to-market', 'gtm',
    'product requirements', 'prd', 'user stories', 'feature',
    'prioritization', 'backlog', 'sprint', 'mvp',
    'competitive analysis', 'pricing', 'revenue', 'growth'
  ];

  private technicalKeywords = [
    'sql', 'python', 'tableau', 'google analytics', 'mixpanel',
    'amplitude', 'jira', 'confluence', 'figma', 'sketch',
    'a/b testing', 'experiment', 'hypothesis', 'conversion',
    'retention', 'churn', 'cohort', 'funnel'
  ];

  extractTextFromPDF(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const text = await this.parseArrayBuffer(arrayBuffer);
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  private async parseArrayBuffer(arrayBuffer: ArrayBuffer): Promise<string> {
    // Since pdf-parse might not work in browser, we'll simulate text extraction
    // In a real implementation, you would use a browser-compatible PDF parser
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.generateSampleResumeText());
      }, 2000);
    });
  }

  private generateSampleResumeText(): string {
    return `John Doe
Product Manager
john.doe@email.com | (555) 123-4567 | LinkedIn: linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Senior Product Manager with 5+ years of experience in product strategy, roadmap development, and cross-functional team leadership. Proven track record of launching successful products that drive user engagement and revenue growth.

EXPERIENCE
Senior Product Manager - TechCorp (2021-Present)
• Led product strategy for mobile app serving 2M+ users
• Increased user retention by 35% through data-driven feature prioritization
• Collaborated with engineering, design, and marketing teams to deliver 15+ product features
• Managed product roadmap and backlog using Agile methodologies

Product Manager - StartupXYZ (2019-2021)
• Launched MVP that acquired 500K users in first 6 months
• Conducted user research and competitive analysis to inform product decisions
• Implemented A/B testing framework resulting in 20% conversion improvement

EDUCATION
MBA - Business School (2019)
BS Computer Science - University (2017)

SKILLS
Product Strategy, Roadmap Development, User Research, Data Analysis, Agile/Scrum, SQL, Google Analytics, A/B Testing`;
  }

  analyzeResume(resumeText: string): ResumeData {
    const sections = this.extractSections(resumeText);
    const metrics = this.calculateMetrics(resumeText);

    return {
      rawText: resumeText,
      sections,
      metrics
    };
  }

  private extractSections(text: string) {
    const sections: any = {};
    const lines = text.split('\n');
    
    let currentSection = '';
    let sectionContent = '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (this.isSectionHeader(trimmedLine)) {
        if (currentSection) {
          sections[currentSection.toLowerCase()] = sectionContent.trim();
        }
        currentSection = trimmedLine.replace(/[:\-]/g, '').trim();
        sectionContent = '';
      } else {
        sectionContent += line + '\n';
      }
    }

    if (currentSection) {
      sections[currentSection.toLowerCase()] = sectionContent.trim();
    }

    return sections;
  }

  private isSectionHeader(line: string): boolean {
    const headers = [
      'summary', 'experience', 'education', 'skills', 'achievements',
      'professional summary', 'work experience', 'professional experience'
    ];
    return headers.some(header => line.toLowerCase().includes(header));
  }

  private calculateMetrics(text: string) {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const keywordMatches = this.countKeywordMatches(text.toLowerCase());
    
    return {
      totalWords: words.length,
      keywordDensity: (keywordMatches / words.length) * 100,
      readabilityScore: this.calculateReadabilityScore(text)
    };
  }

  private countKeywordMatches(text: string): number {
    const allKeywords = [...this.pmKeywords, ...this.technicalKeywords];
    return allKeywords.filter(keyword => text.includes(keyword.toLowerCase())).length;
  }

  private calculateReadabilityScore(text: string): number {
    // Simplified readability calculation
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const avgWordsPerSentence = words.length / sentences.length;
    
    return Math.max(0, Math.min(100, 100 - (avgWordsPerSentence - 15) * 2));
  }

  calculateATSScore(resumeData: ResumeData): ATSScore {
    const formatting = this.scoreFormatting(resumeData);
    const keywords = this.scoreKeywords(resumeData);
    const experience = this.scoreExperience(resumeData);
    const skills = this.scoreSkills(resumeData);
    const achievements = this.scoreAchievements(resumeData);

    const overall = Math.round((formatting + keywords + experience + skills + achievements) / 5);

    return {
      overall,
      breakdown: {
        formatting,
        keywords,
        experience,
        skills,
        achievements
      }
    };
  }

  private scoreFormatting(data: ResumeData): number {
    let score = 0;
    
    // Check for contact information
    if (data.rawText.includes('@') && data.rawText.includes('linkedin')) score += 20;
    
    // Check for proper sections
    const hasSections = Object.keys(data.sections).length >= 4;
    if (hasSections) score += 30;
    
    // Check word count (ideal range: 300-600 words)
    const wordCount = data.metrics.totalWords;
    if (wordCount >= 300 && wordCount <= 600) {
      score += 30;
    } else if (wordCount >= 200 && wordCount <= 800) {
      score += 20;
    } else {
      score += 10;
    }
    
    // Check readability
    if (data.metrics.readabilityScore > 60) score += 20;

    return Math.min(100, score);
  }

  private scoreKeywords(data: ResumeData): number {
    const text = data.rawText.toLowerCase();
    let score = 0;
    
    // PM-specific keywords
    const pmMatches = this.pmKeywords.filter(keyword => text.includes(keyword)).length;
    score += Math.min(60, pmMatches * 3);
    
    // Technical keywords
    const techMatches = this.technicalKeywords.filter(keyword => text.includes(keyword)).length;
    score += Math.min(40, techMatches * 2);
    
    return Math.min(100, score);
  }

  private scoreExperience(data: ResumeData): number {
    const experienceText = data.sections.experience || '';
    let score = 0;
    
    // Check for quantified achievements
    const hasMetrics = /\d+%|\$\d+|million|thousand|users|customers/i.test(experienceText);
    if (hasMetrics) score += 40;
    
    // Check for action verbs
    const actionVerbs = ['led', 'managed', 'launched', 'increased', 'developed', 'implemented'];
    const verbCount = actionVerbs.filter(verb => experienceText.toLowerCase().includes(verb)).length;
    score += Math.min(30, verbCount * 5);
    
    // Check experience length
    if (experienceText.length > 500) score += 30;
    
    return Math.min(100, score);
  }

  private scoreSkills(data: ResumeData): number {
    const text = data.rawText.toLowerCase();
    let score = 0;
    
    // Check for relevant PM skills
    const skillsSection = data.sections.skills || '';
    if (skillsSection.length > 100) score += 30;
    
    // Check for technical proficiency
    if (text.includes('sql') || text.includes('analytics') || text.includes('data')) score += 35;
    
    // Check for soft skills
    if (text.includes('leadership') || text.includes('communication') || text.includes('stakeholder')) score += 35;
    
    return Math.min(100, score);
  }

  private scoreAchievements(data: ResumeData): number {
    const text = data.rawText.toLowerCase();
    let score = 0;
    
    // Look for quantified results
    const metrics = /(\d+%|\$\d+[\w\s]*|million|billion|thousand|\d+x)/gi;
    const metricMatches = text.match(metrics);
    if (metricMatches) {
      score += Math.min(50, metricMatches.length * 10);
    }
    
    // Look for impact keywords
    const impactKeywords = ['increased', 'decreased', 'improved', 'optimized', 'launched', 'delivered'];
    const impactCount = impactKeywords.filter(keyword => text.includes(keyword)).length;
    score += Math.min(50, impactCount * 8);
    
    return Math.min(100, score);
  }

  generateAnalysis(resumeData: ResumeData, atsScore: ATSScore): Analysis {
    const strengths = this.identifyStrengths(resumeData, atsScore);
    const improvements = this.identifyImprovements(resumeData, atsScore);
    const roleSpecificInsights: string[] = [];
    const companySpecific = this.generateCompanySpecificTips(resumeData);

    return {
      strengths,
      improvements,
      roleSpecificInsights,
      companySpecific
    };
  }

  analyzeRoleMatch(resumeData: ResumeData, selectedRole: Role): RoleAnalysis {
    const roleMatch = this.calculateRoleMatch(resumeData, selectedRole);
    const missingSkills = this.identifyMissingSkills(resumeData, selectedRole);
    const strongAreas = this.identifyStrongAreas(resumeData, selectedRole);
    const recommendations = this.generateRoleRecommendations(resumeData, selectedRole);

    return {
      roleMatch,
      missingSkills,
      strongAreas,
      recommendations
    };
  }

  private calculateRoleMatch(resumeData: ResumeData, role: Role): number {
    const text = resumeData.rawText.toLowerCase();
    let score = 0;
    let totalChecks = 0;

    // Check for key skills (40% weight)
    const skillMatches = role.keySkills.filter(skill => 
      text.includes(skill.toLowerCase())
    ).length;
    score += (skillMatches / role.keySkills.length) * 40;
    totalChecks += 40;

    // Check for keywords (30% weight)
    const keywordMatches = role.keywords.filter(keyword => 
      text.includes(keyword.toLowerCase())
    ).length;
    score += (keywordMatches / role.keywords.length) * 30;
    totalChecks += 30;

    // Check for common tools (20% weight)
    const toolMatches = role.commonTools.filter(tool => 
      text.includes(tool.toLowerCase())
    ).length;
    score += (toolMatches / role.commonTools.length) * 20;
    totalChecks += 20;

    // Check for experience requirements (10% weight)
    const expMatches = role.experienceRequirements.filter(req => {
      const reqWords = req.toLowerCase().split(' ');
      return reqWords.some(word => text.includes(word));
    }).length;
    score += (expMatches / role.experienceRequirements.length) * 10;
    totalChecks += 10;

    return Math.round(score);
  }

  private identifyMissingSkills(resumeData: ResumeData, role: Role): string[] {
    const text = resumeData.rawText.toLowerCase();
    const missingSkills: string[] = [];

    // Check key skills
    role.keySkills.forEach(skill => {
      if (!text.includes(skill.toLowerCase())) {
        missingSkills.push(skill);
      }
    });

    // Check important keywords
    role.keywords.slice(0, 10).forEach(keyword => {
      if (!text.includes(keyword.toLowerCase()) && !missingSkills.includes(keyword)) {
        missingSkills.push(keyword);
      }
    });

    return missingSkills.slice(0, 8); // Return top 8 missing skills
  }

  private identifyStrongAreas(resumeData: ResumeData, role: Role): string[] {
    const text = resumeData.rawText.toLowerCase();
    const strongAreas: string[] = [];

    // Check for matching key skills
    role.keySkills.forEach(skill => {
      if (text.includes(skill.toLowerCase())) {
        strongAreas.push(`Strong ${skill} experience demonstrated`);
      }
    });

    // Check for matching tools
    role.commonTools.forEach(tool => {
      if (text.includes(tool.toLowerCase())) {
        strongAreas.push(`Proficiency in ${tool} mentioned`);
      }
    });

    return strongAreas.slice(0, 6); // Return top 6 strong areas
  }

  private generateRoleRecommendations(resumeData: ResumeData, role: Role): string[] {
    const text = resumeData.rawText.toLowerCase();
    const recommendations: string[] = [];

    // Role-specific recommendations based on category
    if (role.category === 'IT') {
      if (!text.includes('github') && !text.includes('git')) {
        recommendations.push('Include links to your GitHub profile or mention version control experience');
      }
      if (!text.includes('agile') && !text.includes('scrum')) {
        recommendations.push('Highlight experience with Agile/Scrum methodologies');
      }
      if (!text.includes('api') && role.keywords.includes('api')) {
        recommendations.push('Mention API development or integration experience if applicable');
      }
    } else {
      if (!text.includes('team') && !text.includes('leadership')) {
        recommendations.push('Emphasize team leadership and collaboration skills');
      }
      if (!text.includes('budget') && !text.includes('cost')) {
        recommendations.push('Include budget management or cost optimization experience');
      }
    }

    // General recommendations
    if (!text.includes('metric') && !text.includes('%')) {
      recommendations.push('Add more quantified achievements with specific metrics');
    }

    // Role-specific skill recommendations
    const missingCriticalSkills = role.keySkills.slice(0, 3).filter(skill => 
      !text.includes(skill.toLowerCase())
    );
    
    missingCriticalSkills.forEach(skill => {
      recommendations.push(`Consider adding examples that demonstrate ${skill} capabilities`);
    });

    return recommendations.slice(0, 6); // Return top 6 recommendations
  }

  private identifyStrengths(data: ResumeData, score: ATSScore): string[] {
    const strengths: string[] = [];
    
    if (score.breakdown.keywords > 70) {
      strengths.push('Strong use of product management keywords and terminology');
    }
    
    if (score.breakdown.experience > 75) {
      strengths.push('Well-documented experience with quantified achievements');
    }
    
    if (data.metrics.totalWords >= 300 && data.metrics.totalWords <= 600) {
      strengths.push('Optimal resume length for ATS scanning');
    }
    
    if (data.rawText.toLowerCase().includes('launched') || data.rawText.toLowerCase().includes('shipped')) {
      strengths.push('Clear demonstration of product launch experience');
    }
    
    if (/\d+%/.test(data.rawText)) {
      strengths.push('Excellent use of metrics to quantify impact');
    }
    
    return strengths.length > 0 ? strengths : ['Professional formatting and structure'];
  }

  private identifyImprovements(data: ResumeData, score: ATSScore): string[] {
    const improvements: string[] = [];
    
    if (score.breakdown.keywords < 60) {
      improvements.push('Include more product management keywords like "roadmap", "stakeholder management", "user research"');
    }
    
    if (score.breakdown.achievements < 70) {
      improvements.push('Add more quantified achievements with specific metrics and percentages');
    }
    
    if (!data.rawText.toLowerCase().includes('user') && !data.rawText.toLowerCase().includes('customer')) {
      improvements.push('Emphasize user-centric thinking and customer focus');
    }
    
    if (!data.rawText.toLowerCase().includes('data') && !data.rawText.toLowerCase().includes('analytics')) {
      improvements.push('Highlight data analysis skills and data-driven decision making');
    }
    
    if (data.metrics.totalWords > 700) {
      improvements.push('Consider condensing content to improve ATS readability');
    }
    
    return improvements.length > 0 ? improvements : ['Consider adding more specific product management examples'];
  }

  private generateCompanySpecificTips(data: ResumeData): { [company: string]: string[] } {
    return {
      Google: [
        'Emphasize data-driven decision making and A/B testing experience',
        'Include experience with large-scale products and technical collaboration',
        'Highlight innovation and user experience focus'
      ],
      Microsoft: [
        'Showcase enterprise product experience and B2B market knowledge',
        'Emphasize stakeholder management and cross-functional leadership',
        'Include experience with cloud or productivity tools'
      ],
      Amazon: [
        'Demonstrate customer obsession and working backwards methodology',
        'Highlight experience with metrics-driven product decisions',
        'Show ability to work in fast-paced, high-growth environments'
      ],
      Meta: [
        'Emphasize social platform or community product experience',
        'Highlight growth hacking and user engagement expertise',
        'Show experience with mobile-first product development'
      ],
      Apple: [
        'Focus on user experience and design thinking',
        'Highlight premium product and brand experience',
        'Emphasize attention to detail and quality focus'
      ]
    };
  }
}