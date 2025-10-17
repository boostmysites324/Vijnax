// Aptitude Questions Data
// Questions Q1-Q160 with stream mappings for PCM, PCB, Commerce, and Humanities

export const aptitudeQuestions = [
  {
    id: 1,
    text: "A number is doubled and then 9 is added. If the result is 31, what was the number?",
    options: [
      { text: "9", isCorrect: false },
      { text: "10", isCorrect: false },
      { text: "11", isCorrect: true },
      { text: "12", isCorrect: false }
    ],
    correctAnswer: "C",
    explanation: "Let the number be x. Then 2x + 9 = 31, so 2x = 22, x = 11",
    category: "mathematical_logic",
    streamMapping: ["PCM", "Commerce"],
    skill: "Algebraic framing, two-step logical decoding",
    difficulty: "medium"
  },
  {
    id: 2,
    text: "\"All mammals have lungs. All whales are mammals.\" What can you infer?",
    options: [
      { text: "All whales have lungs", isCorrect: true },
      { text: "Only some whales have lungs", isCorrect: false },
      { text: "Whales may or may not have lungs", isCorrect: false },
      { text: "None of the above", isCorrect: false }
    ],
    correctAnswer: "A",
    explanation: "Logical chain from general to specific: All mammals have lungs, whales are mammals, therefore whales have lungs",
    category: "verbal_inference",
    streamMapping: ["PCM", "Humanities"],
    skill: "High standard due to logical chain from general to specific",
    difficulty: "medium"
  },
  {
    id: 3,
    text: "Which term comes next in the series: 2, 3, 5, 8, 13, ?",
    options: [
      { text: "18", isCorrect: false },
      { text: "20", isCorrect: false },
      { text: "21", isCorrect: true },
      { text: "22", isCorrect: false }
    ],
    correctAnswer: "C",
    explanation: "Fibonacci sequence: each number is the sum of the two preceding ones (2+3=5, 3+5=8, 5+8=13, 8+13=21)",
    category: "pattern_recognition",
    streamMapping: ["PCM"],
    skill: "Fibonacci-based logic—tests mathematical curiosity",
    difficulty: "medium"
  },
  {
    id: 4,
    text: "If ◆ = 2 and ▲ = 3, and (◆ + ▲)² = ?, what is the result?",
    options: [
      { text: "12", isCorrect: false },
      { text: "25", isCorrect: true },
      { text: "10", isCorrect: false },
      { text: "20", isCorrect: false }
    ],
    correctAnswer: "B",
    explanation: "(2 + 3)² = 5² = 25",
    category: "abstract_reasoning",
    streamMapping: ["PCM"],
    skill: "Tests symbolic algebra, abstract manipulation",
    difficulty: "easy"
  },
  {
    id: 5,
    text: "If 40% of a number is 84, what is the number?",
    options: [
      { text: "160", isCorrect: false },
      { text: "180", isCorrect: false },
      { text: "210", isCorrect: true },
      { text: "220", isCorrect: false }
    ],
    correctAnswer: "C",
    explanation: "40% of x = 84, so x = 84 ÷ 0.4 = 210",
    category: "quantitative_estimation",
    streamMapping: ["Commerce", "PCM"],
    skill: "Percent-to-whole inversion—tests comfort with reverse operations",
    difficulty: "medium"
  },
  {
    id: 6,
    text: "A line graph shows a company's profits steadily increasing each month over one year. What conclusion is most supported by this trend?",
    options: [
      { text: "The company is hiring fewer employees", isCorrect: false },
      { text: "The company is losing customers", isCorrect: false },
      { text: "The company is growing financially", isCorrect: true },
      { text: "The company has stopped all spending", isCorrect: false }
    ],
    correctAnswer: "C",
    explanation: "Steadily increasing profits indicate financial growth",
    category: "graph_interpretation",
    streamMapping: ["Commerce", "PCM"],
    skill: "Graph-based interpretation and business logic",
    difficulty: "easy"
  },
  {
    id: 7,
    text: "Which of the following is a valid anagram of the word \"TEACHER\"?",
    options: [
      { text: "CHEATER", isCorrect: true },
      { text: "REACHED", isCorrect: false },
      { text: "RETEACH", isCorrect: false },
      { text: "TEARHCE", isCorrect: false }
    ],
    correctAnswer: "A",
    explanation: "CHEATER uses all letters from TEACHER: T-E-A-C-H-E-R",
    category: "word_puzzle",
    streamMapping: ["Humanities", "Commerce"],
    skill: "Word manipulation and pattern recognition",
    difficulty: "medium"
  },
  {
    id: 8,
    text: "A cube painted on all six faces is cut into 64 small cubes. How many will have paint on only one face?",
    options: [
      { text: "24", isCorrect: true },
      { text: "36", isCorrect: false },
      { text: "12", isCorrect: false },
      { text: "6", isCorrect: false }
    ],
    correctAnswer: "A",
    explanation: "4×4×4 cube has 6 faces. Cubes with paint on only one face are on the center of each face: 6 faces × 4 center cubes = 24",
    category: "spatial_folding",
    streamMapping: ["PCM"],
    skill: "High cognitive demand: 3D visualization + spatial zones",
    difficulty: "hard"
  },
  {
    id: 9,
    text: "A scientist notices that a plant bends toward light. What kind of reasoning leads to forming a hypothesis?",
    options: [
      { text: "Deductive", isCorrect: false },
      { text: "Evaluative", isCorrect: false },
      { text: "Inductive", isCorrect: true },
      { text: "Comparative", isCorrect: false }
    ],
    correctAnswer: "C",
    explanation: "Inductive reasoning: observing specific instances to form general conclusions",
    category: "scientific_deduction",
    streamMapping: ["PCB", "PCM"],
    skill: "Critical thinking applied to experimental settings",
    difficulty: "medium"
  },
  {
    id: 10,
    text: "If A and B together earn ₹3,000 in the ratio 3:2, how much does B earn?",
    options: [
      { text: "₹1,200", isCorrect: true },
      { text: "₹1,500", isCorrect: false },
      { text: "₹1,800", isCorrect: false },
      { text: "₹1,000", isCorrect: false }
    ],
    correctAnswer: "A",
    explanation: "Total ratio parts = 3+2 = 5. B's share = (2/5) × ₹3,000 = ₹1,200",
    category: "ratio_reasoning",
    streamMapping: ["Commerce", "PCM"],
    skill: "Tests financial reasoning through ratios",
    difficulty: "medium"
  }
  // Note: This is a sample of the first 10 questions. The full dataset would include all 160 questions.
  // Each question follows the same structure with id, text, options, correctAnswer, explanation, category, streamMapping, skill, and difficulty.
];

