import { useMemo } from 'react';
import { CluesInputOriginal, ClueTypeOriginal } from './types';

/**
 * IPUZ-format JSON data input format.  See http://www.ipuz.org/ for details.
 * Note that only the fields/values supported by this crossword component are
 * used.
 */
type IpuzClueEntry =
  | [number, string]
  | {
      number?: number;
      clue?: string;
      text?: string;
      label?: string;
    };

export interface IpuzInput {
  /** IPUZ version for this puzzle */
  version: string;

  /** Kind (IPUZ URI) of this puzzle (must have at least one kind) */
  kind: string[];

  // general/optional fields...

  /** Copyright information */
  copyright?: string;
  /** Name and/or reference for a publisher */
  publisher?: string;
  /** Bibliographic reference for a published puzzle */
  publication?: string;
  /** Permanent URL for the puzzle */
  url?: string;
  /** Globally unique identifier for the puzzle */
  uniqueid?: string;
  /** Title of puzzle */
  title?: string;
  /** Text displayed above puzzle */
  intro?: string;
  /** Text displayed after successful solve */
  explanation?: string;
  /** Non-displayed annotation */
  annotation?: string;
  /** Author of puzzle */
  author?: string;
  /** Editor of puzzle */
  editor?: string;
  /** Date of puzzle or publication date */
  date?: string;
  /** Notes about the puzzle */
  notes?: string;
  /** Informational only, there is no standard for difficulty */
  difficulty?: string;
  /** Characters that can be entered in the puzzle */
  charset?: string;
  /** Program-specific information from program that wrote this file */
  origin?: string;
  /** Text value which represents a block (defaults to "#") */
  block?: string;
  /** Value which represents an empty cell (defaults to 0) */
  empty?: string;
  /** Named styles for the puzzle */
  styles?: unknown;

  // crossword information...

  /** Dimensions of the puzzle grid */
  dimensions: {
    width: number;
    height: number;
  };

  /** The puzzle rows, then columns (describes the rendered cells) */
  puzzle: (number | string | null | { cell?: number; style?: unknown })[][];

  /** Correct solution (row-major cell answers) */
  solution: (string | null)[][];

  /** The final answer to the puzzle */
  answer?: unknown; // how is this different from solution?

  /** Clue sets (each set is array of clue-num, clue tuples or objects.) */
  clues: Record<'Across' | 'Down', IpuzClueEntry[]>;

  saved?: unknown; // not supported!
  showenumerations?: unknown; // not supported!
  clueplacement?: unknown; // not supported!
  enumeration?: unknown; // not supported!
  enumerations?: unknown; // not supported!
  misses?: unknown; // not supported!
}

const IpuzURI = 'http://ipuz.org';
const IpuzVersionURI = `${IpuzURI}/v`;
const IpuzVersion = 2;
const IpuzCrosswordURI = `${IpuzURI}/crossword#`;
const IpuzCrosswordVersion = 1;

const directionMap = {
  Across: 'across',
  Down: 'down',
} as const;

export function useIpuz(data: unknown) {
  return useMemo(() => {
    if (!isIpuzData(data)) {
      // eslint-disable-next-line no-console
      console.error('useIpuz() was not given IPUZ data');
      return null;
    }

    if (!isSupportedIpuz(data)) {
      // eslint-disable-next-line no-console
      console.error('useIpuz() was not given supported IPUZ data');
      return null;
    }

    return convertIpuz(data);
  }, [data]);
}

/** Inspects a value to see if it looks like IPUZ data. */
export function isIpuzData(data: unknown): data is IpuzInput {
  return (
    !!data &&
    typeof data === 'object' &&
    'version' in data &&
    typeof data.version === 'string' &&
    data.version.startsWith(IpuzVersionURI)
  );
}

/** Checks to see whether the IPUZ data is supported. */
export function isSupportedIpuz(ipuz: IpuzInput) {
  const version = Number.parseInt(
    ipuz.version.substring(IpuzVersionURI.length),
    10
  );
  if (version > IpuzVersion) {
    return false;
  }
  if (ipuz.kind.length !== 1 || !ipuz.kind[0].startsWith(IpuzCrosswordURI)) {
    return false;
  }
  const crosswordVersion = Number.parseInt(
    ipuz.kind[0].substring(IpuzCrosswordURI.length),
    10
  );
  if (crosswordVersion > IpuzCrosswordVersion) {
    return false;
  }
  return true;
}

