"use client";

import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
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

const allLanguages = [
  "javascript",
  "python",
  "cpp",
  "java",
  "csharp",
  "ruby",
  "go",
]; // full list

const StartBattle = () => {
  const { roomcode } = useParams();
  const { user } = useContext(UserDataContext);

  const [battle, setBattle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [scores, setScores] = useState({ you: 0, opponent: 0 });
  const [opponentTyping, setOpponentTyping] = useState(false);
  // New state: allowedLanguages from the battle document
  const [allowedLanguages, setAllowedLanguages] = useState([]);
  // Default selected language will be set once battle is fetched
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const [opponentName, setOpponentName] = useState("Waiting...");

  // Fetch battle based on roomcode from URL
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
              // When same language is off, allow all languages
              setAllowedLanguages(allLanguages);
              setSelectedLanguage(allLanguages[0]);
            }
            // Determine if current user is creator based on createdBy field:
            const creatorId =
              typeof foundBattle.createdBy === "object"
                ? foundBattle.createdBy._id
                : foundBattle.createdBy;
            const creatorBool = creatorId.toString() === user._id.toString();
            setIsCreator(creatorBool);

            if (creatorBool) {
              // If creator, fetch challenger name via socketId if available:
              if (foundBattle.user2SocketId) {
                fetchOpponent(foundBattle.user2SocketId);
              }
            } else {
              // If not creator, display creator's name as opponent
              if (foundBattle.createdBy && foundBattle.createdBy.fullname) {
                const { firstname, lastname } = foundBattle.createdBy.fullname;
                setOpponentName(`${firstname} ${lastname}`);
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

  // Function to fetch opponent details using socketId
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
      // Assuming the API returns an array of opponent users:
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

  // Simulate opponent typing if question is present (for demo)
  useEffect(() => {
    if (currentQuestion) {
      const typingInterval = setInterval(() => {
        setOpponentTyping((prev) => !prev);
      }, 3000);
      return () => clearInterval(typingInterval);
    }
  }, [currentQuestion]);

  // Mock question data (would normally come from an API call)
  const mockQuestion = {
    id: 1,
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
        
You may assume that each input would have exactly one solution, and you may not use the same element twice.
        
You can return the answer in any order.`,
    difficulty: "Easy",
    sampleInput: `nums = [2,7,11,15], target = 9`,
    sampleOutput: `[0,1]`,
    explanation: `Because nums[0] + nums[1] == 9, we return [0, 1].`,
    constraints: `
• 2 <= nums.length <= 10^4
• -10^9 <= nums[i] <= 10^9
• -10^9 <= target <= 10^9
• Only one valid answer exists.
        `,
  };

  const handleGenerateQuestion = () => {
    setIsGeneratingQuestion(true);
    // Simulate API call delay for question generation
    setTimeout(() => {
      setCurrentQuestion(mockQuestion);
      setIsGeneratingQuestion(false);
    }, 2000);
  };

  const handleSubmitCode = () => {
    // In a real app, this would send the code along with battle info for evaluation
    console.log("Submitting code:", code);
    setScores((prev) => ({
      ...prev,
      you: prev.you + 1,
    }));
  };

  const [editorInstance, setEditorInstance] = useState(null);

  // When selectedLanguage changes, update the model language.
  useEffect(() => {
    if (editorInstance) {
      const { editor, monaco } = editorInstance;
      monaco.editor.setModelLanguage(editor.getModel(), selectedLanguage);
    }
  }, [selectedLanguage, editorInstance]);

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
      {/* Header */}
      <header className="bg-gray-800/50 border-b border-gray-700/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Code2 className="h-8 w-8 text-blue-500 mr-2" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Code Battle
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              <Clock className="h-4 w-4 inline mr-1" />
              <span>Time: 25:32</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left Column - Battle Info & Question */}
        <div className="w-full lg:w-1/2 space-y-6">
          {/* Battle Info */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
              <h2 className="text-lg font-bold">{battle.battleName}</h2>
              <p className="text-sm text-gray-400">{battle.description}</p>
            </div>
            <div className="p-4 flex justify-between items-center">
              {/* Avatar & Role */}
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/20 border-2 border-blue-500/30">
                  {isCreator ? "You" : user.fullname.firstname || "U"}
                </div>
                <div className="ml-3">
                  <div className="font-medium text-blue-400">
                    {isCreator ? "Creator" : "Challenger"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {isCreator ? "You created the battle" : "Joined battle"}
                  </div>
                </div>
              </div>
              {/* Updated Scoreboard */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="text-lg font-bold">
                    {user.fullname.firstname || "You"}
                  </div>
                  <div className="text-3xl font-bold text-blue-400">
                    {scores.you}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-500">-</div>
                <div className="flex flex-col items-center">
                  <div className="text-lg font-bold">{opponentName}</div>
                  <div className="text-3xl font-bold text-purple-400">
                    {scores.opponent}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Question Generation / Current Question */}
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
                      Generate the first question to begin the coding battle.
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
                      The battle creator is preparing the first question.
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
                    {currentQuestion.title}
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
                      {currentQuestion.sampleInput}
                    </pre>
                  </div>
                  <div className="bg-gray-900/70 rounded-lg p-3 border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">
                      Sample Output:
                    </div>
                    <pre className="text-sm text-blue-400 font-mono">
                      {currentQuestion.sampleOutput}
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
                      disabled={isGeneratingQuestion}
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
                {/* Allowed languages from the battle */}
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
                language={selectedLanguage} // initial language setting
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