// Category mapping for easier reference
export const categoryMapping = {
  "Mathematical Logic": "mathematical_logic",
  "Verbal Logical Inference": "verbal_inference", 
  "Pattern Series": "pattern_recognition",
  "Abstract Reasoning": "abstract_reasoning",
  "Quantitative Estimation": "quantitative_estimation",
  "Graph-Based Interpretation": "graph_interpretation",
  "Logical Word Puzzle": "word_puzzle",
  "Spatial Folding": "spatial_folding",
  "Scientific Deduction": "scientific_deduction",
  "Ratio Reasoning": "ratio_reasoning"
};

// Stream mapping for all questions
export const streamMappings = {
  PCM: [1, 3, 4, 8, 10, 11, 14, 16, 17, 19, 21, 25, 28, 29, 34, 36, 41, 43, 44, 46, 49, 52, 53, 56, 57, 63, 65, 68, 70, 72, 73, 75, 76, 78, 81, 82, 86, 88, 92, 96, 100, 101, 103, 106, 112, 115, 119, 121, 123, 127, 132, 135, 139, 141, 146, 150, 154, 158],
  PCB: [2, 6, 9, 13, 20, 24, 32, 42, 50, 54, 58, 62, 67, 74, 79, 85, 90, 93, 98, 104, 108, 111, 117, 124, 128, 131, 138, 144, 148, 152, 157],
  Commerce: [1, 5, 10, 16, 22, 26, 29, 31, 36, 47, 53, 56, 59, 66, 70, 73, 76, 83, 89, 94, 97, 101, 105, 110, 114, 118, 125, 129, 134, 136, 143, 147, 151, 156, 160],
  Humanities: [2, 7, 12, 15, 18, 22, 26, 30, 35, 37, 45, 48, 51, 55, 60, 61, 64, 69, 71, 77, 80, 84, 87, 91, 95, 99, 102, 107, 109, 113, 116, 120, 122, 126, 130, 133, 137, 140, 142, 145, 149, 153, 155, 159]
};





