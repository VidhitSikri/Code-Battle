"use client";

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Code2,
  User,
  Settings,
  History,
  Edit,
  Save,
  LogOut,
  Trophy,
  Clock,
  ChevronRight,
  CheckCircle,
  X,
  AlertCircle,
  Cpu,
  Key,
  Mail,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Lock,
  Bell,
  Moon,
  Sun,
} from "lucide-react";
import { UserDataContext } from "./context/UserContext";

const ProfilePage = () => {
  // Get user data from context
  const { user, setUser } = useContext(UserDataContext);

  // Tabs and UI state
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  // Settings state for change password and delete account
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  // Local state for profile form (firstname, lastname, email)
  const [profileForm, setProfileForm] = useState({
    firstname: user.fullname?.firstname || "",
    lastname: user.fullname?.lastname || "",
    email: user.email || "",
  });

  useEffect(() => {
    setProfileForm({
      firstname: user.fullname?.firstname || "",
      lastname: user.fullname?.lastname || "",
      email: user.email || "",
    });
  }, [user]);

  const token = localStorage.getItem("token");

  // Logout functionality
  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      console.log(error);
    }
  };

  // Update profile using updateSettings (only update firstname, lastname, email)
  const handleProfileUpdate = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/updateSettings`,
        {
          fullname: {
            firstname: profileForm.firstname,
            lastname: profileForm.lastname,
          },
          email: profileForm.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setUser(response.data.user);
      setShowSuccessToast(true);
      setEditMode(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle profile input changes
  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  // Change password
  const handleChangePassword = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/updateSettings`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setShowSuccessToast(true);
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (error) {
      console.log(error);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/users/deleteAccount`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      localStorage.removeItem("token");
      window.location.href = "/register";
    } catch (error) {
      console.log(error);
    }
  };

  // Handle change in password form inputs
  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  // Helper functions
  const getResultColor = (result) =>
    result === "win" ? "text-green-500" : "text-red-500";
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "hard":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  const getInitials = (nameObj) => {
    if (!nameObj) return "";
    return `${nameObj.firstname?.[0] || ""}${nameObj.lastname?.[0] || ""}`;
  };

  // Mock stats data (removed ranking)
  const stats = {
    totalBattles: 47,
    wins: 32,
    winRate: "68%",
  };

  // Mock battle history (remains unchanged)
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
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 flex items-center bg-green-500/90 text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in-down">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>Profile updated successfully!</span>
          <button
            onClick={() => setShowSuccessToast(false)}
            className="ml-4 text-white hover:text-gray-200"
          >
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
        {/* Top Section */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl || "/placeholder.svg"}
                  alt={`${user.fullname.firstname} ${user.fullname.lastname}`}
                  className="w-24 h-24 rounded-full border-2 border-blue-500 shadow-lg shadow-blue-500/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-500/20">
                  {getInitials(user.fullname)}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1 shadow-lg">
                <Trophy className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold">{user.username}</h2>
              <p className="text-gray-400">
                {user.fullname.firstname} {user.fullname.lastname}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Joined {user.joinedDate}
              </p>
              <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                {user.preferredLanguages?.map((lang) => (
                  <span
                    key={lang}
                    className="px-2 py-1 bg-gray-800/70 rounded-full text-xs border border-gray-700"
                  >
                    {lang}
                  </span>
                )) || []}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full md:w-auto">
              <div className="bg-gray-800/70 rounded-lg p-3 text-center border border-gray-700">
                <div className="text-xl font-bold text-blue-400">
                  {stats.totalBattles}
                </div>
                <div className="text-xs text-gray-400">Battles</div>
              </div>
              <div className="bg-gray-800/70 rounded-lg p-3 text-center border border-gray-700">
                <div className="text-xl font-bold text-green-400">
                  {stats.wins}
                </div>
                <div className="text-xs text-gray-400">Wins</div>
              </div>
              <div className="bg-gray-800/70 rounded-lg p-3 text-center border border-gray-700">
                <div className="text-xl font-bold text-purple-400">
                  {stats.winRate}
                </div>
                <div className="text-xs text-gray-400">Win Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-3 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === "profile"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab("battles")}
            className={`px-4 py-3 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === "battles"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="text-gray-400">First Name</div>
                    {editMode ? (
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          name="firstname"
                          value={profileForm.firstname}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div className="md:col-span-2 font-medium">
                        {profileForm.firstname}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="text-gray-400">Last Name</div>
                    {editMode ? (
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          name="lastname"
                          value={profileForm.lastname}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div className="md:col-span-2 font-medium">
                        {profileForm.lastname}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="text-gray-400">Email</div>
                    {editMode ? (
                      <div className="md:col-span-2">
                        <input
                          type="email"
                          name="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div className="md:col-span-2 font-medium">
                        {profileForm.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

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
                              <h4 className="font-medium text-white">
                                {battle.title}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {battle.date}
                              </p>
                            </div>
                            <div
                              className={`font-bold text-lg ${getResultColor(
                                battle.result
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
                              <span className="text-gray-400 block text-xs">
                                Opponent
                              </span>
                              <span>{battle.opponent}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 block text-xs">
                                Mode
                              </span>
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
                              <span className="text-gray-400 block text-xs">
                                Language
                              </span>
                              <span>{battle.language}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 block text-xs">
                                Difficulty
                              </span>
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-xs ${getDifficultyColor(
                                  battle.difficulty
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
                      <h3 className="text-lg font-medium text-gray-300">
                        No battles yet
                      </h3>
                      <p className="mt-2 text-gray-400">
                        Join a battle to start building your history
                      </p>
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

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-6">Account Settings</h3>
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center">
                      <Key className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <h4 className="font-medium">Change Password</h4>
                        <p className="text-sm text-gray-400">
                          Update your password regularly for security
                        </p>
                      </div>
                    </div>
                    <input
                      type="password"
                      name="currentPassword"
                      placeholder="Current Password"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none"
                    />
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="New Password"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none"
                    />
                    <button
                      onClick={handleChangePassword}
                      className="px-4 py-2 bg-green-600/80 hover:bg-green-700 rounded-lg transition-all duration-300 text-sm font-medium"
                    >
                      Update Password
                    </button>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                      <div>
                        <h4 className="font-medium">Delete Account</h4>
                        <p className="text-sm text-gray-400">
                          Permanently delete your account and all data
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      className="mt-4 px-4 py-2 bg-red-600/80 hover:bg-red-700 rounded-lg transition-all duration-300 text-sm font-medium"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
