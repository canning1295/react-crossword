import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  CrosswordGrid,
  CrosswordProvider,
  CrosswordProviderImperative,
  CrosswordProviderProps,
  DirectionClues,
  useIpuz,
} from '@jaredreisinger/react-crossword';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import {
  puzzles as initialPuzzles,
  normalizeDifficulty,
  isIpuzCrossword,
  createPuzzleSignature,
  type PuzzleLibraryEntry,
  type IpuzPuzzle,
} from './puzzleData';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .trim();
}

function ensureUniqueId(base: string, existing: PuzzleLibraryEntry[]) {
  const fallback = base || 'puzzle';
  const used = new Set(existing.map((entry) => entry.id));
  if (!used.has(fallback)) {
    return fallback;
  }

  let index = 2;
  while (used.has(`${fallback}-${index}`)) {
    index += 1;
  }

  return `${fallback}-${index}`;
}

const GlobalStyle = createGlobalStyle<{ darkMode: boolean }>`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: 'Franklin Gothic Medium', 'Helvetica Neue', Arial, sans-serif;
    background: ${(props) => (props.darkMode ? '#111111' : '#f5f5f5')};
    color: ${(props) => (props.darkMode ? '#f4f4f4' : '#222222')};
    transition: background 0.3s ease, color 0.3s ease;
  }

  a {
    color: inherit;
  }
`;

const AppShell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  background: ${(props) => props.theme.panel};
  border-bottom: 1px solid ${(props) => props.theme.border};
`;

const ControlGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
`;

const SelectControl = styled.select`
  appearance: none;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.panel};
  color: ${(props) => props.theme.text};
  border-radius: 6px;
  padding: 0.4rem 0.85rem;
  font-size: 0.95rem;
  cursor: pointer;
`;

const Button = styled.button`
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.panel};
  color: ${(props) => props.theme.text};
  border-radius: 999px;
  padding: 0.45rem 1rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ImportNotice = styled.p`
  margin: 0;
  padding: 0.75rem 1.5rem;
  background: ${(props) => props.theme.panel};
  border-bottom: 1px solid ${(props) => props.theme.border};
  color: ${(props) => props.theme.accent};
  font-size: 0.9rem;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const BoardColumn = styled.section`
  flex: 2 1 60%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const CluesColumn = styled.aside`
  flex: 1 1 40%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const PuzzleTitle = styled.h1`
  margin: 0;
  font-size: 1.65rem;
  font-weight: 600;
`;

const PuzzleMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.9rem;
  color: ${(props) => props.theme.muted};
`;

const StatsBar = styled.div`
  display: flex;
  gap: 1.25rem;
  font-size: 0.95rem;
  color: ${(props) => props.theme.muted};
`;

const Stat = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 0.25rem;
`;

const CrosswordFrame = styled.div`
  background: ${(props) => props.theme.panel};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BoardControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
`;

const HintSelect = styled.select`
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.panel};
  color: ${(props) => props.theme.text};
  border-radius: 6px;
  padding: 0.4rem 0.75rem;
  font-size: 0.95rem;
`;

const ClueSection = styled.section`
  background: ${(props) => props.theme.panel};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 12px;
  padding: 1rem;
  flex: 1;
  min-height: 0;

  .direction {
    max-height: 60vh;
    overflow-y: auto;
    padding-right: 0.5rem;
  }

  .direction .header {
    display: none;
  }

  .clue {
    font-size: 0.95rem;
    padding: 0.35rem 0;
  }
`;

const ClueHeader = styled.h2`
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${(props) => props.theme.muted};
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: ${(props) => props.theme.muted};
`;

