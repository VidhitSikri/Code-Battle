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
import StartBattle from "./StartBattle.jsx";
import BattleWinner from "./BattleWinner.jsx";
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
          <Route path="/start-battle/:roomcode" element={<UserProtectedWrapper><StartBattle /></UserProtectedWrapper>} />
          <Route path="/battle-winner/:roomcode" element={<UserProtectedWrapper><BattleWinner /></UserProtectedWrapper>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
