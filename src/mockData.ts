import type { Student, Project, Submission, AdminUser } from './types';

export const mockAdmin: AdminUser = {
  id: 'admin-1',
  name: 'Sarah Anderson',
  email: 'sarah.anderson@techcorp.com',
  company: 'TechCorp Industries',
  role: 'Senior Recruiter',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
};

export const mockStudents: Student[] = [
  {
    id: 'student-1',
    name: 'Alex Chen',
    email: 'alex.chen@university.edu',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    skills: [
      { name: 'React', score: 92 },
      { name: 'TypeScript', score: 88 },
      { name: 'Node.js', score: 85 },
      { name: 'Python', score: 78 },
      { name: 'SQL', score: 82 }
    ],
    bio: 'Full-stack developer passionate about building scalable web applications',
    location: 'San Francisco, CA',
    education: 'BS Computer Science - Stanford University',
    experience: '2 years internship experience'
  },
  {
    id: 'student-2',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@university.edu',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    skills: [
      { name: 'Python', score: 95 },
      { name: 'Machine Learning', score: 90 },
      { name: 'TensorFlow', score: 87 },
      { name: 'SQL', score: 85 },
      { name: 'R', score: 80 }
    ],
    bio: 'Data scientist specializing in machine learning and AI solutions',
    location: 'Austin, TX',
    education: 'MS Data Science - MIT',
    experience: '3 years research experience'
  },
  {
    id: 'student-3',
    name: 'James Kim',
    email: 'james.kim@university.edu',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    skills: [
      { name: 'Java', score: 90 },
      { name: 'Spring Boot', score: 88 },
      { name: 'Microservices', score: 85 },
      { name: 'Docker', score: 83 },
      { name: 'Kubernetes', score: 80 }
    ],
    bio: 'Backend engineer focused on cloud-native applications',
    location: 'Seattle, WA',
    education: 'BS Software Engineering - University of Washington',
    experience: '1.5 years internship experience'
  },
  {
    id: 'student-4',
    name: 'Emily Johnson',
    email: 'emily.johnson@university.edu',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    skills: [
      { name: 'React', score: 94 },
      { name: 'TypeScript', score: 91 },
      { name: 'CSS', score: 93 },
      { name: 'UI/UX Design', score: 89 },
      { name: 'Figma', score: 87 }
    ],
    bio: 'Frontend developer with strong design sensibility',
    location: 'New York, NY',
    education: 'BS Digital Media - NYU',
    experience: '2.5 years freelance experience'
  },
  {
    id: 'student-5',
    name: 'Raj Patel',
    email: 'raj.patel@university.edu',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    skills: [
      { name: 'Python', score: 89 },
      { name: 'Django', score: 86 },
      { name: 'PostgreSQL', score: 88 },
      { name: 'AWS', score: 84 },
      { name: 'Redis', score: 81 }
    ],
    bio: 'Backend developer with expertise in scalable systems',
    location: 'Boston, MA',
    education: 'MS Computer Science - Harvard University',
    experience: '2 years startup experience'
  },
  {
    id: 'student-6',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@university.edu',
    avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400',
    skills: [
      { name: 'React', score: 87 },
      { name: 'Node.js', score: 90 },
      { name: 'TypeScript', score: 85 },
      { name: 'MongoDB', score: 82 },
      { name: 'GraphQL', score: 79 }
    ],
    bio: 'Full-stack engineer passionate about clean code and best practices',
    location: 'Chicago, IL',
    education: 'BS Computer Engineering - Northwestern University',
    experience: '1 year internship experience'
  }
];

