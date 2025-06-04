import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Card from '../components/Card';

interface CardType {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameProps {
  testMode?: 'complete';
}

const LEVEL_CONFIG = {
  1: { rows: 2, cols: 3, time: 30, pairs: 3 },
  2: { rows: 3, cols: 4, time: 45, pairs: 6 },
  3: { rows: 4, cols: 5, time: 60, pairs: 10 },
};

const EMOJIS = [
  '🌸', '🍵', '🏺', '👘', '🐠', '🍱', '🍜', '🍙', '⛰️', '🏯',
  '🎌', '🦊', '🐰', '🦢', '🐦', '🦋', '🌺', '🌷', '🌈', '☁️',
  '🌙', '⭐', '🌊', '💮'
];

const Game = ({ testMode }: GameProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get state from URL parameters for restart
  const isRestart = searchParams.get('restart') === 'true';
  const currentScore = parseInt(searchParams.get('score') || '0');
  const currentLevel = parseInt(searchParams.get('level') || '1');
  const currentRound = parseInt(searchParams.get('round') || '1');

  const [cards, setCards] = useState<CardType[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(LEVEL_CONFIG[(currentLevel || 1) as 1 | 2 | 3].time);
  const [score, setScore] = useState<number>(isRestart ? currentScore : 0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [level, setLevel] = useState<number>(isRestart ? currentLevel : 1);
  const [round, setRound] = useState<number>(isRestart ? currentRound : 1);
  const [showTimeUpModal, setShowTimeUpModal] = useState<boolean>(false);
  const [showRoundCompleteModal, setShowRoundCompleteModal] = useState<boolean>(false);
  const [showGameCompleteModal, setShowGameCompleteModal] = useState<boolean>(testMode === 'complete');

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    const username = localStorage.getItem('currentPlayer');
    if (!username) {
      navigate('/start');
    }
  }, [navigate]);

  // Reset timer when level or round changes
  useEffect(() => {
    setTimeLeft(LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG].time);
  }, [level, round]);

