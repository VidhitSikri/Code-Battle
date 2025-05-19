"use client"

import { useState, useEffect } from "react"
import { Code2, Play, RefreshCw, Clock, AlertCircle, Terminal, CheckCircle } from "lucide-react"

const StartBattle = ({ isCreator = true }) => {
  const [scores, setScores] = useState({ you: 0, opponent: 0 })
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [code, setCode] = useState("")
  const [opponentTyping, setOpponentTyping] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")

  // Mock data for the battle
  const battleData = {
    title: "Algorithm Showdown",
    description: "Race to solve classic algorithm challenges with optimal solutions",
    creator: {
      username: "CodeNinja",
    },
    opponent: {
      username: "AlgoMaster",
    },
  }

  // Mock question data
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
  }

  // Simulate opponent typing
  useEffect(() => {
    if (currentQuestion) {
      const typingInterval = setInterval(() => {
        setOpponentTyping((prev) => !prev)
      }, 3000)

      return () => clearInterval(typingInterval)
    }
  }, [currentQuestion])

  // Handle generating a new question
  const handleGenerateQuestion = () => {
    setIsGeneratingQuestion(true)

    // Simulate API call delay
    setTimeout(() => {
      setCurrentQuestion(mockQuestion)
      setIsGeneratingQuestion(false)
    }, 2000)
  }

  // Handle code submission
  const handleSubmitCode = () => {
    // In a real app, this would send the code to be evaluated
    console.log("Submitting code:", code)

    // For demo purposes, let's simulate a correct answer
    setScores((prev) => ({
      ...prev,
      you: prev.you + 1,
    }))
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
            <button className="px-4 py-2 bg-red-600/80 hover:bg-red-700 rounded-lg transition-all duration-300 flex items-center text-sm font-medium">
              Forfeit Battle
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left Column - Battle Info & Question */}
        <div className="w-full lg:w-1/2 space-y-6">
          {/* Battle Info */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
              <h2 className="text-lg font-bold">{battleData.title}</h2>
              <p className="text-sm text-gray-400">{battleData.description}</p>
            </div>

            {/* Players & Scores */}
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/20 border-2 border-blue-500/30">
                  {isCreator ? "CN" : "AM"}
                </div>
                <div className="ml-3">
                  <div className="font-medium text-blue-400">
                    {isCreator ? battleData.creator.username : battleData.opponent.username} (You)
                  </div>
                  <div className="text-xs text-gray-500">{isCreator ? "Creator" : "Challenger"}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-blue-400">{scores.you}</div>
                <div className="text-xl font-bold text-gray-500">-</div>
                <div className="text-2xl font-bold text-purple-400">{scores.opponent}</div>
              </div>

              <div className="flex items-center">
                <div className="mr-3 text-right">
                  <div className="font-medium text-purple-400">
                    {isCreator ? battleData.opponent.username : battleData.creator.username}
                  </div>
                  <div className="text-xs text-gray-500">{isCreator ? "Challenger" : "Creator"}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center text-sm font-bold shadow-lg shadow-purple-500/20 border-2 border-purple-500/30">
                  {isCreator ? "AM" : "CN"}
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
                    <p className="text-gray-400 mb-6">Generate the first question to begin the coding battle.</p>
                    <button
                      onClick={handleGenerateQuestion}
                      disabled={isGeneratingQuestion}
                      className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium flex items-center justify-center mx-auto
                        ${
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
                    <h3 className="text-xl font-bold mb-2">Waiting for Question</h3>
                    <p className="text-gray-400">The battle creator is preparing the first question.</p>
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
                  <p className="text-gray-300 whitespace-pre-line">{currentQuestion.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-900/70 rounded-lg p-3 border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">Sample Input:</div>
                    <pre className="text-sm text-green-400 font-mono">{currentQuestion.sampleInput}</pre>
                  </div>
                  <div className="bg-gray-900/70 rounded-lg p-3 border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">Sample Output:</div>
                    <pre className="text-sm text-blue-400 font-mono">{currentQuestion.sampleOutput}</pre>
                  </div>
                </div>

                {currentQuestion.explanation && (
                  <div className="bg-gray-900/70 rounded-lg p-3 border border-gray-700 mb-4">
                    <div className="text-xs text-gray-400 mb-1">Explanation:</div>
                    <p className="text-sm text-gray-300">{currentQuestion.explanation}</p>
                  </div>
                )}

                {currentQuestion.constraints && (
                  <div className="bg-gray-900/70 rounded-lg p-3 border border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">Constraints:</div>
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
                      <RefreshCw className={`h-4 w-4 mr-1.5 ${isGeneratingQuestion ? "animate-spin" : ""}`} />
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
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-gray-900 border border-gray-700 rounded-md text-sm px-2 py-1 mr-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
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
              {/* Code Editor */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`// Write your ${selectedLanguage} solution here\n\n${
                  selectedLanguage === "javascript"
                    ? "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};"
                    : selectedLanguage === "python"
                      ? "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        "
                      : ""
                }`}
                className="w-full h-full bg-gray-900 text-gray-200 font-mono p-4 resize-none focus:outline-none"
                spellCheck="false"
                disabled={!currentQuestion}
              />

              {!currentQuestion && (
                <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center p-6">
                    <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-300">Waiting for question</h3>
                    <p className="mt-2 text-gray-400 max-w-md">
                      The code editor will be available once the battle begins
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-700 bg-gray-900/50 flex justify-between items-center">
              <div className="text-xs text-gray-400">Remember to handle all edge cases</div>

              <button
                onClick={handleSubmitCode}
                disabled={!currentQuestion || !code.trim()}
                className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium flex items-center
                  ${
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
  )
}

export default StartBattle
