import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Clean existing records safely
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.attemptAnswer.deleteMany();
  await prisma.attempt.deleteMany();
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Default Badges
  const badgesData = [
    {
      name: 'First Step',
      description: 'Completed your very first quiz on the platform!',
      icon: '🏆',
      criteria: JSON.stringify({ type: 'FIRST_QUIZ' }),
    },
    {
      name: 'Quiz Master',
      description: 'Successfully completed 5 or more quizzes!',
      icon: '🎓',
      criteria: JSON.stringify({ type: 'COMPLETED_5' }),
    },
    {
      name: 'Sharpshooter',
      description: 'Achieved a perfect 100% score on a quiz!',
      icon: '🎯',
      criteria: JSON.stringify({ type: 'PERFECT_SCORE' }),
    },
    {
      name: 'On Fire',
      description: 'Maintained a 3-day consecutive quiz attempt streak!',
      icon: '🔥',
      criteria: JSON.stringify({ type: 'STREAK_3' }),
    },
    {
      name: 'Overachiever',
      description: 'Reached Player Level 5!',
      icon: '⚡',
      criteria: JSON.stringify({ type: 'LEVEL_5' }),
    },
  ];

  for (const b of badgesData) {
    await prisma.badge.create({ data: b });
  }

  // 3. Create Users
  const passwordHash = await bcrypt.hash('Admin123!', 10);
  const studentPasswordHash = await bcrypt.hash('Student123!', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Command Admin',
      email: 'admin@quizplatform.com',
      passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      xp: 2500,
      level: 7,
      streak: 5,
    },
  });

  const student = await prisma.user.create({
    data: {
      name: 'Alex Player',
      email: 'student@quizplatform.com',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      status: 'ACTIVE',
      xp: 450,
      level: 3,
      streak: 2,
    },
  });

  // Award First Step badge to student
  const firstBadge = await prisma.badge.findUnique({ where: { name: 'First Step' } });
  if (firstBadge) {
    await prisma.userBadge.create({
      data: {
        userId: student.id,
        badgeId: firstBadge.id,
      },
    });
  }

  // 4. Create Sample Quiz 1: Full-Stack Web Development
  const webQuiz = await prisma.quiz.create({
    data: {
      title: 'Full-Stack Web Development Masterclass',
      description: 'Test your core knowledge of modern JavaScript, React 18, Node.js, and CSS layout techniques!',
      category: 'Development',
      difficulty: 'MEDIUM',
      timeLimitSeconds: 300, // 5 minutes
      passingScore: 70,
      status: 'PUBLISHED',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      createdById: admin.id,
    },
  });

  // Question 1: Single Choice
  await prisma.question.create({
    data: {
      quizId: webQuiz.id,
      type: 'SINGLE_CHOICE',
      text: 'Which hook in React 18 is specifically designed for managing side effects like fetching data or subscribing to events?',
      points: 10,
      explanation: 'useEffect is the standard Hook for executing side-effects after DOM rendering.',
      order: 1,
      options: {
        create: [
          { text: 'useState', isCorrect: false },
          { text: 'useEffect', isCorrect: true },
          { text: 'useContext', isCorrect: false },
          { text: 'useReducer', isCorrect: false },
        ],
      },
    },
  });

  // Question 2: Multi Choice
  await prisma.question.create({
    data: {
      quizId: webQuiz.id,
      type: 'MULTI_CHOICE',
      text: 'Which of the following are valid CSS Flexbox container properties? (Select all that apply)',
      points: 15,
      explanation: 'justify-content and align-items are flex container alignment properties. grid-template-columns belongs to CSS Grid.',
      order: 2,
      options: {
        create: [
          { text: 'justify-content', isCorrect: true },
          { text: 'align-items', isCorrect: true },
          { text: 'grid-template-columns', isCorrect: false },
          { text: 'flex-direction', isCorrect: true },
        ],
      },
    },
  });

  // Question 3: True / False
  await prisma.question.create({
    data: {
      quizId: webQuiz.id,
      type: 'TRUE_FALSE',
      text: 'In Node.js Express middleware, calling `next()` passes control to the next middleware function in the stack.',
      points: 10,
      explanation: 'True. Calling `next()` releases the request handler execution to the subsequent middleware.',
      order: 3,
      options: {
        create: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
        ],
      },
    },
  });

  // 5. Create Sample Quiz 2: Cybersecurity & Hacking Essentials
  const secQuiz = await prisma.quiz.create({
    data: {
      title: 'Cybersecurity & Defense Essentials',
      description: 'Explore fundamental security concepts including CORS, JWT authentication, SQL injection, and encryption algorithms.',
      category: 'Security',
      difficulty: 'HARD',
      timeLimitSeconds: 180, // 3 minutes
      passingScore: 80,
      status: 'PUBLISHED',
      thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
      createdById: admin.id,
    },
  });

  await prisma.question.create({
    data: {
      quizId: secQuiz.id,
      type: 'SINGLE_CHOICE',
      text: 'What does JWT stand for in modern web applications?',
      points: 10,
      explanation: 'JWT stands for JSON Web Token, an open standard for securely transmitting information between parties as a JSON object.',
      order: 1,
      options: {
        create: [
          { text: 'Java Web Text', isCorrect: false },
          { text: 'JSON Web Token', isCorrect: true },
          { text: 'JS Work Tool', isCorrect: false },
          { text: 'Joint Wireless Transport', isCorrect: false },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      quizId: secQuiz.id,
      type: 'TRUE_FALSE',
      text: 'Prepared statements and parameterized queries prevent SQL Injection vulnerabilities.',
      points: 10,
      explanation: 'True! Parameterization separates SQL code from user-supplied parameters.',
      order: 2,
      options: {
        create: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
        ],
      },
    },
  });

  // 6. Create Sample Quiz 3: General Science Challenge
  const sciQuiz = await prisma.quiz.create({
    data: {
      title: 'Cosmic Science & Planetary Physics',
      description: 'Fun beginner-friendly quiz about space, gravity, and the chemical building blocks of nature!',
      category: 'Science',
      difficulty: 'EASY',
      timeLimitSeconds: 240, // 4 minutes
      passingScore: 60,
      status: 'PUBLISHED',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
      createdById: admin.id,
    },
  });

  await prisma.question.create({
    data: {
      quizId: sciQuiz.id,
      type: 'SINGLE_CHOICE',
      text: 'What planet in our solar system is known as the Red Planet?',
      points: 10,
      explanation: 'Mars appears red due to iron oxide (rust) on its surface.',
      order: 1,
      options: {
        create: [
          { text: 'Venus', isCorrect: false },
          { text: 'Jupiter', isCorrect: false },
          { text: 'Mars', isCorrect: true },
          { text: 'Saturn', isCorrect: false },
        ],
      },
    },
  });

  // Seed sample completed attempt for Student on Science Quiz
  const sampleAttempt = await prisma.attempt.create({
    data: {
      quizId: sciQuiz.id,
      userId: student.id,
      startedAt: new Date(Date.now() - 120000),
      submittedAt: new Date(),
      score: 10,
      totalPoints: 10,
      percentage: 100,
      passed: true,
      xpEarned: 220,
      status: 'COMPLETED',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('🔑 Demo Logins:');
  console.log('  Admin:   admin@quizplatform.com / Admin123!');
  console.log('  Student: student@quizplatform.com / Student123!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
