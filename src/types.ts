export interface Skill {
  name: string;
  score: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  skills: Skill[];
  bio: string;
  location: string;
  education: string;
  experience: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  requiredSkills: string[];
  testCases: string[];
  constraints: string[];
  evaluationCriteria: string[];
  publishedDate: Date;
  responses: number;
  monthlyAcceptanceRate: number;
  monthlyResponses: number[];
}

export interface Submission {
  id: string;
  studentId: string;
  student: Student;
  projectId: string;
  projectTitle: string;
  submittedDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  content: string;
  score?: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  avatar?: string;
}
