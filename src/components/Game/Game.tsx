import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useUser } from '../../context/UserContext';
import styles from './Game.module.css';
import httpService from '../../services/HttpService';
import ApiConfig from '../../constants/ApiConfig.constants';
import { ChallengeModal } from '../Challenge/ChallengeModal';

interface ChallengeData {
  destinationId: string;
  clues: string[];
  options: string[];
  correctAnswer: string;
}

interface Feedback {
  correct: boolean;
  funFact: string;
  trivia: string;
}

export const Game = ({ challengeId }: { challengeId?: string }) => {
  const { username, score, updateScore, challengeDetails, setChallengeDetails, setUser } = useUser();
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeGame = async () => {
      try {
        if (challengeId) {
          const { data } = await httpService.get(`${ApiConfig.endpoints.get_challenge}${challengeId}`);
          setChallengeDetails({
            username: data.username,
            score: data.score
          });
        }
        await loadNewChallenge();
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeGame();
  }, [challengeId, username]);

  const loadNewChallenge = async () => {
    try {
      const { data } = await httpService.get<ChallengeData>(ApiConfig.endpoints.new_challenge);
      setChallenge(data);
      setFeedback(null);
    } catch (error) {
      console.error('Error loading challenge:', error);
    }
  };

  const handleGuess = async (guess: string) => {
    if (!challenge) return;
    try {
      console.log(username);
      const { data } = await httpService.post<Feedback>(ApiConfig.endpoints.validate, {
        destinationId: challenge.destinationId,
        guess,
        username
      });
      setFeedback(data);
      updateScore(data.correct);
    } catch (error) {
      console.error('Validation error:', error);
    }
  };


  if (loading) {
    return <div className={styles.loading}>Loading game...</div>;
  }

  return (
    <div className={styles.container}>
      {feedback?.correct && <Confetti recycle={false} />}

      <div className={styles.header}>
        <h1>🌍 Globetrotter Challenge</h1>
        {challengeDetails && (
          <div className={styles.challengeInfo}>
            Challenging {challengeDetails.username} (Score: {challengeDetails.score})
          </div>
        )}
        <div className={styles.score}>
          <span>✅ {score}</span>
          {!feedback && (
            <button
              onClick={() => setShowChallengeModal(true)}
              className={styles.challengeButton}
            >
              Challenge a Friend
            </button>
          )}
        </div>
      </div>

      {challenge && (
        <div className={styles.gameArea}>
          <div className={styles.clues}>
            {challenge.clues.map((clue, i) => (
              <p key={i} className={styles.clue}>{clue}</p>
            ))}
          </div>

          <div className={styles.options}>
            {challenge.options.map((option) => (
              <button
                key={option}
                onClick={() => handleGuess(option)}
                disabled={!!feedback}
                className={`${styles.option} ${feedback?.correct !== undefined &&
                  (option === challenge.correctAnswer ? styles.correct : styles.incorrect)
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {feedback && (
        <div className={`${styles.feedback} ${feedback.correct ? styles.success : styles.error}`}>
          <h3>{feedback.correct ? '🎉 Correct!' : '😢 Try Again!'}</h3>
          <p>{feedback.funFact}</p>
          <p className={styles.trivia}>Trivia: {feedback.trivia}</p>
          <button onClick={loadNewChallenge} className={styles.nextButton}>
            {challengeId ? 'Next Question' : 'Play Again'}
          </button>
        </div>
      )}

      {showChallengeModal && (
        <ChallengeModal onClose={() => setShowChallengeModal(false)} />
      )}
    </div>
  );
};
