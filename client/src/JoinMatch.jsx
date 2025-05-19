"use client";

import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Code2,
  Clock,
  Cpu,
  Globe,
  Lock,
  Zap,
  Hash,
  Languages,
  Search,
  ArrowRight,
  Filter,
  Users,
  AlertCircle,
} from "lucide-react";
import { UserDataContext } from "./context/UserContext";
import { SocketContext } from "./context/SocketContext";

const JoinRoom = () => {
  const [privateRoomCode, setPrivateRoomCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [publicRooms, setPublicRooms] = useState([]);

  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const { sendMessage, recieveMessage } = useContext(SocketContext);

  // Fetch battles from backend and filter for public battles
  useEffect(() => {
    const fetchPublicBattles = async () => {
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
          // Filter out only public battles (isPrivate is false)
          const publicBattles = response.data.battles.filter(
            (battle) => battle.isPrivate === false
          );
          setPublicRooms(publicBattles);
        }
      } catch (error) {
        console.error("Error retrieving battle rooms:", error);
        alert("Error retrieving battle rooms");
      }
    };
    fetchPublicBattles();
  }, []);

  // Filter public rooms based on search query and difficulty
  const filteredRooms = publicRooms.filter((room) => {
    const matchesSearch =
      room.battleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "all" || room.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const handleJoinPrivateRoom = async (e) => {
    e.preventDefault();
    if (privateRoomCode.trim()) {
      const roomCode = privateRoomCode.trim();
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
          const battle = battles.find((b) => b.roomCode === roomCode);
          if (battle) {
            console.log(`Found battle with code: ${roomCode}`);
            sendMessage("battleRoom", roomCode);
            navigate(`/rooms/${roomCode}`);
          } else {
            alert("Battle room not found or invalid room code");
          }
        }
      } catch (error) {
        console.error("Error retrieving battle rooms:", error);
        alert("Error retrieving battle rooms");
      }
      setPrivateRoomCode("");
    }
  };

  const handleJoinPublicRoom = (roomCode) => {
    console.log(`Joining public room with code: ${roomCode}`);
    sendMessage("battleRoom", roomCode);
    navigate(`/rooms/${roomCode}`);
  };

  // Helper function to get difficulty badge color
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
            onClick={() => navigate("/create-room")}
            className="px-4 py-2 bg-blue-600/80 hover:bg-blue-700 rounded-lg transition-all duration-300 flex items-center text-sm font-medium"
          >
            <Zap className="h-4 w-4 mr-2" />
            Create Room
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Public Rooms */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-400" />
                Public Battle Rooms
              </h2>
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 p-4">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
                <div className="text-sm text-gray-400">
                  {filteredRooms.length}{" "}
                  {filteredRooms.length === 1 ? "room" : "rooms"} available
                </div>
              </div>
              {showFilters && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Difficulty</label>
                    <select
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="all">All Difficulties</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  {/* Additional filters can be added here */}
                </div>
              )}
            </div>

            {/* Room List */}
            <div className="space-y-4">
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room) => (
                  <div
                    key={room._id}
                    className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {room.battleName}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">
                            {new Date(room.createdAt).toLocaleTimeString()}
                          </span>
                          <div
                            className={`px-2 py-1 rounded-md text-xs font-medium ${getDifficultyColor(
                              room.difficulty
                            )}`}
                          >
                            {room.difficulty.charAt(0).toUpperCase() +
                              room.difficulty.slice(1)}
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-400 text-sm line-clamp-2">
                        {room.description}
                      </p>
                      {/* Updated "Created by" section */}
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-400">
                          <span>Created by </span>
                          <span className="ml-1 font-medium text-blue-400">
                            {room.creatorName ||
                              (room.createdBy && room.createdBy.fullname
                                ? `${room.createdBy.fullname.firstname} ${room.createdBy.fullname.lastname}`
                                : "Unknown")}
                          </span>
                        </div>
                        <button
                          onClick={() => handleJoinPublicRoom(room.roomCode)}
                          className="px-4 py-2 bg-blue-600/80 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center text-sm font-medium group-hover:shadow-md group-hover:shadow-blue-500/20"
                        >
                          Join Battle
                          <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <AlertCircle className="h-12 w-12 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-300">
                    No battle rooms found
                  </h3>
                  <p className="mt-2 text-gray-400">
                    Try adjusting your filters or create your own battle room
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Private Room & Info */}
          <div className="space-y-6">
            {/* Private Room Section */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
              <div className="p-5">
                <h3 className="text-lg font-semibold flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-purple-400" />
                  Join Private Room
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Enter a private room code shared by the room creator
                </p>
                <form onSubmit={handleJoinPrivateRoom} className="mt-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter room code (e.g. ABC123)"
                      value={privateRoomCode}
                      onChange={(e) => setPrivateRoomCode(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 placeholder-gray-500"
                      maxLength={6}
                    />
                    <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 w-0 group-focus-within:w-full transition-all duration-300"></div>
                  </div>
                  <button
                    type="submit"
                    disabled={!privateRoomCode.trim()}
                    className={`mt-4 w-full px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center font-medium ${
                      privateRoomCode.trim()
                        ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Join Private Battle
                  </button>
                </form>
              </div>
            </div>

            {/* Info Cards */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
              <div className="p-5">
                <h3 className="text-lg font-semibold flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-blue-400" />
                  How It Works
                </h3>
                <ul className="mt-3 space-y-3 text-sm text-gray-300">
                  <li className="flex">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 mr-3 text-xs font-bold">
                      1
                    </span>
                    <span>Join a public room or enter a private room code</span>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 mr-3 text-xs font-bold">
                      2
                    </span>
                    <span>
                      Wait for the battle to begin when all players are ready
                    </span>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 mr-3 text-xs font-bold">
                      3
                    </span>
                    <span>
                      Solve coding challenges faster or better than your
                      opponent
                    </span>
                  </li>
                  <li className="flex">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 mr-3 text-xs font-bold">
                      4
                    </span>
                    <span>Win battles to climb the global leaderboard</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">24</div>
                <div className="text-xs text-gray-400 mt-1">Active Battles</div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">142</div>
                <div className="text-xs text-gray-400 mt-1">Online Coders</div>
              </div>
            </div>

            {/* Create Room CTA */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/30 rounded-xl p-5 text-center">
              <h3 className="text-lg font-semibold">Create Your Own Battle</h3>
              <p className="mt-2 text-sm text-gray-300">
                Set your own rules and challenge other coders
              </p>
              <button
                onClick={() => navigate("/create-room")}
                className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
              >
                Create Battle Room
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JoinRoom;
