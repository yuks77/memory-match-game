interface CardProps {
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

const Card = ({ emoji, isFlipped, isMatched, onClick }: CardProps) => {
  return (
    <div className="w-full aspect-[4/5]">
      <button 
        onClick={onClick}
        className="w-full h-full relative preserve-3d cursor-pointer focus:outline-none"
        style={{ perspective: "1000px" }}
        disabled={isMatched}
      >
        <div 
          className={`
            absolute inset-0 transition-transform duration-500
            ${isFlipped || isMatched ? 'rotate-y-180' : ''}
          `}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Back of card */}
          <div 
            className="absolute inset-0 backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="w-full h-full bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center">
              <div className="w-8 h-8 bg-[#F5E6E6] rounded-full" />
            </div>
          </div>

          {/* Front of card */}
          <div 
            className="absolute inset-0 backface-hidden rotate-y-180"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="w-full h-full bg-[#FFF5F5] rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center">
              <span className="text-5xl select-none">{emoji}</span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default Card; 