  // Initialize cards for current level
  const initializeCards = useCallback(() => {
    const currentLevel = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG];
    const pairs = currentLevel.pairs;
    const levelEmojis = EMOJIS.slice(0, pairs);
    
    const cardPairs = [...levelEmojis, ...levelEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: true,
        isMatched: false,
      }));

    setCards(cardPairs);
    setGameStarted(false);
    setShowTimeUpModal(false);
    setShowRoundCompleteModal(false);
    setMatchedPairs(0); // Reset matched pairs when initializing new cards
    setTimeLeft(currentLevel.time); // Reset timer when cards are initialized
  }, [level]);

  // Start new round
  useEffect(() => {
    initializeCards();
    
    const previewTimer = setTimeout(() => {
      setCards(prevCards => prevCards.map(card => ({ ...card, isFlipped: false })));
      setGameStarted(true);
    }, 3000);

    return () => {
      clearTimeout(previewTimer);
      setGameStarted(false); // Ensure game is stopped when unmounting
    };
  }, [level, round, initializeCards]);

  // Game timer
  useEffect(() => {
    let timer: number;

    if (gameStarted && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setShowTimeUpModal(true);
            setGameStarted(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, [gameStarted]);

  // Handle card click
  const handleCardClick = (clickedId: number) => {
    // Don't allow clicks if game hasn't started or time's up
    if (!gameStarted || timeLeft <= 0) return;

    // Find the clicked card
    const clickedCard = cards.find(card => card.id === clickedId);
    if (!clickedCard) return;

    // Don't allow clicking matched or already flipped cards
    if (clickedCard.isMatched || clickedCard.isFlipped) return;

    // Count currently flipped unmatched cards
    const flippedCards = cards.filter(card => card.isFlipped && !card.isMatched);
    if (flippedCards.length >= 2) return;

    // Flip the clicked card
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === clickedId ? { ...card, isFlipped: true } : card
      )
    );

    // Check for matches after the card is flipped
    const updatedFlippedCards = cards
      .filter(card => (card.id === clickedId || (card.isFlipped && !card.isMatched)));

    if (updatedFlippedCards.length === 2) {
      const [firstCard, secondCard] = updatedFlippedCards;

      if (firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatchedPairs(prev => prev + 1);
          setScore(prev => prev + (level * 100));
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, isFlipped: false }
                : card
            )
          );
        }, 1000);
      }
    }
  };

  // Check for level completion
  useEffect(() => {
    const currentLevel = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG];
    if (matchedPairs === currentLevel.pairs) {
      setShowRoundCompleteModal(true);
      setGameStarted(false);
    }
  }, [matchedPairs, level]);

  const handleNextRound = () => {
    if (round < 3) {
      setRound(r => r + 1);
    } else if (level < 3) {
      setLevel(l => l + 1);
      setRound(1);
    } else {
      setShowGameCompleteModal(true);
    }
    setShowRoundCompleteModal(false);
    initializeCards();
  };

  const handleGameComplete = () => {
    const username = localStorage.getItem('currentPlayer') || 'Anonymous';
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    leaderboard.push({ name: username, score });
    leaderboard.sort((a: { score: number }, b: { score: number }) => b.score - a.score);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 5)));
    localStorage.removeItem('currentPlayer');
    navigate('/leaderboard');
  };

  // Handle restart
  const handleTryAgain = () => {
    setGameStarted(false); // Stop the current timer
    // Construct URL with current state as parameters
    const params = new URLSearchParams({
      restart: 'true',
      score: score.toString(),
      level: level.toString(),
      round: round.toString()
    });
    
    // Use navigate instead of window.location
    navigate(`/game?${params.toString()}`);
  };

  return (
    <div className="min-h-screen h-full flex flex-col items-center py-8 md:py-12">
      {/* Header */}
      <div className="w-full max-w-xl px-4">
        <div className="flex justify-between items-center text-lg md:text-2xl font-semibold text-[#8B6E5E] mb-4">
          <div>Level {level} · Round {round}</div>
          <div>Score: {score}</div>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full max-w-xl px-4 mb-2">
        <div className="h-2 bg-white rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D4A5A5] transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / LEVEL_CONFIG[level as 1 | 2 | 3].time) * 100}%` }}
          />
        </div>
      </div>

      {/* Timer */}
      <div className="text-center text-[#8B6E5E] text-xl font-medium mb-4">
        {formatTime(timeLeft)}
      </div>

      {/* Cards Grid */}
      <div className="w-full max-w-xl px-4 -mt-16 md:-mt-20">
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {cards.map(card => (
            <Card
              key={card.id}
              emoji={card.emoji}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-[#8B6E5E] text-sm text-center mt-28 md:mt-36">
        <div className="flex justify-center space-x-4 mb-4">
          <button 
            onClick={handleTryAgain}
            className="flex items-center text-[#8B6E5E] hover:text-[#D4A5A5] transition-colors"
          >
            <span className="mr-1">🔄</span> Restart
          </button>
          <Link 
            to="/"
            className="flex items-center text-[#8B6E5E] hover:text-[#D4A5A5] transition-colors"
          >
            <span className="mr-1">🏃‍♂️💨</span> Exit
          </Link>
        </div>
        <div>© 2025 Yuko Shimura. All rights reserved.</div>
      </div>

      {/* Round Complete Modal */}
      {showRoundCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
            <h2 className="text-2xl font-semibold text-[#8B6E5E] mb-2">Round Complete!</h2>
            <p className="text-[#D4A5A5] mb-6">You found all {LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG].pairs} pairs!</p>
            
            <div className="mb-8">
              <div className="text-[#8B6E5E] text-sm mb-1">Score</div>
              <div className="text-4xl font-bold text-[#8B6E5E]">{score}</div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleNextRound}
                className="w-full bg-[#D4A5A5] text-white py-3 px-6 rounded-full hover:bg-[#C89595] transition-colors"
              >
                Next Round
              </button>
              <Link
                to="/"
                className="block w-full text-[#8B6E5E] py-3 px-6 rounded-full hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Time's Up Modal */}
      {showTimeUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
            <h2 className="text-2xl font-semibold text-[#8B6E5E] mb-2">Time's Up!</h2>
            <p className="text-[#D4A5A5] mb-6">You ran out of time.</p>
            
            <div className="mb-8">
              <div className="text-[#8B6E5E] text-sm mb-1">Score</div>
              <div className="text-4xl font-bold text-[#8B6E5E]">{score}</div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleTryAgain}
                className="w-full bg-[#D4A5A5] text-white py-3 px-6 rounded-full hover:bg-[#C89595] transition-colors"
              >
                Try Again
              </button>
              <Link
                to="/"
                className="block w-full text-[#8B6E5E] py-3 px-6 rounded-full hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Game Complete Modal */}
      {showGameCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
            <h2 className="text-2xl font-semibold text-[#8B6E5E] mb-2">Congratulations! 🎉</h2>
            <p className="text-[#D4A5A5] mb-6">You've completed all levels!</p>
            
            <div className="mb-8">
              <div className="text-[#8B6E5E] text-sm mb-1">Final Score</div>
              <div className="text-4xl font-bold text-[#8B6E5E]">{score}</div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleGameComplete}
                className="w-full bg-[#D4A5A5] text-white py-3 px-6 rounded-full hover:bg-[#C89595] transition-colors"
              >
                View Leaderboard
              </button>
              <Link
                to="/"
                className="block w-full text-[#8B6E5E] py-3 px-6 rounded-full hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game; 