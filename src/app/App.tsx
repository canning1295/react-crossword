import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

import Crossword, { CrosswordImperative } from '../Crossword';
import type { AnswerTuple, Direction } from '../types';
import highTechMergers, { CrosswordPuzzle } from './puzzles/highTechMergers';

const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: light;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: linear-gradient(160deg, #f1f5f9 0%, #e0f2fe 45%, #e2e8f0 100%);
    color: #0f172a;
    min-height: 100vh;
  }

  button {
    font: inherit;
    cursor: pointer;
  }
`;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  padding: 3rem 1.5rem 1.5rem;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(2.4rem, 4vw, 3.2rem);
  font-weight: 700;
  color: #0f172a;
`;

const Subtitle = styled.p`
  margin: 0.75rem auto 0;
  max-width: 720px;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #334155;
`;

const Content = styled.main`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 0 1.5rem 3rem;

  @media (min-width: 1080px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
  }
`;

const BoardWrapper = styled.section`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.12);
  flex: 1 1 640px;
  min-width: min(640px, 100%);
`;

const Sidebar = styled.aside`
  flex: 0 0 320px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const StatsCard = styled.div`
  background: rgba(15, 23, 42, 0.85);
  color: #f8fafc;
  padding: 1.5rem;
  border-radius: 1.25rem;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.18);
`;

const StatsTitle = styled.h2`
  margin: 0 0 1rem;
  font-size: 1.1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(248, 250, 252, 0.7);
`;

const StatsGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatValue = styled.span`
  font-size: 1.9rem;
  font-weight: 600;
  color: #facc15;
`;

const StatLabel = styled.span`
  font-size: 0.95rem;
  color: rgba(248, 250, 252, 0.7);
`;

const ControlsCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 1.25rem;
  box-shadow: 0 18px 36px rgba(148, 163, 184, 0.25);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ControlButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const ControlButton = styled.button<{ $variant?: 'primary' | 'ghost' | 'danger' }>`
  border: none;
  border-radius: 999px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  color: ${({ $variant }) =>
    $variant === 'primary'
      ? '#0f172a'
      : $variant === 'danger'
      ? '#fff1f2'
      : '#0f172a'};
  background: ${({ $variant }) =>
    $variant === 'primary'
      ? 'linear-gradient(120deg, #fde68a, #f97316)'
      : $variant === 'danger'
      ? 'linear-gradient(120deg, #f97316, #ef4444)'
      : '#e2e8f0'};
  box-shadow: ${({ $variant }) =>
    $variant === 'primary'
      ? '0 14px 24px rgba(249, 115, 22, 0.35)'
      : $variant === 'danger'
      ? '0 14px 24px rgba(239, 68, 68, 0.35)'
      : '0 10px 18px rgba(148, 163, 184, 0.25)'};

  &:hover {
    transform: translateY(-2px);
  }
`;

const Message = styled.div<{ $variant: 'info' | 'success' | 'warning' }>`
  border-radius: 1rem;
  padding: 1rem 1.25rem;
  font-weight: 500;
  line-height: 1.4;
  background: ${({ $variant }) => {
    switch ($variant) {
      case 'success':
        return 'rgba(22, 163, 74, 0.12)';
      case 'warning':
        return 'rgba(234, 179, 8, 0.18)';
      default:
        return 'rgba(59, 130, 246, 0.15)';
    }
  }};
  color: ${({ $variant }) => {
    switch ($variant) {
      case 'success':
        return '#15803d';
      case 'warning':
        return '#a16207';
      default:
        return '#1d4ed8';
    }
  }};
`;

const ActiveClue = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const ActiveClueHeading = styled.span`
  font-size: 0.95rem;
  letter-spacing: 0.06em;
  font-weight: 600;
  text-transform: uppercase;
  color: #334155;
`;

const ActiveClueBody = styled.span`
  font-size: 1.05rem;
  color: #0f172a;
