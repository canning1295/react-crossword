import React, { useCallback, useEffect, useRef, useState } from 'react';
import Crossword, {
  CrosswordImperative,
  CrosswordGrid,
  CrosswordProps,
  CrosswordProvider,
  CrosswordProviderImperative,
  CrosswordProviderProps,
  DirectionClues,
  useIpuz,
} from '@jaredreisinger/react-crossword';
import styled, {
  ThemeProvider,
  createGlobalStyle,
  keyframes,
} from 'styled-components';
import DbVerification from './DbVerification';
import { puzzles, getPuzzlesByDifficulty, PuzzleData } from './puzzleData';

const data = {
  across: {
    1: {
      clue: 'one plus one',
      answer: 'TWO',
      row: 0,
      col: 0,
    },
  },
  down: {
    2: {
      clue: 'three minus two',
      answer: 'ONE',
      row: 0,
      col: 2,
    },
  },
};

const ipuzData = {
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

const GlobalStyle = createGlobalStyle<{ darkMode: boolean }>`
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${(props) => (props.darkMode ? '#1a1a2e' : '#f5f5f5')};
    color: ${(props) => (props.darkMode ? '#eee' : '#333')};
    transition: all 0.3s ease;
  }
`;

const Page = styled.div`
  min-height: 100vh;
  padding: 1em;

  @media (min-width: 768px) {
    padding: 2em;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1em;
  margin-bottom: 1.5em;
  padding-bottom: 1em;
  border-bottom: 2px solid ${(props) => props.theme.borderColor || '#ddd'};

  h1 {
    margin: 0;
    font-size: 1.5em;

    @media (min-width: 768px) {
      font-size: 2em;
    }
  }
`;

const HeaderControls = styled.div`
  display: flex;
  gap: 0.5em;
  align-items: center;
  flex-wrap: wrap;
`;

const ThemeToggle = styled.button`
  background: ${(props) => props.theme.buttonBg || '#007bff'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5em 1em;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  max-width: 1400px;
  margin: 0 auto;

  @media (min-width: 1024px) {
    flex-direction: row;
    gap: 2em;
  }
`;

const GamePanel = styled.div`
  flex: 1;
  background: ${(props) => props.theme.panelBg || 'white'};
  border-radius: 12px;
  padding: 1.5em;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ControlPanel = styled.div`
  width: 100%;

  @media (min-width: 1024px) {
    width: 320px;
    flex-shrink: 0;
  }
`;

const ControlSection = styled.div`
  margin-bottom: 1.5em;

  h3 {
    margin: 0 0 1em 0;
    font-size: 1.1em;
    color: ${(props) => props.theme.headingColor || '#333'};
  }
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75em;
`;

const Button = styled.button<{
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
}>`
  background: ${(props) => {
    switch (props.variant) {
      case 'primary':
        return '#007bff';
      case 'success':
        return '#28a745';
      case 'danger':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  }};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75em 1em;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatsDisplay = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1em;
  margin-bottom: 1.5em;
`;

const StatCard = styled.div`
  background: ${(props) => props.theme.statBg || '#f8f9fa'};
  padding: 1em;
  border-radius: 8px;
  text-align: center;

  .label {
    font-size: 0.85em;
    color: ${(props) => props.theme.mutedText || '#666'};
    margin-bottom: 0.5em;
  }

  .value {
    font-size: 1.5em;
    font-weight: bold;
    color: ${(props) => props.theme.primaryColor || '#007bff'};
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 24px;
  background: ${(props) => props.theme.progressBg || '#e9ecef'};
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5em;
  position: relative;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${(props) => props.progress}%;
  background: linear-gradient(90deg, #28a745, #20c997);
  transition: width 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.85em;
  font-weight: 600;
`;

const PuzzleSelector = styled.div`
  margin-bottom: 1.5em;
`;

const DifficultyTabs = styled.div`
  display: flex;
  gap: 0.5em;
  margin-bottom: 1em;
  flex-wrap: wrap;
`;

const DifficultyTab = styled.button<{ active?: boolean }>`
  padding: 0.5em 1em;
  border: 2px solid
    ${(props) =>
      props.active ? props.theme.primaryColor : props.theme.borderColor};
  background: ${(props) =>
    props.active ? props.theme.primaryColor : 'transparent'};
  color: ${(props) =>
    props.active ? 'white' : props.theme.textColor || '#333'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const PuzzleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1em;
  margin-bottom: 1.5em;
`;

const PuzzleCard = styled.div<{ selected?: boolean }>`
  padding: 1em;
  background: ${(props) =>
    props.selected ? props.theme.primaryColor : props.theme.statBg};
  color: ${(props) => (props.selected ? 'white' : 'inherit')};
  border: 2px solid
    ${(props) => (props.selected ? props.theme.primaryColor : 'transparent')};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }

  h4 {
    margin: 0 0 0.5em 0;
    font-size: 1em;
  }

  .info {
    font-size: 0.85em;
    opacity: 0.8;
  }
`;

const celebrate = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const CelebrationModal = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: ${(props) => (props.show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${celebrate} 0.5s ease;
`;

const CelebrationContent = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3em;
  border-radius: 16px;
  text-align: center;
  color: white;
  max-width: 90%;

  h2 {
    font-size: 2.5em;
    margin: 0 0 0.5em 0;
  }

  p {
    font-size: 1.2em;
    margin: 0.5em 0;
  }

  button {
    margin-top: 1.5em;
    padding: 0.75em 2em;
    background: white;
    color: #667eea;
    border: none;
    border-radius: 8px;
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

const Commands = styled.div`
  display: none;
`;

const Command = styled.button`
  display: none;
`;

const CrosswordMessageBlock = styled.div`
  margin: 2em 0 4em;
  display: flex;
  gap: 2em;
  max-height: 20em;
`;

const CrosswordWrapper = styled.div`
  max-width: 30em;

  /* and some fun making use of the defined class names */
  .crossword.correct {
    rect {
      stroke: rgb(100, 200, 100) !important;
    }
    svg > rect {
      fill: rgb(100, 200, 100) !important;
    }
    text {
      fill: rgb(100, 200, 100) !important;
    }
  }

  .clue.correct {
    ::before {
      content: '\u2713'; /* a.k.a. checkmark: ✓ */
      display: inline-block;
      text-decoration: none;
      color: rgb(100, 200, 100);
      margin-right: 0.25em;
    }

    text-decoration: line-through;
    color: rgb(130, 130, 130);
  }
`;

const CrosswordProviderWrapper = styled(CrosswordWrapper)`
  max-width: 50em;
  display: flex;
  gap: 1em;

  .direction {
    width: 10em;

    .header {
      margin-top: 0;
    }
  }

  .grid {
    width: 10em;
  }
`;

const IpuzWrapper = styled(CrosswordProviderWrapper)`
  max-width: 100%;
  .direction {
    width: 25em;
  }
`;

const Messages = styled.pre`
  flex: auto;
  background-color: rgb(230, 230, 230);
  margin: 0;
  padding: 1em;
  overflow: auto;
`;

// Enhanced crossword game with modern features
function App() {
  const crossword = useRef<CrosswordImperative>(null);

  // Theme state
  const [darkMode, setDarkMode] = useState(false);

  // Puzzle selection
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    'easy' | 'medium' | 'hard'
  >('easy');
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleData>(puzzles[0]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Game state
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedClues, setCompletedClues] = useState(0);
  const [totalClues, setTotalClues] = useState(
    Object.keys(selectedPuzzle.data.across).length +
      Object.keys(selectedPuzzle.data.down).length
  );
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentDirection, setCurrentDirection] = useState<'across' | 'down'>(
    'across'
  );
  const [currentNumber, setCurrentNumber] = useState('1');

  // Update total clues when puzzle changes
  useEffect(() => {
    setTotalClues(
      Object.keys(selectedPuzzle.data.across).length +
        Object.keys(selectedPuzzle.data.down).length
    );
  }, [selectedPuzzle]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const theme = {
    borderColor: darkMode ? '#333' : '#ddd',
    buttonBg: darkMode ? '#0d6efd' : '#007bff',
    panelBg: darkMode ? '#16213e' : 'white',
    headingColor: darkMode ? '#eee' : '#333',
    statBg: darkMode ? '#0f3460' : '#f8f9fa',
    mutedText: darkMode ? '#aaa' : '#666',
    primaryColor: darkMode ? '#0d6efd' : '#007bff',
    progressBg: darkMode ? '#0f3460' : '#e9ecef',
    // Crossword theme
    columnBreakpoint: '768px',
    gridBackground: darkMode ? '#0f3460' : 'rgb(0,0,0)',
    cellBackground: darkMode ? '#16213e' : 'rgb(255,255,255)',
    cellBorder: darkMode ? '#333' : 'rgb(0,0,0)',
    textColor: darkMode ? '#eee' : 'rgb(0,0,0)',
    numberColor: darkMode ? 'rgba(255,255,255, 0.3)' : 'rgba(0,0,0, 0.25)',
    focusBackground: darkMode ? 'rgb(255,200,0)' : 'rgb(255,255,0)',
    highlightBackground: darkMode
      ? 'rgba(255,255,100,0.3)'
      : 'rgb(255,255,204)',
  };

  const focus = useCallback<React.MouseEventHandler>((event) => {
    crossword.current?.focus();
  }, []);

  // Handle puzzle selection
  const selectPuzzle = useCallback((puzzle: PuzzleData) => {
    setSelectedPuzzle(puzzle);
    setTimer(0);
    setIsPlaying(false);
    setCompletedClues(0);
    setHintsUsed(0);
    setShowCelebration(false);
    // Reset crossword will happen via key change
  }, []);

  // Reveal one letter hint
  const revealLetter = useCallback<React.MouseEventHandler>(
    (event) => {
      if (!isPlaying) setIsPlaying(true);

      const acrossData: any = selectedPuzzle.data.across;
      const downData: any = selectedPuzzle.data.down;
      const clueData =
        currentDirection === 'across'
          ? acrossData[currentNumber]
          : downData[currentNumber];

      if (clueData) {
        const { row, col, answer } = clueData;
        // Find first empty cell in current word and fill it
        let filled = false;
        for (let i = 0; i < answer.length; i++) {
          const targetRow = currentDirection === 'across' ? row : row + i;
          const targetCol = currentDirection === 'across' ? col + i : col;
          const letter = answer[i];

          // Check if cell is empty (this is simplified - you'd need to check actual state)
          crossword.current?.setGuess(targetRow, targetCol, letter);
          if (!filled) {
            setHintsUsed((prev) => prev + 1);
            filled = true;
            break;
          }
        }
      }
    },
    [currentDirection, currentNumber, isPlaying]
  );

  // Reveal word hint
  const revealWord = useCallback<React.MouseEventHandler>(
    (event) => {
      if (!isPlaying) setIsPlaying(true);

      const acrossData: any = selectedPuzzle.data.across;
      const downData: any = selectedPuzzle.data.down;
      const clueData =
        currentDirection === 'across'
          ? acrossData[currentNumber]
          : downData[currentNumber];

      if (clueData) {
        const { row, col, answer } = clueData;
        // Fill entire word
        for (let i = 0; i < answer.length; i++) {
          const targetRow = currentDirection === 'across' ? row : row + i;
          const targetCol = currentDirection === 'across' ? col + i : col;
          crossword.current?.setGuess(targetRow, targetCol, answer[i]);
        }
        setHintsUsed((prev) => prev + answer.length);
      }
    },
    [currentDirection, currentNumber, isPlaying]
  );

  // Reveal entire puzzle
  const revealPuzzle = useCallback<React.MouseEventHandler>((event) => {
    if (window.confirm('Are you sure you want to reveal the entire puzzle?')) {
      crossword.current?.fillAllAnswers();
      setIsPlaying(false);
    }
  }, []);

  const reset = useCallback<React.MouseEventHandler>((event) => {
    if (window.confirm('Reset the puzzle? This will clear all progress.')) {
      crossword.current?.reset();
      setTimer(0);
      setIsPlaying(false);
      setCompletedClues(0);
      setHintsUsed(0);
    }
  }, []);

  // We don't really *do* anything with callbacks from the Crossword component,
  // but we can at least show that they are happening.  You would want to do
  // something more interesting than simply collecting them as messages.
  const messagesRef = useRef<HTMLPreElement>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const clearMessages = useCallback<React.MouseEventHandler>((event) => {
    setMessages([]);
  }, []);

  const addMessage = useCallback((message: string) => {
    setMessages((m) => m.concat(`${message}\n`));
  }, []);

  useEffect(() => {
    if (!messagesRef.current) {
      return;
    }
    const { scrollHeight } = messagesRef.current;
    messagesRef.current.scrollTo(0, scrollHeight);
  }, [messages]);

  // onCorrect is called with the direction, number, and the correct answer.
  const onCorrect = useCallback<Required<CrosswordProps>['onCorrect']>(
    (direction, number, answer) => {
      addMessage(`onCorrect: "${direction}", "${number}", "${answer}"`);
      setCompletedClues((prev) => prev + 1);
      if (!isPlaying) setIsPlaying(true);
    },
    [addMessage, isPlaying]
  );

  // onLoadedCorrect is called with an array of the already-correct answers,
  // each element itself is an array with the same values as in onCorrect: the
  // direction, number, and the correct answer.
  const onLoadedCorrect = useCallback<
    Required<CrosswordProps>['onLoadedCorrect']
  >(
    (answers) => {
      addMessage(
        `onLoadedCorrect:\n${answers
          .map(
            ([direction, number, answer]) =>
              `    - "${direction}", "${number}", "${answer}"`
          )
          .join('\n')}`
      );
    },
    [addMessage]
  );

  // onCrosswordCorrect is called with a truthy/falsy value.
  const onCrosswordCorrect = useCallback<
    Required<CrosswordProps>['onCrosswordCorrect']
  >(
    (isCorrect) => {
      addMessage(`onCrosswordCorrect: ${JSON.stringify(isCorrect)}`);
      if (isCorrect) {
        setIsPlaying(false);
        setShowCelebration(true);
      }
    },
    [addMessage]
  );

  // onCellChange is called with the row, column, and character.
  const onCellChange = useCallback<Required<CrosswordProps>['onCellChange']>(
    (row, col, char) => {
      addMessage(`onCellChange: "${row}", "${col}", "${char}"`);
      if (!isPlaying && char) setIsPlaying(true);
    },
    [addMessage, isPlaying]
  );

  // Track clue selection
  const onClueSelected = useCallback(
    (direction: 'across' | 'down', number: string) => {
      setCurrentDirection(direction);
      setCurrentNumber(number);
    },
    []
  );

  // all the same functionality, but for the decomposed CrosswordProvider
  const crosswordProvider = useRef<CrosswordProviderImperative>(null);

  const focusProvider = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.focus();
  }, []);

  const fillOneCellProvider = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.setGuess(0, 2, 'O');
  }, []);

  const fillAllAnswersProvider = useCallback<React.MouseEventHandler>(
    (event) => {
      crosswordProvider.current?.fillAllAnswers();
    },
    []
  );

  const resetProvider = useCallback<React.MouseEventHandler>((event) => {
    crosswordProvider.current?.reset();
  }, []);

  // We don't really *do* anything with callbacks from the Crossword component,
  // but we can at least show that they are happening.  You would want to do
  // something more interesting than simply collecting them as messages.
  const messagesProviderRef = useRef<HTMLPreElement>(null);
  const [messagesProvider, setMessagesProvider] = useState<string[]>([]);

  const clearMessagesProvider = useCallback<React.MouseEventHandler>(
    (event) => {
      setMessagesProvider([]);
    },
    []
  );

  const addMessageProvider = useCallback((message: string) => {
    setMessagesProvider((m) => m.concat(`${message}\n`));
  }, []);

  useEffect(() => {
    if (!messagesProviderRef.current) {
      return;
    }
    const { scrollHeight } = messagesProviderRef.current;
    messagesProviderRef.current.scrollTo(0, scrollHeight);
  }, [messagesProvider]);

  // onCorrect is called with the direction, number, and the correct answer.
  const onCorrectProvider = useCallback<
    Required<CrosswordProviderProps>['onCorrect']
  >(
    (direction, number, answer) => {
      addMessageProvider(`onCorrect: "${direction}", "${number}", "${answer}"`);
    },
    [addMessageProvider]
  );

  // onLoadedCorrect is called with an array of the already-correct answers,
  // each element itself is an array with the same values as in onCorrect: the
  // direction, number, and the correct answer.
  const onLoadedCorrectProvider = useCallback<
    Required<CrosswordProviderProps>['onLoadedCorrect']
  >(
    (answers) => {
      addMessageProvider(
        `onLoadedCorrect:\n${answers
          .map(
            ([direction, number, answer]) =>
              `    - "${direction}", "${number}", "${answer}"`
          )
          .join('\n')}`
      );
    },
    [addMessageProvider]
  );

  // onCrosswordCorrect is called with a truthy/falsy value.
  const onCrosswordCorrectProvider = useCallback<
    Required<CrosswordProviderProps>['onCrosswordCorrect']
  >(
    (isCorrect) => {
      addMessageProvider(`onCrosswordCorrect: ${JSON.stringify(isCorrect)}`);
    },
    [addMessageProvider]
  );

  // onCellChange is called with the row, column, and character.
  const onCellChangeProvider = useCallback<
    Required<CrosswordProviderProps>['onCellChange']
  >(
    (row, col, char) => {
      addMessageProvider(`onCellChange: "${row}", "${col}", "${char}"`);
    },
    [addMessageProvider]
  );

  const fromIpuz = useIpuz(ipuzData);

  const progress =
    totalClues > 0 ? Math.round((completedClues / totalClues) * 100) : 0;
  const filteredPuzzles = getPuzzlesByDifficulty(selectedDifficulty);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle darkMode={darkMode} />
      <Page>
        <Header>
          <h1>🎯 Classic Crossword Puzzle</h1>
          <HeaderControls>
            <ThemeToggle onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </ThemeToggle>
            <DbVerification />
          </HeaderControls>
        </Header>

        <GamePanel>
          <PuzzleSelector role="region" aria-label="Puzzle Selection">
            <h3>Select a Puzzle</h3>
            <DifficultyTabs role="tablist" aria-label="Difficulty levels">
              <DifficultyTab
                role="tab"
                aria-selected={selectedDifficulty === 'easy'}
                aria-label="Easy difficulty puzzles"
                active={selectedDifficulty === 'easy'}
                onClick={() => setSelectedDifficulty('easy')}
              >
                😊 Easy
              </DifficultyTab>
              <DifficultyTab
                role="tab"
                aria-selected={selectedDifficulty === 'medium'}
                aria-label="Medium difficulty puzzles"
                active={selectedDifficulty === 'medium'}
                onClick={() => setSelectedDifficulty('medium')}
              >
                🤔 Medium
              </DifficultyTab>
              <DifficultyTab
                role="tab"
                aria-selected={selectedDifficulty === 'hard'}
                aria-label="Hard difficulty puzzles"
                active={selectedDifficulty === 'hard'}
                onClick={() => setSelectedDifficulty('hard')}
              >
                🔥 Hard
              </DifficultyTab>
            </DifficultyTabs>
            <PuzzleGrid role="list" aria-label="Available puzzles">
              {filteredPuzzles.map((puzzle) => (
                <PuzzleCard
                  key={puzzle.id}
                  role="listitem"
                  selected={puzzle.id === selectedPuzzle.id}
                  onClick={() => selectPuzzle(puzzle)}
                  aria-label={`${puzzle.title}, ${
                    puzzle.difficulty
                  } difficulty, ${
                    Object.keys(puzzle.data.across).length +
                    Object.keys(puzzle.data.down).length
                  } clues`}
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && selectPuzzle(puzzle)}
                >
                  <h4>{puzzle.title}</h4>
                  <div className="info">
                    {puzzle.author && `by ${puzzle.author}`}
                  </div>
                  <div className="info">
                    {Object.keys(puzzle.data.across).length +
                      Object.keys(puzzle.data.down).length}{' '}
                    clues
                  </div>
                </PuzzleCard>
              ))}
            </PuzzleGrid>
          </PuzzleSelector>
        </GamePanel>

        <GameContainer>
          <GamePanel>
            <h3>{selectedPuzzle.title}</h3>
            <ProgressBar>
              <ProgressFill progress={progress}>
                {progress}% Complete
              </ProgressFill>
            </ProgressBar>

            <CrosswordWrapper>
              <Crossword
                key={selectedPuzzle.id}
                ref={crossword}
                data={selectedPuzzle.data}
                storageKey={`crossword-${selectedPuzzle.id}`}
                onCorrect={onCorrect}
                onLoadedCorrect={onLoadedCorrect}
                onCrosswordCorrect={onCrosswordCorrect}
                onCellChange={onCellChange}
                onClueSelected={onClueSelected}
                theme={theme}
              />
            </CrosswordWrapper>
          </GamePanel>

          <ControlPanel>
            <GamePanel>
              <ControlSection>
                <h3>📊 Game Stats</h3>
                <StatsDisplay>
                  <StatCard>
                    <div className="label">Time</div>
                    <div className="value">{formatTime(timer)}</div>
                  </StatCard>
                  <StatCard>
                    <div className="label">Completed</div>
                    <div className="value">
                      {completedClues}/{totalClues}
                    </div>
                  </StatCard>
                  <StatCard>
                    <div className="label">Hints Used</div>
                    <div className="value">{hintsUsed}</div>
                  </StatCard>
                  <StatCard>
                    <div className="label">Progress</div>
                    <div className="value">{progress}%</div>
                  </StatCard>
                </StatsDisplay>
              </ControlSection>

              <ControlSection>
                <h3>💡 Hint Options</h3>
                <ButtonGroup role="group" aria-label="Hint controls">
                  <Button
                    variant="primary"
                    onClick={revealLetter}
                    aria-label="Reveal one letter in current word"
                  >
                    📝 Reveal Letter
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={revealWord}
                    aria-label="Reveal entire current word"
                  >
                    📖 Reveal Word
                  </Button>
                  <Button
                    variant="danger"
                    onClick={revealPuzzle}
                    aria-label="Reveal entire puzzle solution"
                  >
                    🔓 Reveal All
                  </Button>
                </ButtonGroup>
              </ControlSection>

              <ControlSection>
                <h3>🎮 Game Controls</h3>
                <ButtonGroup>
                  <Button variant="primary" onClick={focus}>
                    🎯 Focus Grid
                  </Button>
                  <Button variant="danger" onClick={reset}>
                    🔄 Reset Puzzle
                  </Button>
                </ButtonGroup>
              </ControlSection>

              <ControlSection>
                <h3>📋 Activity Log</h3>
                <Messages ref={messagesRef}>{messages}</Messages>
                <Button
                  variant="secondary"
                  onClick={clearMessages}
                  style={{ marginTop: '0.5em', width: '100%' }}
                >
                  Clear Log
                </Button>
              </ControlSection>
            </GamePanel>
          </ControlPanel>
        </GameContainer>

        <CelebrationModal show={showCelebration}>
          <CelebrationContent>
            <h2>🎉 Congratulations! 🎉</h2>
            <p>You completed the puzzle!</p>
            <p>Time: {formatTime(timer)}</p>
            <p>Hints used: {hintsUsed}</p>
            <button onClick={() => setShowCelebration(false)}>Continue</button>
          </CelebrationContent>
        </CelebrationModal>
      </Page>
    </ThemeProvider>
  );
}

