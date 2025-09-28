export interface Course {
  id: string;
  title: string;
  description: string;
  slug: string;
  instructor: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
  };
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: number; // in minutes
  price: number;
  currency: string;
  status: "draft" | "published" | "archived";
  thumbnail?: string;
  tags: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  modules: CourseModule[];
  enrollment: {
    total: number;
    active: number;
    completed: number;
  };
  rating: {
    average: number;
    count: number;
  };
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: CourseLesson[];
  isPublished: boolean;
}

export interface CourseLesson {
  id: string;
  title: string;
  description: string;
  type: "video" | "text" | "quiz" | "assignment" | "live";
  content: LessonContent;
  duration: number; // in minutes
  order: number;
  isPublished: boolean;
  isFree: boolean;
}

export interface LessonContent {
  video?: {
    url: string;
    duration: number;
    thumbnail?: string;
    captions?: string;
  };
  text?: {
    content: string;
    format: "markdown" | "html";
  };
  quiz?: {
    questions: QuizQuestion[];
    passingScore: number;
    attempts: number;
    timeLimit?: number;
  };
  assignment?: {
    description: string;
    instructions: string;
    dueDate?: Date;
    maxScore: number;
  };
  live?: {
    scheduledAt: Date;
    duration: number;
    meetingUrl?: string;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false" | "short-answer" | "essay";
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
  status: "enrolled" | "in-progress" | "completed" | "dropped";
  enrolledAt: Date;
  completedAt?: Date;
  progress: {
    completedLessons: string[];
    currentModule: string;
    currentLesson: string;
    percentage: number;
  };
  certificate?: {
    id: string;
    issuedAt: Date;
    url: string;
  };
}

export interface Certificate {
  id: string;
  courseId: string;
  studentId: string;
  courseName: string;
  studentName: string;
  completedAt: Date;
  issuedAt: Date;
  url: string;
  verificationCode: string;
}

export class CourseService {
  async createCourse(
    title: string,
    description: string,
    instructor: Course["instructor"],
    tenantId: string,
    options: {
      category?: string;
      level?: Course["level"];
      price?: number;
      currency?: string;
      tags?: string[];
      prerequisites?: string[];
      learningOutcomes?: string[];
    } = {}
  ): Promise<Course> {
    const slug = await this.generateSlug(title);

    return {
      id: `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      slug,
      instructor,
      category: options.category || "General",
      level: options.level || "beginner",
      duration: 0,
      price: options.price || 0,
      currency: options.currency || "USD",
      status: "draft",
      tags: options.tags || [],
      prerequisites: options.prerequisites || [],
      learningOutcomes: options.learningOutcomes || [],
      modules: [],
      enrollment: {
        total: 0,
        active: 0,
        completed: 0,
      },
      rating: {
        average: 0,
        count: 0,
      },
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async createCourseModule(
    courseId: string,
    title: string,
    description: string,
    order: number
  ): Promise<CourseModule> {
    return {
      id: `module_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      order,
      lessons: [],
      isPublished: false,
    };
  }

  async createCourseLesson(
    moduleId: string,
    title: string,
    description: string,
    type: CourseLesson["type"],
    content: LessonContent,
    order: number,
    options: {
      duration?: number;
      isFree?: boolean;
    } = {}
  ): Promise<CourseLesson> {
    return {
      id: `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      type,
      content,
      duration: options.duration || 0,
      order,
      isPublished: false,
      isFree: options.isFree || false,
    };
  }

  async enrollStudent(
    courseId: string,
    studentId: string
  ): Promise<Enrollment> {
    return {
      id: `enrollment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      courseId,
      studentId,
      status: "enrolled",
      enrolledAt: new Date(),
      progress: {
        completedLessons: [],
        currentModule: "",
        currentLesson: "",
        percentage: 0,
      },
    };
  }

  async updateProgress(
    enrollment: Enrollment,
    lessonId: string,
    completed: boolean
  ): Promise<Enrollment> {
    if (completed && !enrollment.progress.completedLessons.includes(lessonId)) {
      enrollment.progress.completedLessons.push(lessonId);
    }

    // Calculate progress percentage
    // This would need to be calculated based on total lessons in the course
    enrollment.progress.percentage = Math.round(
      (enrollment.progress.completedLessons.length / 10) * 100
    );

    if (enrollment.progress.percentage === 100) {
      enrollment.status = "completed";
      enrollment.completedAt = new Date();
    }

    return enrollment;
  }

  async generateCertificate(
    enrollment: Enrollment,
    course: Course,
    studentName: string
  ): Promise<Certificate> {
    const verificationCode = await this.generateVerificationCode();

    return {
      id: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      courseId: enrollment.courseId,
      studentId: enrollment.studentId,
      courseName: course.title,
      studentName,
      completedAt: enrollment.completedAt!,
      issuedAt: new Date(),
      url: `https://certificates.rockket.dev/${verificationCode}`,
      verificationCode,
    };
  }

  async calculateCourseDuration(course: Course): Promise<number> {
    return course.modules.reduce((total, module) => {
      return (
        total +
        module.lessons.reduce((moduleTotal, lesson) => {
          return moduleTotal + lesson.duration;
        }, 0)
      );
    }, 0);
  }

  async publishCourse(course: Course): Promise<Course> {
    course.status = "published";
    course.updatedAt = new Date();
    return course;
  }

  async archiveCourse(course: Course): Promise<Course> {
    course.status = "archived";
    course.updatedAt = new Date();
    return course;
  }

  private async generateSlug(text: string): Promise<string> {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  private async generateVerificationCode(): Promise<string> {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
