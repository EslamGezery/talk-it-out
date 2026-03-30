import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import TalkButton from "@/components/TalkButton";
import TimerDisplay from "@/components/TimerDisplay";
import StatusIndicator, { AppStatus } from "@/components/StatusIndicator";
import { useTimer } from "@/hooks/useTimer";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useGemini } from "@/hooks/useGemini";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useAdMob } from "@/hooks/useAdMob";
import { toast } from "sonner";

const Index = () => {
  const [status, setStatus] = useState<AppStatus>("idle");
  const [hasWatchedAd, setHasWatchedAd] = useState(false);

  const timer = useTimer(300);
  const speech = useSpeechRecognition();
  const gemini = useGemini();
  const tts = useTextToSpeech();
  const adMob = useAdMob();

  useEffect(() => {
    if (timer.timeLeft === 0 && timer.isRunning === false && hasWatchedAd) {
      setStatus("expired");
      speech.stopListening();
      tts.stopSpeaking();
      setHasWatchedAd(false);
      setTimeout(async () => {
        toast.info("Session ended. Watch an ad to continue.");
        await adMob.showRewardedAd();
      }, 1500);
    }
  }, [timer.timeLeft]);

  useEffect(() => {
    if (speech.transcript && status === "listening") {
      handleTranscript(speech.transcript);
    }
  }, [speech.transcript]);

  useEffect(() => {
    if (tts.isSpeaking) {
      setStatus("speaking");
    } else if (status === "speaking") {
      setStatus("listening");
      speech.startListening();
    }
  }, [tts.isSpeaking]);

  const handleTranscript = async (text: string) => {
    setStatus("thinking");
    const reply = await gemini.sendToGemini(text);
    if (reply) {
      setStatus("speaking");
      await tts.speak(reply);
    } else {
      setStatus("listening");
      speech.startListening();
    }
  };

  const handleTalkPress = async () => {
    if (status === "listening") {
      speech.stopListening();
      tts.stopSpeaking();
      timer.stop();
      setStatus("expired");
      setHasWatchedAd(false);
      setTimeout(async () => {
        toast.info("Watch an ad to talk again.");
        await adMob.showRewardedAd();
      }, 1000);
      return;
    }

    if (!hasWatchedAd) {
      setStatus("ad");
      const adWatched = await adMob.showRewardedAd();
      if (adWatched) {
        setHasWatchedAd(true);
        startSession();
      } else {
        setStatus("idle");
        toast.error("Please watch the ad to start talking.");
      }
    } else {
      startSession();
    }
  };

  const startSession = () => {
    timer.reset();
    timer.start();
    setStatus("listening");
    speech.startListening();
  };

  const isButtonDisabled = status === "ad" || status === "thinking" || status === "speaking";

  return (
    <div className="relative flex flex-col min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex items-center justify-center px-6 pt-6 pb-4"
      >
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Talk it Out
        </h1>
      </motion.header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center gap-12 px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <TimerDisplay
            time={timer.formatTime()}
            isRunning={timer.isRunning}
            isExpired={timer.timeLeft === 0 && hasWatchedAd}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <TalkButton
            isActive={status === "listening"}
            isDisabled={isButtonDisabled}
            onClick={handleTalkPress}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <StatusIndicator status={status} />
        </motion.div>

        {gemini.response && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-sm text-center"
          >
            <p className="text-xs text-muted-foreground line-clamp-3">
              {gemini.response}
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Index;