const CelebrationOverlay = styled.div<{ show: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: ${(props) => (props.show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const CelebrationCard = styled.div`
  background: ${(props) => props.theme.panel};
  color: ${(props) => props.theme.text};
  padding: 2.5rem 3rem;
  border-radius: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
`;

function App() {
  const crosswordRef = useRef<CrosswordProviderImperative>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [library, setLibrary] = useState<PuzzleLibraryEntry[]>(initialPuzzles);
  const [selectedPuzzleId, setSelectedPuzzleId] = useState(
    initialPuzzles[0]?.id ?? ''
  );
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [hintChoice, setHintChoice] = useState('');
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedClues, setCompletedClues] = useState(0);
  const [totalClues, setTotalClues] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentDirection, setCurrentDirection] = useState<'across' | 'down'>(
    'across'
  );
  const [currentNumber, setCurrentNumber] = useState('1');
  const [showCelebration, setShowCelebration] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const difficultyOptions = useMemo(() => {
    const map = new Map<string, string>();
    library.forEach((entry) => {
      if (!entry.difficulty) {
        return;
      }
      const key = normalizeDifficulty(entry.difficulty);
      if (!key || map.has(key)) {
        return;
      }
      map.set(key, entry.difficulty);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [library]);

  const filteredLibrary = useMemo(() => {
    if (activeDifficulty === 'all') {
      return library;
    }
    return library.filter((entry) =>
      entry.difficulty
        ? normalizeDifficulty(entry.difficulty) === activeDifficulty
        : false
    );
  }, [activeDifficulty, library]);

  useEffect(() => {
    if (activeDifficulty !== 'all' && filteredLibrary.length === 0) {
      setActiveDifficulty('all');
    }
  }, [activeDifficulty, filteredLibrary.length]);

  useEffect(() => {
    if (filteredLibrary.length === 0) {
      return;
    }
    if (!filteredLibrary.some((entry) => entry.id === selectedPuzzleId)) {
      setSelectedPuzzleId(filteredLibrary[0].id);
    }
  }, [filteredLibrary, selectedPuzzleId]);

  const selectedPuzzle = useMemo(() => {
    if (filteredLibrary.length === 0) {
      return null;
    }
    return (
      filteredLibrary.find((entry) => entry.id === selectedPuzzleId) ||
      filteredLibrary[0]
    );
  }, [filteredLibrary, selectedPuzzleId]);

  const crosswordData = useIpuz(selectedPuzzle?.ipuz ?? null);

  const theme = useMemo(
    () => ({
      background: darkMode ? '#111111' : '#f5f5f5',
      text: darkMode ? '#f4f4f4' : '#222222',
      border: darkMode ? '#2d2d2d' : '#dadada',
      panel: darkMode ? '#1b1b1d' : '#ffffff',
      accent: darkMode ? '#ffd166' : '#0077ff',
      muted: darkMode ? '#9c9c9c' : '#666666',
    }),
    [darkMode]
  );

  const crosswordTheme = useMemo<CrosswordProviderProps['theme']>(
    () => ({
      allowNonSquare: true,
      columnBreakpoint: '720px',
      gridBackground: darkMode ? '#101010' : '#000000',
      cellBackground: darkMode ? '#1f1f1f' : '#ffffff',
      cellBorder: darkMode ? '#383838' : '#333333',
      textColor: darkMode ? '#f5f5f5' : '#111111',
      numberColor: darkMode
        ? 'rgba(255, 255, 255, 0.35)'
        : 'rgba(0, 0, 0, 0.35)',
      focusBackground: darkMode ? '#ffd166' : '#fff175',
      highlightBackground: darkMode
        ? 'rgba(255, 209, 102, 0.2)'
        : 'rgba(255, 241, 117, 0.45)',
    }),
    [darkMode]
  );

  useEffect(() => {
    if (!crosswordData) {
      setTotalClues(0);
      return;
    }
    const acrossCount = Object.keys(crosswordData.across).length;
    const downCount = Object.keys(crosswordData.down).length;
    setTotalClues(acrossCount + downCount);
    setCompletedClues(0);
    setHintsUsed(0);
    setTimer(0);
    setIsPlaying(false);
    setShowCelebration(false);
    setCurrentDirection('across');
    setCurrentNumber('1');
  }, [crosswordData]);

  useEffect(() => {
    if (!isPlaying) {
      return undefined;
    }
    const interval = window.setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!importStatus) {
      return undefined;
    }
    const timeout = window.setTimeout(() => setImportStatus(null), 6000);
    return () => window.clearTimeout(timeout);
  }, [importStatus]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const focus = useCallback(() => {
    crosswordRef.current?.focus();
  }, []);

  const revealLetter = useCallback(() => {
    if (!crosswordData) {
      return;
    }
    if (!isPlaying) {
      setIsPlaying(true);
    }
    const clueSet =
      currentDirection === 'across' ? crosswordData.across : crosswordData.down;
    const clue = clueSet?.[currentNumber];
    if (!clue) {
      return;
    }
    const { row, col, answer } = clue;
    for (let i = 0; i < answer.length; i += 1) {
      const targetRow = currentDirection === 'across' ? row : row + i;
      const targetCol = currentDirection === 'across' ? col + i : col;
      crosswordRef.current?.setGuess(targetRow, targetCol, answer[i]);
      setHintsUsed((prev) => prev + 1);
      break;
    }
  }, [crosswordData, currentDirection, currentNumber, isPlaying]);

  const revealWord = useCallback(() => {
    if (!crosswordData) {
      return;
    }
    if (!isPlaying) {
      setIsPlaying(true);
    }
    const clueSet =
      currentDirection === 'across' ? crosswordData.across : crosswordData.down;
    const clue = clueSet?.[currentNumber];
    if (!clue) {
      return;
    }
    const { row, col, answer } = clue;
    for (let i = 0; i < answer.length; i += 1) {
      const targetRow = currentDirection === 'across' ? row : row + i;
      const targetCol = currentDirection === 'across' ? col + i : col;
      crosswordRef.current?.setGuess(targetRow, targetCol, answer[i]);
    }
    setHintsUsed((prev) => prev + answer.length);
  }, [crosswordData, currentDirection, currentNumber, isPlaying]);

  const revealPuzzle = useCallback(() => {
    if (
      window.confirm(
        'Reveal the entire puzzle? This cannot be undone for this attempt.'
      )
    ) {
      crosswordRef.current?.fillAllAnswers();
      setIsPlaying(false);
    }
  }, []);

  const reset = useCallback(() => {
    if (window.confirm('Reset the puzzle and clear all progress?')) {
      crosswordRef.current?.reset();
      setTimer(0);
      setIsPlaying(false);
      setCompletedClues(0);
      setHintsUsed(0);
      setShowCelebration(false);
    }
  }, []);

  const onCorrect = useCallback<
    Required<CrosswordProviderProps>['onCorrect']
  >(() => {
    setCompletedClues((prev) => Math.min(prev + 1, totalClues));
    if (!isPlaying) {
      setIsPlaying(true);
    }
  }, [isPlaying, totalClues]);

  const onLoadedCorrect = useCallback<
    Required<CrosswordProviderProps>['onLoadedCorrect']
  >((answers) => {
    setCompletedClues(answers.length);
    if (answers.length > 0) {
      setIsPlaying(true);
    }
  }, []);

  const onCrosswordCorrect = useCallback<
    Required<CrosswordProviderProps>['onCrosswordCorrect']
  >(
    (correct) => {
      if (correct) {
        setIsPlaying(false);
        setShowCelebration(true);
        setCompletedClues(totalClues);
      }
    },
    [totalClues]
  );

  const onCellChange = useCallback<
    Required<CrosswordProviderProps>['onCellChange']
  >(
    (_row, _col, char) => {
      if (!isPlaying && char) {
        setIsPlaying(true);
      }
    },
    [isPlaying]
  );

  const onClueSelected = useCallback(
    (direction: 'across' | 'down', number: string) => {
      setCurrentDirection(direction);
      setCurrentNumber(number);
    },
    []
  );

  const handleHintChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setHintChoice(event.target.value);
    },
    []
  );

  useEffect(() => {
    if (!hintChoice) {
      return;
    }
    if (hintChoice === 'letter') {
      revealLetter();
    } else if (hintChoice === 'word') {
      revealWord();
    } else if (hintChoice === 'puzzle') {
      revealPuzzle();
    }
    setHintChoice('');
  }, [hintChoice, revealLetter, revealWord, revealPuzzle]);

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImportFile = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      try {
        const text = await file.text();
        const parsed = JSON.parse(text) as unknown;

        if (!isIpuzCrossword(parsed)) {
          throw new Error('File is not a supported IPUZ crossword.');
        }

        const ipuz = parsed as IpuzPuzzle;
        const signature = createPuzzleSignature(ipuz);
        const labelSource =
          ipuz.title?.trim() || file.name.replace(/\.(ipuz|json)$/i, '').trim();

        let message = '';
        let createdEntry: PuzzleLibraryEntry | null = null;

        setLibrary((prev) => {
          if (
            prev.some((entry) => entry.signature === signature) ||
            (ipuz.uniqueid &&
              prev.some((entry) => entry.ipuz.uniqueid === ipuz.uniqueid))
          ) {
            message = 'That puzzle is already in your library.';
            return prev;
          }

          const baseId = slugify(ipuz.uniqueid ?? labelSource);
          const id = ensureUniqueId(baseId, prev);
          createdEntry = {
            id,
            label: labelSource || `Imported puzzle ${prev.length + 1}`,
            ipuz,
            difficulty: ipuz.difficulty,
            author: ipuz.author,
            signature,
          };

          const next = [...prev, createdEntry].sort((a, b) =>
            a.label.localeCompare(b.label)
          );
          message = `Imported "${createdEntry.label}".`;
          return next;
        });

        if (createdEntry) {
          setActiveDifficulty('all');
          setSelectedPuzzleId(createdEntry.id);
        }

        setImportStatus(message || 'Puzzle imported.');
      } catch (error) {
        setImportStatus(
          error instanceof Error
            ? error.message
            : 'Unable to import the selected file.'
        );
      } finally {
        event.target.value = '';
      }
    },
    []
  );

  const progress =
    totalClues > 0 ? Math.round((completedClues / totalClues) * 100) : 0;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle darkMode={darkMode} />
      <AppShell>
        <TopBar>
          <ControlGroup>
            {difficultyOptions.length > 0 && (
              <SelectControl
                value={activeDifficulty}
                onChange={(event) => setActiveDifficulty(event.target.value)}
              >
                <option value="all">All difficulties</option>
                {difficultyOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </SelectControl>
            )}
            <SelectControl
              value={selectedPuzzle?.id ?? ''}
              onChange={(event) => setSelectedPuzzleId(event.target.value)}
              disabled={filteredLibrary.length === 0}
            >
              {filteredLibrary.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                  {entry.difficulty ? ` (${entry.difficulty})` : ''}
                </option>
              ))}
            </SelectControl>
            <Button type="button" onClick={handleImportClick}>
              Import IPUZ
            </Button>
            <HiddenFileInput
              ref={fileInputRef}
              type="file"
              accept=".ipuz,application/json"
              onChange={handleImportFile}
            />
          </ControlGroup>
          <ControlGroup>
            <Button type="button" onClick={() => setDarkMode((prev) => !prev)}>
              {darkMode ? '☀️ Light mode' : '🌙 Dark mode'}
            </Button>
          </ControlGroup>
        </TopBar>
        {importStatus && <ImportNotice>{importStatus}</ImportNotice>}
        {crosswordData && selectedPuzzle ? (
          <CrosswordProvider
            key={selectedPuzzle.id}
            ref={crosswordRef}
            data={crosswordData}
            storageKey={`ipuz-${selectedPuzzle.id}`}
            theme={crosswordTheme}
            onCorrect={onCorrect}
            onLoadedCorrect={onLoadedCorrect}
            onCrosswordCorrect={onCrosswordCorrect}
            onCellChange={onCellChange}
            onClueSelected={onClueSelected}
          >
            <MainContent>
              <BoardColumn>
                <div>
                  <PuzzleTitle>{selectedPuzzle.label}</PuzzleTitle>
                  <PuzzleMeta>
                    {selectedPuzzle.ipuz.author && (
                      <span>{selectedPuzzle.ipuz.author}</span>
                    )}
                    {selectedPuzzle.ipuz.difficulty && (
                      <span>{selectedPuzzle.ipuz.difficulty}</span>
                    )}
                    {selectedPuzzle.ipuz.date && (
                      <span>{selectedPuzzle.ipuz.date}</span>
                    )}
                  </PuzzleMeta>
                </div>
                <StatsBar>
                  <Stat>
                    <strong>Time</strong> {formatTime(timer)}
                  </Stat>
                  <Stat>
                    <strong>Progress</strong> {progress}%
                  </Stat>
                  <Stat>
                    <strong>Hints</strong> {hintsUsed}
                  </Stat>
                </StatsBar>
                <CrosswordFrame>
                  <CrosswordGrid />
                </CrosswordFrame>
                <BoardControls>
                  <HintSelect
                    value={hintChoice}
                    onChange={handleHintChange}
                    disabled={!crosswordData}
                  >
                    <option value="">Hints</option>
                    <option value="letter">Reveal one letter</option>
                    <option value="word">Reveal this answer</option>
                    <option value="puzzle">Reveal the puzzle</option>
                  </HintSelect>
                  <Button type="button" onClick={focus}>
                    Focus grid
                  </Button>
                  <Button type="button" onClick={reset}>
                    Reset puzzle
                  </Button>
                </BoardControls>
              </BoardColumn>
              <CluesColumn>
                <ClueSection>
                  <ClueHeader>Across</ClueHeader>
                  <DirectionClues direction="across" />
                </ClueSection>
                <ClueSection>
                  <ClueHeader>Down</ClueHeader>
                  <DirectionClues direction="down" />
                </ClueSection>
              </CluesColumn>
            </MainContent>
          </CrosswordProvider>
        ) : (
          <EmptyState>No crossword selected.</EmptyState>
        )}
        <CelebrationOverlay show={showCelebration}>
          <CelebrationCard>
            <h2>Great solve!</h2>
            <p>You finished in {formatTime(timer)}.</p>
            <p>Hints used: {hintsUsed}</p>
            <Button type="button" onClick={() => setShowCelebration(false)}>
              Keep playing
            </Button>
          </CelebrationCard>
        </CelebrationOverlay>
      </AppShell>
    </ThemeProvider>
  );
}

export default App;
