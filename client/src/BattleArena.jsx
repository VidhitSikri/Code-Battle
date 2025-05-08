"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Code2, Copy, Share2, Users, Clock, Shield, Zap, CheckCircle, X, PlayCircle, Loader } from "lucide-react"

const BattleArena = () => {
  const { roomcode } = useParams()
  const [isCreator, setIsCreator] = useState(true) // In a real app, this would be determined by auth
  const [opponentJoined, setOpponentJoined] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [waitTime, setWaitTime] = useState(0)

  // Mock room data - in a real app, this would come from an API
  const roomData = {
    title: "Algorithm Showdown",
    description: "Race to solve classic algorithm challenges with optimal solutions",
    questions: 5,
    difficulty: "medium",
    sameLang: true,
    languages: ["JavaScript", "Python"],
    mode: "speed",
    timeLimit: 30, // minutes
  }

  // Simulate waiting time counter
  useEffect(() => {
    if (!opponentJoined) {
      const timer = setInterval(() => {
        setWaitTime((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [opponentJoined])

  // Simulate opponent joining after some time (for demo purposes)
  useEffect(() => {
    if (isCreator && !opponentJoined) {
      const joinTimer = setTimeout(() => {
        setOpponentJoined(true)
      }, 10000) // Opponent joins after 10 seconds for demo
      return () => clearTimeout(joinTimer)
    }
  }, [isCreator, opponentJoined])

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomcode)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const shareRoomCode = () => {
    // In a real app, this would open a share dialog or generate a shareable link
    // For now, we'll just simulate success
    setShareSuccess(true)
    setTimeout(() => setShareSuccess(false), 2000)
  }

  const startBattle = () => {
    // This function now does nothing - you'll implement it later
    console.log("Start battle button clicked - functionality to be implemented")
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800/50 border-b border-gray-700/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Code2 className="h-8 w-8 text-blue-500 mr-2" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Code Battle
            </h1>
          </div>
          <button className="px-4 py-2 bg-red-600/80 hover:bg-red-700 rounded-lg transition-all duration-300 flex items-center text-sm font-medium">
            <X className="h-4 w-4 mr-2" />
            Leave Room
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Battle Room Info */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-2">{roomData.title}</h2>
              <p className="text-gray-400 mb-6">{roomData.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-xs text-gray-400 mb-1">Difficulty</div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-blue-400" />
                    <span className="font-medium capitalize">{roomData.difficulty}</span>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-xs text-gray-400 mb-1">Questions</div>
                  <div className="flex items-center">
                    <Code2 className="h-4 w-4 mr-2 text-blue-400" />
                    <span className="font-medium">{roomData.questions}</span>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-xs text-gray-400 mb-1">Mode</div>
                  <div className="flex items-center">
                    {roomData.mode === "speed" ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 text-blue-400" />
                        <span className="font-medium">Speed-based</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2 text-purple-400" />
                        <span className="font-medium">Quality-based</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-xs text-gray-400 mb-1">Languages</div>
                  <div className="flex items-center">
                    <Code2 className="h-4 w-4 mr-2 text-blue-400" />
                    <span className="font-medium">{roomData.sameLang ? roomData.languages.join(", ") : "Any"}</span>
                  </div>
                </div>
              </div>

              {isCreator && (
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/30 rounded-xl p-5 mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-400" />
                    Room Code
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 bg-gray-900/70 rounded-lg border border-gray-700 p-3 flex items-center justify-between">
                      <div className="font-mono text-xl text-blue-400 tracking-wider">{roomcode}</div>
                      <button
                        onClick={copyRoomCode}
                        className={`p-2 rounded-md transition-all duration-300 ${
                          copySuccess
                            ? "bg-green-500/20 text-green-400"
                            : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                        }`}
                      >
                        {copySuccess ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                      </button>
                    </div>
                    <button
                      onClick={shareRoomCode}
                      className={`px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center ${
                        shareSuccess ? "bg-green-600 text-white" : "bg-purple-600 hover:bg-purple-700 text-white"
                      }`}
                    >
                      {shareSuccess ? (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Shared!
                        </>
                      ) : (
                        <>
                          <Share2 className="h-5 w-5 mr-2" />
                          Share Code
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Waiting Area / Start Battle */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
            <div className="p-6 text-center">
              {isCreator ? (
                opponentJoined ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-center text-green-400 mb-4">
                      <CheckCircle className="h-12 w-12" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Opponent has joined!</h3>
                    <p className="text-gray-400">You can now start the battle when you're ready.</p>
                    <button
                      onClick={startBattle}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center justify-center mx-auto"
                    >
                      <PlayCircle className="h-6 w-6 mr-2" />
                      Start Battle
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative w-24 h-24 mx-auto">
                      <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Users className="h-8 w-8 text-blue-400" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Waiting for opponent...</h3>
                    <p className="text-gray-400">Share the room code with your opponent to join.</p>
                    <div className="text-gray-500 font-mono">Waiting time: {formatTime(waitTime)}</div>
                  </div>
                )
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-center text-blue-400 mb-4">
                    <Loader className="h-12 w-12 animate-spin" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Waiting for creator to start...</h3>
                  <p className="text-gray-400">The battle will begin shortly.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default BattleArena
