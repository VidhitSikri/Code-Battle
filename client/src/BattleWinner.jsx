"use client";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Trophy,
  Crown,
  Code2,
  Clock,
  Shield,
  Zap,
  Hash,
  Star,
  Home,
  RotateCcw,
  Share2,
  Frown,
} from "lucide-react";

const BattleWinner = () => {
  const location = useLocation();
  // Extract real data passed from the complete battle redirect
  const { isWinner, battleDetails, finalScore } = location.state || {
    isWinner: true,
    battleDetails: {
      title: "Battle Title",
      questions: 0,
      mode: "quality",
      difficulty: "medium",
      duration: "00:00",
      createdBy: {
        _id: "0",
        fullname: { firstname: "Creator", lastname: "User" },
      },
      challenger: {
        _id: "1",
        fullname: { firstname: "Challenger", lastname: "User" },
      },
      winner: null,
    },
    finalScore: { winner: 0, loser: 0 },
  };

  // Determine winner and loser names based on battleDetails
  const getDisplayNames = () => {
    if (!battleDetails) return { winnerName: "Winner", loserName: "Loser" };
    const creatorFullname = battleDetails.createdBy?.fullname;
    const challengerFullname = battleDetails.challenger?.fullname;
    const creatorName = creatorFullname
      ? `${creatorFullname.firstname || "Creator"} ${
          creatorFullname.lastname || ""
        }`.trim()
      : "Creator";
    const challengerName = challengerFullname
      ? `${challengerFullname.firstname || "Challenger"} ${
          challengerFullname.lastname || ""
        }`.trim()
      : "Challenger";

    if (battleDetails.createdBy && battleDetails.challenger) {
      if (
        battleDetails.winner &&
        battleDetails.createdBy._id?.toString() ===
          battleDetails.winner?.toString()
      ) {
        return { winnerName: creatorName, loserName: challengerName };
      } else {
        return { winnerName: challengerName, loserName: creatorName };
      }
    }
    return { winnerName: "Winner", loserName: "Loser" };
  };

  const { winnerName, loserName } = getDisplayNames();

  const [showConfetti, setShowConfetti] = useState(isWinner); // Only show confetti for winners
  const [animationPhase, setAnimationPhase] = useState("entering");

  useEffect(() => {
    // Animation sequence
    const timer1 = setTimeout(() => setAnimationPhase("celebrating"), 500);
    const timer2 = setTimeout(() => setShowConfetti(false), 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Helper function to get initials
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Helper function to get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "medium":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "hard":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  // Generate confetti pieces (only if winner)
  const confettiPieces = isWinner
    ? [...Array(50)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 2,
        color:
          i % 4 === 0
            ? "#3b82f6"
            : i % 4 === 1
            ? "#8b5cf6"
            : i % 4 === 2
            ? "#10b981"
            : "#f59e0b",
      }))
    : [];

  // Generate floating particles
  const floatingParticles = [...Array(20)].map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
  }));

  return (
    <>
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes slide-up {
          0% {
            transform: translateY(50px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.5));
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.8));
            transform: scale(1.05);
          }
        }

        @keyframes winner-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(251, 191, 36, 0.6);
          }
        }

        @keyframes text-glow {
          0%,
          100% {
            text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
          }
          50% {
            text-shadow: 0 0 20px rgba(251, 191, 36, 0.8),
              0 0 30px rgba(251, 191, 36, 0.6);
          }
        }

        @keyframes defeat-pulse {
          0%,
          100% {
            filter: drop-shadow(0 0 5px rgba(156, 163, 175, 0.3));
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 10px rgba(156, 163, 175, 0.5));
            transform: scale(1.02);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .confetti-piece {
          animation: confetti-fall linear infinite;
        }

        .slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }

        .bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
        }

        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .winner-glow {
          animation: winner-glow 2s ease-in-out infinite;
        }

        .text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }

        .defeat-pulse {
          animation: defeat-pulse 2s ease-in-out infinite;
        }

        .float {
          animation: float ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden">
        {/* Confetti Animation - Only for Winners */}
        {showConfetti && isWinner && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {confettiPieces.map((piece) => (
              <div
                key={piece.id}
                className="absolute w-3 h-3 confetti-piece opacity-80"
                style={{
                  left: `${piece.left}%`,
                  animationDelay: `${piece.delay}s`,
                  animationDuration: `${piece.duration}s`,
                  backgroundColor: piece.color,
                }}
              />
            ))}
          </div>
        )}

        {/* Background Effects */}
        <div
          className={`absolute inset-0 ${
            isWinner
              ? "bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black"
              : "bg-gradient-to-br from-gray-900/40 via-red-900/10 to-black"
          }`}
        ></div>

        {/* Animated Background Particles */}
        <div className="absolute inset-0">
          {floatingParticles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute w-1 h-1 rounded-full float opacity-30 ${
                isWinner ? "bg-blue-400" : "bg-gray-500"
              }`}
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            />
          ))}
        </div>

        <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
          <div className="max-w-4xl w-full">
            {/* Main Winner/Loser Announcement */}
            <div
              className={`text-center mb-8 ${
                animationPhase === "entering" ? "slide-up" : "bounce-in"
              }`}
            >
              <div className="mb-6">
                {isWinner ? (
                  <Crown className="h-20 w-20 text-yellow-400 mx-auto pulse-glow" />
                ) : (
                  <Frown className="h-20 w-20 text-gray-400 mx-auto defeat-pulse" />
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {isWinner ? (
                  <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent text-glow">
                    VICTORY!
                  </span>
                ) : (
                  <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                    DEFEAT
                  </span>
                )}
              </h1>

              <p className="text-xl text-gray-300">
                {isWinner
                  ? "Congratulations! You dominated the battlefield!"
                  : "Don't give up! Every defeat is a step towards victory!"}
              </p>
            </div>

            {/* Winner vs Loser Display */}
            <div className="bg-gray-900/80 border border-gray-700 rounded-xl overflow-hidden mb-8 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  {/* Winner (Always on left) */}
                  <div className="flex-1 text-center">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center text-3xl md:text-4xl font-bold shadow-lg shadow-yellow-500/30 border-4 border-yellow-500/50 mx-auto winner-glow">
                        {getInitials(winnerName)}
                      </div>
                      <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-2 shadow-lg">
                        <Crown className="h-6 w-6 text-white" />
                      </div>
                      {isWinner && (
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                          YOU
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2">
                      {winnerName}
                    </h3>
                    <div className="text-yellow-300 font-medium">WINNER</div>
                    <div className="text-3xl font-bold text-yellow-400 mt-2">
                      {finalScore.winner}
                    </div>
                  </div>

                  {/* VS */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 flex items-center justify-center border-2 border-gray-600">
                      <span className="text-xl font-bold text-gray-400">
                        VS
                      </span>
                    </div>
                  </div>

                  {/* Loser (Always on right) */}
                  <div className="flex-1 text-center">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center text-3xl md:text-4xl font-bold shadow-lg border-4 border-gray-600/50 mx-auto">
                        {getInitials(loserName)}
                      </div>
                      {!isWinner && (
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                          YOU
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-400 mb-2">
                      {loserName}
                    </h3>
                    <div className="text-gray-500 font-medium">DEFEATED</div>
                    <div className="text-3xl font-bold text-gray-400 mt-2">
                      {finalScore.loser}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Battle Details */}
            <div className="bg-gray-900/80 border border-gray-700 rounded-xl overflow-hidden mb-8 backdrop-blur-sm">
              <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
                <h3 className="text-xl font-bold flex items-center">
                  <Code2 className="h-5 w-5 mr-2 text-blue-400" />
                  Battle Summary
                </h3>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 text-center">
                    <Hash className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">
                      {battleDetails.questions}
                    </div>
                    <div className="text-sm text-gray-400">Questions</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 text-center">
                    {battleDetails.mode === "speed" ? (
                      <>
                        <Clock className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-lg font-bold text-white">
                          Speed
                        </div>
                        <div className="text-sm text-gray-400">Based</div>
                      </>
                    ) : (
                      <>
                        <Zap className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                        <div className="text-lg font-bold text-white">
                          Quality
                        </div>
                        <div className="text-sm text-gray-400">Based</div>
                      </>
                    )}
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 text-center">
                    <Shield className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
                        battleDetails.difficulty
                      )}`}
                    >
                      {battleDetails.difficulty.charAt(0).toUpperCase() +
                        battleDetails.difficulty.slice(1)}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Difficulty</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 text-center">
                    <Clock className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">
                      {battleDetails.duration}
                    </div>
                    <div className="text-sm text-gray-400">Duration</div>
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="text-lg font-bold text-white mb-2">
                    {battleDetails.title}
                  </h4>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                    <span>
                      Final Score: {finalScore.winner} - {finalScore.loser}
                    </span>
                    <span>•</span>
                    <span>{isWinner ? "Victory" : "Defeat"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className={`px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium shadow-lg flex items-center justify-center ${
                  isWinner
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/20 hover:shadow-blue-500/30"
                    : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-red-500/20 hover:shadow-red-500/30"
                }`}
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                {isWinner ? "Battle Again" : "Try Again"}
              </button>

              <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 border border-gray-700 flex items-center justify-center">
                <Share2 className="h-5 w-5 mr-2" />
                Share Result
              </button>

              <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 border border-gray-700 flex items-center justify-center">
                <Home className="h-5 w-5 mr-2" />
                Home
              </button>
            </div>

            {/* Achievement Badge or Encouragement */}
            <div className="mt-8 text-center">
              {isWinner ? (
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full">
                  <Star className="h-5 w-5 text-yellow-400 mr-2" />
                  <span className="text-yellow-400 font-medium">
                    +50 XP Earned
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full">
                  <Trophy className="h-5 w-5 text-blue-400 mr-2" />
                  <span className="text-blue-400 font-medium">
                    Keep practicing to improve!
                  </span>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default BattleWinner;
