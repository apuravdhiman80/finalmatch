import React, { useMemo, useState } from "react";
import "./App.css";

/* ==========================================
   MATCHSTICK SEGMENTS
========================================== */

const DIGIT_SEGMENTS = {
  0: ["a", "b", "c", "d", "e", "f"],
  1: ["b", "c"],
  2: ["a", "b", "g", "e", "d"],
  3: ["a", "b", "c", "d", "g"],
  4: ["f", "g", "b", "c"],
  5: ["a", "f", "g", "c", "d"],
  6: ["a", "f", "g", "e", "c", "d"],
  7: ["a", "b", "c"],
  8: ["a", "b", "c", "d", "e", "f", "g"],
  9: ["a", "b", "f", "g", "c", "d"],
};

const OP_SEGMENTS = {
  "+": ["h", "v"],
  "-": ["h"],
};

const EQ_SEGMENTS = {
  "=": ["top", "bottom"],
};

const SEGMENT_KEYS = {
  digit: ["a", "b", "c", "d", "e", "f", "g"],
  op: ["h", "v"],
  eq: ["top", "bottom"],
};

const SEGMENT_LAYOUTS = {
  digit: {
    a: { left: "14%", top: "0%", width: "72%", height: "8%", orientation: "horizontal" },
    b: { left: "84%", top: "8%", width: "9%", height: "37%", orientation: "vertical" },
    c: { left: "84%", top: "53%", width: "9%", height: "37%", orientation: "vertical" },
    d: { left: "14%", top: "92%", width: "72%", height: "8%", orientation: "horizontal" },
    e: { left: "7%", top: "53%", width: "9%", height: "37%", orientation: "vertical" },
    f: { left: "7%", top: "8%", width: "9%", height: "37%", orientation: "vertical" },
    g: { left: "14%", top: "46%", width: "72%", height: "8%", orientation: "horizontal" },
  },
  op: {
    h: { left: "7%", top: "46%", width: "86%", height: "8%", orientation: "horizontal" },
    v: { left: "46%", top: "22%", width: "9%", height: "56%", orientation: "vertical" },
  },
  eq: {
    top: { left: "8%", top: "31%", width: "84%", height: "8%", orientation: "horizontal" },
    bottom: { left: "8%", top: "64%", width: "84%", height: "8%", orientation: "horizontal" },
  },
};

/* ==========================================
   CLASS 11–12 PUZZLES · 20 ADVANCED CHALLENGES
   Every puzzle has a verified one-match solution.
========================================== */

