"use client"

import { useState } from "react"
import {
  Code2,
  User,
  Settings,
  History,
  Edit,
  Save,
  LogOut,
  Trophy,
  Star,
  Clock,
  ChevronRight,
  Bell,
  Moon,
  Sun,
  Globe,
  Lock,
  Key,
  Mail,
  Github,
  Twitter,
  Linkedin,
  CheckCircle,
  X,
  AlertCircle,
  Cpu,
} from "lucide-react"

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile")
  const [editMode, setEditMode] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [profileVisibility, setProfileVisibility] = useState("public")
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  // Mock user data - in a real app, this would come from an API
  const [userData, setUserData] = useState({
    username: "CodeNinja",
    fullName: "Alex Johnson",
    email: "alex@example.com",
    bio: "Full-stack developer passionate about algorithms and competitive coding. I love solving complex problems and learning new technologies.",
    location: "San Francisco, CA",
    joinedDate: "January 2023",
    github: "github.com/codeninja",
    twitter: "twitter.com/codeninja",
    linkedin: "linkedin.com/in/codeninja",
    preferredLanguages: ["JavaScript", "Python", "Go"],
    avatarUrl: null, // We'll use initials if no avatar
  })

  // Mock stats data
  const stats = {
    totalBattles: 47,
    wins: 32,
    winRate: "68%",
    ranking: 124,
    level: 18,
    xp: 3240,
    nextLevelXp: 4000,
    badges: ["Algorithm Master", "Speed Coder", "Problem Solver"],
  }

  // Mock battle history
  const battleHistory = [
    {
      id: "battle-1",
      title: "Algorithm Showdown",
      date: "2 days ago",
      opponent: "ByteWarrior",
      result: "win",
      score: "5-2",
      mode: "speed",
      language: "JavaScript",
      difficulty: "hard",
    },
    {
      id: "battle-2",
      title: "Data Structure Duel",
      date: "1 week ago",
      opponent: "AlgoMaster",
      result: "loss",
      score: "3-5",
      mode: "quality",
      language: "Python",
      difficulty: "medium",
    },
    {
      id: "battle-3",
      title: "Frontend Challenge",
      date: "2 weeks ago",
      opponent: "UIWizard",
      result: "win",
      score: "4-1",
      mode: "speed",
      language: "JavaScript",
      difficulty: "medium",
    },
    {
      id: "battle-4",
      title: "Database Query Battle",
      date: "3 weeks ago",
      opponent: "DataGuru",
      result: "win",
      score: "6-4",
      mode: "quality",
      language: "SQL",
      difficulty: "hard",
    },
    {
      id: "battle-5",
      title: "Recursion Masters",
      date: "1 month ago",
      opponent: "RecursiveGenius",
      result: "loss",
      score: "2-4",
      mode: "quality",
      language: "Python",
      difficulty: "hard",
    },
  ]

  const handleProfileUpdate = () => {
    // In a real app, this would send the updated data to an API
    setEditMode(false)
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 3000)
  }

  const handleLogout = () => {
    console.log("Logging out...")
    // In a real app, this would handle the logout process
  }

  // Helper function to get result color
  const getResultColor = (result) => {
    return result === "win" ? "text-green-400" : "text-red-400"
  }

  // Helper function to get difficulty badge color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "medium":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "hard":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  // Helper function to get initials from name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 flex items-center bg-green-500/90 text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in-down">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>Profile updated successfully!</span>
          <button onClick={() => setShowSuccessToast(false)} className="ml-4 text-white hover:text-gray-200">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

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
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-300 flex items-center text-sm font-medium border border-gray-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              {userData.avatarUrl ? (
                <img
                  src={userData.avatarUrl || "/placeholder.svg"}
                  alt={userData.username}
                  className="w-24 h-24 rounded-full border-2 border-blue-500 shadow-lg shadow-blue-500/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-500/20">
                  {getInitials(userData.fullName)}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1 shadow-lg">
                <Trophy className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{userData.username}</h2>
              <p className="text-gray-400">{userData.fullName}</p>
              <p className="text-sm text-gray-500 mt-1">Joined {userData.joinedDate}</p>
              <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                {userData.preferredLanguages.map((lang) => (
                  <span key={lang} className="px-2 py-1 bg-gray-800/70 rounded-full text-xs border border-gray-700">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
              <div className="bg-gray-800/70 rounded-lg p-3 text-center border border-gray-700">
                <div className="text-xl font-bold text-blue-400">{stats.totalBattles}</div>
                <div className="text-xs text-gray-400">Battles</div>
              </div>
              <div className="bg-gray-800/70 rounded-lg p-3 text-center border border-gray-700">
                <div className="text-xl font-bold text-green-400">{stats.wins}</div>
                <div className="text-xs text-gray-400">Wins</div>
              </div>
              <div className="bg-gray-800/70 rounded-lg p-3 text-center border border-gray-700">
                <div className="text-xl font-bold text-purple-400">{stats.winRate}</div>
                <div className="text-xs text-gray-400">Win Rate</div>
              </div>
              <div className="bg-gray-800/70 rounded-lg p-3 text-center border border-gray-700">
                <div className="text-xl font-bold text-yellow-400">#{stats.ranking}</div>
                <div className="text-xs text-gray-400">Ranking</div>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm font-medium">Level {stats.level}</span>
              </div>
              <div className="text-xs text-gray-400">
                {stats.xp} / {stats.nextLevelXp} XP
              </div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full"
                style={{ width: `${(stats.xp / stats.nextLevelXp) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Badges */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
            {stats.badges.map((badge) => (
              <div
                key={badge}
                className="px-3 py-1 bg-gray-800/70 rounded-full text-xs border border-yellow-500/30 text-yellow-400 flex items-center"
              >
                <Trophy className="h-3 w-3 mr-1" />
                {badge}
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-3 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === "profile" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab("battles")}
            className={`px-4 py-3 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === "battles" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <History className="h-4 w-4 mr-2" />
            Battle History
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-3 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === "settings"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Profile Information</h3>
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-3 py-2 bg-blue-600/80 hover:bg-blue-700 rounded-lg transition-all duration-300 flex items-center text-sm font-medium"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={handleProfileUpdate}
                      className="px-3 py-2 bg-green-600/80 hover:bg-green-700 rounded-lg transition-all duration-300 flex items-center text-sm font-medium"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Username */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="text-gray-400">Username</div>
                    {editMode ? (
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          value={userData.username}
                          onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                        />
                      </div>
                    ) : (
                      <div className="md:col-span-2 font-medium">{userData.username}</div>
                    )}
                  </div>

                  {/* Full Name */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="text-gray-400">Full Name</div>
                    {editMode ? (
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          value={userData.fullName}
                          onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                        />
                      </div>
                    ) : (
                      <div className="md:col-span-2 font-medium">{userData.fullName}</div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="text-gray-400">Email</div>
                    {editMode ? (
                      <div className="md:col-span-2">
                        <input
                          type="email"
                          value={userData.email}
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                        />
                      </div>
                    ) : (
                      <div className="md:col-span-2 font-medium">{userData.email}</div>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <div className="text-gray-400">Bio</div>
                    {editMode ? (
                      <div className="md:col-span-2">
                        <textarea
                          value={userData.bio}
                          onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                          rows="4"
                          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none"
                        ></textarea>
                      </div>
                    ) : (
                      <div className="md:col-span-2">{userData.bio}</div>
                    )}
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="text-gray-400">Location</div>
                    {editMode ? (
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          value={userData.location}
                          onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                        />
                      </div>
                    ) : (
                      <div className="md:col-span-2 font-medium">{userData.location}</div>
                    )}
                  </div>

                  {/* Preferred Languages */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="text-gray-400">Preferred Languages</div>
                    {editMode ? (
                      <div className="md:col-span-2">
                        <select
                          multiple
                          value={userData.preferredLanguages}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              preferredLanguages: Array.from(e.target.selectedOptions, (option) => option.value),
                            })
                          }
                          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                        >
                          <option value="JavaScript">JavaScript</option>
                          <option value="Python">Python</option>
                          <option value="Java">Java</option>
                          <option value="C++">C++</option>
                          <option value="Go">Go</option>
                          <option value="Ruby">Ruby</option>
                          <option value="PHP">PHP</option>
                          <option value="Swift">Swift</option>
                          <option value="Kotlin">Kotlin</option>
                          <option value="Rust">Rust</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                      </div>
                    ) : (
                      <div className="md:col-span-2">
                        <div className="flex flex-wrap gap-2">
                          {userData.preferredLanguages.map((lang) => (
                            <span
                              key={lang}
                              className="px-2 py-1 bg-gray-900/70 rounded-full text-xs border border-gray-700"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-700 pt-6">
                  <h3 className="text-xl font-bold mb-6">Social Profiles</h3>

                  <div className="space-y-6">
                    {/* GitHub */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="flex items-center text-gray-400">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </div>
                      {editMode ? (
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            value={userData.github}
                            onChange={(e) => setUserData({ ...userData, github: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                            placeholder="github.com/username"
                          />
                        </div>
                      ) : (
                        <div className="md:col-span-2 font-medium">
                          <a
                            href={`https://${userData.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                          >
                            {userData.github}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Twitter */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="flex items-center text-gray-400">
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </div>
                      {editMode ? (
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            value={userData.twitter}
                            onChange={(e) => setUserData({ ...userData, twitter: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                            placeholder="twitter.com/username"
                          />
                        </div>
                      ) : (
                        <div className="md:col-span-2 font-medium">
                          <a
                            href={`https://${userData.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                          >
                            {userData.twitter}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* LinkedIn */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="flex items-center text-gray-400">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </div>
                      {editMode ? (
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            value={userData.linkedin}
                            onChange={(e) => setUserData({ ...userData, linkedin: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                            placeholder="linkedin.com/in/username"
                          />
                        </div>
                      ) : (
                        <div className="md:col-span-2 font-medium">
                          <a
                            href={`https://${userData.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                          >
                            {userData.linkedin}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Battle History Tab */}
          {activeTab === "battles" && (
            <div className="space-y-6">
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-6">Recent Battles</h3>

                  {battleHistory.length > 0 ? (
                    <div className="space-y-4">
                      {battleHistory.map((battle) => (
                        <div
                          key={battle.id}
                          className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 hover:border-blue-500/30 transition-all duration-300"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                            <div>
                              <h4 className="font-medium text-white">{battle.title}</h4>
                              <p className="text-sm text-gray-400">{battle.date}</p>
                            </div>
                            <div
                              className={`font-bold text-lg ${getResultColor(
                                battle.result,
                              )} flex items-center mt-2 sm:mt-0`}
                            >
                              {battle.result === "win" ? (
                                <CheckCircle className="h-4 w-4 mr-1" />
                              ) : (
                                <X className="h-4 w-4 mr-1" />
                              )}
                              {battle.score}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="text-gray-400 block text-xs">Opponent</span>
                              <span>{battle.opponent}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 block text-xs">Mode</span>
                              <span className="flex items-center">
                                {battle.mode === "speed" ? (
                                  <>
                                    <Clock className="h-3 w-3 mr-1 text-blue-400" />
                                    <span>Speed</span>
                                  </>
                                ) : (
                                  <>
                                    <Cpu className="h-3 w-3 mr-1 text-purple-400" />
                                    <span>Quality</span>
                                  </>
                                )}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400 block text-xs">Language</span>
                              <span>{battle.language}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 block text-xs">Difficulty</span>
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-xs ${getDifficultyColor(
                                  battle.difficulty,
                                )}`}
                              >
                                {battle.difficulty}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 flex justify-end">
                            <button className="text-blue-400 text-sm flex items-center hover:text-blue-300 transition-colors">
                              View Details
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="flex justify-center mb-4">
                        <AlertCircle className="h-12 w-12 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-300">No battles yet</h3>
                      <p className="mt-2 text-gray-400">Join a battle to start building your history</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center">
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-300 text-sm font-medium border border-gray-700">
                  View All Battles
                </button>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Account Settings */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-6">Account Settings</h3>

                  <div className="space-y-6">
                    {/* Change Password */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <div className="flex items-start">
                        <Key className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Change Password</h4>
                          <p className="text-sm text-gray-400">Update your password regularly for security</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 text-sm">
                        Change
                      </button>
                    </div>

                    {/* Email Notifications */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-gray-400">Receive email updates about your account</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 text-sm">
                        Configure
                      </button>
                    </div>

                    {/* Delete Account */}
                    <div className="flex justify-between items-center py-3">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Delete Account</h4>
                          <p className="text-sm text-gray-400">Permanently delete your account and all data</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-red-600/80 hover:bg-red-700 rounded-lg transition-all duration-300 text-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-6">Preferences</h3>

                  <div className="space-y-6">
                    {/* Notifications */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <div className="flex items-start">
                        <Bell className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Notifications</h4>
                          <p className="text-sm text-gray-400">Enable or disable in-app notifications</p>
                        </div>
                      </div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationsEnabled}
                          onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Dark Mode */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <div className="flex items-start">
                        {darkMode ? (
                          <Moon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        ) : (
                          <Sun className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
                        )}
                        <div>
                          <h4 className="font-medium">Dark Mode</h4>
                          <p className="text-sm text-gray-400">Toggle between dark and light theme</p>
                        </div>
                      </div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={darkMode}
                          onChange={() => setDarkMode(!darkMode)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Profile Visibility */}
                    <div className="flex justify-between items-center py-3">
                      <div className="flex items-start">
                        {profileVisibility === "public" ? (
                          <Globe className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        ) : (
                          <Lock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        )}
                        <div>
                          <h4 className="font-medium">Profile Visibility</h4>
                          <p className="text-sm text-gray-400">Control who can see your profile</p>
                        </div>
                      </div>
                      <select
                        value={profileVisibility}
                        onChange={(e) => setProfileVisibility(e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                      >
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connected Accounts */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-6">Connected Accounts</h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <div className="flex items-center">
                        <Github className="h-6 w-6 text-white mr-3" />
                        <div>
                          <h4 className="font-medium">GitHub</h4>
                          <p className="text-sm text-gray-400">Connected</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 text-sm">
                        Disconnect
                      </button>
                    </div>

                    <div className="flex justify-between items-center py-3">
                      <div className="flex items-center">
                        <div className="h-6 w-6 bg-[#1DA1F2] rounded flex items-center justify-center mr-3">
                          <Twitter className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">Twitter</h4>
                          <p className="text-sm text-gray-400">Not connected</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-blue-600/80 hover:bg-blue-700 rounded-lg transition-all duration-300 text-sm">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ProfilePage
