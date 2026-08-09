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
      description: 'Deep-dive into space science, gravity, planetary physics, black holes, and the laws that govern our cosmos!',
      category: 'Science',
      difficulty: 'EASY',
      timeLimitSeconds: 600, // 10 minutes
      passingScore: 60,
      status: 'PUBLISHED',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
      createdById: admin.id,
    },
  });

  const scienceQuestions = [
    {
      type: 'SINGLE_CHOICE',
      text: 'What planet in our solar system is known as the Red Planet?',
      points: 10,
      explanation: 'Mars appears red due to iron oxide (rust) on its surface.',
      order: 1,
      options: [
        { text: 'Venus', isCorrect: false },
        { text: 'Jupiter', isCorrect: false },
        { text: 'Mars', isCorrect: true },
        { text: 'Saturn', isCorrect: false },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'Which force keeps planets in orbit around the Sun?',
      points: 10,
      explanation: 'Gravity is the fundamental force that keeps all planets in elliptical orbits around the Sun.',
      order: 2,
      options: [
        { text: 'Electromagnetism', isCorrect: false },
        { text: 'Gravity', isCorrect: true },
        { text: 'Nuclear Force', isCorrect: false },
        { text: 'Centrifugal Force', isCorrect: false },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'What is the approximate age of the Universe according to current scientific consensus?',
      points: 10,
      explanation: 'The Universe is approximately 13.8 billion years old, based on cosmic microwave background radiation.',
      order: 3,
      options: [
        { text: '4.5 billion years', isCorrect: false },
        { text: '13.8 billion years', isCorrect: true },
        { text: '6 billion years', isCorrect: false },
        { text: '20 billion years', isCorrect: false },
      ],
    },
    {
      type: 'TRUE_FALSE',
      text: 'The speed of light in a vacuum is approximately 299,792 kilometres per second.',
      points: 10,
      explanation: 'True. The speed of light (c) is exactly 299,792,458 metres per second.',
      order: 4,
      options: [
        { text: 'True', isCorrect: true },
        { text: 'False', isCorrect: false },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'What is the largest planet in our Solar System?',
      points: 10,
      explanation: 'Jupiter is the largest planet with a mass more than twice that of all other planets combined.',
      order: 5,
      options: [
        { text: 'Saturn', isCorrect: false },
        { text: 'Neptune', isCorrect: false },
        { text: 'Jupiter', isCorrect: true },
        { text: 'Uranus', isCorrect: false },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'What is the event horizon of a black hole?',
      points: 15,
      explanation: 'The event horizon is the boundary around a black hole beyond which nothing — not even light — can escape.',
      order: 6,
      options: [
        { text: 'The bright ring of gas around a black hole', isCorrect: false },
        { text: 'The point of zero gravity inside a black hole', isCorrect: false },
        { text: 'The boundary beyond which nothing can escape', isCorrect: true },
        { text: 'The centre of mass of a black hole', isCorrect: false },
      ],
    },
    {
      type: 'MULTI_CHOICE',
      text: 'Which of the following are classified as terrestrial (rocky) planets in our Solar System? (Select all that apply)',
      points: 15,
      explanation: 'Mercury, Venus, Earth, and Mars are terrestrial planets composed of rock and metal.',
      order: 7,
      options: [
        { text: 'Mercury', isCorrect: true },
        { text: 'Jupiter', isCorrect: false },
        { text: 'Mars', isCorrect: true },
        { text: 'Earth', isCorrect: true },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'What phenomenon causes the tides on Earth?',
      points: 10,
      explanation: 'The gravitational pull of the Moon causes Earth\'s oceans to bulge, creating tides.',
      order: 8,
      options: [
        { text: 'Earth\'s rotation alone', isCorrect: false },
        { text: 'Gravitational pull of the Moon', isCorrect: true },
        { text: 'Solar wind pressure', isCorrect: false },
        { text: 'Earth\'s magnetic field', isCorrect: false },
      ],
    },
    {
      type: 'TRUE_FALSE',
      text: 'A light-year is a measure of time, not distance.',
      points: 10,
      explanation: 'False. A light-year is the distance light travels in one year.',
      order: 9,
      options: [
        { text: 'True', isCorrect: false },
        { text: 'False', isCorrect: true },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'What is the name of the galaxy that contains our Solar System?',
      points: 10,
      explanation: 'Our Solar System is located in the Milky Way galaxy.',
      order: 10,
      options: [
        { text: 'Andromeda', isCorrect: false },
        { text: 'Triangulum', isCorrect: false },
        { text: 'Milky Way', isCorrect: true },
        { text: 'Whirlpool', isCorrect: false },
      ],
    },
  ];

  for (const q of scienceQuestions) {
    await prisma.question.create({
      data: {
        quizId: sciQuiz.id,
        type: q.type,
        text: q.text,
        points: q.points,
        explanation: q.explanation,
        order: q.order,
        options: { create: q.options },
      },
    });
  }

  // 7. Create Sample Quiz 4: Mysterious Section
  const mysteryQuiz = await prisma.quiz.create({
    data: {
      title: 'Mysteries of the Universe & Beyond',
      description: 'Explore the greatest unsolved mysteries of science — dark matter, the Fermi Paradox, consciousness, and unexplained cosmic phenomena!',
      category: 'Mysterious',
      difficulty: 'MEDIUM',
      timeLimitSeconds: 480,
      passingScore: 65,
      status: 'PUBLISHED',
      thumbnail: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=600&auto=format&fit=crop&q=80',
      createdById: admin.id,
    },
  });

  const mysteryQuestions = [
    {
      type: 'SINGLE_CHOICE',
      text: 'What is "Dark Matter" in cosmology?',
      points: 10,
      explanation: 'Dark matter is an invisible, undetected substance that makes up about 27% of the Universe.',
      order: 1,
      options: [
        { text: 'Black holes that absorb all light', isCorrect: false },
        { text: 'An undetected substance with gravitational effects', isCorrect: true },
        { text: 'The dark side of a planet away from the Sun', isCorrect: false },
        { text: 'Interstellar gas clouds', isCorrect: false },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'What is the "Fermi Paradox"?',
      points: 10,
      explanation: 'The Fermi Paradox is the contradiction between high likelihood of alien life and zero evidence of it.',
      order: 2,
      options: [
        { text: 'A paradox about the speed of light', isCorrect: false },
        { text: 'Why nuclear fusion hasn\'t been solved yet', isCorrect: false },
        { text: 'The contradiction between likely alien life and zero evidence of it', isCorrect: true },
        { text: 'A paradox about time travel', isCorrect: false },
      ],
    },
    {
      type: 'TRUE_FALSE',
      text: 'Scientists have fully explained what triggers consciousness in the human brain.',
      points: 10,
      explanation: 'False. Consciousness remains one of the greatest unsolved mysteries in neuroscience.',
      order: 3,
      options: [
        { text: 'True', isCorrect: false },
        { text: 'False', isCorrect: true },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'The Wow! Signal detected in 1977 is mysterious because:',
      points: 15,
      explanation: 'It was a strong radio signal matching extraterrestrial origin traits that was never detected again.',
      order: 4,
      options: [
        { text: 'It came from inside Earth\'s atmosphere', isCorrect: false },
        { text: 'It was a strong signal from space that was never detected again', isCorrect: true },
        { text: 'It was transmitted by a satellite', isCorrect: false },
        { text: 'It caused equipment worldwide to fail', isCorrect: false },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'What is "Dark Energy" believed to be responsible for?',
      points: 10,
      explanation: 'Dark energy is thought to be driving the accelerating expansion of the Universe.',
      order: 5,
      options: [
        { text: 'Pulling galaxies together through gravity', isCorrect: false },
        { text: 'Creating black holes', isCorrect: false },
        { text: 'The accelerating expansion of the Universe', isCorrect: true },
        { text: 'Generating cosmic radiation', isCorrect: false },
      ],
    },
    {
      type: 'MULTI_CHOICE',
      text: 'Which of the following are considered genuine scientific mysteries that remain unsolved? (Select all that apply)',
      points: 15,
      explanation: 'Dark matter, the origin of life, and what triggered the Big Bang are unsolved scientific mysteries.',
      order: 6,
      options: [
        { text: 'The nature of dark matter', isCorrect: true },
        { text: 'How Newton\'s laws of motion work', isCorrect: false },
        { text: 'The origin of life on Earth', isCorrect: true },
        { text: 'What triggered the Big Bang', isCorrect: true },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'What is the "Great Attractor" in astronomy?',
      points: 15,
      explanation: 'The Great Attractor is a massive gravitational anomaly pulling thousands of galaxies toward it.',
      order: 7,
      options: [
        { text: 'The largest known star in the universe', isCorrect: false },
        { text: 'A gravitational anomaly pulling thousands of galaxies toward it', isCorrect: true },
        { text: 'The supermassive black hole in the Milky Way', isCorrect: false },
        { text: 'A region of the universe with no stars', isCorrect: false },
      ],
    },
    {
      type: 'TRUE_FALSE',
      text: 'The Bermuda Triangle has been proven to have a higher rate of disappearances than other ocean regions.',
      points: 10,
      explanation: 'False. Coast Guard data shows no unusual disappearance rate compared to other ocean regions.',
      order: 8,
      options: [
        { text: 'True', isCorrect: false },
        { text: 'False', isCorrect: true },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'What is the "Observer Effect" in quantum mechanics?',
      points: 15,
      explanation: 'Particles behave differently when observed vs unobserved in quantum mechanics.',
      order: 9,
      options: [
        { text: 'Observation has no effect on quantum particles', isCorrect: false },
        { text: 'Particles behave differently when observed vs unobserved', isCorrect: true },
        { text: 'Only human observers affect quantum experiments', isCorrect: false },
        { text: 'The universe expands faster when observed', isCorrect: false },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'The Voynich Manuscript is mysterious because:',
      points: 10,
      explanation: 'It is written in an unknown, undeciphered script that has baffled cryptographers for decades.',
      order: 10,
      options: [
        { text: 'It was written by Leonardo da Vinci in code', isCorrect: false },
        { text: 'It contains alien star maps', isCorrect: false },
        { text: 'It is written in an undeciphered script that no one can read', isCorrect: true },
        { text: 'It predicts future events', isCorrect: false },
      ],
    },
  ];

  for (const q of mysteryQuestions) {
    await prisma.question.create({
      data: {
        quizId: mysteryQuiz.id,
        type: q.type,
        text: q.text,
        points: q.points,
        explanation: q.explanation,
        order: q.order,
        options: { create: q.options },
      },
    });
  }

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
