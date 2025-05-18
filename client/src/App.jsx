import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage.jsx";
import SignInPage from "./SignInPage.jsx";
import SignUpPage from "./SignUpPage.jsx"; 
import BattleArena from "./BattleArena.jsx";
import "./index.css";
import CreateRoom from "./CreateRoom.jsx";
import UserProtectedWrapper from "./UserProtectedWrapper.jsx";
import JoinMatch from "./JoinMatch.jsx";
import ProfilePage from "./ProfilePage.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/create-room" element={<UserProtectedWrapper><CreateRoom /></UserProtectedWrapper>} />
          <Route path="/join-room" element={<UserProtectedWrapper><JoinMatch /></UserProtectedWrapper>} />
          <Route path="/rooms/:roomcode" element={<UserProtectedWrapper><BattleArena /></UserProtectedWrapper>} />
          <Route path="/profile" element={<UserProtectedWrapper><ProfilePage /></UserProtectedWrapper>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