`;

type AnswerKey = `${Direction}-${string}`;

const crosswordTheme = {
  allowNonSquare: true,
  columnBreakpoint: '900px',
  gridBackground: '#0f172a',
  cellBackground: '#f8fafc',
  cellBorder: '#94a3b8',
  textColor: '#0f172a',
  numberColor: '#facc15',
  focusBackground: '#fde68a',
  highlightBackground: '#fee2e2',
};

function makeAnswerKey(direction: Direction, number: string): AnswerKey {
  return `${direction}-${number}`;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');

  const hours = Math.floor(totalSeconds / 3600);
  if (hours > 0) {
    const hourString = hours.toString().padStart(2, '0');
    return `${hourString}:${minutes}:${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

const defaultPuzzle = highTechMergers;

const App: React.FC = () => {
  const [puzzle] = useState<CrosswordPuzzle>(defaultPuzzle);
  const crosswordRef = useRef<CrosswordImperative>(null);
  const [activeClue, setActiveClue] = useState<AnswerKey | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState<Set<AnswerKey>>(
    () => new Set()
  );
  const [incorrectAnswers, setIncorrectAnswers] = useState<Set<AnswerKey>>(
    () => new Set()
  );
  const [message, setMessage] = useState<{
    text: string;
    variant: 'info' | 'success' | 'warning';
  } | null>(null);
  const [isCrosswordCorrect, setIsCrosswordCorrect] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const storageKey = useMemo(
    () => `crossword-game:${puzzle.id}`,
    [puzzle.id]
  );

  const [secondsElapsed, setSecondsElapsed] = useState<number>(() => {
    if (typeof window === 'undefined') {
      return 0;
    }

    const stored = window.localStorage.getItem(`${storageKey}:timer`);
    return stored ? Number(stored) || 0 : 0;
  });

  const totalAnswers = useMemo(() => {
    const acrossTotal = Object.keys(puzzle.data.across).length;
    const downTotal = Object.keys(puzzle.data.down).length;
    return acrossTotal + downTotal;
  }, [puzzle.data.across, puzzle.data.down]);

  const progressPercent = useMemo(() => {
    if (totalAnswers === 0) {
      return 0;
    }

    return Math.round((correctAnswers.size / totalAnswers) * 100);
  }, [correctAnswers.size, totalAnswers]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    if (isPaused || isComplete) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setSecondsElapsed((previous) => previous + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isPaused, isComplete]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(
      `${storageKey}:timer`,
      secondsElapsed.toString()
    );
  }, [secondsElapsed, storageKey]);

  const updateMessage = useCallback(
    (text: string, variant: 'info' | 'success' | 'warning' = 'info') => {
      setMessage({ text, variant });
    },
    []
  );

  const handleAnswerComplete = useCallback(
    (direction: Direction, number: string, correct: boolean) => {
      const key = makeAnswerKey(direction, number);

      setCorrectAnswers((prev) => {
        const next = new Set(prev);
        if (correct) {
          next.add(key);
        } else {
          next.delete(key);
        }
        return next;
      });

      setIncorrectAnswers((prev) => {
        const next = new Set(prev);
        if (correct) {
          next.delete(key);
        } else {
          next.add(key);
        }
        return next;
      });
    },
    []
  );

  const handleLoadedCorrect = useCallback((answers: AnswerTuple[]) => {
    const restored = new Set<AnswerKey>();
    answers.forEach(([direction, number]) => {
      restored.add(makeAnswerKey(direction, number));
    });
    setCorrectAnswers(restored);
  }, []);

  const handleCrosswordCorrect = useCallback((correct: boolean) => {
    setIsCrosswordCorrect(correct);
    if (correct) {
      setIsComplete(true);
      setIsPaused(true);
      updateMessage('You solved the crossword — fantastic work!', 'success');
    }
  }, [updateMessage]);

  const handleCrosswordComplete = useCallback(
    (correct: boolean) => {
      if (!correct) {
        updateMessage(
          'Every square is filled, but a few answers still need attention.',
          'warning'
        );
        setIsCrosswordCorrect(false);
        setIsComplete(false);
        return;
      }

      setIsComplete(true);
      setIsPaused(true);
      setIsCrosswordCorrect(true);
      updateMessage('Puzzle complete! Every answer is spot on.', 'success');
    },
    [updateMessage]
  );

  const handleClueSelected = useCallback((direction: Direction, number: string) => {
    setActiveClue(makeAnswerKey(direction, number));
  }, []);

  const handleCellChange = useCallback(() => {
    if (message) {
      setMessage(null);
    }
  }, [message]);

  const getActiveClue = useCallback(() => {
    if (!activeClue) {
      return null;
    }

    const [direction, number] = activeClue.split('-') as [Direction, string];
    const clue = puzzle.data[direction]?.[number];

    if (!clue) {
      return null;
    }

    return { direction, number, clue: clue.clue };
  }, [activeClue, puzzle.data]);

  const resetGame = useCallback(() => {
    crosswordRef.current?.reset();
    setCorrectAnswers(new Set());
    setIncorrectAnswers(new Set());
    setIsCrosswordCorrect(false);
    setIsComplete(false);
    setIsPaused(false);
    setSecondsElapsed(0);
    setActiveClue(null);
    setMessage(null);

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(storageKey);
      window.localStorage.removeItem(`${storageKey}:timer`);
    }

    crosswordRef.current?.focus();
  }, [storageKey]);

  const checkProgress = useCallback(() => {
    const correct = crosswordRef.current?.isCrosswordCorrect();
    if (correct) {
      setIsCrosswordCorrect(true);
      setIsComplete(true);
      setIsPaused(true);
      updateMessage('Every entry is correct — puzzle solved!', 'success');
    } else {
      updateMessage('Keep going! Some entries still need work.', 'info');
    }
  }, [updateMessage]);

  const revealAllAnswers = useCallback(() => {
    crosswordRef.current?.fillAllAnswers();
    const allKeys = new Set<AnswerKey>();
    Object.entries(puzzle.data.across).forEach(([number]) => {
      allKeys.add(makeAnswerKey('across', number));
    });
    Object.entries(puzzle.data.down).forEach(([number]) => {
      allKeys.add(makeAnswerKey('down', number));
    });
    setCorrectAnswers(allKeys);
    setIncorrectAnswers(new Set());
    setIsCrosswordCorrect(true);
    setIsComplete(true);
    setIsPaused(true);
    updateMessage('All answers revealed. Feel free to explore the grid.', 'warning');
  }, [puzzle.data.across, puzzle.data.down, updateMessage]);

  const togglePause = useCallback(() => {
    setIsPaused((previous) => !previous);
  }, []);

  const activeClueDetails = getActiveClue();

  return (
    <ThemeProvider theme={crosswordTheme}>
      <GlobalStyle />
      <Page>
        <Header>
          <Title>{puzzle.title}</Title>
          <Subtitle>
            {puzzle.description ??
              'Solve the crossword, track your progress, and master every clue. Your best time is stored locally so you can keep improving!'}
          </Subtitle>
        </Header>
        <Content>
          <BoardWrapper>
            <Crossword
              ref={crosswordRef}
              data={puzzle.data}
              storageKey={storageKey}
              useStorage
              onAnswerComplete={handleAnswerComplete}
              onLoadedCorrect={handleLoadedCorrect}
              onCrosswordCorrect={handleCrosswordCorrect}
              onCrosswordComplete={handleCrosswordComplete}
              onClueSelected={handleClueSelected}
              onCellChange={handleCellChange}
            />
          </BoardWrapper>
          <Sidebar>
            <StatsCard>
              <StatsTitle>Game Stats</StatsTitle>
              <StatsGrid>
                <Stat>
                  <StatValue>{formatTime(secondsElapsed)}</StatValue>
                  <StatLabel>Elapsed Time</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>{progressPercent}%</StatValue>
                  <StatLabel>Completion</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>{correctAnswers.size}</StatValue>
                  <StatLabel>Clues Solved</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>{incorrectAnswers.size}</StatValue>
                  <StatLabel>Needs Review</StatLabel>
                </Stat>
              </StatsGrid>
            </StatsCard>
            <ControlsCard>
              {message ? (
                <Message $variant={message.variant}>{message.text}</Message>
              ) : null}
              <ControlButtons>
                <ControlButton $variant="primary" onClick={checkProgress}>
                  Check Progress
                </ControlButton>
                <ControlButton onClick={togglePause}>
                  {isPaused ? 'Resume Timer' : 'Pause Timer'}
                </ControlButton>
                <ControlButton onClick={resetGame}>Reset Puzzle</ControlButton>
                <ControlButton $variant="danger" onClick={revealAllAnswers}>
                  Reveal All Answers
                </ControlButton>
              </ControlButtons>
              {activeClueDetails ? (
                <ActiveClue>
                  <ActiveClueHeading>Current Clue</ActiveClueHeading>
                  <ActiveClueBody>
                    <strong>
                      {activeClueDetails.direction.toUpperCase()} {activeClueDetails.number}:
                    </strong>{' '}
                    {activeClueDetails.clue}
                  </ActiveClueBody>
                </ActiveClue>
              ) : (
                <ActiveClue>
                  <ActiveClueHeading>Need a hint?</ActiveClueHeading>
                  <ActiveClueBody>
                    Select a clue from the grid or the list to focus it instantly.
                  </ActiveClueBody>
                </ActiveClue>
              )}
            </ControlsCard>
          </Sidebar>
        </Content>
      </Page>
    </ThemeProvider>
  );
};

export default App;
