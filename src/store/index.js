import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./playerSlice";

const STORAGE_KEY = "playlist-player/state-v1";

// restore the last session (playlist + player settings) so a refresh or a
// later visit doesn't lose the loaded playlist
function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved.playlist) || saved.playlist.length === 0) return undefined;
    const currentIndex = Math.min(Math.max(saved.currentIndex ?? 0, 0), saved.playlist.length - 1);
    return {
      player: {
        playlist: saved.playlist,
        currentIndex,
        currentUrl: saved.playlist[currentIndex]?.url || null,
        shuffle: Boolean(saved.shuffle),
        repeat: Boolean(saved.repeat),
      },
    };
  } catch {
    return undefined;
  }
}

const store = configureStore({
  reducer: {
    player: playerReducer,
  },
  preloadedState: loadPersistedState(),
});

// persist the relevant state (debounced so skipping through tracks doesn't spam storage)
let saveTimer = null;
store.subscribe(() => {
  const { playlist, currentIndex, shuffle, repeat } = store.getState().player;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ playlist, currentIndex, shuffle, repeat })
      );
    } catch {
      // storage unavailable or full — persistence is best-effort
    }
  }, 250);
});

export default store;
