import { Role } from '../types/resume';

export const roles: Role[] = [
  // IT Roles
  {
    id: 'product-manager-tech',
    title: 'Product Manager (Tech)',
    category: 'IT',
    description: 'Technical product manager for software products and platforms',
    keySkills: [
      'product strategy', 'technical product management', 'agile development',
      'user experience', 'data analysis', 'stakeholder management',
      'product roadmap', 'cross-functional leadership', 'market research'
    ],
    keywords: [
      'api', 'sdk', 'microservices', 'cloud', 'scalability', 'architecture',
      'technical requirements', 'engineering collaboration', 'system design',
      'performance optimization', 'integration', 'platform', 'infrastructure'
    ],
    experienceRequirements: [
      'Led technical product initiatives',
      'Collaborated with engineering teams',
      'Managed product roadmaps',
      'Launched software products',
      'Analyzed user data and metrics'
    ],
    commonTools: [
      'jira', 'confluence', 'figma', 'tableau', 'google analytics',
      'mixpanel', 'amplitude', 'sql', 'python', 'git'
    ]
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    category: 'IT',
    description: 'Full-stack or specialized software developer',
    keySkills: [
      'programming', 'software development', 'problem solving',
      'algorithms', 'data structures', 'system design',
      'code review', 'testing', 'debugging'
    ],
    keywords: [
      'javascript', 'python', 'java', 'react', 'node.js', 'aws',
      'docker', 'kubernetes', 'rest api', 'database', 'git',
      'ci/cd', 'agile', 'scrum', 'microservices'
    ],
    experienceRequirements: [
      'Developed software applications',
      'Collaborated in agile teams',
      'Implemented features and bug fixes',
      'Participated in code reviews',
      'Optimized application performance'
    ],
    commonTools: [
      'vs code', 'git', 'docker', 'aws', 'jenkins', 'postman',
      'slack', 'jira', 'github', 'npm'
    ]
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'IT',
    description: 'Analyze complex data to drive business insights and decisions',
    keySkills: [
      'machine learning', 'statistical analysis', 'data visualization',
      'predictive modeling', 'data mining', 'hypothesis testing',
      'feature engineering', 'model evaluation', 'business intelligence'
    ],
    keywords: [
      'python', 'r', 'sql', 'tensorflow', 'pytorch', 'scikit-learn',
      'pandas', 'numpy', 'matplotlib', 'seaborn', 'jupyter',
      'hadoop', 'spark', 'tableau', 'power bi'
    ],
    experienceRequirements: [
      'Built predictive models',
      'Analyzed large datasets',
      'Created data visualizations',
      'Collaborated with business stakeholders',
      'Deployed machine learning models'
    ],
    commonTools: [
      'python', 'jupyter', 'tableau', 'sql', 'git', 'aws',
      'docker', 'airflow', 'databricks', 'snowflake'
    ]
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    category: 'IT',
    description: 'Bridge development and operations for efficient software delivery',
    keySkills: [
      'infrastructure automation', 'ci/cd', 'cloud platforms',
      'containerization', 'monitoring', 'security',
      'configuration management', 'incident response', 'scalability'
    ],
    keywords: [
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform',
      'ansible', 'jenkins', 'gitlab ci', 'prometheus', 'grafana',
      'elk stack', 'nginx', 'linux', 'bash'
    ],
    experienceRequirements: [
      'Managed cloud infrastructure',
      'Implemented CI/CD pipelines',
      'Automated deployment processes',
      'Monitored system performance',
      'Resolved production incidents'
    ],
    commonTools: [
      'aws', 'docker', 'kubernetes', 'terraform', 'jenkins',
      'git', 'prometheus', 'grafana', 'slack', 'pagerduty'
    ]
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    category: 'IT',
    description: 'Design user interfaces and experiences for digital products',
    keySkills: [
      'user research', 'wireframing', 'prototyping', 'visual design',
      'interaction design', 'usability testing', 'design systems',
      'user journey mapping', 'accessibility'
    ],
    keywords: [
      'figma', 'sketch', 'adobe creative suite', 'invision', 'principle',
      'user personas', 'information architecture', 'responsive design',
      'design thinking', 'a/b testing'
    ],
    experienceRequirements: [
      'Designed user interfaces',
      'Conducted user research',
      'Created prototypes and wireframes',
      'Collaborated with product teams',
      'Improved user experience metrics'
    ],
    commonTools: [
      'figma', 'sketch', 'adobe xd', 'invision', 'miro',
      'hotjar', 'google analytics', 'zeplin', 'principle'
    ]
  },

  // Non-IT Roles
  {
    id: 'marketing-manager',
    title: 'Marketing Manager',
    category: 'Non-IT',
    description: 'Develop and execute marketing strategies to drive growth',
    keySkills: [
      'marketing strategy', 'brand management', 'campaign management',
      'market research', 'content marketing', 'digital marketing',
      'lead generation', 'customer acquisition', 'roi analysis'
    ],
    keywords: [
      'seo', 'sem', 'social media', 'email marketing', 'content strategy',
      'brand awareness', 'customer segmentation', 'conversion optimization',
      'marketing automation', 'crm'
    ],
    experienceRequirements: [
      'Developed marketing campaigns',
      'Managed marketing budgets',
      'Analyzed campaign performance',
      'Collaborated with sales teams',
      'Increased brand awareness'
    ],
    commonTools: [
      'google ads', 'facebook ads', 'hubspot', 'mailchimp',
      'google analytics', 'hootsuite', 'canva', 'salesforce'
    ]
  },
  {
    id: 'sales-manager',
    title: 'Sales Manager',
    category: 'Non-IT',
    description: 'Lead sales teams and drive revenue growth',
    keySkills: [
      'sales strategy', 'team leadership', 'client relationship management',
      'negotiation', 'pipeline management', 'forecasting',
      'territory management', 'sales training', 'performance analysis'
    ],
    keywords: [
      'revenue growth', 'quota attainment', 'lead qualification',
      'sales funnel', 'customer retention', 'upselling',
      'cross-selling', 'account management', 'crm'
    ],
    experienceRequirements: [
      'Exceeded sales targets',
      'Managed sales teams',
      'Developed client relationships',
      'Negotiated contracts',
      'Analyzed sales performance'
    ],
    commonTools: [
      'salesforce', 'hubspot', 'pipedrive', 'linkedin sales navigator',
      'zoom', 'slack', 'excel', 'powerpoint'
    ]
  },
  {
    id: 'hr-manager',
    title: 'HR Manager',
    category: 'Non-IT',
    description: 'Manage human resources and organizational development',
    keySkills: [
      'talent acquisition', 'employee relations', 'performance management',
      'compensation planning', 'training development', 'policy development',
      'conflict resolution', 'organizational development', 'compliance'
    ],
    keywords: [
      'recruitment', 'onboarding', 'employee engagement', 'retention',
      'diversity inclusion', 'performance reviews', 'hr policies',
      'labor relations', 'benefits administration'
    ],
    experienceRequirements: [
      'Recruited and hired talent',
      'Managed employee relations',
      'Developed HR policies',
      'Conducted performance reviews',
      'Improved employee satisfaction'
    ],
    commonTools: [
      'workday', 'bamboohr', 'linkedin recruiter', 'greenhouse',
      'slack', 'zoom', 'microsoft office', 'survey tools'
    ]
  },
  {
    id: 'financial-analyst',
    title: 'Financial Analyst',
    category: 'Non-IT',
    description: 'Analyze financial data and provide business insights',
    keySkills: [
      'financial modeling', 'data analysis', 'forecasting',
      'budgeting', 'variance analysis', 'risk assessment',
      'investment analysis', 'reporting', 'strategic planning'
    ],
    keywords: [
      'excel', 'financial statements', 'dcf', 'valuation',
      'budget planning', 'cost analysis', 'roi', 'kpis',
      'financial reporting', 'compliance'
    ],
    experienceRequirements: [
      'Created financial models',
      'Analyzed financial performance',
      'Prepared budget forecasts',
      'Supported strategic decisions',
      'Improved financial processes'
    ],
    commonTools: [
      'excel', 'powerpoint', 'tableau', 'quickbooks',
      'sap', 'bloomberg', 'factset', 'sql'
    ]
  },
  {
    id: 'operations-manager',
    title: 'Operations Manager',
    category: 'Non-IT',
    description: 'Optimize business operations and processes',
    keySkills: [
      'process improvement', 'operations management', 'supply chain',
      'quality control', 'team leadership', 'project management',
      'cost optimization', 'vendor management', 'performance metrics'
    ],
    keywords: [
      'lean manufacturing', 'six sigma', 'process optimization',
      'supply chain management', 'inventory management', 'quality assurance',
      'operational efficiency', 'cost reduction', 'vendor relations'
    ],
    experienceRequirements: [
      'Managed daily operations',
      'Improved operational efficiency',
      'Led process improvement initiatives',
      'Managed vendor relationships',
      'Reduced operational costs'
    ],
    commonTools: [
      'excel', 'project management software', 'erp systems',
      'tableau', 'powerpoint', 'slack', 'microsoft office'
    ]
  }
];

export const getRolesByCategory = (category: 'IT' | 'Non-IT' | 'All') => {
  if (category === 'All') return roles;
  return roles.filter(role => role.category === category);
};

export const getRoleById = (id: string) => {
  return roles.find(role => role.id === id);
};