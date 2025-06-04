import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#FFF5F5] flex flex-col items-center justify-between py-12">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-6 w-full max-w-md px-4">
        {/* Title with Emojis */}
        <h1 className="text-5xl font-bold text-[#8B6E5E] flex items-center">
          <span className="text-3xl">🌸</span>
          Memory Match
          <span className="text-3xl">🍵</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[#8B6E5E] text-xl text-center">
          Match cards and test your memory
        </p>

        {/* Buttons */}
        <div className="flex flex-col w-full space-y-4 mt-8">
          <Link
            to="/start"
            className="bg-[#D4A5A5] text-white text-lg font-semibold py-4 px-8 rounded-full text-center hover:bg-[#C89595] transition-colors duration-300"
          >
            Start Game
          </Link>
          <Link
            to="/leaderboard"
            className="bg-white text-[#8B6E5E] text-lg font-semibold py-4 px-8 rounded-full text-center hover:bg-gray-50 transition-colors duration-300"
          >
            Leaderboard
          </Link>
        </div>

        {/* Footer */}
        <footer className="text-[#8B6E5E] text-sm mt-8">
          © 2025 Yuko Shimura. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Home; 