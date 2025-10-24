import { CluesInput } from '../../types';

export interface CrosswordPuzzle {
  /** Unique identifier for local storage keys. */
  id: string;
  /** Human-readable title displayed in the UI. */
  title: string;
  /** Optional author credit. */
  author?: string;
  /** Optional blurb displayed alongside the puzzle. */
  description?: string;
  /** Data passed directly to the crossword component. */
  data: CluesInput;
}

const puzzleData: CluesInput = {
  across: {
    '1': {
      clue: 'Launches, as a software product',
      answer: 'SHIPS',
      row: 0,
      col: 0,
    },
    '6': {
      clue: 'Villain in "Tron"',
      answer: 'MCP',
      row: 0,
      col: 6,
    },
    '9': {
      clue: 'Separated',
      answer: 'APART',
      row: 0,
      col: 10,
    },
    '14': {
      clue: "Drew Barrymore's great aunt",
      answer: 'ETHEL',
      row: 1,
      col: 0,
    },
    '15': {
      clue: 'Inventor Whitney',
      answer: 'ELI',
      row: 1,
      col: 6,
    },
    '16': {
      clue: 'Skywalker',
      answer: 'VADER',
      row: 1,
      col: 10,
    },
    '17': {
      clue: 'Jungle heat?',
      answer: 'AMAZONSUN',
      row: 2,
      col: 0,
    },
    '19': {
      clue: 'Theatre that always had standing room',
      answer: 'GLOBE',
      row: 2,
      col: 10,
    },
    '20': {
      clue: "Law prof.'s degree",
      answer: 'LLD',
      row: 3,
      col: 0,
    },
    '21': {
      clue: 'Canadian $2 coin, familiarly',
      answer: 'TOONIE',
      row: 3,
      col: 4,
    },
    '23': {
      clue: 'CEO types',
      answer: 'MBAS',
      row: 3,
      col: 11,
    },
    '24': {
      clue: 'Scanner or font term',
      answer: 'OCR',
      row: 4,
      col: 3,
    },
    '25': {
      clue: 'Memphis cheer',
      answer: 'GOTIGERS',
      row: 4,
      col: 7,
    },
    '27': {
      clue: 'Head south for the winter',
      answer: 'MIGRATE',
      row: 5,
      col: 0,
    },
    '31': {
      clue: 'Zilch, in Veracruz',
      answer: 'NADA',
      row: 5,
      col: 8,
    },
    '32': {
      clue: 'Simon and Garfunkel hit of 1966',
      answer: 'IAMAROCK',
      row: 6,
      col: 0,
    },
    '34': {
      clue: 'Parts of a procedure',
      answer: 'STEPS',
      row: 6,
      col: 10,
    },
    '38': {
      clue: 'Bygone compression company',
      answer: 'STAC',
      row: 7,
      col: 0,
    },
    '39': {
      clue: 'What Jack Sprat ate?',
      answer: 'NOFAT',
      row: 7,
      col: 5,
    },
    '42': {
      clue: 'Big name in art deco',
      answer: 'ERTE',
      row: 7,
      col: 11,
    },
    '43': {
      clue: 'Net wt. of a big bag of flour',
      answer: 'TENLB',
      row: 8,
      col: 0,
    },
    '45': {
      clue: 'Sideways, as a way of walking',
      answer: 'CRABWISE',
      row: 8,
      col: 7,
    },
    '47': {
      clue: 'Recedes',
      answer: 'EBBS',
      row: 9,
      col: 3,
    },
    '50': {
      clue: 'Hawaii has hundreds',
      answer: 'ISLANDS',
      row: 9,
      col: 8,
    },
    '51': {
      clue: 'First piece of evidence',
      answer: 'EXHIBITA',
      row: 10,
      col: 0,
    },
    '55': {
      clue: '"For example..."',
      answer: 'SAY',
      row: 10,
      col: 9,
    },
    '56': {
      clue: 'Indian flatbread',
      answer: 'NAAN',
      row: 11,
      col: 0,
    },
    '57': {
      clue: 'Clothing and skate shop chain',
      answer: 'ZUMIEZ',
      row: 11,
      col: 5,
    },
    '59': {
      clue: 'The M in MP3 does not stand for this: abbr.',
      answer: 'MUS',
      row: 11,
      col: 12,
    },
    '62': {
      clue: 'Put together',
      answer: 'UNITE',
      row: 12,
      col: 0,
    },
    '64': {
      clue: 'Fruity valley?',
      answer: 'APPLEDELL',
      row: 12,
      col: 6,
    },
    '66': {
      clue: 'Garden tools',
      answer: 'RAKES',
      row: 13,
      col: 0,
    },
    '67': {
      clue: 'Famous Speedwagon',
      answer: 'REO',
      row: 13,
      col: 6,
    },
    '68': {
      clue: 'Alfa follower',
      answer: 'ROMEO',
      row: 13,
      col: 10,
    },
    '69': {
      clue: 'Rejoice',
      answer: 'EXULT',
      row: 14,
      col: 0,
    },
    '70': {
      clue: "Communicator for those who can't hear: abbr.",
      answer: 'TDD',
      row: 14,
      col: 6,
    },
    '71': {
      clue: 'Win all the games',
      answer: 'SWEEP',
      row: 14,
      col: 10,
    },
  },
  down: {
    '1': {
      clue: 'The United States has a great one',
      answer: 'SEAL',
      row: 0,
      col: 0,
    },
    '2': {
      clue: 'Language of the web',
      answer: 'HTML',
      row: 0,
      col: 1,
    },
    '3': {
      clue: '"___ no idea!"',
      answer: 'IHAD',
      row: 0,
      col: 2,
    },
    '4': {
      clue: 'Candy that might be given out by a cartoon head',
      answer: 'PEZ',
      row: 0,
      col: 3,
    },
    '5': {
      clue: "Kid's racer",
      answer: 'SLOTCAR',
      row: 0,
      col: 4,
    },
    '6': {
      clue: 'Prefix with -zoic, meaning middle',
      answer: 'MESO',
      row: 0,
      col: 6,
    },
    '7': {
      clue: 'Adhered (to)',
      answer: 'CLUNG',
      row: 0,
      col: 7,
    },
    '8': {
      clue: "Rack's partner in cars",
      answer: 'PINION',
      row: 0,
      col: 8,
    },
    '9': {
      clue: "Pitcher's or student's stat: abbr.",
      answer: 'AVG',
      row: 0,
      col: 10,
    },
    '10': {
      clue: 'Tropical entrance?',
      answer: 'PALMGATEWAY',
      row: 0,
      col: 11,
    },
    '11': {
      clue: 'Acrobat company',
      answer: 'ADOBE',
      row: 0,
      col: 12,
    },
    '12': {
      clue: 'Construction rod',
      answer: 'REBAR',
      row: 0,
      col: 13,
    },
    '13': {
      clue: 'A braid',
      answer: 'TRESS',
      row: 0,
      col: 14,
    },
    '18': {
      clue: 'Last name in security software',
      answer: 'NORTON',
      row: 2,
      col: 5,
    },
    '22': {
      clue: 'It comes between zeta and theta',
      answer: 'ETA',
      row: 3,
      col: 9,
    },
    '24': {
      clue: "Seer's info?",
      answer: 'ORACLEINTEL',
      row: 4,
      col: 3,
    },
    '26': {
      clue: "They're checked in bars",
      answer: 'IDS',
      row: 4,
      col: 10,
    },
    '27': {
      clue: 'Fine spray',
      answer: 'MIST',
      row: 5,
      col: 0,
    },
    '28': {
      clue: '"I can\'t believe ___ the whole thing!"',
      answer: 'IATE',
      row: 5,
      col: 1,
    },
    '29': {
      clue: 'Nickname for an FBI agent, as popularized in the 1959 movie "The FBI Story"',
      answer: 'GMAN',
      row: 5,
      col: 2,
    },
    '30': {
      clue: 'Environmental prefix',
      answer: 'ECO',
      row: 5,
      col: 6,
    },
    '33': {
      clue: 'Fast food chain that added grills in 2009',
      answer: 'KFC',
      row: 6,
      col: 7,
    },
    '35': {
      clue: 'Ms. Brockovich',
      answer: 'ERIN',
      row: 6,
      col: 12,
    },
    '36': {
      clue: 'Anxiety syndrome associated with veterans: abbr.',
      answer: 'PTSD',
      row: 6,
      col: 13,
    },
    '37': {
      clue: 'Meets with',
      answer: 'SEES',
      row: 6,
      col: 14,
    },
    '40': {
      clue: 'Former White House press secretary Fleischer',
      answer: 'ARI',
      row: 7,
      col: 8,
    },
    '41': {
      clue: 'Dangler at a graduation',
      answer: 'TASSEL',
      row: 7,
      col: 9,
    },
    '44': {
      clue: 'Consumer protection grp. with the slogan "Start With Trust"',
      answer: 'BBB',
      row: 8,
      col: 4,
    },
    '46': {
      clue: "Portland's team, for short",
      answer: 'BLAZERS',
      row: 8,
      col: 10,
    },
    '48': {
      clue: 'Alternative to .com',
      answer: 'BIZ',
      row: 9,
      col: 5,
    },
    '49': {
      clue: 'Little mouse',
      answer: 'STUART',
      row: 9,
      col: 6,
    },
    '51': {
      clue: 'Habituate',
      answer: 'ENURE',
      row: 10,
      col: 0,
    },
    '52': {
      clue: 'Anti-anxiety drug (sometimes used to treat 36-Down)',
      answer: 'XANAX',
      row: 10,
      col: 1,
    },
    '53': {
      clue: "Dancing off the page / Pleasant as a Summer breeze / It's a short poem",
      answer: 'HAIKU',
      row: 10,
      col: 2,
    },
    '54': {
      clue: 'Pumped up the volume',
      answer: 'AMPED',
      row: 10,
      col: 7,
    },
    '58': {
      clue: 'Shuffle or Classic',
      answer: 'IPOD',
      row: 11,
      col: 8,
    },
    '59': {
      clue: 'I Can Has Cheezburger is all about one',
      answer: 'MEME',
      row: 11,
      col: 12,
    },
    '60': {
      clue: '"___\'s Gold" (Peter Fonda flick of 1997)',
      answer: 'ULEE',
      row: 11,
      col: 13,
    },
    '61': {
      clue: 'Feed for the pigs',
      answer: 'SLOP',
      row: 11,
      col: 14,
    },
    '63': {
      clue: 'Approx.',
      answer: 'EST',
      row: 12,
      col: 4,
    },
    '65': {
      clue: 'Stock market benchmark, with "The"',
      answer: 'DOW',
      row: 12,
      col: 11,
    },
  },
};

export const highTechMergers: CrosswordPuzzle = {
  id: 'high-tech-mergers',
  title: 'High-Tech Mergers',
  author: 'Crossword Team',
  description:
    'An original crossword packed with tech-flavored wordplay, adapted for the production game experience.',
  data: puzzleData,
};

export const puzzles: CrosswordPuzzle[] = [highTechMergers];

export default highTechMergers;
