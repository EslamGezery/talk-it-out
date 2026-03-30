import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

interface TalkButtonProps {
  isActive: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const TalkButton = ({ isActive, isDisabled, onClick }: TalkButtonProps) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Ripple rings when active */}
      {isActive && (
        <>
          <span className="absolute w-40 h-40 rounded-full border-2 border-talk-active/40 animate-ripple" />
          <span className="absolute w-40 h-40 rounded-full border-2 border-talk-active/30 animate-ripple" style={{ animationDelay: "0.5s" }} />
          <span className="absolute w-40 h-40 rounded-full border-2 border-talk-active/20 animate-ripple" style={{ animationDelay: "1s" }} />
        </>
      )}

      {/* Glow ring */}
      <div
        className={`absolute w-44 h-44 rounded-full transition-all duration-700 ${
          isActive
            ? "bg-talk-active/10 shadow-[0_0_60px_hsl(var(--talk-active)/0.3)]"
            : "bg-talk-glow/5 animate-pulse-glow"
        }`}
      />

      {/* Main button */}
      <motion.button
        onClick={onClick}
        disabled={isDisabled}
        whileTap={{ scale: 0.92 }}
        className={`relative z-10 w-36 h-36 rounded-full flex items-center justify-center transition-all duration-500 ${
          isDisabled
            ? "bg-muted cursor-not-allowed opacity-50"
            : isActive
            ? "bg-gradient-to-br from-talk-active to-emerald-600 shadow-[0_0_40px_hsl(var(--talk-active)/0.4)] animate-breathe"
            : "bg-gradient-to-br from-primary to-purple-700 shadow-[0_0_30px_hsl(var(--talk-glow)/0.3)] hover:shadow-[0_0_50px_hsl(var(--talk-glow)/0.5)]"
        }`}
      >
        {isActive ? (
          <div className="flex items-end gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 bg-primary-foreground rounded-full"
                animate={{
                  height: [8, 28, 8],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        ) : (
          <Mic className="w-14 h-14 text-primary-foreground" />
        )}
      </motion.button>

      {/* Label */}
      <span className="absolute -bottom-10 text-sm font-medium text-muted-foreground tracking-wider uppercase">
        {isDisabled ? "Watch ad first" : isActive ? "Listening..." : "Tap to talk"}
      </span>
    </div>
  );
};

export default TalkButton;
