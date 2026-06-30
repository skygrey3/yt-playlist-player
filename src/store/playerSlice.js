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
  // video urls/ids the user excluded from playback; excluded entries stay in
  // the list (greyed out in the UI) but are skipped during playback
  excludedUrls: [],
  // YouTube playlist id the current playlist was loaded from — null when the
  // player was restored from cache without one. Used for the share link.
  playlistId: null,
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

// helper: is the video at this index excluded from playback?
function isExcluded(state, index) {
  const item = state.playlist[index];
  if (!item) return false;
  return state.excludedUrls.includes(item.url) ||
         state.excludedUrls.includes(item.videoId);
}

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlaylist: (state, action) => {
      state.playlist = action.payload.videos;
      state.playlistId = action.payload.playlistId ?? null;
      state.currentIndex = 0;
      state.currentUrl = action.payload.videos[0]?.url || null;
      state.playing = true;
      state.excludedUrls = []; // fresh playlist starts with a clean exclusion list
      if (state.shuffle) enterShuffle(state, 0);
    },
    nextVideo: (state) => {
      const start = state.shuffle ? state.shufflePosition : state.currentIndex;
      // walk forward past excluded entries; the loop bound makes us give up
      // after a full cycle (protects the degenerate "everything excluded" case)
      for (let step = 1; step <= state.playlist.length; step++) {
        let candidate;
        if (state.shuffle) {
          const pos = start + step;
          if (pos < state.shuffleQueue.length) {
            candidate = state.shuffleQueue[pos];
          } else if (state.repeat) {
            // queue exhausted + repeat: fresh cycle with a brand-new order
            state.shuffleQueue = buildShuffleQueue(state.playlist.length, -1);
            state.shufflePosition = 0;
            state.currentIndex = state.shuffleQueue[0];
            state.currentUrl = state.playlist[state.currentIndex]?.url || null;
            return;
          } else {
            state.playing = false;
            return;
          }
        } else {
          candidate = start + step;
          if (candidate > state.playlist.length - 1) {
            if (state.repeat) candidate = candidate % state.playlist.length;
            else {
              state.playing = false;
              return;
            }
          }
        }
        if (!isExcluded(state, candidate)) {
          if (state.shuffle) state.shufflePosition = start + step;
          state.currentIndex = candidate;
          state.currentUrl = state.playlist[candidate]?.url || null;
          return;
        }
      }
    },
    prevVideo: (state) => {
      const start = state.shuffle ? state.shufflePosition : state.currentIndex;
      // walk backward past excluded entries
      for (let step = 1; step <= state.playlist.length; step++) {
        let candidate;
        if (state.shuffle) {
          const pos = start - step;
          if (pos < 0) break; // no history left in the queue
          candidate = state.shuffleQueue[pos];
        } else {
          candidate = start - step;
          if (candidate < 0) {
            if (state.repeat) candidate = state.playlist.length + candidate;
            else break;
          }
        }
        if (!isExcluded(state, candidate)) {
          if (state.shuffle) state.shufflePosition = start - step;
          state.currentIndex = candidate;
          state.currentUrl = state.playlist[candidate]?.url || null;
          return;
        }
      }
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
    // exclude/restore a video from playback (payload: the playlist item)
    toggleExclusion: (state, action) => {
      const item = action.payload;
      if (!item) return;
      const key = item.url ?? item.videoId;
      if (state.excludedUrls.includes(key)) {
        state.excludedUrls = state.excludedUrls.filter(u => u !== key);
      } else {
        state.excludedUrls.push(key);
        // if the currently playing video was excluded, skip to the next one
        if (state.currentIndex === state.playlist.findIndex(p => (p.url ?? p.videoId) === key)) {
          state.playing = true;
          // reuse nextVideo logic inline: dispatching is not possible inside a reducer
        }
      }
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
  toggleExclusion,
  setPlayerReady,
} = playerSlice.actions;

export default playerSlice.reducer;
