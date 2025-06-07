"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Code2,
  Play,
  RefreshCw,
  Clock,
  AlertCircle,
  Terminal,
  CheckCircle,
} from "lucide-react";
import { UserDataContext } from "./context/UserContext";
import Editor from "@monaco-editor/react";
import { SocketContext } from "./context/SocketContext";

// Add language mapping for Judge0 (adjust or expand as needed)
const languageMapping = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62,
  csharp: 51,
  ruby: 72,
  go: 60,
};

const getLanguageId = (lang) => languageMapping[lang] || 63;

const allLanguages = [
  "javascript",
  "python",
  "cpp",
  "java",
  "csharp",
  "ruby",
  "go",
];

const StartBattle = () => {
  const navigate = useNavigate();
  const { roomcode } = useParams();
  const { user } = useContext(UserDataContext);
  const { socket } = useContext(SocketContext);

  // Scores now are always stored as creator and challenger.
  const [scores, setScores] = useState({ creator: 0, challenger: 0 });
  const [battle, setBattle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [opponentTyping, setOpponentTyping] = useState(false);
  const [allowedLanguages, setAllowedLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  // We store opponentName separately.
  const [opponentName, setOpponentName] = useState("Waiting...");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(600);
  const [editorInstance, setEditorInstance] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Fetch battle details and set allowedLanguages.
  useEffect(() => {
    const fetchBattle = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/battle/all`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200) {
          const battles = response.data.battles;
          const foundBattle = battles.find((b) => b.roomCode === roomcode);
          setBattle(foundBattle);
          if (foundBattle && user) {
            if (foundBattle.isSameLanguage) {
              if (
                foundBattle.allowedLanguages &&
                foundBattle.allowedLanguages.length > 0
              ) {
                setAllowedLanguages(foundBattle.allowedLanguages);
                setSelectedLanguage(foundBattle.allowedLanguages[0]);
              }
            } else {
              setAllowedLanguages(allLanguages);
              setSelectedLanguage(allLanguages[0]);
            }
            const creatorId =
              typeof foundBattle.createdBy === "object"
                ? foundBattle.createdBy._id
                : foundBattle.createdBy;
            const creatorBool = creatorId.toString() === user._id.toString();
            setIsCreator(creatorBool);
            if (creatorBool) {
              if (foundBattle.user2SocketId) {
                fetchOpponent(foundBattle.user2SocketId);
              }
            } else {
              // For challengers, display the creator's full name on left.
              if (foundBattle.createdBy && foundBattle.createdBy.fullname) {
                const { firstname, lastname } = foundBattle.createdBy.fullname;
                // We keep opponentName as is, because on challenger screen "You" will be on right.
                // No need to update opponentName here.
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching battle:", error);
      } finally {
        setLoading(false);
      }
    };
    if (roomcode) {
      fetchBattle();
    }
  }, [roomcode, user]);

  // Join battle room.
  useEffect(() => {
    if (battle && socket) {
      socket.emit("battleRoom", battle.roomCode);
    }
  }, [battle, socket]);

  // Timer useEffect.
  useEffect(() => {
    if (battle && currentQuestion) {
      let interval;
      if (battle.mode === "quality") {
        interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setCurrentQuestion(null);
              return 600; // reset timer for next question
            }
            return prev - 1;
          });
        }, 1000);
      } else if (battle.mode === "time") {
        setTimer(0);
        interval = setInterval(() => {
          setTimer((prev) => prev + 1);
        }, 1000);
      }
      return () => clearInterval(interval);
    }
  }, [battle, currentQuestion]);

  // Socket listeners.
  useEffect(() => {
    if (!socket) return;
    socket.on("newQuestion", (data) => {
      setCurrentQuestion(data.question);
      setHasSubmitted(false);
      setCode(""); // clear the code editor upon receiving a new question
      if (battle) {
        if (battle.mode === "quality") {
          setTimer(600);
        } else if (battle.mode === "time") {
          setTimer(0);
        }
      }
    });
    socket.on("scoreUpdate", (data) => {
      setScores(data.scores);
    });
    socket.on("pointAwarded", (data) => {
      const wonPoint =
        (isCreator && data.winner === "creator") ||
        (!isCreator && data.winner === "challenger");
      const msg = wonPoint ? "You won a point" : "Opponent won a point";
      setToastMessage(msg);
      // Clear the current question and increment the question index
      setCurrentQuestion(null);
      setQuestionIndex((prev) => prev + 1);
      if (battle) {
        if (battle.mode === "quality") {
          setTimer(600);
        } else if (battle.mode === "time") {
          setTimer(0);
        }
      }
      setTimeout(() => setToastMessage(""), 2000);
    });
    socket.on("battleCompleted", (data) => {
      // data contains isWinner, battleDetails, finalScore
      navigate(`/battle-winner/${battle.roomCode}`, {
        state: {
          isWinner: data.isWinner,
          battleDetails: data.battleDetails,
          finalScore: data.finalScore,
        },
      });
    });
    return () => {
      socket.off("newQuestion");
      socket.off("scoreUpdate");
      socket.off("pointAwarded");
      socket.off("battleCompleted");
    };
  }, [socket, battle, isCreator, navigate]);

  // Update editor language on change.
  useEffect(() => {
    if (editorInstance) {
      const { editor, monaco } = editorInstance;
      monaco.editor.setModelLanguage(editor.getModel(), selectedLanguage);
    }
  }, [selectedLanguage, editorInstance]);

  // Simulate opponent typing.
  useEffect(() => {
    if (currentQuestion) {
      const typingInterval = setInterval(() => {
        setOpponentTyping((prev) => !prev);
      }, 3000);
      return () => clearInterval(typingInterval);
    }
  }, [currentQuestion]);

  const fetchOpponent = async (socketId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/getOpponent/${socketId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (
        res.status === 200 &&
        res.data.opponent &&
        res.data.opponent.length > 0
      ) {
        const opponent = res.data.opponent[0];
        setOpponentName(
          `${opponent.fullname.firstname} ${opponent.fullname.lastname}`
        );
      }
    } catch (error) {
      console.error("Error fetching opponent:", error);
    }
  };

  // Generate question handler (creator only).
  const handleGenerateQuestion = () => {
    if (!isCreator || currentQuestion) return;
    if (battle && battle.questions && battle.questions.length > questionIndex) {
      setIsGeneratingQuestion(true);
      const newQuestion = {
        ...battle.questions[questionIndex],
        constraints: `
• 2 <= nums.length <= 10^4
• -10^9 <= nums[i] <= 10^9
• -10^9 <= target <= 10^9
• Only one valid answer exists.
      `,
      };
      setCurrentQuestion(newQuestion);
      if (battle.mode === "quality") {
        setTimer(600);
      } else if (battle.mode === "time") {
        setTimer(0);
      }
      setIsGeneratingQuestion(false);
      socket.emit("newQuestion", {
        roomCode: battle.roomCode,
        question: newQuestion,
      });
    }
  };

  // Helper to normalize output for comparison
  const normalizeOutput = (output) => {
    if (!output) return "";
    const trimmed = output.trim();
    try {
      // Parse and stringify to remove formatting differences (will output without spaces)
      return JSON.stringify(JSON.parse(trimmed));
    } catch (error) {
      // If not valid JSON, remove all whitespace
      return trimmed.replace(/\s+/g, "");
    }
  };

  // Modified submission handler integrating Judge0 API
  const handleSubmitCode = async () => {
    if (!currentQuestion || hasSubmitted) return;
    setHasSubmitted(true);

    try {
      // Submit the code to Judge0
      const submissionResponse = await axios.post(
        `https://${
          import.meta.env.VITE_JUDGE0_API_HOST
        }/submissions?base64_encoded=false&wait=true`,
        {
          source_code: code,
          language_id: getLanguageId(selectedLanguage),
          stdin: currentQuestion["sample input"] || currentQuestion.sampleInput,
        },
        {
          headers: {
            "x-rapidapi-host": import.meta.env.VITE_JUDGE0_API_HOST,
            "x-rapidapi-key": import.meta.env.VITE_JUDGE0_API_KEY,
          },
        }
      );

      // Debug logs for raw output from Judge0.
      console.log("Judge0 Raw stdout:", submissionResponse.data.stdout);
      console.log("Judge0 Raw stderr:", submissionResponse.data.stderr);

      const judgeOutput = normalizeOutput(submissionResponse.data.stdout);
      const expectedOutput = normalizeOutput(
        currentQuestion["sample output"] || currentQuestion.sampleOutput
      );

      console.log("Normalized Judge0 Output:", judgeOutput);
      console.log("Normalized Expected Output:", expectedOutput);

      if (judgeOutput === expectedOutput) {
        // Update the scores if solution is correct
        const updatedScores = { ...scores };
        if (isCreator) {
          updatedScores.creator += 1;
        } else {
          updatedScores.challenger += 1;
        }
        socket.emit("scoreUpdate", {
          roomCode: battle.roomCode,
          scores: updatedScores,
        });
        socket.emit("pointAwarded", {
          roomCode: battle.roomCode,
          winner: isCreator ? "creator" : "challenger",
        });

        // Removed the extra setQuestionIndex here.
        // (The socket "pointAwarded" listener will increment questionIndex.)

        // If all questions are answered, complete the battle.
        if (
          updatedScores.creator + updatedScores.challenger ===
          battle.questions.length
        ) {
          const token = localStorage.getItem("token");
          axios
            .patch(
              `${import.meta.env.VITE_BASE_URL}/battle/complete/${battle._id}`,
              { scores: updatedScores },
              {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
              }
            )
            .then((response) => {
              const isWinner =
                response.data.battle.winner?.toString() === user._id.toString();
              socket.emit("battleCompleted", {
                roomCode: battle.roomCode,
                isWinner,
                battleDetails: battle,
                finalScore: updatedScores,
              });
            })
            .catch((error) => console.error("Error completing battle:", error));
        }
      } else {
        // If the solution is not correct, allow re-submission.
        alert("Incorrect solution submitted.");
        setHasSubmitted(false);
      }
    } catch (error) {
      console.error("Error during submission:", error);
      setHasSubmitted(false);
    }
  };

  // Socket listener for battleCompleted (inside a useEffect):
  useEffect(() => {
    if (!socket) return;
    socket.on("battleCompleted", (data) => {
      navigate(`/battle-winner/${battle.roomCode}`, {
        state: {
          isWinner: data.isWinner,
          battleDetails: data.battleDetails,
          finalScore: data.finalScore,
        },
      });
    });
    return () => {
      socket.off("battleCompleted");
    };
  }, [socket, battle, navigate]);

  // Define display names so the logged in user sees "You" on their side.
  const creatorDisplayName = isCreator
    ? "You"
    : battle?.createdBy?.fullname
    ? `${battle.createdBy.fullname.firstname} ${battle.createdBy.fullname.lastname}`
    : "Creator";
  const challengerDisplayName = isCreator ? opponentName : "You";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center text-gray-100">
        Loading battle details...
      </div>
    );
  }

  if (!battle) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center text-gray-100">
        Battle not found!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {toastMessage}
        </div>
      )}
      <header className="bg-gray-800/50 border-b border-gray-700/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Code2 className="h-8 w-8 text-blue-500 mr-2" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Code Battle
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {currentQuestion && battle.mode === "quality" && (
              <div className="text-sm text-gray-400">
                <Clock className="h-4 w-4 inline mr-1" /> Time Left: {timer}s
              </div>
            )}
            {currentQuestion && battle.mode === "time" && (
              <div className="text-sm text-gray-400">
                Elapsed: {new Date(timer * 1000).toISOString().substr(14, 5)}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left Column - Battle Info & Question */}
        <div className="w-full lg:w-1/2 space-y-6">
          {/* Battle Info & Scoreboard */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
              <h2 className="text-lg font-bold">{battle.battleName}</h2>
              <p className="text-sm text-gray-400">{battle.description}</p>
            </div>
            <div className="p-4 flex justify-center items-center">
              <div className="flex items-center gap-4">
                {/* Left: Creator always */}
                <div className="flex flex-col items-center">
                  <div className="text-lg font-bold">{creatorDisplayName}</div>
                  <div className="text-3xl font-bold text-blue-400">
                    {scores.creator}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-500">-</div>
                {/* Right: Challenger always */}
                <div className="flex flex-col items-center">
                  <div className="text-lg font-bold">
                    {challengerDisplayName}
                  </div>
                  <div className="text-3xl font-bold text-purple-400">
                    {scores.challenger}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Question Section */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
            {!currentQuestion ? (
              <div className="p-8 text-center">
                {isCreator ? (
                  <>
                    <div className="mb-4 flex justify-center">
                      <Play className="h-12 w-12 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Start the Battle</h3>
                    <p className="text-gray-400 mb-6">
                      Click below to generate the next question.
                    </p>
                    <button
                      onClick={handleGenerateQuestion}
                      disabled={isGeneratingQuestion}
                      className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium flex items-center justify-center mx-auto ${
                        isGeneratingQuestion
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transform hover:scale-105 active:scale-95"
                      }`}
                    >
                      {isGeneratingQuestion ? (
                        <>
                          <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                          Generating Question...
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 mr-2" />
                          Generate Question
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mb-4 flex justify-center">
                      <Clock className="h-12 w-12 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      Waiting for Question
                    </h3>
                    <p className="text-gray-400">
                      The battle creator is preparing the next question.
                    </p>
                    <div className="mt-6 flex justify-center">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-150"></div>
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-300"></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold flex items-center">
                    <Terminal className="h-5 w-5 mr-2 text-blue-400" />
                    {currentQuestion.questionname || currentQuestion.title}
                  </h3>
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                    {currentQuestion.difficulty}
                  </div>
                </div>
                <div className="prose prose-invert prose-sm max-w-none mb-4">
                  <p className="text-gray-300 whitespace-pre-line">
                    {currentQuestion.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-900/70 rounded-lg p-3 border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">
                      Sample Input:
                    </div>
                    <pre className="text-sm text-green-400 font-mono">
                      {currentQuestion["sample input"] ||
                        currentQuestion.sampleInput}
                    </pre>
                  </div>
                  <div className="bg-gray-900/70 rounded-lg p-3 border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">
                      Sample Output:
                    </div>
                    <pre className="text-sm text-blue-400 font-mono">
                      {currentQuestion["sample output"] ||
                        currentQuestion.sampleOutput}
                    </pre>
                  </div>
                </div>
                {currentQuestion.explanation && (
                  <div className="bg-gray-900/70 rounded-lg p-3 border border-gray-700 mb-4">
                    <div className="text-xs text-gray-400 mb-1">
                      Explanation:
                    </div>
                    <p className="text-sm text-gray-300">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}
                {currentQuestion.constraints && (
                  <div className="bg-gray-900/70 rounded-lg p-3 border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">
                      Constraints:
                    </div>
                    <pre className="text-xs text-gray-300 font-mono whitespace-pre-line">
                      {currentQuestion.constraints}
                    </pre>
                  </div>
                )}
                {isCreator && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleGenerateQuestion}
                      disabled={currentQuestion !== null}
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 text-sm flex items-center"
                    >
                      <RefreshCw
                        className={`h-4 w-4 mr-1.5 ${
                          isGeneratingQuestion ? "animate-spin" : ""
                        }`}
                      />
                      {isGeneratingQuestion ? "Generating..." : "Next Question"}
                    </button>
                  </div>
                )}
                {currentQuestion && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleSubmitCode}
                      className="px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium flex items-center bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-1.5" />
                      Submit Solution
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Code Editor */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden h-full flex flex-col">
            <div className="p-3 border-b border-gray-700 bg-gray-900/50 flex justify-between items-center">
              <div className="flex items-center">
                <Code2 className="h-4 w-4 text-blue-400 mr-2" />
                <span className="font-medium">Solution</span>
              </div>
              <div className="flex items-center">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-gray-900 border border-gray-700 rounded-md text-sm px-2 py-1 mr-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {allowedLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                {opponentTyping && (
                  <div className="text-xs text-gray-400 flex items-center mr-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mr-1"></div>
                    Opponent is typing...
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 relative">
              <Editor
                height="100%"
                language={selectedLanguage}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                onMount={(editor, monaco) => {
                  setEditorInstance({ editor, monaco });
                }}
                options={{
                  minimap: { enabled: false },
                  readOnly: !currentQuestion,
                }}
              />
              {!currentQuestion && (
                <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center p-6">
                    <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-300">
                      Waiting for question
                    </h3>
                    <p className="mt-2 text-gray-400 max-w-md">
                      The code editor will be available once the battle begins
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-3 border-t border-gray-700 bg-gray-900/50 flex justify-between items-center">
              <div className="text-xs text-gray-400">
                Remember to handle all edge cases
              </div>
              <button
                onClick={handleSubmitCode}
                disabled={!currentQuestion || !code.trim()}
                className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium flex items-center ${
                  !currentQuestion || !code.trim()
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                <CheckCircle className="h-4 w-4 mr-1.5" />
                Submit Solution
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StartBattle;
