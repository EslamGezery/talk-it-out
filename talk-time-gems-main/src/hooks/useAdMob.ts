import { useState, useCallback } from "react";

const ADMOB_ID = import.meta.env.VITE_ADMOB_ID;

export function useAdMob() {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isShowingAd, setIsShowingAd] = useState(false);

  const showRewardedAd = useCallback(async (): Promise<boolean> => {
    try {
      const { AdMob, RewardAdPluginEvents } = await import(
        "@capacitor-community/admob"
      );

      await AdMob.initialize({ initializeForTesting: false });

      return new Promise<boolean>(async (resolve) => {
        AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
          setIsShowingAd(false);
          resolve(true);
        });

        AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
          setIsShowingAd(false);
          resolve(false);
        });

        AdMob.addListener(RewardAdPluginEvents.FailedToLoad, () => {
          setIsShowingAd(false);
          resolve(false);
        });

        try {
          await AdMob.prepareRewardVideoAd({
            adId: ADMOB_ID,
            isTesting: false,
          });
          setIsAdLoaded(true);
          setIsShowingAd(true);
          await AdMob.showRewardVideoAd();
        } catch (err) {
          console.error("AdMob error:", err);
          setIsShowingAd(false);
          resolve(false);
        }
      });
    } catch {
      console.warn("AdMob plugin not available in browser");
      return true;
    }
  }, []);

  return { isAdLoaded, isShowingAd, showRewardedAd };
}