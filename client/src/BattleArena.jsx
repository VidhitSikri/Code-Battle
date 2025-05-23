"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Code2,
  Copy,
  Share2,
  Users,
  Clock,
  Shield,
  Zap,
  CheckCircle,
  X,
  PlayCircle,
  Loader,
} from "lucide-react";
import { UserDataContext } from "./context/UserContext";
import { SocketContext } from "./context/SocketContext"; // ensure you import your SocketContext

const BattleArena = () => {
  const { roomcode } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserDataContext);
  const { socket, sendMessage } = useContext(SocketContext); // assuming socket is exposed here

  const [battle, setBattle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [waitTime, setWaitTime] = useState(0);
  const [showBattleModal, setShowBattleModal] = useState(false);
  const [opponentData, setOpponentData] = useState(null);

  // Fetch the battle data on initial render based on the roomcode from useParams
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
          const battles = response.data.battles; // ensure your API returns an array named "battles"
          const foundBattle = battles.find((b) => b.roomCode === roomcode);
          setBattle(foundBattle);
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
  }, [roomcode]);

  // Set isCreator based on battle data and current user
  useEffect(() => {
    if (battle && user) {
      // If createdBy is populated, use its _id property; otherwise, assume it's an ID string.
      const creatorId =
        typeof battle.createdBy === "object" && battle.createdBy._id
          ? battle.createdBy._id
          : battle.createdBy;
      setIsCreator(creatorId.toString() === user._id.toString());
    }
  }, [battle, user]);

  // Simulate waiting time counter
  useEffect(() => {
    if (!opponentJoined) {
      const timer = setInterval(() => {
        setWaitTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [opponentJoined]);

  // Polling to check for opponent connection based on backend data
  useEffect(() => {
    let pollInterval;
    const pollBattle = async () => {
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
          const updatedBattle = battles.find((b) => b.roomCode === roomcode);
          if (!updatedBattle) {
            // If the battle is not present and the user is not the creator,
            // then the creator must have left; navigate home.
            if (!isCreator) {
              navigate("/");
            }
          } else {
            setBattle(updatedBattle);
            if (updatedBattle.user2SocketId) {
              setOpponentJoined(true);
            } else {
              setOpponentJoined(false);
            }
          }
        }
      } catch (error) {
        console.error("Error polling battle:", error);
      }
    };

    if (roomcode) {
      pollInterval = setInterval(pollBattle, 3000);
    }
    return () => clearInterval(pollInterval);
  }, [isCreator, roomcode, navigate]);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomcode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const shareRoomCode = () => {
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  const startBattle = async () => {
    if (!isCreator || !battle.user2SocketId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/getOpponent/${
          battle.user2SocketId
        }`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        let opponent = response.data.opponent;
        // If the API returns an array, pick the first element
        if (Array.isArray(opponent)) {
          opponent = opponent[0];
        }
        if (opponent && opponent.fullname) {
          setOpponentData(opponent);
          setShowBattleModal(true);
        } else {
          console.error("Opponent data missing fullname");
        }
      }
    } catch (error) {
      console.error("Error fetching opponent data:", error);
    }
  };

  const confirmStartBattle = async () => {
    try {
      const token = localStorage.getItem("token");
      // Call the new API endpoint to start the battle
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/battle/start/${battle._id}`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        // Emit socket event to notify the opponent
        socket.emit("startBattle", {
          roomCode: roomcode,
          opponentSocketId: battle.user2SocketId,
        });
        console.log("Battle Started!");
        setShowBattleModal(false);
        navigate(`/start-battle/${roomcode}`);
      }
    } catch (error) {
      console.error("Error starting battle:", error);
    }
  };

  // Listen for the redirect event on the opponent client side
  useEffect(() => {
    if (socket) {
      socket.on("redirectToBattle", ({ roomCode }) => {
        navigate(`/start-battle/${roomCode}`);
      });
    }
    return () => {
      if (socket) socket.off("redirectToBattle");
    };
  }, [socket, navigate]);

  // New leave room functionality
  const handleLeaveRoom = async () => {
    const token = localStorage.getItem("token");
    try {
      if (isCreator) {
        const confirmed = window.confirm(
          "Are you sure you want to leave and delete this battle?"
        );
        if (confirmed) {
          await axios.delete(
            `${import.meta.env.VITE_BASE_URL}/battle/${battle._id}`,
            {
              withCredentials: true,
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          navigate("/");
        }
      } else {
        await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/battle/leave/${battle._id}`,
          { user2SocketId: null },
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        navigate("/");
      }
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex justify-center items-center">
        <Loader className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!battle) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex justify-center items-center">
        <p>Battle not found</p>
      </div>
    );
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
          <button
            onClick={handleLeaveRoom}
            className="px-4 py-2 bg-red-600/80 hover:bg-red-700 rounded-lg transition-all duration-300 flex items-center text-sm font-medium"
          >
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
              <h2 className="text-2xl font-bold text-white mb-2">
                {battle.battleName}
              </h2>
              <p className="text-gray-400 mb-6">{battle.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-xs text-gray-400 mb-1">Difficulty</div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-blue-400" />
                    <span className="font-medium capitalize">
                      {battle.difficulty}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-xs text-gray-400 mb-1">Questions</div>
                  <div className="flex items-center">
                    <Code2 className="h-4 w-4 mr-2 text-blue-400" />
                    <span className="font-medium">
                      {battle.questionsNumber}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                  <div className="text-xs text-gray-400 mb-1">Mode</div>
                  <div className="flex items-center">
                    {battle.mode === "time" ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 text-blue-400" />
                        <span className="font-medium">Time-based</span>
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
                    <span className="font-medium">
                      {battle.isSameLanguage
                        ? battle.allowedLanguages.join(", ")
                        : "Any"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Room Code / Room Type Block */}
              {battle.isPrivate ? (
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/30 rounded-xl p-5 mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-400" />
                    Room Code
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 bg-gray-900/70 rounded-lg border border-gray-700 p-3 flex items-center justify-between">
                      <div className="font-mono text-xl text-blue-400 tracking-wider">
                        {battle.roomCode}
                      </div>
                      <button
                        onClick={copyRoomCode}
                        className={`p-2 rounded-md transition-all duration-300 ${
                          copySuccess
                            ? "bg-green-500/20 text-green-400"
                            : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                        }`}
                      >
                        {copySuccess ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <button
                      onClick={shareRoomCode}
                      className={`px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center ${
                        shareSuccess
                          ? "bg-green-600 text-white"
                          : "bg-purple-600 hover:bg-purple-700 text-white"
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
              ) : (
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/30 rounded-xl p-5 mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-400" />
                    Public Room
                  </h3>
                  <p className="text-gray-400">
                    Anyone can join this room without a code.
                  </p>
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
                    <h3 className="text-2xl font-bold text-white">
                      Opponent has joined!
                    </h3>
                    <p className="text-gray-400">
                      You can now start the battle when you're ready.
                    </p>
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
                    <h3 className="text-2xl font-bold text-white">
                      Waiting for opponent...
                    </h3>
                    <p className="text-gray-400">
                      Share the room details with your opponent to join.
                    </p>
                    <div className="text-gray-500 font-mono">
                      Waiting time: {formatTime(waitTime)}
                    </div>
                  </div>
                )
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-center text-blue-400 mb-4">
                    <Loader className="h-12 w-12 animate-spin" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Waiting for creator to start...
                  </h3>
                  <p className="text-gray-400">
                    The battle will begin shortly.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal for Battle Details */}
      {isCreator && showBattleModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 rounded-2xl p-8 w-96 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105">
            <h2 className="text-3xl font-extrabold text-white mb-6 text-center">
              Battle Details
            </h2>
            <div className="mb-3">
              <span className="text-gray-200 font-medium">Creator: </span>
              <span className="text-white">{user.fullname.firstname}</span>
            </div>
            <div className="mb-3">
              <span className="text-gray-200 font-medium">Opponent: </span>
              <span className="text-white">
                {opponentData && opponentData.fullname
                  ? opponentData.fullname.firstname
                  : "Loading..."}
              </span>
            </div>
            <div className="mb-3">
              <span className="text-gray-200 font-medium">Battle Name: </span>
              <span className="text-white">{battle.battleName}</span>
            </div>
            <div className="mb-3">
              <span className="text-gray-200 font-medium">Description: </span>
              <span className="text-white">{battle.description}</span>
            </div>
            <div className="mb-3">
              <span className="text-gray-200 font-medium">Questions: </span>
              <span className="text-white">{battle.questionsNumber}</span>
            </div>
            <div className="mb-3">
              <span className="text-gray-200 font-medium">Mode: </span>
              <span className="text-white">
                {battle.mode === "time" ? "Time-based" : "Quality-based"}
              </span>
            </div>
            <div className="mb-3">
              <span className="text-gray-200 font-medium">Difficulty: </span>
              <span className="text-white capitalize">{battle.difficulty}</span>
            </div>
            <div className="mb-6">
              <span className="text-gray-200 font-medium">
                Languages Allowed:{" "}
              </span>
              <span className="text-white">
                {battle.isSameLanguage
                  ? battle.allowedLanguages.join(", ")
                  : "Any"}
              </span>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setShowBattleModal(false)}
                className="flex-1 mr-2 py-3 border border-red-400 text-red-400 font-semibold rounded-full hover:bg-red-400 hover:text-white transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmStartBattle}
                className="flex-1 ml-2 py-3 bg-green-500 font-semibold text-white rounded-full hover:bg-green-600 transition-all duration-300 shadow-lg shadow-green-400/50"
              >
                Start Battle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleArena;
