"use client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useState } from "react";
import { SocketContext } from "./context/SocketContext";
import {
  Code2,
  Clock,
  Cpu,
  Globe,
  Lock,
  Zap,
  FileCode,
  MessageSquare,
  HelpCircle,
  Hash,
  BarChart3,
  Languages,
} from "lucide-react";

const CreateBattleRoom = () => {
  const [formData, setFormData] = useState({
    battleName: "",
    description: "",
    questionsNumber: 5,
    isSameLanguage: true,
    allowedLanguages: [],
    mode: "time",
    difficulty: "medium",
    isPrivate: true,
  });

  const navigate = useNavigate();
  const { sendMessage, recieveMessage } = useContext(SocketContext);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (name === "allowedLanguages") {
      // Handle multi-select for allowedLanguages
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData({ ...formData, [name]: selectedOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Battle room data:", formData);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/battle/create`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        const data = response.data;
        console.log("Battle room created:", data);
        // Handle successful battle room creation
        const roomCode = data.battle.roomCode;
        sendMessage('battleRoom', roomCode);
        navigate(`/rooms/${roomCode}`);
      }
    } catch (error) {
      alert("battle name and description are too short")
      console.error("Battle room creation error:", error);
      // Handle battle room creation error
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 md:p-8 flex justify-center items-center">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center mb-4">
            <Code2 className="h-10 w-10 text-blue-500 mr-2" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Create Battle Room
            </h1>
          </div>
          <p className="text-gray-400 max-w-lg mx-auto">
            Configure your coding duel parameters and challenge opponents to
            test their skills
          </p>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg shadow-blue-500/10 overflow-hidden relative"
        >
          {/* Glowing corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500 rounded-tl-md"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-500 rounded-tr-md"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500 rounded-bl-md"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-500 rounded-br-md"></div>

          {/* Form Content */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Battle Room Title */}
            <div className="space-y-2">
              <label
                htmlFor="battleName"
                className="flex items-center text-sm font-medium text-gray-300"
              >
                <FileCode className="h-4 w-4 mr-2 text-blue-400" />
                Battle Room Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="battleName"
                  name="battleName"
                  value={formData.battleName}
                  onChange={handleChange}
                  placeholder="Enter a catchy title for your battle"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 placeholder-gray-500"
                  required
                />
                <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 w-0 group-focus-within:w-full transition-all duration-300"></div>
              </div>
            </div>

            {/* Battle Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="flex items-center text-sm font-medium text-gray-300"
              >
                <MessageSquare className="h-4 w-4 mr-2 text-blue-400" />
                Battle Description
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe the battle challenge"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 placeholder-gray-500 resize-none"
                ></textarea>
              </div>
            </div>

            {/* Question Count Slider */}
            <div className="space-y-2">
              <label
                htmlFor="questionsNumber"
                className="flex items-center text-sm font-medium text-gray-300"
              >
                <Hash className="h-4 w-4 mr-2 text-blue-400" />
                Number of Questions:{" "}
                <span className="ml-2 text-blue-400 font-bold">
                  {formData.questionsNumber}
                </span>
              </label>
              <div className="relative">
                <input
                  type="range"
                  id="questionsNumber"
                  name="questionsNumber"
                  min="3"
                  max="10"
                  step="1"
                  value={formData.questionsNumber}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 px-1 mt-1">
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6</span>
                  <span>7</span>
                  <span>8</span>
                  <span>9</span>
                  <span>10</span>
                </div>
              </div>
            </div>

            {/* Two Column Layout for smaller inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Same Language Toggle */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-300">
                  <Languages className="h-4 w-4 mr-2 text-blue-400" />
                  Programming Language
                </label>
                <div className="flex items-center space-x-4 bg-gray-900/30 p-3 rounded-lg border border-gray-700">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isSameLanguage"
                      checked={formData.isSameLanguage}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          isSameLanguage: !formData.isSameLanguage,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-300">
                      Same Language
                    </span>
                  </label>
                </div>
              </div>

              {/* Battle Type */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-300">
                  <Zap className="h-4 w-4 mr-2 text-blue-400" />
                  Battle Type
                </label>
                <div className="flex flex-col space-y-2 bg-gray-900/30 p-3 rounded-lg border border-gray-700">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      value="time"
                      checked={formData.mode === "time"}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-500/50 focus:ring-offset-gray-800"
                    />
                    <span className="ml-2 text-sm flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-blue-400" />
                      Time-based (First to solve)
                    </span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      value="quality"
                      checked={formData.mode === "quality"}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-500/50 focus:ring-offset-gray-800"
                    />
                    <span className="ml-2 text-sm flex items-center">
                      <Cpu className="h-4 w-4 mr-1 text-blue-400" />
                      Quality-based (Optimal code)
                    </span>
                  </label>
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-2">
                <label
                  htmlFor="allowedLanguages"
                  className="flex items-center text-sm font-medium text-gray-300"
                >
                  <Code2 className="h-4 w-4 mr-2 text-blue-400" />
                  Allowed Languages
                </label>
                <div className="relative">
                  <select
                    id="allowedLanguages"
                    name="allowedLanguages"
                    multiple
                    value={formData.allowedLanguages}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                    disabled={!formData.isSameLanguage}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
                    <option value="ruby">Ruby</option>
                    <option value="go">Go</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Hold Ctrl/Cmd to select multiple
                  </p>
                </div>
              </div>

              {/* Difficulty Level */}
              <div className="space-y-2">
                <label
                  htmlFor="difficulty"
                  className="flex items-center text-sm font-medium text-gray-300"
                >
                  <BarChart3 className="h-4 w-4 mr-2 text-blue-400" />
                  Difficulty Level
                </label>
                <div className="relative">
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 appearance-none"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Public/Private Toggle */}
            <div className="flex items-center justify-between bg-gray-900/30 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center">
                {formData.isPrivate ? (
                  <Lock className="h-5 w-5 text-purple-400 mr-3" />
                ) : (
                  <Globe className="h-5 w-5 text-blue-400 mr-3" />
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-200">
                    {formData.isPrivate ? "Private Room" : "Public Room"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {formData.isPrivate
                      ? "Only people with the link can join"
                      : "Anyone can find and join this battle"}
                  </p>
                </div>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isPrivate"
                  checked={formData.isPrivate}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Form Footer */}
          <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs text-gray-400 flex items-center">
              <HelpCircle className="h-4 w-4 mr-1" />
              <span>
                Need help? Check our{" "}
                <a href="#" className="text-blue-400 hover:underline">
                  battle guide
                </a>
              </span>
            </div>
            <button
              type="submit"
              className="cursor-pointer px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] flex items-center"
            >
              <Zap className="h-5 w-5 mr-2" />
              Create Battle Room
            </button>
          </div>
        </form>

        {/* Bottom text */}
        <p className="text-center text-gray-500 text-xs mt-6">
          By creating a battle room, you agree to our Code Battle terms and fair
          play guidelines
        </p>
      </div>
    </div>
  );
};

export default CreateBattleRoom;
