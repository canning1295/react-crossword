import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  CrosswordContext,
  CrosswordGrid,
  CrosswordProvider,
  CrosswordProviderImperative,
  CrosswordProviderProps,
  DirectionClues,
  useIpuz,
} from '@jaredreisinger/react-crossword';
import styled, {
  createGlobalStyle,
  ThemeProvider,
  css,
} from 'styled-components';
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

const IPUZZLER_PUZZLE_SOURCE =
  'https://api.github.com/repos/dylanbeattie/ipuzzler/contents/gh-pages/puzzles';
const MAX_REMOTE_PUZZLES = 20;

interface GithubContentItem {
  name: string;
  download_url?: string;
  type: string;
}

interface PendingRemoteEntry {
  baseId: string;
  label: string;
  ipuz: IpuzPuzzle;
  signature: string;
  difficulty?: string;
  author?: string;
}

type PuzzleProgressState = 'not-started' | 'in-progress' | 'completed';

const progressStatusLabels: Record<PuzzleProgressState, string> = {
  'not-started': '',
  'in-progress': 'In progress',
  completed: 'Completed',
};

const progressOrdering: PuzzleProgressState[] = [
  'in-progress',
  'not-started',
  'completed',
];

function prettifyLabelFromFilename(name: string) {
  return name
    .replace(/\.ipuz$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getSolutionCharacter(
  cell: unknown,
  blockValue: string,
  emptyValue: string
) {
  if (cell === null || cell === undefined) {
    return null;
  }

  if (typeof cell === 'string') {
    if (
      cell === '' ||
      cell === '#' ||
      cell === blockValue ||
      cell === emptyValue
    ) {
      return null;
    }
    return cell;
  }

  if (typeof cell === 'number') {
    if (cell === 0) {
      return null;
    }
    return cell.toString();
  }

  if (typeof cell === 'object') {
    const maybeValue = (cell as { value?: unknown }).value;
    if (typeof maybeValue === 'string') {
      if (
        maybeValue === '' ||
        maybeValue === '#' ||
        maybeValue === blockValue ||
        maybeValue === emptyValue
      ) {
        return null;
      }
      return maybeValue;
    }
  }

  return null;
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

const StartScreen = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
`;

const StartCard = styled.div`
  width: min(720px, 100%);
  background: ${(props) => props.theme.panel};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const StartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

const StartTitle = styled.h1`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
`;

const StartDescription = styled.p`
  margin: 0.25rem 0 0 0;
  color: ${(props) => props.theme.muted};
  font-size: 0.95rem;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const SelectRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const OptionsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 1.1rem;
  height: 1.1rem;
  accent-color: ${(props) => props.theme.accent};
`;

const StartButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.75rem;
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

const PuzzleScreenContainer = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem;
`;

const PuzzleHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

const BackButton = styled.button`
  border: none;
  background: none;
  color: ${(props) => props.theme.text};
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
`;

const MetaContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  gap: 0.35rem;
`;

const MetaTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const MetaDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: ${(props) => props.theme.muted};
  font-size: 0.95rem;
`;

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
`;

const ActionSelect = styled.select`
  min-width: 12rem;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.panel};
  color: ${(props) => props.theme.text};
  border-radius: 6px;
  padding: 0.5rem 0.85rem;
  font-size: 0.95rem;
`;

const ActionsGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const StatsBar = styled.div`
  display: flex;
  gap: 1.25rem;
  font-size: 0.95rem;
  color: ${(props) => props.theme.muted};
  flex-wrap: wrap;
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

const ActiveClueBox = styled.div<{
  status: 'correct' | 'incorrect' | 'neutral';
  showStatus: boolean;
}>`
  border-radius: 12px;
  border: 1px solid
    ${(props) => {
      if (!props.showStatus) {
        return props.theme.border;
      }
      if (props.status === 'correct') {
        return 'rgba(46, 160, 67, 0.35)';
      }
      if (props.status === 'incorrect') {
        return 'rgba(208, 44, 44, 0.45)';
      }
      return props.theme.border;
    }};
  background: ${(props) => {
    if (!props.showStatus) {
      return props.theme.panel;
    }
    if (props.status === 'correct') {
      return 'rgba(46, 160, 67, 0.15)';
    }
    if (props.status === 'incorrect') {
      return 'rgba(208, 44, 44, 0.15)';
    }
    return props.theme.panel;
  }};
  color: ${(props) => {
    if (!props.showStatus) {
      return props.theme.text;
    }
    if (props.status === 'correct') {
      return '#1d7a2f';
    }
    if (props.status === 'incorrect') {
      return '#b3261e';
    }
    return props.theme.text;
  }};
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-height: 72px;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
`;

const ActiveClueLabel = styled.span`
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${(props) => props.theme.muted};
`;

const ActiveClueText = styled.span`
  font-size: 1rem;
`;

const ClueLists = styled.div<{ showStatus: boolean }>`
  display: grid;
  gap: 1.25rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .direction {
    background: ${(props) => props.theme.panel};
    border: 1px solid ${(props) => props.theme.border};
    border-radius: 12px;
    padding: 1rem;
    max-height: 45vh;
    overflow-y: auto;
  }

  .direction .header {
    margin-top: 0;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${(props) => props.theme.muted};
  }

  .clue {
    font-size: 0.95rem;
    padding: 0.35rem 0;
    display: flex;
    align-items: baseline;
  }

  ${(props) =>
    props.showStatus &&
    css`
      .clue.correct {
        color: #1d7a2f;
        font-weight: 600;
      }

      .clue.correct::after {
        content: '✔';
        margin-left: 0.5rem;
      }

      .clue.incorrect {
        color: #b3261e;
        font-weight: 600;
      }

      .clue.incorrect::after {
        content: '✖';
        margin-left: 0.5rem;
      }
    `}
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
  const [screen, setScreen] = useState<'start' | 'puzzle'>('start');
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedClues, setCompletedClues] = useState(0);
  const [totalClues, setTotalClues] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [allowHints, setAllowHints] = useState(true);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(true);
  const [puzzleStoreStatus, setPuzzleStoreStatus] = useState<
    'idle' | 'loading' | 'ready' | 'error'
  >('idle');
  const [puzzleStoreError, setPuzzleStoreError] = useState<string | null>(null);
  const [remotePuzzleCount, setRemotePuzzleCount] = useState(0);
  const [puzzleProgress, setPuzzleProgress] = useState<
    Record<string, PuzzleProgressState>
  >({});

  const computePuzzleProgress = useCallback(
    (entry: PuzzleLibraryEntry): PuzzleProgressState => {
      if (typeof window === 'undefined' || !window.localStorage) {
        return 'not-started';
      }
      try {
        const storageKey = `ipuz-${entry.id}`;
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) {
          return 'not-started';
        }
        const parsed = JSON.parse(raw) as {
          guesses?: Record<string, string> | null;
        };
        if (
          !parsed ||
          typeof parsed !== 'object' ||
          !parsed.guesses ||
          typeof parsed.guesses !== 'object'
        ) {
          return 'not-started';
        }
        const guesses = parsed.guesses as Record<string, string>;
        if (Object.keys(guesses).length === 0) {
          return 'not-started';
        }
        const blockValue =
          typeof entry.ipuz.block === 'string' ? entry.ipuz.block : '#';
        const emptyValue =
          typeof entry.ipuz.empty === 'string' ? entry.ipuz.empty : '0';
        let total = 0;
        let correct = 0;
        entry.ipuz.solution.forEach((row, r) => {
          row.forEach((cell, c) => {
            const expected = getSolutionCharacter(cell, blockValue, emptyValue);
            if (!expected) {
              return;
            }
            total += 1;
            const guess = guesses[`${r}_${c}`];
            if (typeof guess === 'string' && guess.trim()) {
              if (guess.toUpperCase() === expected.toUpperCase()) {
                correct += 1;
              }
            }
          });
        });
        if (total === 0) {
          return 'not-started';
        }
        if (correct === total) {
          return 'completed';
        }
        return 'in-progress';
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Unable to determine puzzle progress', error);
        return 'not-started';
      }
    },
    []
  );

  const refreshProgress = useCallback(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    setPuzzleProgress((prev) => {
      const next: Record<string, PuzzleProgressState> = {};
      library.forEach((entry) => {
        next[entry.id] = computePuzzleProgress(entry);
      });
      return next;
    });
  }, [computePuzzleProgress, library]);

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

  useEffect(() => {
    refreshProgress();
  }, [library, refreshProgress]);

  useEffect(() => {
    if (screen === 'start') {
      refreshProgress();
    }
  }, [refreshProgress, screen]);

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

  const orderedLibrary = useMemo(() => {
    const grouped: Record<PuzzleProgressState, PuzzleLibraryEntry[]> = {
      'in-progress': [],
      'not-started': [],
      completed: [],
    };
    filteredLibrary.forEach((entry) => {
      const status = puzzleProgress[entry.id] ?? 'not-started';
      grouped[status].push(entry);
    });
    const sortByLabel = (a: PuzzleLibraryEntry, b: PuzzleLibraryEntry) =>
      a.label.localeCompare(b.label);
    return progressOrdering.flatMap((status) =>
      grouped[status].sort(sortByLabel)
    );
  }, [filteredLibrary, puzzleProgress]);

  useEffect(() => {
    if (activeDifficulty !== 'all' && orderedLibrary.length === 0) {
      setActiveDifficulty('all');
    }
  }, [activeDifficulty, orderedLibrary.length]);

  useEffect(() => {
    if (orderedLibrary.length === 0) {
      return;
    }
    if (!orderedLibrary.some((entry) => entry.id === selectedPuzzleId)) {
      setSelectedPuzzleId(orderedLibrary[0].id);
    }
  }, [orderedLibrary, selectedPuzzleId]);

  const selectedPuzzle = useMemo(() => {
    if (orderedLibrary.length === 0) {
      return null;
    }
    return (
      orderedLibrary.find((entry) => entry.id === selectedPuzzleId) ||
      orderedLibrary[0]
    );
  }, [orderedLibrary, selectedPuzzleId]);

  const crosswordData = useIpuz(selectedPuzzle?.ipuz ?? null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.fetch !== 'function') {
      return undefined;
    }

    let cancelled = false;

    const loadRemotePuzzles = async () => {
      try {
        setPuzzleStoreStatus('loading');
        setPuzzleStoreError(null);

        const indexResponse = await fetch(IPUZZLER_PUZZLE_SOURCE);
        if (!indexResponse.ok) {
          throw new Error(`GitHub API responded with ${indexResponse.status}`);
        }

        const files = (await indexResponse.json()) as GithubContentItem[];
        const ipuzFiles = files
          .filter(
            (file) =>
              file.type === 'file' &&
              file.download_url &&
              file.name.toLowerCase().endsWith('.ipuz')
          )
          .slice(0, MAX_REMOTE_PUZZLES);

        if (ipuzFiles.length === 0) {
          if (!cancelled) {
            setPuzzleStoreStatus('ready');
            setPuzzleStoreError(
              'No community IPUZ puzzles were available to load.'
            );
          }
          return;
        }

        const pending = (
          await Promise.all(
            ipuzFiles.map(async (file, index) => {
              if (!file.download_url) {
                return null;
              }
              try {
                const puzzleResponse = await fetch(file.download_url);
                if (!puzzleResponse.ok) {
                  throw new Error(`HTTP ${puzzleResponse.status}`);
                }
                const parsed = (await puzzleResponse.json()) as unknown;
                if (!isIpuzCrossword(parsed)) {
                  return null;
                }
                const ipuz = parsed as IpuzPuzzle;
                const signature = createPuzzleSignature(ipuz);
                const label =
                  ipuz.title?.trim() || prettifyLabelFromFilename(file.name);
                const baseIdSource =
                  (ipuz.uniqueid && ipuz.uniqueid.trim()) ||
                  label ||
                  file.name.replace(/\.ipuz$/i, '');
                return {
                  baseId: slugify(baseIdSource) || `ipuzzler-${index + 1}`,
                  label,
                  ipuz,
                  signature,
                  difficulty: ipuz.difficulty,
                  author: ipuz.author,
                } satisfies PendingRemoteEntry;
              } catch (error) {
                // eslint-disable-next-line no-console
                console.warn(
                  'Failed to load remote IPUZ puzzle',
                  file.name,
                  error
                );
                return null;
              }
            })
          )
        ).filter((entry): entry is PendingRemoteEntry => entry !== null);

        if (cancelled) {
          return;
        }

        if (pending.length === 0) {
          setPuzzleStoreStatus('ready');
          setPuzzleStoreError(
            'All community puzzles are already in your library.'
          );
          return;
        }

        let added = 0;
        setLibrary((prev) => {
          let next = [...prev];
          pending.forEach((entry, index) => {
            const duplicate =
              next.some((existing) => existing.signature === entry.signature) ||
              (entry.ipuz.uniqueid &&
                next.some(
                  (existing) => existing.ipuz.uniqueid === entry.ipuz.uniqueid
                ));
            if (duplicate) {
              return;
            }
            const baseId = entry.baseId || `ipuzzler-${index + 1}`;
            const id = ensureUniqueId(baseId, next);
            next.push({
              id,
              label: entry.label,
              ipuz: entry.ipuz,
              difficulty: entry.difficulty,
              author: entry.author,
              signature: entry.signature,
            });
            added += 1;
          });
          if (added === 0) {
            return prev;
          }
          return next.sort((a, b) => a.label.localeCompare(b.label));
        });

        if (cancelled) {
          return;
        }

        if (added > 0) {
          setRemotePuzzleCount(added);
          setPuzzleStoreStatus('ready');
        } else {
          setPuzzleStoreStatus('ready');
          setPuzzleStoreError(
            'All community puzzles are already in your library.'
          );
        }
      } catch (error) {
        if (cancelled) {
          return;
        }
        setPuzzleStoreStatus('error');
        setPuzzleStoreError(
          error instanceof Error
            ? error.message
            : 'Unable to load community puzzles.'
        );
      }
    };

    loadRemotePuzzles();

    return () => {
      cancelled = true;
    };
  }, []);

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
        refreshProgress();
      }
    },
    [refreshProgress, totalClues]
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
          setSelectedPuzzleId((createdEntry as PuzzleLibraryEntry).id);
          setScreen('start');
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

  const handleStartPuzzle = useCallback(() => {
    if (!selectedPuzzle || !crosswordData) {
      return;
    }
    setScreen('puzzle');
    setShowCelebration(false);
    setIsPlaying(false);
    setTimer(0);
    window.requestAnimationFrame(() => {
      focus();
    });
  }, [crosswordData, focus, selectedPuzzle]);

  const handleBackToStart = useCallback(() => {
    setScreen('start');
    setIsPlaying(false);
    setShowCelebration(false);
    refreshProgress();
  }, [refreshProgress]);

  const registerHintUsage = useCallback(
    (count: number) => {
      if (count <= 0) {
        return;
      }
      setHintsUsed((prev) => prev + count);
      if (!isPlaying) {
        setIsPlaying(true);
      }
    },
    [isPlaying]
  );

  const progress =
    totalClues > 0 ? Math.round((completedClues / totalClues) * 100) : 0;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle darkMode={darkMode} />
      <AppShell>
        {importStatus && <ImportNotice>{importStatus}</ImportNotice>}
        {screen === 'start' ? (
          <StartScreen>
            <StartCard>
              <StartHeader>
                <div>
                  <StartTitle>Choose a crossword</StartTitle>
                  <StartDescription>
                    Pick a puzzle and configure your game options to begin.
                  </StartDescription>
                  {puzzleStoreStatus === 'loading' && (
                    <StartDescription role="status">
                      Loading community puzzles from the iPuzzler project…
                    </StartDescription>
                  )}
                  {puzzleStoreStatus === 'ready' && remotePuzzleCount > 0 && (
                    <StartDescription role="status">
                      Added {remotePuzzleCount}{' '}
                      {remotePuzzleCount === 1 ? 'puzzle' : 'puzzles'} from the
                      open iPuzzler collection.
                    </StartDescription>
                  )}
                  {puzzleStoreError && (
                    <StartDescription role="status">
                      {puzzleStoreError}
                    </StartDescription>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={() => setDarkMode((prev) => !prev)}
                >
                  {darkMode ? '☀️ Light mode' : '🌙 Dark mode'}
                </Button>
              </StartHeader>
              {library.length > 0 ? (
                <>
                  <div>
                    <SectionTitle>Puzzle selection</SectionTitle>
                    <SelectRow>
                      {difficultyOptions.length > 0 && (
                        <SelectControl
                          value={activeDifficulty}
                          onChange={(event) =>
                            setActiveDifficulty(event.target.value)
                          }
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
                        onChange={(event) =>
                          setSelectedPuzzleId(event.target.value)
                        }
                        disabled={orderedLibrary.length === 0}
                      >
                        {orderedLibrary.map((entry) => {
                          const status =
                            puzzleProgress[entry.id] ?? 'not-started';
                          const statusLabel = progressStatusLabels[status];
                          const difficultySuffix = entry.difficulty
                            ? ` (${entry.difficulty})`
                            : '';
                          const statusSuffix = statusLabel
                            ? ` — ${statusLabel}`
                            : '';
                          return (
                            <option key={entry.id} value={entry.id}>
                              {`${entry.label}${difficultySuffix}${statusSuffix}`}
                            </option>
                          );
                        })}
                      </SelectControl>
                    </SelectRow>
                  </div>
                  {selectedPuzzle?.ipuz && (
                    <MetaDetails>
                      {selectedPuzzle.ipuz.author && (
                        <span>Author: {selectedPuzzle.ipuz.author}</span>
                      )}
                      {selectedPuzzle.ipuz.date && (
                        <span>Date: {selectedPuzzle.ipuz.date}</span>
                      )}
                      {(selectedPuzzle.ipuz.difficulty ||
                        selectedPuzzle.difficulty) && (
                        <span>
                          Difficulty:{' '}
                          {selectedPuzzle.ipuz.difficulty ||
                            selectedPuzzle.difficulty}
                        </span>
                      )}
                    </MetaDetails>
                  )}
                </>
              ) : (
                <EmptyState>No crosswords available.</EmptyState>
              )}
              <div>
                <SectionTitle>Game options</SectionTitle>
                <OptionsGroup>
                  <CheckboxLabel>
                    <Checkbox
                      checked={allowHints}
                      onChange={(event) => setAllowHints(event.target.checked)}
                    />
                    Allow hints
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <Checkbox
                      checked={showCorrectAnswers}
                      onChange={(event) =>
                        setShowCorrectAnswers(event.target.checked)
                      }
                    />
                    Show correct answers
                  </CheckboxLabel>
                </OptionsGroup>
              </div>
              <StartButtons>
                <Button type="button" onClick={handleImportClick}>
                  Import IPUZ
                </Button>
                <Button
                  type="button"
                  onClick={handleStartPuzzle}
                  disabled={!selectedPuzzle || !crosswordData}
                >
                  Start puzzle
                </Button>
              </StartButtons>
              <HiddenFileInput
                ref={fileInputRef}
                type="file"
                accept=".ipuz,application/json"
                onChange={handleImportFile}
              />
            </StartCard>
          </StartScreen>
        ) : crosswordData && selectedPuzzle ? (
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
          >
            <PuzzleScreen
              puzzle={selectedPuzzle}
              allowHints={allowHints}
              showCorrectAnswers={showCorrectAnswers}
              crosswordRef={crosswordRef}
              onBack={handleBackToStart}
              onUseHint={registerHintUsage}
              focus={focus}
              reset={reset}
              formatTime={formatTime}
              timer={timer}
              progress={progress}
              hintsUsed={hintsUsed}
              onToggleDarkMode={() => setDarkMode((prev) => !prev)}
              darkMode={darkMode}
            />
          </CrosswordProvider>
        ) : (
          <EmptyState>Unable to load the selected crossword.</EmptyState>
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

interface PuzzleScreenProps {
  puzzle: PuzzleLibraryEntry;
  allowHints: boolean;
  showCorrectAnswers: boolean;
  crosswordRef: React.RefObject<CrosswordProviderImperative>;
  onBack: () => void;
  onUseHint: (count: number) => void;
  focus: () => void;
  reset: () => void;
  formatTime: (seconds: number) => string;
  timer: number;
  progress: number;
  hintsUsed: number;
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

function PuzzleScreen({
  puzzle,
  allowHints,
  showCorrectAnswers,
  crosswordRef,
  onBack,
  onUseHint,
  focus,
  reset,
  formatTime,
  timer,
  progress,
  hintsUsed,
  onToggleDarkMode,
  darkMode,
}: PuzzleScreenProps) {
  const {
    clues,
    selectedDirection,
    selectedNumber,
    selectedPosition,
    gridData,
  } = useContext(CrosswordContext);

  const activeClue = useMemo(() => {
    if (!clues) {
      return undefined;
    }
    return clues[selectedDirection].find(
      (clueInfo) => clueInfo.number === selectedNumber
    );
  }, [clues, selectedDirection, selectedNumber]);

  const activeStatus: 'correct' | 'incorrect' | 'neutral' =
    showCorrectAnswers && activeClue?.complete
      ? activeClue.correct
        ? 'correct'
        : 'incorrect'
      : 'neutral';

  const directionLabel = selectedDirection === 'down' ? 'Down' : 'Across';

  const metaDetails = useMemo(() => {
    const details: string[] = [];
    if (puzzle.ipuz.author) {
      details.push(`Author: ${puzzle.ipuz.author}`);
    }
    if (puzzle.ipuz.date) {
      details.push(`Date: ${puzzle.ipuz.date}`);
    }
    if (puzzle.ipuz.difficulty || puzzle.difficulty) {
      details.push(
        `Difficulty: ${puzzle.ipuz.difficulty || puzzle.difficulty || ''}`
      );
    }
    return details;
  }, [puzzle]);

  const revealCurrentSquare = useCallback(() => {
    if (!allowHints) {
      return;
    }
    const ref = crosswordRef.current;
    if (!ref || gridData.length === 0) {
      return;
    }
    const { row, col } = selectedPosition;
    const cell = gridData[row]?.[col];
    if (!cell || !cell.used) {
      return;
    }
    if (cell.guess !== cell.answer) {
      ref.setGuess(row, col, cell.answer);
      onUseHint(1);
    }
  }, [allowHints, crosswordRef, gridData, onUseHint, selectedPosition]);

  const revealCurrentWord = useCallback(() => {
    if (!allowHints || !activeClue) {
      return;
    }
    const ref = crosswordRef.current;
    if (!ref) {
      return;
    }
    const deltaRow = selectedDirection === 'across' ? 0 : 1;
    const deltaCol = selectedDirection === 'across' ? 1 : 0;
    let revealed = 0;
    for (let i = 0; i < activeClue.answer.length; i += 1) {
      const row = activeClue.row + deltaRow * i;
      const col = activeClue.col + deltaCol * i;
      const cell = gridData[row]?.[col];
      if (!cell || !cell.used) {
        continue;
      }
      if (cell.guess !== cell.answer) {
        ref.setGuess(row, col, cell.answer);
        revealed += 1;
      }
    }
    if (revealed > 0) {
      onUseHint(revealed);
    }
  }, [
    activeClue,
    allowHints,
    crosswordRef,
    gridData,
    onUseHint,
    selectedDirection,
  ]);

  const revealPuzzle = useCallback(() => {
    if (!allowHints) {
      return;
    }
    const ref = crosswordRef.current;
    if (!ref) {
      return;
    }
    let revealed = 0;
    gridData.forEach((row) => {
      row.forEach((cell) => {
        if (cell.used && cell.guess !== cell.answer) {
          ref.setGuess(cell.row, cell.col, cell.answer);
          revealed += 1;
        }
      });
    });
    if (revealed > 0) {
      onUseHint(revealed);
    }
  }, [allowHints, crosswordRef, gridData, onUseHint]);

  const checkCurrentSquare = useCallback(() => {
    const ref = crosswordRef.current;
    if (!ref || gridData.length === 0) {
      return;
    }
    const { row, col } = selectedPosition;
    const cell = gridData[row]?.[col];
    if (!cell || !cell.used || !cell.guess) {
      return;
    }
    if (cell.guess !== cell.answer) {
      ref.setGuess(row, col, '');
    }
  }, [crosswordRef, gridData, selectedPosition]);

  const checkCurrentWord = useCallback(() => {
    const ref = crosswordRef.current;
    if (!ref || !activeClue) {
      return;
    }
    const deltaRow = selectedDirection === 'across' ? 0 : 1;
    const deltaCol = selectedDirection === 'across' ? 1 : 0;
    for (let i = 0; i < activeClue.answer.length; i += 1) {
      const row = activeClue.row + deltaRow * i;
      const col = activeClue.col + deltaCol * i;
      const cell = gridData[row]?.[col];
      if (!cell || !cell.used || !cell.guess) {
        continue;
      }
      if (cell.guess !== cell.answer) {
        ref.setGuess(row, col, '');
      }
    }
  }, [activeClue, crosswordRef, gridData, selectedDirection]);

  const checkPuzzle = useCallback(() => {
    const ref = crosswordRef.current;
    if (!ref) {
      return;
    }
    gridData.forEach((row) => {
      row.forEach((cell) => {
        if (cell.used && cell.guess && cell.guess !== cell.answer) {
          ref.setGuess(cell.row, cell.col, '');
        }
      });
    });
  }, [crosswordRef, gridData]);

  const handleActionChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.target;
      if (!value) {
        return;
      }
      switch (value) {
        case 'reveal-square':
          revealCurrentSquare();
          break;
        case 'reveal-word':
          revealCurrentWord();
          break;
        case 'reveal-puzzle':
          revealPuzzle();
          break;
        case 'check-square':
          checkCurrentSquare();
          break;
        case 'check-word':
          checkCurrentWord();
          break;
        case 'check-puzzle':
          checkPuzzle();
          break;
        default:
          break;
      }
      event.target.value = '';
    },
    [
      checkCurrentSquare,
      checkCurrentWord,
      checkPuzzle,
      revealCurrentSquare,
      revealCurrentWord,
      revealPuzzle,
    ]
  );

  return (
    <PuzzleScreenContainer>
      <PuzzleHeader>
        <BackButton type="button" onClick={onBack} aria-label="Back to start">
          ←
        </BackButton>
        <MetaContainer>
          <MetaTitle>{puzzle.label}</MetaTitle>
          <MetaDetails>
            {metaDetails.map((detail) => (
              <span key={detail}>{detail}</span>
            ))}
          </MetaDetails>
        </MetaContainer>
      </PuzzleHeader>
      <ActionRow>
        <ActionSelect value="" onChange={handleActionChange}>
          <option value="">Puzzle actions</option>
          <option value="reveal-square" disabled={!allowHints}>
            Reveal square
          </option>
          <option value="reveal-word" disabled={!allowHints}>
            Reveal word
          </option>
          <option value="reveal-puzzle" disabled={!allowHints}>
            Reveal puzzle
          </option>
          <option value="check-square">Check square</option>
          <option value="check-word">Check word</option>
          <option value="check-puzzle">Check puzzle</option>
        </ActionSelect>
        <ActionsGroup>
          <Button type="button" onClick={focus}>
            Focus grid
          </Button>
          <Button type="button" onClick={reset}>
            Reset puzzle
          </Button>
          <Button type="button" onClick={onToggleDarkMode}>
            {darkMode ? '☀️ Light mode' : '🌙 Dark mode'}
          </Button>
        </ActionsGroup>
      </ActionRow>
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
      <ActiveClueBox status={activeStatus} showStatus={showCorrectAnswers}>
        <ActiveClueLabel>Active clue</ActiveClueLabel>
        {activeClue ? (
          <ActiveClueText>
            <strong>{selectedNumber}</strong> {directionLabel} —{' '}
            {activeClue.clue}
          </ActiveClueText>
        ) : (
          <ActiveClueText>Select a clue to begin solving.</ActiveClueText>
        )}
      </ActiveClueBox>
      <ClueLists showStatus={showCorrectAnswers}>
        <DirectionClues direction="across" />
        <DirectionClues direction="down" />
      </ClueLists>
    </PuzzleScreenContainer>
  );
}

export default App;
