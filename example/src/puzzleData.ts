export interface LegacyClueDefinition {
  clue: string;
  answer: string;
  row: number;
  col: number;
}

export interface LegacyPuzzleData {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  author?: string;
  data: {
    across: Record<string, LegacyClueDefinition>;
    down: Record<string, LegacyClueDefinition>;
  };
}

const legacyPuzzles: LegacyPuzzleData[] = [
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

export interface IpuzPuzzle {
  version: string;
  kind: string[];
  title?: string;
  author?: string;
  copyright?: string;
  publisher?: string;
  difficulty?: string;
  date?: string;
  empty?: string;
  block?: string;
  intro?: string;
  explanation?: string;
  origin?: string;
  uniqueid?: string;
  dimensions: {
    width: number;
    height: number;
  };
  puzzle: (number | string | null | { cell?: number; style?: unknown })[][];
  solution: (string | null)[][];
  clues: Record<'Across' | 'Down', [number, string][]>;
}

const IPUZ_VERSION_URI = 'http://ipuz.org/v';
const IPUZ_CROSSWORD_URI = 'http://ipuz.org/crossword#';
const SUPPORTED_IPUZ_VERSION = 2;
const SUPPORTED_CROSSWORD_VERSION = 1;

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function computeDimensions(puzzle: LegacyPuzzleData['data']) {
  let width = 0;
  let height = 0;

  Object.values(puzzle.across).forEach(({ row, col, answer }) => {
    width = Math.max(width, col + answer.length);
    height = Math.max(height, row + 1);
  });

  Object.values(puzzle.down).forEach(({ row, col, answer }) => {
    width = Math.max(width, col + 1);
    height = Math.max(height, row + answer.length);
  });

  return { width, height };
}

function convertLegacyToIpuz(puzzle: LegacyPuzzleData): IpuzPuzzle {
  const { width, height } = computeDimensions(puzzle.data);
  const solution = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => '#')
  );
  const grid = Array.from(
    { length: height },
    () => Array.from({ length: width }, () => '#') as (number | string | null)[]
  );
  const numbering = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 0)
  );

  Object.entries(puzzle.data.across).forEach(([num, clue]) => {
    const clueNumber = Number(num);
    const { row, col, answer } = clue;
    numbering[row][col] = clueNumber;
    for (let i = 0; i < answer.length; i += 1) {
      const targetCol = col + i;
      solution[row][targetCol] = answer[i].toUpperCase();
      grid[row][targetCol] = 0;
    }
  });

  Object.entries(puzzle.data.down).forEach(([num, clue]) => {
    const clueNumber = Number(num);
    const { row, col, answer } = clue;
    if (numbering[row][col] === 0) {
      numbering[row][col] = clueNumber;
    }
    for (let i = 0; i < answer.length; i += 1) {
      const targetRow = row + i;
      solution[targetRow][col] = answer[i].toUpperCase();
      grid[targetRow][col] = 0;
    }
  });

  for (let r = 0; r < height; r += 1) {
    for (let c = 0; c < width; c += 1) {
      if (solution[r][c] === '#') {
        grid[r][c] = '#';
      } else if (numbering[r][c] !== 0) {
        grid[r][c] = numbering[r][c];
      } else if (grid[r][c] === '#') {
        grid[r][c] = 0;
      }
    }
  }

  const acrossClues = Object.entries(puzzle.data.across)
    .map(([num, clue]) => [Number(num), clue.clue] as [number, string])
    .sort((a, b) => a[0] - b[0]);

  const downClues = Object.entries(puzzle.data.down)
    .map(([num, clue]) => [Number(num), clue.clue] as [number, string])
    .sort((a, b) => a[0] - b[0]);

  return {
    version: `${IPUZ_VERSION_URI}${SUPPORTED_IPUZ_VERSION}`,
    kind: [`${IPUZ_CROSSWORD_URI}${SUPPORTED_CROSSWORD_VERSION}`],
    title: puzzle.title,
    author: puzzle.author,
    difficulty: capitalize(puzzle.difficulty),
    empty: '0',
    block: '#',
    uniqueid: puzzle.id,
    dimensions: { width, height },
    puzzle: grid,
    solution,
    clues: {
      Across: acrossClues,
      Down: downClues,
    },
  };
}

export function normalizeDifficulty(value?: string) {
  if (!value) {
    return undefined;
  }
  return value.trim().toLowerCase();
}

