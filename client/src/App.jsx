import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage.jsx";
import SignInPage from "./SignInPage.jsx";
import SignUpPage from "./SignUpPage.jsx";

import "./index.css";
import CreateRoom from "./CreateRoom.jsx";
import UserProtectedWrapper from "./UserProtectedWrapper.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/create-room" element={<UserProtectedWrapper><CreateRoom /></UserProtectedWrapper>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
