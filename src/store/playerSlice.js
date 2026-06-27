// playerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  playlist: [],        // array of {url, videoId, title, channel}
  currentIndex: 0,
  currentUrl: null,
  playing: false,
  repeat: false,
  shuffle: false,
  // Spotify-style shuffle queue: a pre-shuffled order of playlist indices with
  // the current track pinned first. Walking the queue guarantees every track
  // plays once before any repeats (a fresh shuffle starts only after the
  // queue is exhausted, and only when repeat is on).
  shuffleQueue: [],
  shufflePosition: -1,
  playerReady: false,
};

// Fisher-Yates shuffle of all playlist indices, with `pinned` moved to the
// front so the track that triggered the shuffle plays first.
function buildShuffleQueue(length, pinned) {
  const indices = Array.from({ length }, (_, i) => i).filter(i => i !== pinned);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return pinned >= 0 && pinned < length ? [pinned, ...indices] : indices;
}

// keep the queue in sync whenever shuffle is (re)enabled or the current track
// is picked manually — the picked track becomes the head of a fresh queue
function enterShuffle(state, pinnedIndex) {
  state.shuffleQueue = buildShuffleQueue(state.playlist.length, pinnedIndex);
  state.shufflePosition = 0;
}

function exitShuffle(state) {
  state.shuffleQueue = [];
  state.shufflePosition = -1;
}

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlaylist: (state, action) => {
      state.playlist = action.payload;
      state.currentIndex = 0;
      state.currentUrl = action.payload[0]?.url || null;
      state.playing = true;
      if (state.shuffle) enterShuffle(state, 0);
    },
    nextVideo: (state) => {
      if (state.shuffle) {
        // rebuild lazily (e.g. state restored from an older persisted session)
        if (state.shuffleQueue.length !== state.playlist.length) {
          enterShuffle(state, state.currentIndex);
        }
        if (state.shufflePosition < state.shuffleQueue.length - 1) {
          state.shufflePosition += 1;
          state.currentIndex = state.shuffleQueue[state.shufflePosition];
        } else if (state.repeat) {
          // queue exhausted: start a brand-new random order (no repeats within
          // the new cycle either), starting from a random track
          state.shuffleQueue = buildShuffleQueue(state.playlist.length, -1);
          state.shufflePosition = 0;
          state.currentIndex = state.shuffleQueue[0];
        } else {
          state.playing = false;
          return;
        }
      } else {
        if (state.currentIndex < state.playlist.length - 1) {
          state.currentIndex += 1;
        } else if (state.repeat) {
          state.currentIndex = 0;
        } else {
          state.playing = false;
          return;
        }
      }
      state.currentUrl = state.playlist[state.currentIndex]?.url || null;
    },
    prevVideo: (state) => {
      if (state.shuffle) {
        // step back through the already-played part of the queue
        if (state.shufflePosition > 0) {
          state.shufflePosition -= 1;
          state.currentIndex = state.shuffleQueue[state.shufflePosition];
        }
      } else {
        if (state.currentIndex > 0) {
          state.currentIndex -= 1;
        } else if (state.repeat) {
          state.currentIndex = state.playlist.length - 1;
        }
      }
      state.currentUrl = state.playlist[state.currentIndex]?.url || null;
    },
    setUrl: (state, action) => {
      state.currentIndex = action.payload;
      state.currentUrl = state.playlist[state.currentIndex]?.url || null;
      state.playing = true;
      if (state.shuffle) enterShuffle(state, action.payload);
    },
    togglePlay: (state) => {
      state.playing = !state.playing;
    },
    setPlaying: (state, action) => {
      state.playing = action.payload;
    },
    toggleRepeat: (state) => {
      state.repeat = !state.repeat;
    },
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
      if (state.shuffle) enterShuffle(state, state.currentIndex);
      else exitShuffle(state);
    },
    setPlayerReady: (state, action) => {
      state.playerReady = action.payload;
    },
  },
});

export const {
  setPlaylist,
  nextVideo,
  prevVideo,
  setUrl,
  togglePlay,
  setPlaying,
  toggleRepeat,
  toggleShuffle,
  setPlayerReady,
} = playerSlice.actions;

export default playerSlice.reducer;
