
import React, { useState, useEffect } from "react";
import "./App.css";

const questions = [
  {
    q: "01",
    difficulty: "HARD",
    instruction: "Move exactly ONE matchstick to make the equation correct.",
    visual: "6 + 4 = 4",
    type: "equation",
    hint: "Think about changing both a digit and an operator."
  },
  {
    q: "02",
    difficulty: "HARD",
    instruction: "Move exactly TWO matchsticks to make the equation mathematically correct.",
    visual: "9 - 3 = 3",
    type: "equation",
    hint: "Look carefully at the possible transformations of 9 and 3."
  },
  {
    q: "03",
    difficulty: "HARD",
    instruction: "Move exactly ONE matchstick. You are allowed to change the mathematical operator.",
    visual: "8 + 3 = 9",
    type: "equation",
    hint: "Consider the different ways a plus or minus sign can be formed."
  },
  {
    q: "04",
    difficulty: "HARD",
    instruction: "Move exactly TWO matchsticks to make the equation correct.",
    visual: "6 + 6 = 9",
    type: "equation",
    hint: "Think about the seven-segment structure of the digits."
  },
  {
    q: "05",
    difficulty: "HARD",
    instruction: "Move exactly ONE matchstick to make this equation correct.",
    visual: "9 - 5 = 3",
    type: "equation",
    hint: "A single segment can change the value of a digit."
  },
  {
    q: "06",
    difficulty: "VERY HARD",
    instruction: "You have 12 matchsticks arranged into four identical squares in a 2 × 2 arrangement. Move exactly TWO matchsticks to create three squares of different sizes.",
    visual: "2 × 2 SQUARE GRID",
    type: "geometry",
    hint: "Do not focus only on the small squares. Look for larger combined shapes."
  },
  {
    q: "07",
    difficulty: "VERY HARD",
    instruction: "You have 24 matchsticks arranged into a 3 × 3 grid of squares. Remove exactly FOUR matchsticks so that exactly five squares remain.",
    visual: "3 × 3 SQUARE GRID",
    type: "geometry",
    hint: "Remember that squares can be formed using more than one unit square."
  },
  {
    q: "08",
    difficulty: "VERY HARD",
    instruction: "Arrange 12 matchsticks into a flat figure containing six triangles. Move exactly THREE matchsticks to create four triangles.",
    visual: "12 MATCHSTICKS",
    type: "geometry",
    hint: "Think about triangles sharing sides."
  },
  {
    q: "09",
    difficulty: "VERY HARD",
    instruction: "Using exactly six matchsticks, construct four identical equilateral triangles. No matchstick may be broken.",
    visual: "6 MATCHSTICKS",
    type: "geometry",
    hint: "The trick is to think beyond a two-dimensional arrangement."
  },
  {
    q: "10",
    difficulty: "VERY HARD",
    instruction: "You have 18 matchsticks arranged into six identical squares. Move exactly THREE matchsticks to create three identical squares.",
    visual: "6 SQUARES",
    type: "geometry",
    hint: "Consider how squares can share sides."
  },
  {
    q: "11",
    difficulty: "EXPERT",
    instruction: "Construct five identical squares using 16 matchsticks. Move exactly FOUR matchsticks to create four identical squares.",
    visual: "16 MATCHSTICKS",
    type: "geometry",
    hint: "Look for a completely different arrangement, not just a rearrangement of the outer boundary."
  },
  {
    q: "12",
    difficulty: "EXPERT",
    instruction: "Arrange 15 matchsticks into five identical equilateral triangles. Move exactly THREE matchsticks to create five squares.",
    visual: "15 MATCHSTICKS",
    type: "geometry",
    hint: "Think about how the original figure can share sides in a new way."
  },
  {
    q: "13",
    difficulty: "EXPERT",
    instruction: "Using 20 matchsticks, construct a figure containing exactly five squares. Move exactly FOUR matchsticks to create seven squares.",
    visual: "20 MATCHSTICKS",
    type: "geometry",
    hint: "Count squares of every possible size."
  },
  {
    q: "14",
    difficulty: "EXPERT",
    instruction: "Arrange 24 matchsticks into a rectangular grid containing six equal squares. Move exactly THREE matchsticks to create three rectangles of equal area.",
    visual: "24 MATCHSTICKS",
    type: "geometry",
    hint: "Rectangles do not have to be squares."
  },
  {
    q: "15",
    difficulty: "EXPERT",
    instruction: "Create a house-shaped figure using 11 matchsticks. Move exactly TWO matchsticks to create two triangles and two squares.",
    visual: "HOUSE PUZZLE",
    type: "geometry",
    hint: "Pay attention to the roof and the shared boundaries."
  },
  {
    q: "16",
    difficulty: "MASTER",
    instruction: "Construct a three-dimensional structure with 12 matchsticks containing exactly six equilateral triangles. Rearrange exactly THREE matchsticks to form a different structure containing four equilateral triangles.",
    visual: "3D CHALLENGE",
    type: "geometry",
    hint: "Think about tetrahedral structures."
  },
  {
    q: "17",
    difficulty: "MASTER",
    instruction: "Construct two identical cubes using 24 matchsticks. Rearrange exactly FOUR matchsticks to create a structure containing three identical cubes.",
    visual: "3D CUBE PUZZLE",
    type: "geometry",
    hint: "Consider cubes that share edges."
  },
  {
    q: "18",
    difficulty: "MASTER",
    instruction: "Arrange 12 matchsticks into a figure containing exactly eight triangles. Move exactly TWO matchsticks to leave exactly six triangles.",
    visual: "TRIANGLE CHALLENGE",
    type: "geometry",
    hint: "Look at both small and large triangles."
  },
  {
    q: "19",
    difficulty: "MASTER",
    instruction: "Using 18 matchsticks, construct a figure containing exactly four squares and four triangles. Move exactly THREE matchsticks to create a figure containing exactly six squares.",
    visual: "MIXED GEOMETRY",
    type: "geometry",
    hint: "The same matchstick can form a side of multiple shapes."
  },
  {
    q: "20",
    difficulty: "MASTER",
    instruction: "The ultimate challenge: Using 24 matchsticks, construct a three-dimensional structure containing eight equilateral triangular faces. Rearrange exactly SIX matchsticks to form a different three-dimensional structure containing four square faces.",
    visual: "ULTIMATE 3D CHALLENGE",
    type: "geometry",
    hint: "Think about the relationship between vertices, edges and faces."
  }
];

