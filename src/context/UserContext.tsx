import { createContext, useContext, useState } from 'react';

type UserContextType = {
  username: string | null;
  score: number;
  setUser: (username: string, score: number) => void;
  updateScore: (correct: boolean) => void;
  challengeDetails: { username: string; score: number } | null;
  setChallengeDetails: (details: { username: string; score: number }) => void;
};

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [challengeDetails, setChallengeDetails] = useState<{
    username: string;
    score: number;
  } | null>(null);

  const setUser = (newUsername: string, newScore: number) => {
    setUsername(newUsername);
    setScore(newScore);
  };

  const updateScore = (correct: boolean) => {
    setScore(prev => (correct ? prev + 1 : Math.max(prev - 1, 0)));
  };

  return (
    <UserContext.Provider value={{ username, score, setUser, updateScore, challengeDetails, setChallengeDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