const LEVELS = [
  {
    start: '34+29=55',
    solution: '34+25=59',
    difficulty: 'Advanced',
    title: 'The numerical switch',
    hint: 'The final number and the second operand are linked.',
    explanation: 'Move the upper-right segment from character 5 to the empty upper-right segment position in character 8. The equation becomes 34 + 25 = 59.',
  },
  {
    start: '50-79=71',
    solution: '90-79=11',
    difficulty: 'Advanced',
    title: 'A balanced transfer',
    hint: 'Compare the first digit with the first digit of the result.',
    explanation: 'Move the top segment from character 7 to the empty upper-right segment position in character 1. The equation becomes 90 − 79 = 11.',
  },
  {
    start: '13+45=66',
    solution: '13+45=58',
    difficulty: 'Advanced',
    title: 'The final-digit trap',
    hint: 'Inspect the final two digits of the equation.',
    explanation: 'Move the lower-left segment from character 7 to the empty upper-right segment position in character 8. The equation becomes 13 + 45 = 58.',
  },
  {
    start: '99-86=19',
    solution: '99-80=19',
    difficulty: 'Advanced',
    title: 'Rebuild the operand',
    hint: 'One digit in the second number is the key.',
    explanation: 'Move the middle segment from character 5 to the empty upper-right segment position in character 5. The equation becomes 99 − 80 = 19.',
  },
  {
    start: '83-33=96',
    solution: '89-33=56',
    difficulty: 'Advanced',
    title: 'A result transformation',
    hint: 'The first operand and the result both need attention.',
    explanation: 'Move the upper-right segment from character 7 to the empty upper-left segment position in character 2. The equation becomes 89 − 33 = 56.',
  },
  {
    start: '91+11=86',
    solution: '97-11=86',
    difficulty: 'Advanced',
    title: 'Operator reversal',
    hint: 'Look at the first digit and the operator.',
    explanation: 'Move the vertical match from character 3 to the empty top segment position in character 2. The equation becomes 97 − 11 = 86.',
  },
  {
    start: '95-78=29',
    solution: '99-70=29',
    difficulty: 'Advanced',
    title: 'The hidden tens digit',
    hint: 'The first and second operands are involved.',
    explanation: 'Move the middle segment from character 5 to the empty upper-right segment position in character 2. The equation becomes 99 − 70 = 29.',
  },
  {
    start: '50+12=71',
    solution: '59+12=71',
    difficulty: 'Expert',
    title: 'Segment relocation',
    hint: 'A single digit can be rebuilt by relocating one match.',
    explanation: 'Move the lower-left segment from character 2 to the empty middle segment position in character 2. The equation becomes 59 + 12 = 71.',
  },
  {
    start: '45-21=14',
    solution: '45-31=14',
    difficulty: 'Expert',
    title: 'The tens-place puzzle',
    hint: 'Focus on the tens digit of the second operand.',
    explanation: 'Move the lower-left segment from character 4 to the empty lower-right segment position in character 4. The equation becomes 45 − 31 = 14.',
  },
  {
    start: '41+65=56',
    solution: '41+55=96',
    difficulty: 'Expert',
    title: 'Two-number balance',
    hint: 'The second operand and answer form the trick.',
    explanation: 'Move the lower-left segment from character 4 to the empty upper-right segment position in character 7. The equation becomes 41 + 55 = 96.',
  },
  {
    start: '28-32=61',
    solution: '29+32=61',
    difficulty: 'Expert',
    title: 'Change the operator',
    hint: 'The operator changes when a match is transferred.',
    explanation: 'Move the lower-left segment from character 2 to the empty vertical match position in character 3. The equation becomes 29 + 32 = 61.',
  },
  {
    start: '78-19=51',
    solution: '76-19=57',
    difficulty: 'Expert',
    title: 'First-to-last connection',
    hint: 'Compare the first and final digits.',
    explanation: 'Move the upper-right segment from character 2 to the empty top segment position in character 8. The equation becomes 76 − 19 = 57.',
  },
  {
    start: '38-65=95',
    solution: '30+65=95',
    difficulty: 'Expert',
    title: 'The operator shift',
    hint: 'The operator and first number are connected.',
    explanation: 'Move the middle segment from character 2 to the empty vertical match position in character 3. The equation becomes 30 + 65 = 95.',
  },
  {
    start: '56+36=95',
    solution: '59+36=95',
    difficulty: 'Expert',
    title: 'A digit reconstruction',
    hint: 'A match shifts within the first number.',
    explanation: 'Move the lower-left segment from character 2 to the empty upper-right segment position in character 2. The equation becomes 59 + 36 = 95.',
  },
  {
    start: '82-99=44',
    solution: '82-38=44',
    difficulty: 'Olympiad',
    title: 'The middle-number mystery',
    hint: 'Look closely at the second number.',
    explanation: 'Move the upper-left segment from character 4 to the empty lower-left segment position in character 5. The equation becomes 82 − 38 = 44.',
  },
  {
    start: '13-53=28',
    solution: '73-53=20',
    difficulty: 'Olympiad',
    title: 'Coordinated correction',
    hint: 'The first digit and last digit need a coordinated change.',
    explanation: 'Move the middle segment from character 8 to the empty top segment position in character 1. The equation becomes 73 − 53 = 20.',
  },
  {
    start: '80-99=11',
    solution: '80-69=11',
    difficulty: 'Olympiad',
    title: 'The second-operand code',
    hint: 'A one-match change in the second operand fixes the equation.',
    explanation: 'Move the upper-right segment from character 4 to the empty lower-left segment position in character 4. The equation becomes 80 − 69 = 11.',
  },
  {
    start: '93+54=81',
    solution: '33+54=87',
    difficulty: 'Olympiad',
    title: 'A first-digit reversal',
    hint: 'The first and final numbers are the key.',
    explanation: 'Move the upper-left segment from character 1 to the empty top segment position in character 8. The equation becomes 33 + 54 = 87.',
  },
  {
    start: '61-40=17',
    solution: '57-40=17',
    difficulty: 'Olympiad',
    title: 'The opening move',
    hint: 'Inspect the first two digits.',
    explanation: 'Move the lower-left segment from character 1 to the empty top segment position in character 2. The equation becomes 57 − 40 = 17.',
  },
  {
    start: '99-46=44',
    solution: '89-45=44',
    difficulty: 'Olympiad',
    title: 'The double transformation',
    hint: 'The first and second operands both change.',
    explanation: 'Move the lower-left segment from character 5 to the empty lower-left segment position in character 1. The equation becomes 89 − 45 = 44.',
  }
];

