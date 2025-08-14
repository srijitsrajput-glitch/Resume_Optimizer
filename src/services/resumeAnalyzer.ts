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

  async extractTextFromPDF(file: File): Promise<string> {
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
    try {
      // Try to use pdf-parse if available
      const pdfParse = await import('pdf-parse');
      const data = await pdfParse.default(arrayBuffer);
      return data.text;
    } catch (error) {
      // Fallback: Try to extract text using basic PDF parsing
      return this.basicPDFTextExtraction(arrayBuffer);
    }
  }

  private basicPDFTextExtraction(arrayBuffer: ArrayBuffer): string {
    // Convert ArrayBuffer to string and try to extract readable text
    const uint8Array = new Uint8Array(arrayBuffer);
    let text = '';
    
    // Look for text between BT and ET markers (PDF text objects)
    const pdfString = Array.from(uint8Array)
      .map(byte => String.fromCharCode(byte))
      .join('');
    
    // Extract text using regex patterns for PDF text objects
    const textMatches = pdfString.match(/\(([^)]+)\)/g);
    if (textMatches) {
      text = textMatches
        .map(match => match.slice(1, -1))
        .join(' ')
        .replace(/\\[rn]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    // If no text found, try alternative extraction
    if (!text) {
      // Look for readable ASCII text in the PDF
      const readableText = pdfString.match(/[a-zA-Z0-9\s@.,;:!?()-]{10,}/g);
      if (readableText) {
        text = readableText.join(' ').replace(/\s+/g, ' ').trim();
      }
    }
    
    return text || 'Unable to extract text from PDF. Please ensure the PDF contains selectable text.';
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
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    let currentSection = '';
    let sectionContent: string[] = [];

    for (const line of lines) {
      if (this.isSectionHeader(line)) {
        // Save previous section
        if (currentSection && sectionContent.length > 0) {
          sections[currentSection.toLowerCase().replace(/\s+/g, '_')] = sectionContent.join('\n');
        }
        
        // Start new section
        currentSection = this.normalizeSectionName(line);
        sectionContent = [];
      } else if (currentSection) {
        sectionContent.push(line);
      } else {
        // Content before any section header
        if (!sections.header) sections.header = '';
        sections.header += line + '\n';
      }
    }

    // Save last section
    if (currentSection && sectionContent.length > 0) {
      sections[currentSection.toLowerCase().replace(/\s+/g, '_')] = sectionContent.join('\n');
    }

    return sections;
  }

  private isSectionHeader(line: string): boolean {
    const headers = [
      'summary', 'experience', 'education', 'skills', 'achievements',
      'professional summary', 'work experience', 'professional experience',
      'employment', 'career summary', 'qualifications', 'certifications',
      'projects', 'accomplishments', 'technical skills', 'core competencies',
      'career highlights', 'key achievements', 'employment history'
    ];
    
    const normalizedLine = line.toLowerCase().replace(/[:\-_]/g, '').trim();
    return headers.some(header => 
      normalizedLine === header || 
      normalizedLine.includes(header) ||
      (normalizedLine.length < 30 && header.includes(normalizedLine))
    );
  }

  private normalizeSectionName(line: string): string {
    const normalized = line.toLowerCase().replace(/[:\-_]/g, '').trim();
    
    // Map variations to standard names
    const sectionMap: { [key: string]: string } = {
      'professional summary': 'summary',
      'career summary': 'summary',
      'work experience': 'experience',
      'professional experience': 'experience',
      'employment': 'experience',
      'employment history': 'experience',
      'technical skills': 'skills',
      'core competencies': 'skills',
      'key achievements': 'achievements',
      'accomplishments': 'achievements',
      'career highlights': 'achievements'
    };

    return sectionMap[normalized] || normalized;
  }

  private calculateMetrics(text: string) {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const keywordMatches = this.countKeywordMatches(text.toLowerCase());
    
    return {
      totalWords: words.length,
      keywordDensity: words.length > 0 ? (keywordMatches / words.length) * 100 : 0,
      readabilityScore: this.calculateReadabilityScore(text, words, sentences)
    };
  }

  private countKeywordMatches(text: string): number {
    const allKeywords = [...this.pmKeywords, ...this.technicalKeywords];
    return allKeywords.filter(keyword => text.includes(keyword.toLowerCase())).length;
  }

  private calculateReadabilityScore(text: string, words: string[], sentences: string[]): number {
    if (sentences.length === 0) return 0;
    
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = words.reduce((sum, word) => sum + this.countSyllables(word), 0) / words.length;
    
    // Flesch Reading Ease formula adapted for resumes
    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    return Math.max(0, Math.min(100, score));
  }

  private countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    const vowels = 'aeiouy';
    let syllables = 0;
    let prevWasVowel = false;
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !prevWasVowel) {
        syllables++;
      }
      prevWasVowel = isVowel;
    }
    
    // Adjust for silent e
    if (word.endsWith('e')) syllables--;
    
    return Math.max(1, syllables);
  }

  calculateATSScore(resumeData: ResumeData, selectedRole?: Role): ATSScore {
    const formatting = this.scoreFormatting(resumeData);
    const keywords = this.scoreKeywords(resumeData, selectedRole);
    const experience = this.scoreExperience(resumeData);
    const skills = this.scoreSkills(resumeData, selectedRole);
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
    const text = data.rawText.toLowerCase();
    
    // Check for contact information (25 points)
    let contactScore = 0;
    if (text.includes('@') && (text.includes('.com') || text.includes('.org'))) contactScore += 10;
    if (text.match(/\(\d{3}\)\s*\d{3}-\d{4}|\d{3}-\d{3}-\d{4}|\+\d{1,3}\s*\d{3,4}\s*\d{3,4}/)) contactScore += 10;
    if (text.includes('linkedin')) contactScore += 5;
    score += contactScore;
    
    // Check for proper sections (30 points)
    const sectionCount = Object.keys(data.sections).length;
    if (sectionCount >= 5) score += 30;
    else if (sectionCount >= 4) score += 25;
    else if (sectionCount >= 3) score += 20;
    else score += 10;
    
    // Check word count (25 points)
    const wordCount = data.metrics.totalWords;
    if (wordCount >= 300 && wordCount <= 600) {
      score += 25;
    } else if (wordCount >= 250 && wordCount <= 750) {
      score += 20;
    } else if (wordCount >= 200 && wordCount <= 800) {
      score += 15;
    } else {
      score += 5;
    }
    
    // Check readability (20 points)
    if (data.metrics.readabilityScore > 60) score += 20;
    else if (data.metrics.readabilityScore > 40) score += 15;
    else if (data.metrics.readabilityScore > 20) score += 10;
    else score += 5;

    return Math.min(100, score);
  }

  private scoreKeywords(data: ResumeData, selectedRole?: Role): number {
    const text = data.rawText.toLowerCase();
    let score = 0;
    
    if (selectedRole) {
      // Role-specific keyword scoring
      const roleKeywords = [...selectedRole.keySkills, ...selectedRole.keywords];
      const matchedKeywords = roleKeywords.filter(keyword => 
        text.includes(keyword.toLowerCase())
      );
      score += Math.min(70, (matchedKeywords.length / roleKeywords.length) * 70);
      
      // Tool-specific scoring
      const toolMatches = selectedRole.commonTools.filter(tool => 
        text.includes(tool.toLowerCase())
      );
      score += Math.min(30, (toolMatches.length / selectedRole.commonTools.length) * 30);
    } else {
      // General PM keywords
      const pmMatches = this.pmKeywords.filter(keyword => text.includes(keyword)).length;
      score += Math.min(60, pmMatches * 3);
      
      // Technical keywords
      const techMatches = this.technicalKeywords.filter(keyword => text.includes(keyword)).length;
      score += Math.min(40, techMatches * 2);
    }
    
    return Math.min(100, score);
  }

  private scoreExperience(data: ResumeData): number {
    const experienceText = (data.sections.experience || data.sections.work_experience || '').toLowerCase();
    let score = 0;
    
    // Check for quantified achievements (40 points)
    const metricPatterns = [
      /\d+%/g,
      /\$\d+[kmb]?/g,
      /\d+\s*(million|thousand|billion)/g,
      /\d+\s*(users|customers|clients)/g,
      /\d+x\s*(increase|improvement|growth)/g,
      /increased?\s+by\s+\d+/g,
      /reduced?\s+by\s+\d+/g,
      /improved?\s+by\s+\d+/g
    ];
    
    let metricCount = 0;
    metricPatterns.forEach(pattern => {
      const matches = experienceText.match(pattern);
      if (matches) metricCount += matches.length;
    });
    
    score += Math.min(40, metricCount * 8);
    
    // Check for action verbs (30 points)
    const actionVerbs = [
      'led', 'managed', 'launched', 'increased', 'developed', 'implemented',
      'created', 'designed', 'optimized', 'improved', 'delivered', 'achieved',
      'built', 'established', 'coordinated', 'executed', 'streamlined'
    ];
    const verbCount = actionVerbs.filter(verb => experienceText.includes(verb)).length;
    score += Math.min(30, verbCount * 3);
    
    // Check experience depth (30 points)
    const experienceLength = experienceText.length;
    if (experienceLength > 800) score += 30;
    else if (experienceLength > 500) score += 25;
    else if (experienceLength > 300) score += 20;
    else if (experienceLength > 100) score += 15;
    else score += 5;
    
    return Math.min(100, score);
  }

  private scoreSkills(data: ResumeData, selectedRole?: Role): number {
    const text = data.rawText.toLowerCase();
    const skillsSection = (data.sections.skills || data.sections.technical_skills || '').toLowerCase();
    let score = 0;
    
    if (selectedRole) {
      // Role-specific skills scoring
      const skillMatches = selectedRole.keySkills.filter(skill => 
        text.includes(skill.toLowerCase())
      );
      score += Math.min(60, (skillMatches.length / selectedRole.keySkills.length) * 60);
      
      // Tool proficiency
      const toolMatches = selectedRole.commonTools.filter(tool => 
        text.includes(tool.toLowerCase())
      );
      score += Math.min(40, (toolMatches.length / selectedRole.commonTools.length) * 40);
    } else {
      // General skills assessment
      if (skillsSection.length > 100) score += 30;
      else if (skillsSection.length > 50) score += 20;
      else score += 10;
      
      // Technical proficiency
      const techSkills = ['sql', 'python', 'analytics', 'data', 'tableau', 'excel'];
      const techCount = techSkills.filter(skill => text.includes(skill)).length;
      score += Math.min(35, techCount * 6);
      
      // Soft skills
      const softSkills = ['leadership', 'communication', 'stakeholder', 'collaboration', 'strategic'];
      const softCount = softSkills.filter(skill => text.includes(skill)).length;
      score += Math.min(35, softCount * 7);
    }
    
    return Math.min(100, score);
  }

  private scoreAchievements(data: ResumeData): number {
    const text = data.rawText.toLowerCase();
    let score = 0;
    
    // Look for quantified results (50 points)
    const metricPatterns = [
      /\d+%/g,
      /\$\d+[\w\s]*/g,
      /(million|billion|thousand)/g,
      /\d+x/g,
      /\d+\s*(users|customers|revenue|growth|increase|improvement)/g
    ];
    
    let totalMetrics = 0;
    metricPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) totalMetrics += matches.length;
    });
    
    score += Math.min(50, totalMetrics * 5);
    
    // Look for impact keywords (50 points)
    const impactKeywords = [
      'increased', 'decreased', 'improved', 'optimized', 'launched', 'delivered',
      'achieved', 'exceeded', 'reduced', 'enhanced', 'streamlined', 'accelerated'
    ];
    const impactCount = impactKeywords.filter(keyword => text.includes(keyword)).length;
    score += Math.min(50, impactCount * 6);
    
    return Math.min(100, score);
  }

  generateAnalysis(resumeData: ResumeData, atsScore: ATSScore, selectedRole?: Role): Analysis {
    const strengths = this.identifyStrengths(resumeData, atsScore, selectedRole);
    const improvements = this.identifyImprovements(resumeData, atsScore, selectedRole);
    const roleSpecificInsights = selectedRole ? this.generateRoleInsights(resumeData, selectedRole) : [];
    const companySpecific = this.generateCompanySpecificTips(resumeData, selectedRole);

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

    // Check for key skills (40% weight)
    const skillMatches = role.keySkills.filter(skill => 
      text.includes(skill.toLowerCase())
    ).length;
    score += (skillMatches / role.keySkills.length) * 40;

    // Check for keywords (30% weight)
    const keywordMatches = role.keywords.filter(keyword => 
      text.includes(keyword.toLowerCase())
    ).length;
    score += (keywordMatches / role.keywords.length) * 30;

    // Check for common tools (20% weight)
    const toolMatches = role.commonTools.filter(tool => 
      text.includes(tool.toLowerCase())
    ).length;
    score += (toolMatches / role.commonTools.length) * 20;

    // Check for experience requirements (10% weight)
    const expMatches = role.experienceRequirements.filter(req => {
      const reqWords = req.toLowerCase().split(' ').filter(word => word.length > 3);
      return reqWords.some(word => text.includes(word));
    }).length;
    score += (expMatches / role.experienceRequirements.length) * 10;

    return Math.round(Math.min(100, score));
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

    // Check important tools
    role.commonTools.slice(0, 8).forEach(tool => {
      if (!text.includes(tool.toLowerCase()) && !missingSkills.includes(tool)) {
        missingSkills.push(tool);
      }
    });

    return missingSkills.slice(0, 8);
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

    return strongAreas.slice(0, 6);
  }

  private generateRoleRecommendations(resumeData: ResumeData, role: Role): string[] {
    const text = resumeData.rawText.toLowerCase();
    const recommendations: string[] = [];

    // Role-specific recommendations
    if (role.category === 'IT') {
      if (!text.includes('github') && !text.includes('git')) {
        recommendations.push('Include links to your GitHub profile or mention version control experience');
      }
      if (!text.includes('agile') && !text.includes('scrum')) {
        recommendations.push('Highlight experience with Agile/Scrum methodologies');
      }
    } else {
      if (!text.includes('team') && !text.includes('leadership')) {
        recommendations.push('Emphasize team leadership and collaboration skills');
      }
      if (!text.includes('budget') && !text.includes('cost')) {
        recommendations.push('Include budget management or cost optimization experience');
      }
    }

    // Missing critical skills
    const missingCriticalSkills = role.keySkills.slice(0, 3).filter(skill => 
      !text.includes(skill.toLowerCase())
    );
    
    missingCriticalSkills.forEach(skill => {
      recommendations.push(`Consider adding examples that demonstrate ${skill} capabilities`);
    });

    // General recommendations
    if (!text.match(/\d+%/)) {
      recommendations.push('Add more quantified achievements with specific metrics and percentages');
    }

    return recommendations.slice(0, 6);
  }

  private identifyStrengths(data: ResumeData, score: ATSScore, selectedRole?: Role): string[] {
    const strengths: string[] = [];
    const text = data.rawText.toLowerCase();
    
    if (score.breakdown.keywords > 70) {
      strengths.push(selectedRole ? 
        `Strong use of ${selectedRole.title} keywords and terminology` :
        'Strong use of relevant keywords and terminology'
      );
    }
    
    if (score.breakdown.experience > 75) {
      strengths.push('Well-documented experience with quantified achievements');
    }
    
    if (data.metrics.totalWords >= 300 && data.metrics.totalWords <= 600) {
      strengths.push('Optimal resume length for ATS scanning');
    }
    
    if (text.includes('launched') || text.includes('shipped') || text.includes('delivered')) {
      strengths.push('Clear demonstration of project delivery and launch experience');
    }
    
    if (text.match(/\d+%/)) {
      strengths.push('Excellent use of metrics to quantify impact and results');
    }

    if (selectedRole) {
      const matchedSkills = selectedRole.keySkills.filter(skill => 
        text.includes(skill.toLowerCase())
      );
      if (matchedSkills.length > selectedRole.keySkills.length * 0.6) {
        strengths.push(`Strong alignment with ${selectedRole.title} key skills`);
      }
    }
    
    return strengths.length > 0 ? strengths : ['Professional formatting and clear structure'];
  }

  private identifyImprovements(data: ResumeData, score: ATSScore, selectedRole?: Role): string[] {
    const improvements: string[] = [];
    const text = data.rawText.toLowerCase();
    
    if (score.breakdown.keywords < 60) {
      if (selectedRole) {
        const missingKeywords = selectedRole.keywords.filter(keyword => 
          !text.includes(keyword.toLowerCase())
        ).slice(0, 3);
        improvements.push(`Include more ${selectedRole.title} keywords like: ${missingKeywords.join(', ')}`);
      } else {
        improvements.push('Include more relevant industry keywords and terminology');
      }
    }
    
    if (score.breakdown.achievements < 70) {
      improvements.push('Add more quantified achievements with specific metrics, percentages, and dollar amounts');
    }
    
    if (selectedRole) {
      const missingSkills = selectedRole.keySkills.filter(skill => 
        !text.includes(skill.toLowerCase())
      ).slice(0, 2);
      if (missingSkills.length > 0) {
        improvements.push(`Consider highlighting experience with: ${missingSkills.join(', ')}`);
      }
    }
    
    if (!text.includes('data') && !text.includes('analytics') && !text.includes('metrics')) {
      improvements.push('Emphasize data-driven decision making and analytical skills');
    }
    
    if (data.metrics.totalWords > 700) {
      improvements.push('Consider condensing content to improve ATS readability (aim for 300-600 words)');
    } else if (data.metrics.totalWords < 250) {
      improvements.push('Consider adding more detail about your experience and achievements');
    }
    
    return improvements.length > 0 ? improvements : ['Consider adding more specific examples and quantified results'];
  }

  private generateRoleInsights(data: ResumeData, role: Role): string[] {
    const insights: string[] = [];
    const text = data.rawText.toLowerCase();
    
    // Role-specific insights based on what's found in the resume
    if (role.category === 'IT') {
      if (text.includes('api') || text.includes('technical')) {
        insights.push('Your technical background aligns well with IT role requirements');
      }
      if (text.includes('agile') || text.includes('scrum')) {
        insights.push('Strong demonstration of modern development methodologies');
      }
    } else {
      if (text.includes('team') || text.includes('leadership')) {
        insights.push('Leadership experience is valuable for this non-technical role');
      }
      if (text.includes('budget') || text.includes('revenue')) {
        insights.push('Financial acumen demonstrated through budget/revenue experience');
      }
    }
    
    return insights;
  }

  private generateCompanySpecificTips(data: ResumeData, selectedRole?: Role): { [company: string]: string[] } {
    const text = data.rawText.toLowerCase();
    const tips: { [company: string]: string[] } = {};
    
    const companies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'];
    
    companies.forEach(company => {
      tips[company] = [];
      
      switch (company) {
        case 'Google':
          tips[company].push('Emphasize data-driven decision making and analytical thinking');
          if (selectedRole?.category === 'IT') {
            tips[company].push('Highlight experience with large-scale systems and technical innovation');
          }
          if (!text.includes('user')) {
            tips[company].push('Focus on user-centric product development and user experience');
          }
          break;
          
        case 'Microsoft':
          tips[company].push('Showcase enterprise and B2B product experience');
          if (!text.includes('stakeholder')) {
            tips[company].push('Emphasize stakeholder management and cross-functional collaboration');
          }
          tips[company].push('Highlight experience with productivity tools or cloud platforms');
          break;
          
        case 'Amazon':
          tips[company].push('Demonstrate customer obsession and working backwards methodology');
          if (!text.includes('metric')) {
            tips[company].push('Include more metrics-driven examples and KPI improvements');
          }
          tips[company].push('Show ability to work in fast-paced, high-growth environments');
          break;
          
        case 'Meta':
          if (selectedRole?.category === 'IT') {
            tips[company].push('Emphasize social platform or community product experience');
          }
          tips[company].push('Highlight growth hacking and user engagement expertise');
          tips[company].push('Show experience with mobile-first product development');
          break;
          
        case 'Apple':
          tips[company].push('Focus on user experience and design thinking principles');
          tips[company].push('Highlight premium product and brand experience');
          tips[company].push('Emphasize attention to detail and quality-focused approach');
          break;
      }
    });
    
    return tips;
  }
}