function extractSolutionChar(
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
      cell === blockValue ||
      cell === emptyValue ||
      cell === '#'
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
        maybeValue === blockValue ||
        maybeValue === emptyValue ||
        maybeValue === '#'
      ) {
        return null;
      }
      return maybeValue;
    }
  }

  return null;
}

/** Converts an IPUZ crossword to our internal format. */
export function convertIpuz(ipuz: IpuzInput): CluesInputOriginal {
  const blockValue = typeof ipuz.block === 'string' ? ipuz.block : '#';
  const emptyValue = typeof ipuz.empty === 'string' ? ipuz.empty : '0';

  // loop through the puzzle and figure out the row/col of each clue...
  const clueLocs = ipuz.puzzle.reduce<
    Record<string, { row: number; col: number }>
  >(
    (memoOuter, rowData, row) =>
      rowData.reduce((memoInner, cell, col) => {
        let key: unknown;
        if (cell && typeof cell === 'object') {
          key = (cell as { cell?: unknown }).cell;
        } else {
          key = cell;
        }

        let clueNumber: number | null = null;
        if (typeof key === 'number') {
          clueNumber = key;
        } else if (typeof key === 'string') {
          const parsed = Number.parseInt(key, 10);
          if (!Number.isNaN(parsed)) {
            clueNumber = parsed;
          }
        }

        if (clueNumber !== null && clueNumber > 0) {
          memoInner[clueNumber.toString()] = { row, col };
        }

        return memoInner;
      }, memoOuter),
    {}
  );

  const converted: CluesInputOriginal = Object.fromEntries(
    (Object.entries(ipuz.clues) as ['Across' | 'Down', IpuzClueEntry[]][]).map(
      ([dir, clueList]) => {
        const normalizedClues = clueList
          .map((entry) => {
            if (Array.isArray(entry) && entry.length >= 2) {
              const [rawNum, rawClue] = entry;
              const num =
                typeof rawNum === 'number'
                  ? rawNum
                  : Number.parseInt(String(rawNum), 10);
              const clueText = String(rawClue);
              if (!Number.isNaN(num) && clueText) {
                return { number: num, clue: clueText };
              }
              return null;
            }

            if (entry && typeof entry === 'object') {
              const numberValue = (entry as { number?: unknown }).number;
              const clueValue =
                (entry as { clue?: unknown }).clue ??
                (entry as { text?: unknown }).text ??
                (entry as { label?: unknown }).label;

              const num =
                typeof numberValue === 'number'
                  ? numberValue
                  : typeof numberValue === 'string'
                  ? Number.parseInt(numberValue, 10)
                  : null;
              const clueText =
                typeof clueValue === 'string' ? clueValue : undefined;

              if (num !== null && !Number.isNaN(num) && clueText) {
                return { number: num, clue: clueText };
              }
            }

            return null;
          })
          .filter(
            (value): value is { number: number; clue: string } => value !== null
          );

        const dirClues = normalizedClues.reduce<
          Record<string, ClueTypeOriginal>
        >((memo, { number: num, clue: clueText }) => {
          const location = clueLocs[num.toString()];
          if (!location) {
            return memo;
          }
          const { row, col } = location;
          // get the answer by inspecting the solution grid
          let answer = '';
          const dr = dir === 'Across' ? 0 : 1;
          const dc = dir === 'Across' ? 1 : 0;
          for (
            let r = row, c = col;
            r < ipuz.dimensions.height && c < ipuz.dimensions.width;
            r += dr, c += dc
          ) {
            const ch = extractSolutionChar(
              ipuz.solution[r][c],
              blockValue,
              emptyValue
            );
            if (!ch) {
              break;
            }
            answer += ch;
          }

          memo[num.toString()] = {
            clue: clueText,
            answer,
            row,
            col,
          };

          return memo;
        }, {});

        return [directionMap[dir], dirClues];
      }
    )
  ) as CluesInputOriginal;

  return converted;
}
