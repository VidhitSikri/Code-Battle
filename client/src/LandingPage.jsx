"use client";

import { useState, useEffect, useContext } from "react";
import {
  Code2,
  Timer,
  Layers,
  Languages,
  History,
  Github,
  Linkedin,
  MessageSquare,
  Database,
  Server,
  Globe,
  Cpu,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "./context/UserContext";

// Simple Button component to replace the shadcn Button
const Button = ({ children, className, variant }) => {
  const baseClasses =
    "inline-flex h-10 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

  const variantClasses =
    variant === "outline"
      ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
      : "bg-primary text-primary-foreground shadow hover:bg-primary/90";

  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </button>
  );
};

// Simple animation component to replace framer-motion
const FadeIn = ({ children, delay = 0, className }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default function LandingPage() {
  const { user, setUser } = useContext(UserDataContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const token = localStorage.getItem("token");

  // On initial render, if token exists, fetch user profile
  useEffect(() => {
    if (token) {
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((err) => {
          console.error("Fetching profile failed:", err);
        });
    }
  }, [token, setUser]);

  // Existing effect for fade-in visibility
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
        withCredentials: true,
      });
      localStorage.removeItem("token");
      setUser({
        email: "",
        fullname: {
          firstname: "",
          lastname: "",
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="position-sticky top-0 container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Code2 className="h-8 w-8 text-purple-500" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Code Battle
          </h1>
        </div>
        <nav className="hidden md:flex gap-8 font-bold text-lg">
          <a
            href="#features"
            className="text-gray-300 hover:text-purple-400 transition-colors"
          >
            Features
          </a>
          <a
            href="#tech"
            className="text-gray-300 hover:text-purple-400 transition-colors"
          >
            Tech Stack
          </a>
          <a
            href="#testimonials"
            className="text-gray-300 hover:text-purple-400 transition-colors"
          >
            Testimonials
          </a>
          <a
            href="#leaderboard"
            className="text-gray-300 hover:text-purple-400 transition-colors"
          >
            Leaderboard
          </a>
        </nav>
        <div className="flex gap-3 relative">
          {token ? (
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() =>
                setTimeout(() => setDropdownOpen(false), 1000)
              }
            >
              <div className="w-10 h-10 rounded-full bg-black border border-white flex items-center justify-center cursor-pointer">
                {user.fullname.firstname
                  ? user.fullname.firstname.charAt(0).toUpperCase()
                  : "U"}
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-10">
                  <div className="ml-2 font-bold">
                    {user.fullname.firstname + " " + user.fullname.lastname ||
                      "User"}
                  </div>
                  <Link
                    to={"/profile"}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to={"/login"}
                className="pb-2 cursor-pointer pt-2 font-bold pl-4 pr-4 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none"
              >
                Sign In
              </Link>
              <Link
                to={"/register"}
                className="cursor-pointer pt-2 font-bold pl-4 pr-4 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <FadeIn>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Real-time <span className="text-blue-500">Coding</span> Battles
                for <span className="text-purple-500">Developers</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Challenge your friends or random opponents to head-to-head
                coding competitions. Solve DSA problems faster than your
                opponent and climb the leaderboard.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6">
                  Create Room
                </Button>
                <Button className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-6">
                  Join Match
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer border-blue-500 text-blue-500 hover:bg-blue-950 text-lg px-8 py-6"
                >
                  Try a Demo
                </Button>
              </div>
            </FadeIn>
          </div>
          <FadeIn delay={0.3} className="relative h-[400px] w-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* VS Battle Animation */}
                <div className="absolute left-0 top-0 w-5/12 h-full bg-blue-900/20 rounded-lg border border-blue-500/30 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto bg-blue-500/20 rounded-full mb-4 flex items-center justify-center">
                      <Code2 className="h-12 w-12 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-400">
                      Player 1
                    </h3>
                    <p className="text-blue-300 text-sm">Python</p>
                  </div>
                </div>

                <div className="absolute z-10 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">VS</span>
                </div>

                <div className="absolute right-0 top-0 w-5/12 h-full bg-purple-900/20 rounded-lg border border-purple-500/30 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto bg-purple-500/20 rounded-full mb-4 flex items-center justify-center">
                      <Code2 className="h-12 w-12 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-purple-400">
                      Player 2
                    </h3>
                    <p className="text-purple-300 text-sm">JavaScript</p>
                  </div>
                </div>

                {/* Code snippets */}
                <div className="absolute left-4 bottom-4 w-4/12 h-1/3 bg-black/60 border border-blue-500/50 rounded p-2 overflow-hidden">
                  <pre className="text-xs text-blue-300">
                    <code>{`def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)`}</code>
                  </pre>
                </div>

                <div className="absolute right-4 bottom-4 w-4/12 h-1/3 bg-black/60 border border-purple-500/50 rounded p-2 overflow-hidden">
                  <pre className="text-xs text-purple-300">
                    <code>{`function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Battle Features
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FadeIn className="bg-gray-800 p-6 rounded-lg border border-blue-500/20 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Code2 className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-400">
                Real-Time Code Execution
              </h3>
              <p className="text-gray-300">
                Execute your code in real-time using Judge0 API with support for
                over 40+ programming languages.
              </p>
            </FadeIn>

            <FadeIn
              delay={0.1}
              className="bg-gray-800 p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all"
            >
              <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <Timer className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-purple-400">
                Live Timer
              </h3>
              <p className="text-gray-300">
                Race against the clock with a live timer that adds pressure and
                excitement to your coding battles.
              </p>
            </FadeIn>

            <FadeIn
              delay={0.2}
              className="bg-gray-800 p-6 rounded-lg border border-blue-500/20 hover:border-blue-500/50 transition-all"
            >
              <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Layers className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-400">
                Problem Difficulty Levels
              </h3>
              <p className="text-gray-300">
                Choose from easy, medium, or hard problems to match your skill
                level and challenge yourself.
              </p>
            </FadeIn>

            <FadeIn
              delay={0.3}
              className="bg-gray-800 p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all"
            >
              <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <Languages className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-purple-400">
                Multiple Language Support
              </h3>
              <p className="text-gray-300">
                Code in your preferred language with support for Python,
                JavaScript, Java, C++, and many more.
              </p>
            </FadeIn>

            <FadeIn
              delay={0.4}
              className="bg-gray-800 p-6 rounded-lg border border-blue-500/20 hover:border-blue-500/50 transition-all"
            >
              <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <History className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-400">
                Match History
              </h3>
              <p className="text-gray-300">
                Review your past battles, learn from your mistakes, and track
                your progress over time.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Powered By Modern Tech Stack
            </span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <FadeIn className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-900/20 rounded-full flex items-center justify-center mb-4 border border-green-500/30">
                <Database className="h-10 w-10 text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-center">MongoDB</h3>
            </FadeIn>

            <FadeIn delay={0.1} className="flex flex-col items-center">
              <div className="cursor-pointer w-20 h-20 bg-gray-700/20 rounded-full flex items-center justify-center mb-4 border border-gray-500/30">
                <Server className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-center">Express</h3>
            </FadeIn>

            <FadeIn delay={0.2} className="flex flex-col items-center">
              <div className="cursor-pointer w-20 h-20 bg-blue-900/20 rounded-full flex items-center justify-center mb-4 border border-blue-500/30">
                <Globe className="h-10 w-10 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-center">React</h3>
            </FadeIn>

            <FadeIn delay={0.3} className="flex flex-col items-center">
              <div className="cursor-pointer w-20 h-20 bg-green-900/20 rounded-full flex items-center justify-center mb-4 border border-green-500/30">
                <Server className="h-10 w-10 text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-center">Node.js</h3>
            </FadeIn>

            <FadeIn delay={0.4} className="flex flex-col items-center">
              <div className="cursor-pointer w-20 h-20 bg-purple-900/20 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                <Cpu className="h-10 w-10 text-purple-400" />
              </div>
              <h3 className="text-lg font-medium text-center">Judge0 API</h3>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              What Coders Say
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn className="bg-gray-800 p-6 rounded-lg border border-blue-500/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-900/30 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold">Alex Johnson</h4>
                  <p className="text-sm text-gray-400">
                    Senior Developer @ Tech Co
                  </p>
                </div>
              </div>
              <p className="text-gray-300">
                "Code Battle has completely changed how I practice DSA problems.
                The competitive aspect makes it so much more engaging than
                solving problems alone."
              </p>
            </FadeIn>

            <FadeIn
              delay={0.1}
              className="bg-gray-800 p-6 rounded-lg border border-purple-500/20"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-900/30 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold">Samantha Lee</h4>
                  <p className="text-sm text-gray-400">
                    CS Student @ University
                  </p>
                </div>
              </div>
              <p className="text-gray-300">
                "I use Code Battle to prepare for technical interviews. The
                timer and competitive element simulates the pressure of real
                interviews perfectly."
              </p>
            </FadeIn>

            <FadeIn
              delay={0.2}
              className="bg-gray-800 p-6 rounded-lg border border-blue-500/20"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-900/30 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold">Michael Chen</h4>
                  <p className="text-sm text-gray-400">Full Stack Developer</p>
                </div>
              </div>
              <p className="text-gray-300">
                "My team uses Code Battle for our weekly coding challenges. It's
                become a fun way to improve our skills while building team
                camaraderie."
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section id="leaderboard" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Global Leaderboard
            </span>
          </h2>

          <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg overflow-hidden border border-purple-500/20">
            <div className="grid grid-cols-12 bg-gray-900 p-4 border-b border-gray-700">
              <div className="col-span-1 font-bold text-gray-400">#</div>
              <div className="col-span-5 font-bold text-gray-400">Coder</div>
              <div className="col-span-2 font-bold text-gray-400">Wins</div>
              <div className="col-span-2 font-bold text-gray-400">Battles</div>
              <div className="col-span-2 font-bold text-gray-400">Win Rate</div>
            </div>

            {[
              {
                rank: 1,
                name: "CodeNinja",
                wins: 142,
                battles: 167,
                rate: "85%",
              },
              {
                rank: 2,
                name: "AlgoMaster",
                wins: 136,
                battles: 164,
                rate: "83%",
              },
              {
                rank: 3,
                name: "ByteWarrior",
                wins: 129,
                battles: 158,
                rate: "82%",
              },
              {
                rank: 4,
                name: "SyntaxSlayer",
                wins: 118,
                battles: 150,
                rate: "79%",
              },
              {
                rank: 5,
                name: "DevDestroyer",
                wins: 112,
                battles: 145,
                rate: "77%",
              },
            ].map((player, index) => (
              <FadeIn
                key={index}
                delay={index * 0.1}
                className={`grid grid-cols-12 p-4 ${
                  index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"
                } hover:bg-gray-700 transition-colors`}
              >
                <div className="col-span-1 font-bold text-gray-300">
                  {player.rank}
                </div>
                <div className="col-span-5 font-medium text-white flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-3 flex items-center justify-center text-xs">
                    {player.name.charAt(0)}
                  </div>
                  {player.name}
                </div>
                <div className="col-span-2 text-blue-400">{player.wins}</div>
                <div className="col-span-2 text-gray-300">{player.battles}</div>
                <div className="col-span-2 text-green-400">{player.rate}</div>
              </FadeIn>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button className="cursor-pointer p-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              View Full Leaderboard
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/40 to-purple-900/40">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Test Your Coding Skills?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are improving their coding skills
            through competitive battles.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6">
              Create Room
            </Button>
            <Button className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-6">
              Join Match
            </Button>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-950 text-lg px-8 py-6"
            >
              Try a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Code2 className="h-8 w-8 text-purple-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Code Battle
              </h1>
            </div>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Github className="h-5 w-5 text-gray-300" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Linkedin className="h-5 w-5 text-gray-300" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <MessageSquare className="h-5 w-5 text-gray-300" />
              </a>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">Platform</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Leaderboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Problem Library
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      API
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Tutorials
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Press
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Cookie Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
              <p>
                © {new Date().getFullYear()} Code Battle. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