/* ==========================================
   SEGMENT UTILITIES
========================================== */

function sortSegments(segments) {
  return [...segments].sort();
}

function sameSegments(left, right) {
  const a = sortSegments(left);
  const b = sortSegments(right);

  return (
    a.length === b.length &&
    a.every((segment, index) => segment === b[index])
  );
}

function makeToken(character) {
  if (character === "=") {
    return { kind: "eq", segments: [...EQ_SEGMENTS["="]] };
  }

  if (character === "+" || character === "-") {
    return { kind: "op", segments: [...OP_SEGMENTS[character]] };
  }

  return {
    kind: "digit",
    segments: [...DIGIT_SEGMENTS[character]],
  };
}

function makeBoard(expression) {
  return expression.split("").map(makeToken);
}

function decodeToken(token) {
  if (token.kind === "digit") {
    for (const [digit, segments] of Object.entries(DIGIT_SEGMENTS)) {
      if (sameSegments(token.segments, segments)) return digit;
    }
    return null;
  }

  if (token.kind === "op") {
    for (const [operator, segments] of Object.entries(OP_SEGMENTS)) {
      if (sameSegments(token.segments, segments)) return operator;
    }
    return null;
  }

  return sameSegments(token.segments, EQ_SEGMENTS["="]) ? "=" : null;
}

function readEquation(board) {
  const decoded = board.map(decodeToken);

  if (decoded.some((symbol) => symbol === null)) return null;
  if (decoded.filter((symbol) => symbol === "=").length !== 1) return null;

  return decoded.join("");
}

function isCorrectEquation(board) {
  const expression = readEquation(board);
  if (!expression) return false;

  const match = expression.match(/^(\d+)([+-])(\d+)=(\d+)$/);
  if (!match) return false;

  const [, leftText, operator, rightText, resultText] = match;
  const left = Number(leftText);
  const right = Number(rightText);
  const result = Number(resultText);

  return operator === "+"
    ? left + right === result
    : left - right === result;
}

/* ==========================================
   MATCHSTICK GLYPH
========================================== */

