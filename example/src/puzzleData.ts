// Puzzle library with different difficulty levels

export interface PuzzleData {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  author?: string;
  data: {
    across: Record<
      string,
      { clue: string; answer: string; row: number; col: number }
    >;
    down: Record<
      string,
      { clue: string; answer: string; row: number; col: number }
    >;
  };
}

export const puzzles: PuzzleData[] = [
  {
    id: 'easy-1',
    title: 'Easy Starter',
    difficulty: 'easy',
    author: 'Crossword Master',
    data: {
      across: {
        1: { clue: 'one plus one', answer: 'TWO', row: 0, col: 0 },
        3: { clue: 'feline pet', answer: 'CAT', row: 1, col: 0 },
        4: { clue: 'opposite of yes', answer: 'NO', row: 2, col: 1 },
      },
      down: {
        1: { clue: 'beverage leaves', answer: 'TEA', row: 0, col: 0 },
        2: { clue: 'three minus two', answer: 'ONE', row: 0, col: 2 },
      },
    },
  },
  {
    id: 'easy-2',
    title: 'Simple Words',
    difficulty: 'easy',
    author: 'Word Wizard',
    data: {
      across: {
        1: { clue: 'opposite of hot', answer: 'COLD', row: 0, col: 0 },
        5: { clue: 'flying mammal', answer: 'BAT', row: 1, col: 0 },
        6: { clue: 'water from sky', answer: 'RAIN', row: 2, col: 0 },
      },
      down: {
        1: { clue: 'baby feline', answer: 'CAT', row: 0, col: 0 },
        2: { clue: 'cooking fat', answer: 'OIL', row: 0, col: 1 },
        3: { clue: 'hair on lion', answer: 'MANE', row: 0, col: 3 },
      },
    },
  },
  {
    id: 'medium-1',
    title: 'Daily Challenge',
    difficulty: 'medium',
    author: 'Puzzle Pro',
    data: {
      across: {
        1: { clue: 'Computer input device', answer: 'MOUSE', row: 0, col: 0 },
        6: { clue: 'Frozen water', answer: 'ICE', row: 1, col: 0 },
        7: { clue: 'Large body of water', answer: 'OCEAN', row: 2, col: 0 },
        8: { clue: 'Night bird', answer: 'OWL', row: 3, col: 2 },
      },
      down: {
        1: { clue: 'Midday meal', answer: 'LUNCH', row: 0, col: 0 },
        2: { clue: 'Not new', answer: 'OLD', row: 0, col: 1 },
        3: { clue: 'Sound of laughter', answer: 'HAHA', row: 0, col: 4 },
        4: { clue: 'School test', answer: 'EXAM', row: 0, col: 2 },
      },
    },
  },
  {
    id: 'medium-2',
    title: 'Thinking Cap',
    difficulty: 'medium',
    author: 'Brain Teaser',
    data: {
      across: {
        1: { clue: 'Largest continent', answer: 'ASIA', row: 0, col: 0 },
        5: { clue: 'Fruit with fuzzy skin', answer: 'PEACH', row: 1, col: 0 },
        6: { clue: 'Honey maker', answer: 'BEE', row: 2, col: 0 },
        7: { clue: 'Desert animal with hump', answer: 'CAMEL', row: 3, col: 0 },
      },
      down: {
        1: { clue: 'Red fruit', answer: 'APPLE', row: 0, col: 0 },
        2: { clue: 'Ocean motion', answer: 'WAVE', row: 0, col: 2 },
        3: { clue: 'Opposite of she', answer: 'HE', row: 0, col: 3 },
        4: { clue: 'Food fish', answer: 'BASS', row: 0, col: 4 },
      },
    },
  },
  {
    id: 'hard-1',
    title: 'Expert Challenge',
    difficulty: 'hard',
    author: 'Crossword Champion',
    data: {
      across: {
        1: {
          clue: 'Programming language named after a snake',
          answer: 'PYTHON',
          row: 0,
          col: 0,
        },
        7: { clue: 'Capital of France', answer: 'PARIS', row: 1, col: 0 },
        8: { clue: 'Shakespearean tragedy', answer: 'HAMLET', row: 2, col: 0 },
        9: { clue: 'Opposite of day', answer: 'NIGHT', row: 3, col: 1 },
      },
      down: {
        1: { clue: 'Type of tree', answer: 'PINE', row: 0, col: 0 },
        2: {
          clue: 'Ancient Greek city-state',
          answer: 'SPARTA',
          row: 0,
          col: 2,
        },
        3: {
          clue: 'Musical instrument with keys',
          answer: 'PIANO',
          row: 0,
          col: 5,
        },
        4: { clue: 'Egyptian river', answer: 'NILE', row: 0, col: 1 },
        5: { clue: 'Bright star', answer: 'SUN', row: 1, col: 4 },
      },
    },
  },
  {
    id: 'hard-2',
    title: 'Master Puzzle',
    difficulty: 'hard',
    author: 'Grand Master',
    data: {
      across: {
        1: { clue: 'Fastest land animal', answer: 'CHEETAH', row: 0, col: 0 },
        8: { clue: 'Red planet', answer: 'MARS', row: 1, col: 0 },
        9: { clue: 'Largest ocean', answer: 'PACIFIC', row: 2, col: 0 },
        10: { clue: 'Opposite of begin', answer: 'END', row: 3, col: 4 },
      },
      down: {
        1: { clue: 'Swiss cheese', answer: 'CHEDDAR', row: 0, col: 0 },
        2: { clue: 'Precious stone', answer: 'EMERALD', row: 0, col: 2 },
        3: { clue: 'Theater performance', answer: 'PLAY', row: 0, col: 5 },
        4: { clue: 'Citrus fruit', answer: 'ORANGE', row: 0, col: 6 },
      },
    },
  },
];

export function getPuzzlesByDifficulty(
  difficulty: 'easy' | 'medium' | 'hard'
): PuzzleData[] {
  return puzzles.filter((p) => p.difficulty === difficulty);
}

export function getPuzzleById(id: string): PuzzleData | undefined {
  return puzzles.find((p) => p.id === id);
}
