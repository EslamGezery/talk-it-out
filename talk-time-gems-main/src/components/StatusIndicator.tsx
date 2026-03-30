import { motion, AnimatePresence } from "framer-motion";

export type AppStatus = "idle" | "ad" | "listening" | "thinking" | "speaking" | "expired";

interface StatusIndicatorProps {
  status: AppStatus;
}

const statusConfig: Record<AppStatus, { label: string; color: string }> = {
  idle: { label: "Watch ad to start", color: "text-muted-foreground" },
  ad: { label: "Playing ad...", color: "text-yellow-400" },
  listening: { label: "Listening...", color: "text-talk-active" },
  thinking: { label: "Thinking...", color: "text-primary" },
  speaking: { label: "Speaking...", color: "text-blue-400" },
  expired: { label: "Session ended", color: "text-destructive" },
};

const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  const config = statusConfig[status];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        className={`flex items-center gap-2 ${config.color}`}
      >
        {(status === "listening" || status === "thinking" || status === "speaking") && (
          <motion.span
            className="inline-block w-2 h-2 rounded-full bg-current"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
        <span className="text-sm font-medium tracking-wide">{config.label}</span>
      </motion.div>
    </AnimatePresence>
  );
};

export default StatusIndicator;