function MatchGlyph({
  token,
  slotIndex,
  selected,
  onMatchClick,
  onEmptyClick,
  locked,
}) {
  const keys = SEGMENT_KEYS[token.kind];

  const kindName =
    token.kind === "digit"
      ? "digit"
      : token.kind === "op"
        ? "operator"
        : "equals sign";

  return (
    <div
      className={`glyph glyph--${token.kind}`}
      aria-label={`Equation ${kindName}`}
    >
      {keys.map((segment) => {
        const present = token.segments.includes(segment);

        const isSelected =
          selected?.slotIndex === slotIndex &&
          selected?.segment === segment;

        const { orientation, ...segmentStyle } =
          SEGMENT_LAYOUTS[token.kind][segment];

        const className = [
          "match",
          `match--${orientation}`,
          present ? "is-present" : "is-empty",
          isSelected ? "is-selected" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            key={segment}
            type="button"
            className={className}
            style={segmentStyle}
            aria-label={`${present ? "Select" : "Place match at"} ${segment} in ${kindName} ${slotIndex + 1}`}
            aria-pressed={Boolean(isSelected)}
            disabled={locked || (!present && !selected)}
            onClick={() =>
              present
                ? onMatchClick({ slotIndex, segment })
                : onEmptyClick({ slotIndex, segment })
            }
          >
            {present && (
              <span className="match__head" aria-hidden="true" />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ==========================================
   MAIN APP
========================================== */

export default function App() {
  
  const [levelIndex, setLevelIndex] = useState(0);
  const [board, setBoard] = useState(() => makeBoard(LEVELS[0].start));
  const [selected, setSelected] = useState(null);
  const [movesUsed, setMovesUsed] = useState(0);
  const [status, setStatus] = useState("ready");
  const [hintVisible, setHintVisible] = useState(false);
  const [solutionVisible, setSolutionVisible] = useState(false);

  const [completedLevels, setCompletedLevels] = useState([]);

  const levels = LEVELS;
  const categoryName = "CLASS 11–12";

  const level = levels[levelIndex];
  const completed = completedLevels;
  const isLocked = movesUsed >= 1 || status === "solved";

  const progressPercent = Math.round(
    (completed.length / levels.length) * 100
  );

  const currentExpression = useMemo(
    () => readEquation(board),
    [board]
  );

  const score =
    completedLevels.length * 100;

  function resetLevel() {
    setBoard(makeBoard(level.start));
    setSelected(null);
    setMovesUsed(0);
    setStatus("ready");
    setHintVisible(false);
    setSolutionVisible(false);
  }

  function goToLevel(nextIndex) {
    const bounded = Math.max(
      0,
      Math.min(levels.length - 1, nextIndex)
    );

    setLevelIndex(bounded);
    setBoard(makeBoard(levels[bounded].start));
    setSelected(null);
    setMovesUsed(0);
    setStatus("ready");
    setHintVisible(false);
    setSolutionVisible(false);
  }


  function handleMatchClick(position) {
    if (isLocked) return;

    if (
      selected?.slotIndex === position.slotIndex &&
      selected?.segment === position.segment
    ) {
      setSelected(null);
      setStatus("ready");
      return;
    }

    setSelected(position);
    setStatus("selected");
  }

  function handleEmptyClick(destination) {
    if (!selected || isLocked) return;

    const nextBoard = board.map((token) => ({
      ...token,
      segments: [...token.segments],
    }));

    nextBoard[selected.slotIndex].segments =
      nextBoard[selected.slotIndex].segments.filter(
        (segment) => segment !== selected.segment
      );

    nextBoard[destination.slotIndex].segments.push(
      destination.segment
    );

    setBoard(nextBoard);
    setSelected(null);
    setMovesUsed(1);

    if (isCorrectEquation(nextBoard)) {
      setStatus("solved");

      setCompletedLevels((previous) =>
        previous.includes(levelIndex) ? previous : [...previous, levelIndex]
      );
    } else {
      setStatus("wrong");
    }
  }

  function toggleHint() {
    setHintVisible((visible) => !visible);
    setSolutionVisible(false);
  }

  function toggleSolution() {
    setSolutionVisible((visible) => !visible);
    setHintVisible(false);
  }

  const statusCopy = {
    ready: {
      icon: "✦",
      title: "Your move",
      body: "Tap a lit match, then tap an empty segment to place it.",
      tone: "neutral",
    },
    selected: {
      icon: "↗",
      title: "Match selected",
      body: "Now choose a glowing empty slot for your match.",
      tone: "active",
    },
    wrong: {
      icon: "↻",
      title: "Not quite",
      body: "That move did not make a true equation. Reset the level and try again.",
      tone: "error",
    },
    solved: {
      icon: "✓",
      title: "Beautifully solved!",
      body: "The equation is correct. Ready for the next brain teaser?",
      tone: "success",
    },
  }[status];

  return (
    <div className="app-shell">
      <div className="ambient ambient--one" aria-hidden="true" />
      <div className="ambient ambient--two" aria-hidden="true" />

      {/* HEADER */}
      <header className="topbar">
        <a
          className="brand"
          href="#home"
          onClick={(event) => event.preventDefault()}
          aria-label="Match Mind home"
        >
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>

          <span className="brand-copy">
            <strong>
              MATCH<span>MIND</span>
            </strong>
            <small>THE MATCHSTICK LAB</small>
          </span>
        </a>

        <div className="topbar-right">
          <div className="top-stat">
            <span className="top-stat__icon">✦</span>
            <span>
              <strong>{score.toLocaleString()}</strong>
              <small>POINTS</small>
            </span>
          </div>

          <div className="top-stat top-stat--progress">
            <span className="top-stat__icon">◈</span>
            <span>
              <strong>
                {completed.length}
                <em>/{levels.length}</em>
              </strong>
              <small>THIS SECTION</small>
            </span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="main-content" id="home">
        <section className="intro-row">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              LOGIC TRAINING · DAILY BRAIN WORKOUT
            </div>

            <h1>
              One match can <span>change everything.</span>
            </h1>

            <p className="intro-copy">
              Move exactly one matchstick. Turn the impossible equation into a
              true one.
            </p>
          </div>

          <div
            className="progress-card"
            aria-label={`${progressPercent}% of puzzles completed`}
          >
            <div className="progress-card__top">
              <span>{categoryName} PROGRESS</span>
              <strong>{progressPercent}%</strong>
            </div>

            <div className="progress-track">
              <span style={{ width: `${progressPercent}%` }} />
            </div>

            <small>
              {completed.length === levels.length
                ? "All puzzles mastered"
                : `${levels.length - completed.length} challenges left to master`}
            </small>
          </div>
        </section>

        {/* GAME LAYOUT */}
        <div className="game-layout">
          <section className="game-card">
            <div className="game-card__header">
              <div className="level-kicker">
                <span className="level-icon">
                  {String(levelIndex + 1).padStart(2, "0")}
                </span>

                <span>
                  {categoryName} · PUZZLE{" "}
                  {String(levelIndex + 1).padStart(2, "0")}{" "}
                  <i>/ {String(levels.length).padStart(2, "0")}</i>
                </span>
              </div>

              <span
                className={`difficulty difficulty--${
                  levelIndex > 7
                    ? "hard"
                    : levelIndex > 3
                      ? "medium"
                      : "easy"
                }`}
              >
                {level.difficulty}
              </span>
            </div>

            <div className="puzzle-heading">
              <h2>{level.title}</h2>
              <p>
                Move <strong>1 match</strong> to make the equation correct.
              </p>
            </div>

            {/* PUZZLE BOARD */}
            <div
              className={`puzzle-board ${
                selected ? "has-selection" : ""
              } ${status === "solved" ? "is-solved" : ""}`}
            >
              <div className="board-topline">
                <span className="board-label">
                  <span className="live-dot" />
                  MATCHSTICK EQUATION
                </span>

                <span
                  className={`moves-pill ${
                    movesUsed ? "moves-pill--used" : ""
                  }`}
                >
                  <strong>{movesUsed}</strong>
                  <span>/ 1 MOVE</span>
                </span>
              </div>

              <div
                className="equation-stage"
                aria-label={
                  currentExpression
                    ? `Current equation ${currentExpression}`
                    : "Matchstick equation puzzle"
                }
              >
                <div className="equation-row">
                  {board.map((token, slotIndex) => (
                    <MatchGlyph
                      key={`senior-${levelIndex}-${slotIndex}`}
                      token={token}
                      slotIndex={slotIndex}
                      selected={selected}
                      onMatchClick={handleMatchClick}
                      onEmptyClick={handleEmptyClick}
                      locked={isLocked}
                    />
                  ))}
                </div>
              </div>

              {/* STATUS */}
              <div
                className={`status-strip status-strip--${statusCopy.tone}`}
                role="status"
                aria-live="polite"
              >
                <span className="status-strip__icon">{statusCopy.icon}</span>
                <div>
                  <strong>{statusCopy.title}</strong>
                  <p>{statusCopy.body}</p>
                </div>
              </div>

              {/* HINT */}
              {hintVisible && (
                <div className="helper-panel helper-panel--hint">
                  <span className="helper-panel__icon">✧</span>
                  <div>
                    <strong>Hint for this puzzle</strong>
                    <p>{level.hint}</p>
                  </div>
                  <button
                    type="button"
                    className="helper-close"
                    onClick={() => setHintVisible(false)}
                    aria-label="Close hint"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* SOLUTION */}
              {solutionVisible && (
                <div className="helper-panel helper-panel--solution">
                  <span className="helper-panel__icon">◎</span>
                  <div>
                    <strong>
                      Solution:{" "}
                      {level.solution
                        .replace("-", " − ")
                        .replace("+", " + ")
                        .replace("=", " = ")}
                    </strong>
                    <p>{level.explanation}</p>
                  </div>
                  <button
                    type="button"
                    className="helper-close"
                    onClick={() => setSolutionVisible(false)}
                    aria-label="Close solution"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* WIN FOOTER */}
              {status === "solved" ? (
                <div className="win-footer">
                  <div className="win-burst" aria-hidden="true">
                    ✦
                  </div>

                  <div>
                    <strong>+100 points</strong>
                    <small>Logic level cleared</small>
                  </div>

                  <button
                    type="button"
                    className="primary-button next-button"
                    onClick={() =>
                      levelIndex === levels.length - 1
                        ? goToLevel(0)
                        : goToLevel(levelIndex + 1)
                    }
                  >
                    {levelIndex === levels.length - 1
                      ? "RESTART SECTION"
                      : "NEXT PUZZLE"}
                    <span>→</span>
                  </button>
                </div>
              ) : (
                <div className="action-row">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={resetLevel}
                  >
                    <span className="button-icon">↻</span>
                    Reset
                  </button>

                  <div className="action-row__right">
                    <button
                      type="button"
                      className={`secondary-button ${
                        hintVisible ? "is-active" : ""
                      }`}
                      onClick={toggleHint}
                    >
                      <span className="button-icon">✧</span>
                      Hint
                    </button>

                    <button
                      type="button"
                      className="text-button"
                      onClick={toggleSolution}
                    >
                      Reveal answer <span>↗</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* HOW TO PLAY */}
            <div className="how-to-row">
              <div className="how-to-step">
                <span className="step-number">01</span>
                <div>
                  <strong>Pick a match</strong>
                  <small>Tap any bright stick.</small>
                </div>
              </div>

              <span className="step-arrow">→</span>

              <div className="how-to-step">
                <span className="step-number">02</span>
                <div>
                  <strong>Move it</strong>
                  <small>Tap an empty slot.</small>
                </div>
              </div>

              <span className="step-arrow">→</span>

              <div className="how-to-step">
                <span className="step-number">03</span>
                <div>
                  <strong>Make it true</strong>
                  <small>Use only one move.</small>
                </div>
              </div>
            </div>
          </section>

          {/* SIDEBAR */}
          <aside className="side-column">
            <section className="side-card level-list-card">
              <div className="side-card__heading">
                <div>
                  <span className="eyebrow-small">THE CHALLENGE</span>
                  <h3>Level path</h3>
                </div>
                <span className="count-badge">
                  {completed.length}/{levels.length}
                </span>
              </div>

              <div className="level-grid">
                {levels.map((item, index) => {
                  const isComplete = completed.includes(index);
                  const isCurrent = levelIndex === index;

                  return (
                    <button
                      type="button"
                      key={`${item.start}-${index}`}
                      className={`level-tile ${
                        isCurrent ? "is-current" : ""
                      } ${isComplete ? "is-complete" : ""}`}
                      onClick={() => goToLevel(index)}
                      aria-label={`Open puzzle ${index + 1}${
                        isComplete ? ", completed" : ""
                      }`}
                      aria-current={isCurrent ? "step" : undefined}
                    >
                      {isComplete ? (
                        <span className="level-check">✓</span>
                      ) : (
                        String(index + 1).padStart(2, "0")
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="level-list-footer">
                <span className="legend-dot legend-dot--current" />
                Current
                <span className="legend-dot legend-dot--done" />
                Solved
                <span className="legend-dot legend-dot--locked" />
                To do
              </div>
            </section>

            {/* MISSION */}
            <section className="side-card mission-card">
              <div className="mission-icon" aria-hidden="true">
                <span>✳</span>
              </div>

              <span className="eyebrow-small">YOUR MISSION</span>
              <h3>Think in segments.</h3>

              <p>
                Digits are made from seven possible match positions. Look for a
                match that can leave one place and complete another.
              </p>

              <div className="mission-rule">
                <span className="rule-icon">1</span>
                <span>One match moved</span>
                <span className="rule-line" />
                <span className="rule-check">✓</span>
              </div>

              <div className="mission-rule">
                <span className="rule-icon">=</span>
                <span>Equation must be true</span>
                <span className="rule-line" />
                <span className="rule-check">✓</span>
              </div>

              <div className="mission-rule">
                <span className="rule-icon">∞</span>
                <span>No timer. Use your brain.</span>
                <span className="rule-line" />
                <span className="rule-check">✓</span>
              </div>
            </section>

            {/* QUOTE */}
            <section className="quote-card">
              <span className="quote-mark">“</span>
              <p>
                Great solutions often start with seeing one small thing
                differently.
              </p>
              <span className="quote-caption">THE MATCH MIND RULE</span>
            </section>
          </aside>
        </div>

        {/* FOOTER */}
        <footer className="page-footer">
          <span>© MATCHMIND LAB</span>
          <span>
            <i /> MADE FOR CURIOUS MINDS
          </span>
          <span>20 PUZZLES · ONE MATCH EACH</span>
        </footer>
      </main>
    </div>
  );
}