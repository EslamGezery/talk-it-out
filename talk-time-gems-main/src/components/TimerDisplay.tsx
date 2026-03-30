import { motion } from "framer-motion";

interface TimerDisplayProps {
  time: string;
  isRunning: boolean;
  isExpired: boolean;
}

const TimerDisplay = ({ time, isRunning, isExpired }: TimerDisplayProps) => {
  return (
    <motion.div
      className="flex flex-col items-center"
      animate={isExpired ? { opacity: [1, 0.3, 1] } : {}}
      transition={isExpired ? { duration: 1, repeat: Infinity } : {}}
    >
      <span
        className={`font-digital text-6xl tracking-[0.2em] tabular-nums transition-colors duration-500 ${
          isExpired
            ? "text-destructive"
            : isRunning
            ? "text-talk-active"
            : "text-foreground/80"
        }`}
      >
        {time}
      </span>
      <span className="text-xs text-muted-foreground mt-2 tracking-widest uppercase">
        {isExpired ? "Time's up" : isRunning ? "Remaining" : "Session Timer"}
      </span>
    </motion.div>
  );
};

export default TimerDisplay;
