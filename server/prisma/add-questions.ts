import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Adding new questions...');

  // ─── Find admin user ───────────────────────────────────────────────────────
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) throw new Error('No admin user found. Run seed.ts first.');

  // ──────────────────────────────────────────────────────────────────────────
  // 1. ADD MORE QUESTIONS TO "Cosmic Science & Planetary Physics"
  // ──────────────────────────────────────────────────────────────────────────
  const sciQuiz = await prisma.quiz.findFirst({
    where: { title: { contains: 'Cosmic Science' } },
    include: { questions: true },
  });

  if (sciQuiz) {
    const currentMax = sciQuiz.questions.reduce((max, q) => Math.max(max, q.order), 0);
    console.log(`📡 Found "${sciQuiz.title}" — currently ${sciQuiz.questions.length} question(s). Adding 9 more...`);

    // Update time limit to accommodate more questions
    await prisma.quiz.update({
      where: { id: sciQuiz.id },
      data: { timeLimitSeconds: 600, description: 'Deep-dive into space science, gravity, planetary physics, black holes, and the laws that govern our cosmos!' },
    });

    const newScienceQuestions = [
      {
        type: 'SINGLE_CHOICE',
        text: 'Which force keeps planets in orbit around the Sun?',
        points: 10,
        explanation: 'Gravity is the fundamental force that keeps all planets in elliptical orbits around the Sun.',
        order: currentMax + 1,
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
        explanation: 'The Universe is approximately 13.8 billion years old, based on measurements of the cosmic microwave background radiation.',
        order: currentMax + 2,
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
        explanation: 'True. The speed of light (c) is exactly 299,792,458 metres per second — the universal speed limit.',
        order: currentMax + 3,
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
        order: currentMax + 4,
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
        explanation: 'The event horizon is the boundary around a black hole beyond which nothing — not even light — can escape its gravitational pull.',
        order: currentMax + 5,
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
        explanation: 'Mercury, Venus, Earth, and Mars are the four terrestrial planets — composed primarily of rock and metal.',
        order: currentMax + 6,
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
        explanation: 'The gravitational pull of the Moon (and to a lesser extent the Sun) causes Earth\'s oceans to bulge, creating tides.',
        order: currentMax + 7,
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
        explanation: 'False. A light-year is the distance light travels in one year — approximately 9.461 trillion kilometres.',
        order: currentMax + 8,
        options: [
          { text: 'True', isCorrect: false },
          { text: 'False', isCorrect: true },
        ],
      },
      {
        type: 'SINGLE_CHOICE',
        text: 'What is the name of the galaxy that contains our Solar System?',
        points: 10,
        explanation: 'Our Solar System is located in the Milky Way galaxy, a barred spiral galaxy approximately 100,000 light-years in diameter.',
        order: currentMax + 9,
        options: [
          { text: 'Andromeda', isCorrect: false },
          { text: 'Triangulum', isCorrect: false },
          { text: 'Milky Way', isCorrect: true },
          { text: 'Whirlpool', isCorrect: false },
        ],
      },
    ];

    for (const q of newScienceQuestions) {
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

    console.log(`✅ Added 9 new questions to "${sciQuiz.title}"`);
  } else {
    console.log('⚠️  Cosmic Science quiz not found — skipping question additions.');
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 2. CREATE NEW QUIZ: Mysteries of the Universe & Beyond
  // ──────────────────────────────────────────────────────────────────────────
  const existingMystery = await prisma.quiz.findFirst({
    where: { title: { contains: 'Mysteries' } },
  });

  if (existingMystery) {
    console.log('⚠️  Mysteries quiz already exists — skipping creation.');
  } else {
    console.log('🔮 Creating new "Mysteries of the Universe & Beyond" quiz...');

    const mysteryQuiz = await prisma.quiz.create({
      data: {
        title: 'Mysteries of the Universe & Beyond',
        description: 'Explore the greatest unsolved mysteries of science — dark matter, the Fermi Paradox, consciousness, and the unexplained phenomena that baffle the world\'s greatest minds!',
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
        explanation: 'Dark matter is an invisible, undetected substance that makes up about 27% of the Universe. It doesn\'t interact with light but exerts gravitational effects on visible matter.',
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
        explanation: 'The Fermi Paradox is the contradiction between the high probability of extraterrestrial civilizations existing and the complete lack of evidence or contact with them.',
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
        explanation: 'False. Consciousness remains one of the greatest unsolved mysteries in neuroscience. The "hard problem of consciousness" — why subjective experience exists — is still unexplained.',
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
        explanation: 'The Wow! Signal was a strong narrowband radio signal detected by astronomer Jerry Ehman. It matched expected characteristics of an extraterrestrial signal but was never detected again.',
        order: 4,
        options: [
          { text: 'It came from inside Earth\'s atmosphere', isCorrect: false },
          { text: 'It was a strong signal from space that was never detected again', isCorrect: true },
          { text: 'It was transmitted by a known satellite but decoded strangely', isCorrect: false },
          { text: 'It caused radio equipment worldwide to malfunction', isCorrect: false },
        ],
      },
      {
        type: 'SINGLE_CHOICE',
        text: 'What is "Dark Energy" believed to be responsible for?',
        points: 10,
        explanation: 'Dark energy is a hypothetical form of energy that fills all of space and is thought to be driving the accelerating expansion of the Universe.',
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
        explanation: 'Dark matter, the origin of life, and what triggered the Big Bang are all genuine unsolved scientific mysteries. Newton\'s laws of motion are fully understood.',
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
        explanation: 'The Great Attractor is a gravitational anomaly — a massive concentration of mass that is pulling the Milky Way and thousands of other galaxies toward it.',
        order: 7,
        options: [
          { text: 'The largest known star in the universe', isCorrect: false },
          { text: 'A gravitational anomaly pulling thousands of galaxies toward it', isCorrect: true },
          { text: 'The supermassive black hole at the centre of the Milky Way', isCorrect: false },
          { text: 'A region of the universe with no stars', isCorrect: false },
        ],
      },
      {
        type: 'TRUE_FALSE',
        text: 'The Bermuda Triangle has been scientifically proven to have a higher rate of ship and aircraft disappearances than other ocean regions.',
        points: 10,
        explanation: 'False. Studies and the US Coast Guard have found that the Bermuda Triangle does not have an unusually high number of disappearances compared to other heavily trafficked ocean areas.',
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
        explanation: 'The Observer Effect refers to the phenomenon where the act of measuring or observing a quantum system inevitably disturbs it, changing the outcome — most famously demonstrated in the double-slit experiment.',
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
        explanation: 'The Voynich Manuscript is a medieval illustrated codex written in an unknown writing system. Despite decades of cryptanalysis, it has never been decoded.',
        order: 10,
        options: [
          { text: 'It was written by Leonardo da Vinci in code', isCorrect: false },
          { text: 'It contains alien star maps', isCorrect: false },
          { text: 'It is written in an undeciphered script that no one can read', isCorrect: true },
          { text: 'It predicts future events with 100% accuracy', isCorrect: false },
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

    console.log(`✅ Created new quiz: "${mysteryQuiz.title}" with 10 questions`);
  }

  console.log('\n🎉 All done!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
