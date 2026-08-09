import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Adding Marvel Entertainment & GK Quizzes...');

  // Find admin user
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!admin) throw new Error('No admin user found. Run seed.ts first.');

  // ──────────────────────────────────────────────────────────────────────────
  // 1. MARVEL ENTERTAINMENT QUIZ (15 Questions)
  // ──────────────────────────────────────────────────────────────────────────
  let marvelQuiz = await prisma.quiz.findFirst({
    where: { title: { contains: 'Marvel' } },
  });

  if (!marvelQuiz) {
    console.log('⚡ Creating "Marvel Cinematic & Comics Universe Trivia" quiz...');
    marvelQuiz = await prisma.quiz.create({
      data: {
        title: 'Marvel Cinematic & Comics Universe Trivia',
        description: 'Test your ultimate fandom knowledge on Marvel superheroes, Avengers, Infinity Stones, Wakanda, and epic cinematic moments!',
        category: 'Entertainment',
        difficulty: 'MEDIUM',
        timeLimitSeconds: 600, // 10 minutes
        passingScore: 70,
        status: 'PUBLISHED',
        thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
        createdById: admin.id,
      },
    });
  }

  const marvelQuestions = [
    {
      type: 'SINGLE_CHOICE',
      text: 'What fictional indestructible metal is fused to Wolverine\'s skeleton?',
      points: 10,
      explanation: 'Wolverine\'s skeleton and claws are coated with Adamantium, a dense, virtually indestructible steel alloy.',
      order: 1,
      options: [
        { text: 'Vibranium', isCorrect: false },
        { text: 'Adamantium', isCorrect: true },
        { text: 'Uru', isCorrect: false },
        { text: 'Kryptonite', isCorrect: false },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'What is the name of Thor\'s enchanted hammer enchanted by Odin?',
      points: 10,
      explanation: 'Thor\'s primary weapon is Mjolnir, forged in the heart of a dying star.',
      order: 2,
      options: [
        { text: 'Stormbreaker', isCorrect: false },
        { text: 'Mjolnir', isCorrect: true },
        { text: 'Gungnir', isCorrect: false },
        { text: 'Hofund', isCorrect: false },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'Which Infinity Stone is housed inside the glowing blue Tesseract cube?',
      points: 10,
      explanation: 'The Tesseract contains the Space Stone, allowing teleportation across the universe.',
      order: 3,
      options: [
        { text: 'Mind Stone', isCorrect: false },
        { text: 'Power Stone', isCorrect: false },
        { text: 'Space Stone', isCorrect: true },
        { text: 'Reality Stone', isCorrect: false },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'What is the real birth name of Black Panther, King of Wakanda?',
      points: 10,
      explanation: 'T\'Challa is the King of Wakanda and protector who assumes the mantle of Black Panther.',
      order: 4,
      options: [
        { text: 'M\'Baku', isCorrect: false },
        { text: 'N\'Jadaka', isCorrect: false },
        { text: 'T\'Challa', isCorrect: true },
        { text: 'W\'Kabi', isCorrect: false },
      ],
    },
    {
      type: 'TRUE_FALSE',
      text: 'Tony Stark constructed his very first Mark I Iron Man suit while held captive in a cave.',
      points: 10,
      explanation: 'True! Tony Stark built the crude Mark I armor with Ho Yinsen in an Afghan cave in the 2008 movie.',
      order: 5,
      options: [
        { text: 'True', isCorrect: true },
        { text: 'False', isCorrect: false },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'What metal is Captain America\'s shield primarily made of?',
      points: 10,
      explanation: 'Captain America\'s shield is made of a rare Vibranium alloy crafted by Howard Stark.',
      order: 6,
      options: [
        { text: 'Titanium', isCorrect: false },
        { text: 'Vibranium', isCorrect: true },
        { text: 'Adamantium', isCorrect: false },
        { text: 'Carbon Fiber', isCorrect: false },
      ],
    },
    {
      type: 'MULTI_CHOICE',
      text: 'Which of the following characters were founding members of the original 2012 Avengers film team? (Select all that apply)',
      points: 15,
      explanation: 'The original 6 Avengers in MCU 2012 were Iron Man, Captain America, Thor, Hulk, Black Widow, and Hawkeye.',
      order: 7,
      options: [
        { text: 'Iron Man', isCorrect: true },
        { text: 'Spider-Man', isCorrect: false },
        { text: 'Black Widow', isCorrect: true },
        { text: 'Captain America', isCorrect: true },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'What is the isolated, technologically advanced African nation hidden under a force field in Marvel lore?',
      points: 10,
      explanation: 'Wakanda is a futuristic African nation that uses Vibranium technology.',
      order: 8,
      options: [
        { text: 'Genosha', isCorrect: false },
        { text: 'Latveria', isCorrect: false },
        { text: 'Wakanda', isCorrect: true },
        { text: 'Madripoor', isCorrect: false },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'Which Infinity Stone is embedded in Doctor Strange\'s Eye of Agamotto amulet?',
      points: 10,
      explanation: 'The Eye of Agamotto holds the Time Stone, allowing manipulation of timelines.',
      order: 9,
      options: [
        { text: 'Time Stone', isCorrect: true },
        { text: 'Soul Stone', isCorrect: false },
        { text: 'Mind Stone', isCorrect: false },
        { text: 'Reality Stone', isCorrect: false },
      ],
    },
    {
      type: 'TRUE_FALSE',
      text: 'Thanos, the Mad Titan, originates from the planet Titan.',
      points: 10,
      explanation: 'True. Thanos is a member of the Eternals species born on Saturn\'s moon/planet Titan.',
      order: 10,
      options: [
        { text: 'True', isCorrect: true },
        { text: 'False', isCorrect: false },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'What tree-like alien species is Groot from Guardians of the Galaxy?',
      points: 10,
      explanation: 'Groot is a Flora Colossus from Planet X.',
      order: 11,
      options: [
        { text: 'Kree', isCorrect: false },
        { text: 'Flora Colossus', isCorrect: true },
        { text: 'Skrull', isCorrect: false },
        { text: 'Centaurian', isCorrect: false },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'Who directed the record-breaking MCU blockbusters "Avengers: Infinity War" and "Avengers: Endgame"?',
      points: 10,
      explanation: 'Anthony and Joe Russo (The Russo Brothers) directed both epic Avengers movies.',
      order: 12,
      options: [
        { text: 'Joss Whedon', isCorrect: false },
        { text: 'James Gunn', isCorrect: false },
        { text: 'The Russo Brothers', isCorrect: true },
        { text: 'Taika Waititi', isCorrect: false },
      ],
    },
    {
      type: 'MULTI_CHOICE',
      text: 'Which of the following are among the 6 cosmic Infinity Stones? (Select all that apply)',
      points: 15,
      explanation: 'The 6 Infinity Stones are Space, Mind, Reality, Power, Time, and Soul.',
      order: 13,
      options: [
        { text: 'Power Stone', isCorrect: true },
        { text: 'Shadow Stone', isCorrect: false },
        { text: 'Reality Stone', isCorrect: true },
        { text: 'Soul Stone', isCorrect: true },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'What is Peter Parker\'s high school best friend and "guy in the chair" named in the MCU trilogy?',
      points: 10,
      explanation: 'Ned Leeds is Peter Parker\'s loyal best friend.',
      order: 14,
      options: [
        { text: 'Harry Osborn', isCorrect: false },
        { text: 'Flash Thompson', isCorrect: false },
        { text: 'Ned Leeds', isCorrect: true },
        { text: 'Miles Morales', isCorrect: false },
      ],
    },
    {
      type: 'TRUE_FALSE',
      text: 'Wanda Maximoff (Scarlet Witch) and Pietro Maximoff (Quicksilver) are twin siblings.',
      points: 10,
      explanation: 'True! Wanda and Pietro are twins introduced together in Avengers: Age of Ultron.',
      order: 15,
      options: [
        { text: 'True', isCorrect: true },
        { text: 'False', isCorrect: false },
      ],
    },
  ];

  for (const q of marvelQuestions) {
    await prisma.question.create({
      data: {
        quizId: marvelQuiz.id,
        type: q.type,
        text: q.text,
        points: q.points,
        explanation: q.explanation,
        order: q.order,
        options: { create: q.options },
      },
    });
  }

  console.log(`✅ Marvel Quiz created/updated with 15 questions!`);

  // ──────────────────────────────────────────────────────────────────────────
  // 2. GENERAL KNOWLEDGE (GK) QUIZ (10 Questions)
  // ──────────────────────────────────────────────────────────────────────────
  let gkQuiz = await prisma.quiz.findFirst({
    where: { title: { contains: 'General Knowledge' } },
  });

  if (!gkQuiz) {
    console.log('🌍 Creating "Global General Knowledge & World Trivia" quiz...');
    gkQuiz = await prisma.quiz.create({
      data: {
        title: 'Global General Knowledge & World Trivia',
        description: 'Test your world awareness, geography, history, and general facts across continents and cultures!',
        category: 'General Knowledge',
        difficulty: 'EASY',
        timeLimitSeconds: 480, // 8 minutes
        passingScore: 70,
        status: 'PUBLISHED',
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
        createdById: admin.id,
      },
    });
  }

  const gkQuestions = [
    {
      type: 'SINGLE_CHOICE',
      text: 'What is the capital city of Japan?',
      points: 10,
      explanation: 'Tokyo is the capital city and largest metropolis of Japan.',
      order: 1,
      options: [
        { text: 'Kyoto', isCorrect: false },
        { text: 'Osaka', isCorrect: false },
        { text: 'Tokyo', isCorrect: true },
        { text: 'Hiroshima', isCorrect: false },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'Which is the largest ocean by surface area on planet Earth?',
      points: 10,
      explanation: 'The Pacific Ocean is the world\'s largest and deepest ocean basin.',
      order: 2,
      options: [
        { text: 'Atlantic Ocean', isCorrect: false },
        { text: 'Indian Ocean', isCorrect: false },
        { text: 'Pacific Ocean', isCorrect: true },
        { text: 'Arctic Ocean', isCorrect: false },
      ],
    },
    {
      type: 'TRUE_FALSE',
      text: 'The Great Wall of China is easily visible from low Earth orbit with the naked eye without magnification.',
      points: 10,
      explanation: 'False. Astronauts and NASA have confirmed it is generally not visible to the naked eye without specialized camera lenses.',
      order: 3,
      options: [
        { text: 'True', isCorrect: false },
        { text: 'False', isCorrect: true },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'What is the official chemical symbol for Gold on the Periodic Table?',
      points: 10,
      explanation: 'Au (from the Latin word "Aurum") is the symbol for Gold.',
      order: 4,
      options: [
        { text: 'Ag', isCorrect: false },
        { text: 'Au', isCorrect: true },
        { text: 'Gd', isCorrect: false },
        { text: 'Fe', isCorrect: false },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'Which continent is home to the vast Sahara Desert?',
      points: 10,
      explanation: 'The Sahara Desert spans across northern Africa.',
      order: 5,
      options: [
        { text: 'Asia', isCorrect: false },
        { text: 'Australia', isCorrect: false },
        { text: 'Africa', isCorrect: true },
        { text: 'South America', isCorrect: false },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'Who painted the famous Renaissance masterpiece "Mona Lisa"?',
      points: 10,
      explanation: 'Leonardo da Vinci painted the Mona Lisa between 1503 and 1519.',
      order: 6,
      options: [
        { text: 'Vincent van Gogh', isCorrect: false },
        { text: 'Pablo Picasso', isCorrect: false },
        { text: 'Leonardo da Vinci', isCorrect: true },
        { text: 'Michelangelo', isCorrect: false },
      ],
    },
    {
      type: 'MULTI_CHOICE',
      text: 'Which of the following nations are official member countries of the G7 (Group of Seven)? (Select all that apply)',
      points: 15,
      explanation: 'G7 consists of Canada, France, Germany, Italy, Japan, UK, and USA.',
      order: 7,
      options: [
        { text: 'Japan', isCorrect: true },
        { text: 'Germany', isCorrect: true },
        { text: 'Brazil', isCorrect: false },
        { text: 'Canada', isCorrect: true },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'What is the hardest naturally occurring substance found on Earth?',
      points: 10,
      explanation: 'Diamond is a solid form of pure carbon arranged in a crystal structure, making it the hardest natural material.',
      order: 8,
      options: [
        { text: 'Titanium', isCorrect: false },
        { text: 'Quartz', isCorrect: false },
        { text: 'Diamond', isCorrect: true },
        { text: 'Granite', isCorrect: false },
      ],
    },
    {
      type: 'TRUE_FALSE',
      text: 'Light travels significantly faster than sound in air.',
      points: 10,
      explanation: 'True! Light travels at ~300,000 km/s while sound travels at ~343 m/s in air.',
      order: 9,
      options: [
        { text: 'True', isCorrect: true },
        { text: 'False', isCorrect: false },
      ],
    },
    {
      type: 'SINGLE_CHOICE',
      text: 'Which planet in our Solar System has the highest number of confirmed moons (over 140)?',
      points: 10,
      explanation: 'Saturn leads the solar system with 146 officially recognized moons.',
      order: 10,
      options: [
        { text: 'Jupiter', isCorrect: false },
        { text: 'Saturn', isCorrect: true },
        { text: 'Uranus', isCorrect: false },
        { text: 'Neptune', isCorrect: false },
      ],
    },
  ];

  for (const q of gkQuestions) {
    await prisma.question.create({
      data: {
        quizId: gkQuiz.id,
        type: q.type,
        text: q.text,
        points: q.points,
        explanation: q.explanation,
        order: q.order,
        options: { create: q.options },
      },
    });
  }

  console.log(`✅ GK Quiz created/updated with 10 questions!`);
  console.log('\n🎉 Marvel & GK Quizzes insertion complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