export function isIpuzCrossword(data: unknown): data is IpuzPuzzle {
  if (
    !data ||
    typeof data !== 'object' ||
    !('version' in data) ||
    typeof (data as { version: unknown }).version !== 'string'
  ) {
    return false;
  }

  const versionStr = (data as { version: string }).version;
  if (!versionStr.startsWith(IPUZ_VERSION_URI)) {
    return false;
  }

  const version = Number.parseInt(
    versionStr.substring(IPUZ_VERSION_URI.length),
    10
  );
  if (Number.isNaN(version) || version > SUPPORTED_IPUZ_VERSION) {
    return false;
  }

  if (!('kind' in data) || !Array.isArray((data as { kind: unknown }).kind)) {
    return false;
  }

  const kind = (data as { kind: unknown[] }).kind;
  if (
    kind.length === 0 ||
    typeof kind[0] !== 'string' ||
    !kind[0].startsWith(IPUZ_CROSSWORD_URI)
  ) {
    return false;
  }

  const crosswordVersion = Number.parseInt(
    (kind[0] as string).substring(IPUZ_CROSSWORD_URI.length),
    10
  );

  if (
    Number.isNaN(crosswordVersion) ||
    crosswordVersion > SUPPORTED_CROSSWORD_VERSION
  ) {
    return false;
  }

  if (!('dimensions' in data)) {
    return false;
  }

  const dimensions = (
    data as { dimensions: { width?: number; height?: number } }
  ).dimensions;
  if (
    typeof dimensions.width !== 'number' ||
    typeof dimensions.height !== 'number'
  ) {
    return false;
  }

  if (
    !('puzzle' in data) ||
    !Array.isArray((data as { puzzle: unknown }).puzzle)
  ) {
    return false;
  }

  if (
    !('solution' in data) ||
    !Array.isArray((data as { solution: unknown }).solution)
  ) {
    return false;
  }

  if (!('clues' in data)) {
    return false;
  }

  return true;
}

export function createPuzzleSignature(ipuz: IpuzPuzzle) {
  const fingerprint = JSON.stringify({
    uniqueid: ipuz.uniqueid ?? null,
    title: ipuz.title ?? null,
    author: ipuz.author ?? null,
    dimensions: ipuz.dimensions,
    puzzle: ipuz.puzzle,
    solution: ipuz.solution,
  });

  let hash = 0;
  for (let i = 0; i < fingerprint.length; i += 1) {
    hash = (hash * 31 + fingerprint.charCodeAt(i)) >>> 0;
  }

  return hash.toString(16).padStart(8, '0');
}

const referenceMini: IpuzPuzzle = {
  version: 'http://ipuz.org/v2',
  kind: ['http://ipuz.org/crossword#1'],
  title: 'Reference Mini',
  difficulty: 'Easy',
  empty: '0',
  block: '#',
  dimensions: { width: 3, height: 3 },
  puzzle: [
    [{ cell: 1, style: { shapebg: 'circle' } }, 2, '#'],
    [3, { style: { shapebg: 'circle' } }, 4],
    [null, 5, { style: { shapebg: 'circle' } }],
  ],
  solution: [
    ['C', 'A', '#'],
    ['B', 'O', 'T'],
    [null, 'L', 'O'],
  ],
  clues: {
    Across: [
      [1, 'OR neighbor'],
      [3, 'Droid'],
      [5, 'Behold!'],
    ],
    Down: [
      [1, "Trucker's radio"],
      [2, 'MSN competitor'],
      [4, 'A preposition'],
    ],
  },
};

