"use client";

import useSound from "use-sound";

const SOUND_VOLUME = 0.25;

/**
 * Wrapper sobre use-sound con archivos locales en /public/sounds/.
 * Si los archivos no existen, use-sound falla silenciosamente.
 */
export function useSounds() {
  const [playTap] = useSound("/sounds/tap.mp3", { volume: SOUND_VOLUME });
  const [playSuccess] = useSound("/sounds/success.mp3", { volume: SOUND_VOLUME });
  const [playError] = useSound("/sounds/error.mp3", { volume: SOUND_VOLUME });
  const [playSwipe] = useSound("/sounds/swipe.mp3", { volume: SOUND_VOLUME });
  return { playTap, playSuccess, playError, playSwipe };
}
