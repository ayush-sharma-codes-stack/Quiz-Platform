import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export async function ensureDatabaseSeeded() {
  try {
    const quizCount = await prisma.quiz.count();
    if (quizCount > 0) return;

    console.log("?? Auto-seeding initial quizzes and data...");

    // 1. Create Badges
    const badgesData = [
      { name: "First Step", description: "Completed your very first quiz!", icon: "??", criteria: JSON.stringify({ type: "FIRST_QUIZ" }) },
      { name: "Quiz Master", description: "Completed 5 or more quizzes!", icon: "??", criteria: JSON.stringify({ type: "COMPLETED_5" }) },
      { name: "Sharpshooter", description: "Achieved 100% score on a quiz!", icon: "??", criteria: JSON.stringify({ type: "PERFECT_SCORE" }) },
      { name: "On Fire", description: "Maintained a 3-day streak!", icon: "??", criteria: JSON.stringify({ type: "STREAK_3" }) },
      { name: "Overachiever", description: "Reached Level 5!", icon: "?", criteria: JSON.stringify({ type: "LEVEL_5" }) },
    ];

    for (const b of badgesData) {
      await prisma.badge.upsert({
        where: { name: b.name },
        update: {},
        create: b,
      });
    }

    // 2. Create Default Admin & Student Users
    const passwordHash = await bcrypt.hash("Admin123!", 10);
    const studentPasswordHash = await bcrypt.hash("Student123!", 10);

    const admin = await prisma.user.upsert({
      where: { email: "admin@quizplatform.com" },
      update: {},
      create: {
        name: "Command Admin",
        email: "admin@quizplatform.com",
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
        xp: 2500,
        level: 7,
        streak: 5,
      },
    });

    await prisma.user.upsert({
      where: { email: "student@quizplatform.com" },
      update: {},
      create: {
        name: "Alex Player",
        email: "student@quizplatform.com",
        passwordHash: studentPasswordHash,
        role: "STUDENT",
        status: "ACTIVE",
        xp: 450,
        level: 3,
        streak: 2,
      },
    });

    // 3. Quiz 1: Full-Stack Web Development
    const webQuiz = await prisma.quiz.create({
      data: {
        title: "Full-Stack Web Development Masterclass",
        description: "Test your core knowledge of modern JavaScript, React 18, Node.js, and CSS Flexbox!",
        category: "Development",
        difficulty: "MEDIUM",
        timeLimitSeconds: 300,
        passingScore: 70,
        status: "PUBLISHED",
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
        createdById: admin.id,
      },
    });

    await prisma.question.create({
      data: {
        quizId: webQuiz.id,
        type: "SINGLE_CHOICE",
        text: "Which hook in React 18 is specifically designed for managing side effects like data fetching?",
        points: 10,
        explanation: "useEffect is the standard Hook for executing side-effects after DOM rendering.",
        order: 1,
        options: {
          create: [
            { text: "useState", isCorrect: false },
            { text: "useEffect", isCorrect: true },
            { text: "useContext", isCorrect: false },
            { text: "useReducer", isCorrect: false },
          ],
        },
      },
    });

    await prisma.question.create({
      data: {
        quizId: webQuiz.id,
        type: "MULTI_CHOICE",
        text: "Which of the following are valid CSS Flexbox container properties?",
        points: 15,
        explanation: "justify-content and align-items are flex alignment properties.",
        order: 2,
        options: {
          create: [
            { text: "justify-content", isCorrect: true },
            { text: "align-items", isCorrect: true },
            { text: "grid-template-columns", isCorrect: false },
            { text: "flex-direction", isCorrect: true },
          ],
        },
      },
    });

    await prisma.question.create({
      data: {
        quizId: webQuiz.id,
        type: "TRUE_FALSE",
        text: "In Node.js Express, calling next() passes control to the next middleware function.",
        points: 10,
        explanation: "True. next() releases control to the subsequent middleware handler.",
        order: 3,
        options: {
          create: [
            { text: "True", isCorrect: true },
            { text: "False", isCorrect: false },
          ],
        },
      },
    });

    // 4. Quiz 2: Cybersecurity & Defense Essentials
    const secQuiz = await prisma.quiz.create({
      data: {
        title: "Cybersecurity & Defense Essentials",
        description: "Explore fundamental security concepts including CORS, JWT authentication, and SQL injection prevention.",
        category: "Security",
        difficulty: "HARD",
        timeLimitSeconds: 180,
        passingScore: 80,
        status: "PUBLISHED",
        thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80",
        createdById: admin.id,
      },
    });

    await prisma.question.create({
      data: {
        quizId: secQuiz.id,
        type: "SINGLE_CHOICE",
        text: "What does JWT stand for in modern web authentication?",
        points: 10,
        explanation: "JWT stands for JSON Web Token.",
        order: 1,
        options: {
          create: [
            { text: "Java Web Text", isCorrect: false },
            { text: "JSON Web Token", isCorrect: true },
            { text: "JS Work Tool", isCorrect: false },
            { text: "Joint Wireless Transport", isCorrect: false },
          ],
        },
      },
    });

    await prisma.question.create({
      data: {
        quizId: secQuiz.id,
        type: "TRUE_FALSE",
        text: "Prepared statements and parameterized queries prevent SQL Injection vulnerabilities.",
        points: 10,
        explanation: "True! Parameterization separates SQL commands from untrusted inputs.",
        order: 2,
        options: {
          create: [
            { text: "True", isCorrect: true },
            { text: "False", isCorrect: false },
          ],
        },
      },
    });

    // 5. Quiz 3: General Science Challenge
    const sciQuiz = await prisma.quiz.create({
      data: {
        title: "Cosmic Science & Planetary Physics",
        description: "Fun beginner-friendly quiz about space, planets, and physical laws of nature!",
        category: "Science",
        difficulty: "EASY",
        timeLimitSeconds: 240,
        passingScore: 60,
        status: "PUBLISHED",
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
        createdById: admin.id,
      },
    });

    await prisma.question.create({
      data: {
        quizId: sciQuiz.id,
        type: "SINGLE_CHOICE",
        text: "Which planet in our solar system is famously known as the Red Planet?",
        points: 10,
        explanation: "Mars appears red due to iron oxide on its surface.",
        order: 1,
        options: {
          create: [
            { text: "Venus", isCorrect: false },
            { text: "Jupiter", isCorrect: false },
            { text: "Mars", isCorrect: true },
            { text: "Saturn", isCorrect: false },
          ],
        },
      },
    });

    console.log("? Auto-seeding completed successfully!");
  } catch (err) {
    console.error("?? Auto-seed error:", err);
  }
}

