"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
import { UserDataContext } from "./context/UserContext";

const BattleWinner = () => {
  const { user } = useContext(UserDataContext);
  const { roomcode } = useParams();
  const navigate = useNavigate();

  const [battleDetails, setBattleDetails] = useState(null);
  const [finalScore, setFinalScore] = useState({ winner: 0, loser: 0 });
  const [loading, setLoading] = useState(true);

  // Fetch complete battle details using the room code
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
          if (foundBattle) {
            setBattleDetails(foundBattle);
            // Use scores if sent, otherwise compute dummy score values (this example assumes scores are stored separately)
            if (foundBattle.scores) {
              setFinalScore(foundBattle.scores);
            } else {
              // For demonstration, assume if winner field is set then winner gets 1 point
              setFinalScore({ winner: 1, loser: 0 });
            }
          } else {
            console.error("Battle not found for room code:", roomcode);
          }
        }
      } catch (err) {
        console.error("Error fetching battle details:", err);
      } finally {
        setLoading(false);
      }
    };
    if (roomcode) {
      fetchBattle();
    }
  }, [roomcode]);

  // Helper to format full name
  const getFullName = (fullname) =>
    fullname ? `${fullname.firstname} ${fullname.lastname}` : "";

  let yourName = "";
  let oppName = "";
  let isMeWinner = false;

  if (battleDetails && battleDetails.createdBy && battleDetails.challenger) {
    if (user._id.toString() === battleDetails.createdBy._id.toString()) {
      yourName = getFullName(battleDetails.createdBy.fullname);
      oppName = getFullName(battleDetails.challenger.fullname);
    } else {
      yourName = getFullName(battleDetails.challenger.fullname);
      oppName = getFullName(battleDetails.createdBy.fullname);
    }
    // battleDetails.winner is expected to be set on completion
    isMeWinner =
      battleDetails.winner &&
      battleDetails.winner.toString() === user._id.toString();
  }

  const yourScore = isMeWinner ? finalScore.winner : finalScore.loser;
  const oppScore = isMeWinner ? finalScore.loser : finalScore.winner;

  // UI Animation and confetti states
  const [showConfetti, setShowConfetti] = useState(isMeWinner);
  const [animationPhase, setAnimationPhase] = useState("entering");

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationPhase("celebrating"), 500);
    const timer2 = setTimeout(() => setShowConfetti(false), 8000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

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

  // Generate confetti pieces for the winning animation
  const confettiPieces = isMeWinner
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

  const floatingParticles = [...Array(20)].map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center">
        Loading battle results...
      </div>
    );
  }

  if (!battleDetails) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center">
        Battle details not found.
      </div>
    );
  }

  return (
    <>
      {/* Inline CSS for animations */}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes slide-up {
          0% { transform: translateY(50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .confetti-piece { animation: confetti-fall linear infinite; }
        .slide-up { animation: slide-up 0.8s ease-out forwards; }
        .bounce-in { animation: bounce-in 0.6s ease-out forwards; }
      `}</style>

      <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden">
        {showConfetti && isMeWinner && (
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
        <div
          className={`absolute inset-0 ${
            isMeWinner
              ? "bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black"
              : "bg-gradient-to-br from-gray-900/40 via-red-900/10 to-black"
          }`}
        ></div>
        <div className="absolute inset-0">
          {floatingParticles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute w-1 h-1 rounded-full float opacity-30 ${
                isMeWinner ? "bg-blue-400" : "bg-gray-500"
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
          <div className="max-w-4xl w-full text-center mb-8">
            <div className={animationPhase === "entering" ? "slide-up" : "bounce-in"}>
              <div className="mb-6">
                {isMeWinner ? (
                  <Crown className="h-20 w-20 text-yellow-400 mx-auto" />
                ) : (
                  <Frown className="h-20 w-20 text-gray-400 mx-auto" />
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {isMeWinner ? "VICTORY!" : "DEFEAT"}
              </h1>
              <p className="text-xl text-gray-300">
                {isMeWinner
                  ? `Congratulations ${yourName}! You dominated the battlefield!`
                  : "Don't give up! Every defeat is a step towards victory!"}
              </p>
            </div>
          </div>

          {/* Score Display */}
          <div className="bg-gray-900/80 border border-gray-700 rounded-xl overflow-hidden mb-8 backdrop-blur-sm">
            <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center text-3xl md:text-4xl font-bold shadow-lg border-4 border-yellow-500/50 mx-auto">
                    {getInitials(yourName)}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                    YOU
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2">
                  {yourName}
                </h3>
                <div className="text-yellow-300 font-medium">Your Score</div>
                <div className="text-3xl font-bold text-yellow-400 mt-2">
                  {yourScore}
                </div>
              </div>

              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600">
                  <span className="text-xl font-bold text-gray-400">VS</span>
                </div>
              </div>

              <div className="flex-1 text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center text-3xl md:text-4xl font-bold shadow-lg border-4 border-gray-600/50 mx-auto">
                    {getInitials(oppName)}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                    OPPONENT
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-400 mb-2">
                  {oppName}
                </h3>
                <div className="text-gray-500 font-medium">Score</div>
                <div className="text-3xl font-bold text-gray-400 mt-2">
                  {oppScore}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className={`px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium shadow-lg flex items-center justify-center ${isMeWinner ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "bg-gradient-to-r from-red-600 to-red-700 text-white"}`}>
              <RotateCcw className="h-5 w-5 mr-2" />
              {isMeWinner ? "Battle Again" : "Try Again"}
            </button>
            <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 border border-gray-700 flex items-center justify-center">
              <Share2 className="h-5 w-5 mr-2" />
              Share Result
            </button>
            <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 border border-gray-700 flex items-center justify-center" onClick={() => navigate("/")}>
              <Home className="h-5 w-5 mr-2" />
              Home
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default BattleWinner;
