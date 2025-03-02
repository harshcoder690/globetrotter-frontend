import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { Game } from './components/Game/Game';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/challenge/:challengeId" element={<GameWrapper />} />
          <Route path="/" element={<Game />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

const GameWrapper = () => {
  const { challengeId } = useParams();
  return <Game challengeId={challengeId} />;
};

export default App;