function App() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!started || finished) return;

    const timer = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, finished]);

  const question = questions[current];

  const formatTime = (time) => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const markCompleted = () => {
    if (!completed.includes(current)) {
      setCompleted([...completed, current]);
    }
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setShowHint(false);
    } else {
      setFinished(true);
    }
  };

  const previousQuestion = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setShowHint(false);
    }
  };

  const restart = () => {
    setStarted(false);
    setCurrent(0);
    setCompleted([]);
    setSeconds(0);
    setShowHint(false);
    setFinished(false);
  };

  if (!started) {
    return (
      <div className="app">
        <div className="landing">
          <div className="top-label">
            <span className="live-dot"></span>
            STEM SKILLS INSTITUTE
          </div>

          <div className="hero-icon">
            <span></span><span></span><span></span>
          </div>

          <p className="eyebrow">THE ULTIMATE BRAIN CHALLENGE</p>

          <h1>
            MATCHSTICK
            <span>MASTERS</span>
          </h1>

          <p className="subtitle">
            20 mind-bending puzzles. One sharp mind.
            Can you solve them all?
          </p>

          <div className="rule-card">
            <h2>HOW TO PLAY</h2>

            <div className="rule">
              <span className="rule-number">01</span>
              <p>There are exactly 20 challenging puzzles.</p>
            </div>

            <div className="rule">
              <span className="rule-number">02</span>
              <p>Move or remove only the specified number of matchsticks.</p>
            </div>

            <div className="rule">
              <span className="rule-number">03</span>
              <p>Do not break, bend or add matchsticks.</p>
            </div>

            <div className="rule">
              <span className="rule-number">04</span>
              <p>For 3D puzzles, think beyond flat shapes.</p>
            </div>

            <div className="rule">
              <span className="rule-number">05</span>
              <p>Mark a question solved only when you are confident in your answer.</p>
            </div>
          </div>

          <div className="challenge-info">
            <div>
              <strong>20</strong>
              <span>QUESTIONS</span>
            </div>
            <div>
              <strong>HARD</strong>
              <span>DIFFICULTY</span>
            </div>
            <div>
              <strong>∞</strong>
              <span>THINKING</span>
            </div>
          </div>

          <button className="start-btn" onClick={() => setStarted(true)}>
            START CHALLENGE <span>→</span>
          </button>

          <p className="footer-note">THINK DIFFERENTLY. SOLVE SMARTER.</p>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="app">
        <div className="finish-screen">
          <div className="finish-icon">✦</div>
          <p className="eyebrow">CHALLENGE COMPLETED</p>
          <h1>WELL DONE!</h1>
          <p className="subtitle">
            You have reached the end of all 20 matchstick challenges.
          </p>

          <div className="result-card">
            <div>
              <strong>{completed.length}/20</strong>
              <span>MARKED SOLVED</span>
            </div>
            <div>
              <strong>{formatTime(seconds)}</strong>
              <span>TIME TAKEN</span>
            </div>
          </div>

          <button className="start-btn" onClick={restart}>
            PLAY AGAIN <span>↻</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-symbol">M</div>
          <div>
            <strong>MATCHSTICK MASTERS</strong>
            <small>STEM SKILLS INSTITUTE</small>
          </div>
        </div>

        <div className="timer">
          <span>◷</span> {formatTime(seconds)}
        </div>
      </header>

      <main className="main-content">
        <div className="progress-section">
          <div className="progress-top">
            <span>YOUR PROGRESS</span>
            <strong>{completed.length} / 20 SOLVED</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${completed.length * 5}%` }}
            ></div>
          </div>

          <div className="question-dots">
            {questions.map((item, index) => (
              <button
                key={item.q}
                onClick={() => {
                  setCurrent(index);
                  setShowHint(false);
                }}
                className={[
                  "dot",
                  index === current ? "active" : "",
                  completed.includes(index) ? "solved" : ""
                ].join(" ")}
                title={`Question ${item.q}`}
              >
                {completed.includes(index) ? "✓" : index + 1}
              </button>
            ))}
          </div>
        </div>

        <section className="question-card">
          <div className="question-top">
            <div>
              <span className="question-label">CHALLENGE</span>
              <h2>QUESTION {question.q}</h2>
            </div>

            <span className={`difficulty ${question.difficulty.toLowerCase().replace(" ", "-")}`}>
              {question.difficulty}
            </span>
          </div>

          <div className="visual-area">
            <span className="visual-label">PUZZLE</span>
            <div className={question.type === "equation" ? "equation" : "visual-text"}>
              {question.visual}
            </div>
            {question.type === "equation" && (
              <p className="visual-caption">
                Standard seven-segment matchstick digits
              </p>
            )}
            {question.type === "geometry" && (
              <p className="visual-caption">
                Use the specified number of individual matchsticks
              </p>
            )}
          </div>

          <div className="instruction-area">
            <span className="instruction-label">YOUR TASK</span>
            <p>{question.instruction}</p>
          </div>

          <button
            className="hint-btn"
            onClick={() => setShowHint(!showHint)}
          >
            <span>✧</span>
            {showHint ? "HIDE HINT" : "NEED A HINT?"}
            <span>{showHint ? "−" : "+"}</span>
          </button>

          {showHint && (
            <div className="hint-box">
              <strong>THINK ABOUT IT</strong>
              <p>{question.hint}</p>
            </div>
          )}

          <button
            className={`solved-btn ${completed.includes(current) ? "marked" : ""}`}
            onClick={markCompleted}
          >
            {completed.includes(current) ? "✓  MARKED AS SOLVED" : "✓  I SOLVED THIS"}
          </button>
        </section>

        <div className="navigation">
          <button
            className="nav-btn previous"
            onClick={previousQuestion}
            disabled={current === 0}
          >
            ← PREVIOUS
          </button>

          <span className="page-number">
            {current + 1} <span>/</span> 20
          </span>

          <button className="nav-btn next" onClick={nextQuestion}>
            {current === 19 ? "FINISH" : "NEXT QUESTION"} →
          </button>
        </div>

        <div className="bottom-note">
          <span>✦</span> EVERY MATCHSTICK HAS A PURPOSE.
        </div>
      </main>
    </div>
  );
}

export default App;
