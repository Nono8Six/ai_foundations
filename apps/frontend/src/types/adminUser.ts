export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'student';
  status: string;
  registrationDate: string;
  lastActivity: string;
  courseProgress: number;
  totalCourses: number;
  completedCourses: number;
  xpPoints: number;
  level: number;
  streak: number;
  achievements: number;
  location: string;
  phone: string;
  notes: string;
  enrolledCourses: string[];
}