export default App;

/* OLD EXAMPLE CODE - PRESERVED FOR REFERENCE BUT NOT RENDERED
      <p>
        And here’s a decomposed version, showing more control of the individual
        components (intended for specific layout needs).
      </p>

      <Commands>
        <Command onClick={focusProvider}>Focus</Command>
        <Command onClick={fillOneCellProvider}>
          Fill the first letter of 2-down
        </Command>
        <Command onClick={fillAllAnswersProvider}>Fill all answers</Command>
        <Command onClick={resetProvider}>Reset</Command>
        <Command onClick={clearMessagesProvider}>Clear messages</Command>
      </Commands>

      <CrosswordMessageBlock>
        <CrosswordProviderWrapper>
          <CrosswordProvider
            ref={crosswordProvider}
            data={data}
            storageKey="second-example"
            onCorrect={onCorrectProvider}
            onLoadedCorrect={onLoadedCorrectProvider}
            onCrosswordCorrect={onCrosswordCorrectProvider}
            onCellChange={onCellChangeProvider}
          >
            <DirectionClues direction="across" />
            <CrosswordGrid />
            <DirectionClues direction="down" />
          </CrosswordProvider>
        </CrosswordProviderWrapper>

        <Messages ref={messagesProviderRef}>{messagesProvider}</Messages>
      </CrosswordMessageBlock>

      <p>A proof-of-concept for non-square crosswords:</p>

      <CrosswordMessageBlock>
        <CrosswordWrapper>
          <Crossword
            data={{
              across: {
                1: {
                  clue: 'one plus one',
                  answer: 'TWO',
                  row: 0,
                  col: 0,
                },
              },
              down: {
                2: {
                  clue: 'opposite of "off"',
                  answer: 'ON',
                  row: 0,
                  col: 2,
                },
              },
            }}
            theme={{ allowNonSquare: true }}
            storageKey="third-example"
          />
        </CrosswordWrapper>
      </CrosswordMessageBlock>

      <p>And support for IPUZ crosswords:</p>

      <IpuzWrapper>
        <CrosswordProvider data={fromIpuz!} storageKey="ipuz-example">
          <DirectionClues direction="across" />
          <CrosswordGrid />
          <DirectionClues direction="down" />
        </CrosswordProvider>
      </IpuzWrapper>

*/