export const mockProjects: Project[] = [
  {
    id: 'project-1',
    title: 'E-commerce Platform Dashboard',
    description: 'Build a comprehensive dashboard for an e-commerce platform with real-time analytics, inventory management, and order tracking.',
    difficulty: 'Hard',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'SQL'],
    testCases: [
      'Dashboard loads within 2 seconds',
      'Real-time updates work correctly',
      'All CRUD operations function properly',
      'Responsive design works on mobile devices'
    ],
    constraints: [
      'Must use React 18+',
      'TypeScript strict mode required',
      'Maximum bundle size: 500KB',
      'Support for latest 2 browser versions'
    ],
    evaluationCriteria: [
      'Code quality and organization',
      'UI/UX design and responsiveness',
      'Performance optimization',
      'Test coverage',
      'Documentation quality'
    ],
    publishedDate: new Date('2024-01-15'),
    responses: 45,
    monthlyAcceptanceRate: 68,
    monthlyResponses: [12, 15, 18, 22, 28, 35, 42, 45],
  },
  {
    id: 'project-2',
    title: 'Machine Learning Model Deployment',
    description: 'Deploy a trained ML model as a REST API with monitoring and logging capabilities.',
    difficulty: 'Medium',
    requiredSkills: ['Python', 'Machine Learning', 'Docker'],
    testCases: [
      'API responds within 200ms',
      'Model predictions are accurate',
      'Error handling works correctly',
      'Logging captures all requests'
    ],
    constraints: [
      'Must use Python 3.10+',
      'Docker container size < 1GB',
      'API must handle 100 req/sec',
      'Must include health check endpoint'
    ],
    evaluationCriteria: [
      'API design and documentation',
      'Model performance',
      'Error handling',
      'Monitoring implementation',
      'Code maintainability'
    ],
    publishedDate: new Date('2024-01-20'),
    responses: 32,
    monthlyAcceptanceRate: 72,
    monthlyResponses: [8, 12, 16, 20, 24, 28, 30, 32],
  },
  {
    id: 'project-3',
    title: 'Mobile App UI Components',
    description: 'Create a reusable component library for React Native applications with comprehensive documentation.',
    difficulty: 'Easy',
    requiredSkills: ['React', 'TypeScript', 'CSS'],
    testCases: [
      'All components render correctly',
      'Props are properly typed',
      'Components are accessible',
      'Storybook documentation is complete'
    ],
    constraints: [
      'Must support both iOS and Android',
      'TypeScript required',
      'Include unit tests',
      'Follow design system guidelines'
    ],
    evaluationCriteria: [
      'Component reusability',
      'Code documentation',
      'Test coverage',
      'Design consistency',
      'Performance'
    ],
    publishedDate: new Date('2024-01-25'),
    responses: 58,
    monthlyAcceptanceRate: 81,
    monthlyResponses: [15, 22, 28, 35, 42, 48, 53, 58],
  },
  {
    id: 'project-4',
    title: 'Microservices Architecture Implementation',
    description: 'Design and implement a microservices-based system for a hotel booking platform.',
    difficulty: 'Hard',
    requiredSkills: ['Java', 'Spring Boot', 'Docker', 'Kubernetes'],
    testCases: [
      'All services communicate properly',
      'Service discovery works',
      'Load balancing functions correctly',
      'Circuit breaker pattern implemented'
    ],
    constraints: [
      'Must use Spring Boot 3+',
      'Include API gateway',
      'Implement service mesh',
      'Use container orchestration'
    ],
    evaluationCriteria: [
      'Architecture design',
      'Service communication',
      'Scalability',
      'Fault tolerance',
      'Documentation'
    ],
    publishedDate: new Date('2024-02-01'),
    responses: 28,
    monthlyAcceptanceRate: 64,
    monthlyResponses: [5, 8, 12, 15, 18, 22, 25, 28],
  }
];

export const mockSubmissions: Submission[] = [
  {
    id: 'sub-1',
    studentId: 'student-1',
    student: mockStudents[0],
    projectId: 'project-1',
    projectTitle: 'E-commerce Platform Dashboard',
    submittedDate: new Date('2024-02-02'),
    status: 'pending',
    content: 'Completed implementation with React 18, TypeScript, and real-time updates using WebSockets.',
    score: 88
  },
  {
    id: 'sub-2',
    studentId: 'student-2',
    student: mockStudents[1],
    projectId: 'project-2',
    projectTitle: 'Machine Learning Model Deployment',
    submittedDate: new Date('2024-02-01'),
    status: 'pending',
    content: 'Deployed using FastAPI with Docker containerization and Prometheus monitoring.',
    score: 92
  },
  {
    id: 'sub-3',
    studentId: 'student-4',
    student: mockStudents[3],
    projectId: 'project-3',
    projectTitle: 'Mobile App UI Components',
    submittedDate: new Date('2024-02-03'),
    status: 'pending',
    content: 'Created 15+ reusable components with full TypeScript support and Storybook documentation.',
    score: 95
  },
  {
    id: 'sub-4',
    studentId: 'student-3',
    student: mockStudents[2],
    projectId: 'project-4',
    projectTitle: 'Microservices Architecture Implementation',
    submittedDate: new Date('2024-01-31'),
    status: 'pending',
    content: 'Implemented 5 microservices with Spring Boot, Docker, and Kubernetes orchestration.',
    score: 85
  },
  {
    id: 'sub-5',
    studentId: 'student-5',
    student: mockStudents[4],
    projectId: 'project-1',
    projectTitle: 'E-commerce Platform Dashboard',
    submittedDate: new Date('2024-02-02'),
    status: 'pending',
    content: 'Built with Django backend and React frontend, includes real-time inventory tracking.',
    score: 82
  }
];

export let savedProfiles: Set<string> = new Set(['student-2', 'student-4']);