const highTechMergers: IpuzPuzzle = {
  origin: 'ipuz example puzzle (from Puzzazz)',
  version: 'http://ipuz.org/v1',
  kind: ['http://ipuz.org/crossword#1'],
  copyright: '2011 Puzzazz',
  author: 'Roy Leban',
  publisher: 'Puzzazz, Inc.',
  title: 'High-Tech Mergers',
  intro:
    'Solve the puzzle, then anagram the circled letters to find an appropriate word.',
  difficulty: 'Easy',
  empty: '0',
  dimensions: { width: 15, height: 15 },
  puzzle: [
    [1, 2, 3, 4, 5, '#', 6, 7, 8, '#', 9, 10, 11, 12, 13],
    [14, 0, 0, 0, 0, '#', 15, 0, 0, '#', 16, 0, 0, 0, 0],
    [
      17,
      0,
      0,
      0,
      { cell: 0, style: { shapebg: 'circle' } },
      18,
      0,
      { cell: 0, style: { shapebg: 'circle' } },
      0,
      '#',
      19,
      0,
      0,
      0,
      0,
    ],
    [
      20,
      0,
      0,
      '#',
      21,
      0,
      0,
      0,
      0,
      22,
      '#',
      { cell: 23, style: { shapebg: 'circle' } },
      0,
      0,
      0,
    ],
    ['#', '#', '#', 24, 0, 0, '#', 25, 0, 0, 26, 0, 0, 0, 0],
    [27, 28, 29, 0, 0, 0, 30, '#', 31, 0, 0, 0, '#', '#', '#'],
    [32, 0, 0, 0, 0, 0, 0, 33, '#', '#', 34, 0, 35, 36, 37],
    [
      38,
      0,
      0,
      { cell: 0, style: { shapebg: 'circle' } },
      '#',
      39,
      0,
      0,
      40,
      41,
      '#',
      { cell: 42, style: { shapebg: 'circle' } },
      0,
      0,
      0,
    ],
    [43, 0, 0, 0, 44, '#', '#', 45, 0, 0, 46, 0, 0, 0, 0],
    ['#', '#', '#', 47, 0, 48, 49, '#', 50, 0, 0, 0, 0, 0, 0],
    [51, 52, 53, 0, 0, 0, 0, 54, '#', 55, 0, 0, '#', '#', '#'],
    [56, 0, 0, 0, '#', 57, 0, 0, 58, 0, 0, '#', 59, 60, 61],
    [
      62,
      0,
      0,
      { cell: 0, style: { shapebg: 'circle' } },
      63,
      '#',
      64,
      0,
      { cell: 0, style: { shapebg: 'circle' } },
      0,
      0,
      { cell: 65, style: { shapebg: 'circle' } },
      0,
      0,
      0,
    ],
    [66, 0, 0, 0, 0, '#', 67, 0, 0, '#', 68, 0, 0, 0, 0],
    [69, 0, 0, 0, 0, '#', 70, 0, 0, '#', 71, 0, 0, 0, 0],
  ],
  clues: {
    Across: [
      [1, 'Launches, as a software product'],
      [6, 'Villain in "Tron"'],
      [9, 'Separated'],
      [14, "Drew Barrymore's great aunt"],
      [15, 'Inventor Whitney'],
      [16, 'Skywalker'],
      [17, 'Jungle heat?'],
      [19, 'Theatre that always had standing room'],
      [20, "Law prof.'s degree"],
      [21, 'Canadian $2 coin, familiarly'],
      [23, 'CEO types'],
      [24, 'Scanner or font term'],
      [25, 'Memphis cheer'],
      [27, 'Head south for the winter'],
      [31, 'Zilch, in Veracruz'],
      [32, 'Simon and Garfunkel hit of 1966'],
      [34, 'Parts of a procedure'],
      [38, 'Bygone compression company'],
      [39, 'What Jack Sprat ate?'],
      [42, 'Big name in art deco'],
      [43, 'Net wt. of a big bag of flour'],
      [45, 'Sideways, as a way of walking'],
      [47, 'Recedes'],
      [50, 'Hawaii has hundreds'],
      [51, 'First piece of evidence'],
      [55, '"For example..."'],
      [56, 'Indian flatbread'],
      [57, 'Clothing and skate shop chain'],
      [59, 'The M in MP3 does not stand for this: abbr.'],
      [62, 'Put together'],
      [64, 'Fruity valley?'],
      [66, 'Garden tools'],
      [67, 'Famous Speedwagon'],
      [68, 'Alfa follower'],
      [69, 'Rejoice'],
      [70, "Communicator for those who can't hear: abbr."],
      [71, 'Win all the games'],
    ],
    Down: [
      [1, 'The United States has a great one'],
      [2, 'Language of the web'],
      [3, '"___ no idea!"'],
      [4, 'Candy that might be given out by a cartoon head'],
      [5, "Kid's racer"],
      [6, 'Prefix with -zoic, meaning middle'],
      [7, 'Adhered (to)'],
      [8, "Rack's partner in cars"],
      [9, "Pitcher's or student's stat: abbr."],
      [10, 'Tropical entrance?'],
      [11, 'Acrobat company'],
      [12, 'Construction rod'],
      [13, 'A braid'],
      [18, 'Last name in security software'],
      [22, 'It comes between zeta and theta'],
      [24, "Seer's info?"],
      [26, "They're checked in bars"],
      [27, 'Fine spray'],
      [28, '"I can\'t believe ___ the whole thing!"'],
      [
        29,
        'Nickname for an FBI agent, as popularized in the 1959 movie "The FBI Story"',
      ],
      [30, 'Environmental prefix'],
      [33, 'Fast food chain that added grills in 2009'],
      [35, 'Ms. Brockovich'],
      [36, 'Anxiety syndrome associated with veterans: abbr.'],
      [37, 'Meets with'],
      [40, 'Former White House press secretary  Fleischer'],
      [41, 'Dangler at a graduation'],
      [44, 'Consumer protection grp. with the slogan "Start With Trust"'],
      [46, "Portland's team, for short"],
      [48, 'Alternative to .com'],
      [49, 'Little mouse'],
      [51, 'Habituate'],
      [52, 'Anti-anxiety drug (sometimes used to treat 36-Down)'],
      [
        53,
        "Dancing off the page / Pleasant as a Summer breeze / It's a short poem",
      ],
      [54, 'Pumped up the volume'],
      [58, 'Shuffle or Classic'],
      [59, 'I Can Has Cheezburger is all about one'],
      [60, '"___\'s Gold" (Peter Fonda flick of 1997)'],
      [61, 'Feed for the pigs'],
      [63, 'Approx.'],
      [65, 'Stock market benchmark, with "The"'],
    ],
  },
  solution: [
    ['S', 'H', 'I', 'P', 'S', '#', 'M', 'C', 'P', '#', 'A', 'P', 'A', 'R', 'T'],
    ['E', 'T', 'H', 'E', 'L', '#', 'E', 'L', 'I', '#', 'V', 'A', 'D', 'E', 'R'],
    ['A', 'M', 'A', 'Z', 'O', 'N', 'S', 'U', 'N', '#', 'G', 'L', 'O', 'B', 'E'],
    ['L', 'L', 'D', '#', 'T', 'O', 'O', 'N', 'I', 'E', '#', 'M', 'B', 'A', 'S'],
    ['#', '#', '#', 'O', 'C', 'R', '#', 'G', 'O', 'T', 'I', 'G', 'E', 'R', 'S'],
    ['M', 'I', 'G', 'R', 'A', 'T', 'E', '#', 'N', 'A', 'D', 'A', '#', '#', '#'],
    ['I', 'A', 'M', 'A', 'R', 'O', 'C', 'K', '#', '#', 'S', 'T', 'E', 'P', 'S'],
    ['S', 'T', 'A', 'C', '#', 'N', 'O', 'F', 'A', 'T', '#', 'E', 'R', 'T', 'E'],
    ['T', 'E', 'N', 'L', 'B', '#', '#', 'C', 'R', 'A', 'B', 'W', 'I', 'S', 'E'],
    ['#', '#', '#', 'E', 'B', 'B', 'S', '#', 'I', 'S', 'L', 'A', 'N', 'D', 'S'],
    ['E', 'X', 'H', 'I', 'B', 'I', 'T', 'A', '#', 'S', 'A', 'Y', '#', '#', '#'],
    ['N', 'A', 'A', 'N', '#', 'Z', 'U', 'M', 'I', 'E', 'Z', '#', 'M', 'U', 'S'],
    ['U', 'N', 'I', 'T', 'E', '#', 'A', 'P', 'P', 'L', 'E', 'D', 'E', 'L', 'L'],
    ['R', 'A', 'K', 'E', 'S', '#', 'R', 'E', 'O', '#', 'R', 'O', 'M', 'E', 'O'],
    ['E', 'X', 'U', 'L', 'T', '#', 'T', 'D', 'D', '#', 'S', 'W', 'E', 'E', 'P'],
  ],
};

const convertedLegacyPuzzles = legacyPuzzles.map((puzzle) => ({
  id: puzzle.id,
  label: puzzle.title,
  ipuz: convertLegacyToIpuz(puzzle),
}));

const additionalIpuzPuzzles = [
  {
    id: 'ipuz-reference-mini',
    label: 'Reference Mini Puzzle',
    ipuz: referenceMini,
  },
  {
    id: 'ipuz-high-tech-mergers',
    label: 'High-Tech Mergers (Puzzazz, 2011)',
    ipuz: highTechMergers,
  },
];

export interface PuzzleLibraryEntry {
  id: string;
  label: string;
  ipuz: IpuzPuzzle;
  difficulty?: string;
  author?: string;
  signature: string;
}

export const puzzles: PuzzleLibraryEntry[] = [
  ...convertedLegacyPuzzles,
  ...additionalIpuzPuzzles,
]
  .map((entry) => ({
    ...entry,
    difficulty: entry.ipuz.difficulty,
    author: entry.ipuz.author,
    signature: createPuzzleSignature(entry.ipuz),
  }))
  .sort((a, b) => a.label.localeCompare(b.label));
