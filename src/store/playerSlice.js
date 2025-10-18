// playerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  playlist: [],        // array of {url, videoId, title, channel}
  currentIndex: 0,
  currentUrl: null,
  playing: false,
  repeat: false,
  shuffle: false,
  playerReady: false,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlaylist: (state, action) => {
      state.playlist = action.payload;
      state.currentIndex = 0;
      state.currentUrl = action.payload[0]?.url || null;
      state.playing = true;
    },
    nextVideo: (state) => {
      if (state.shuffle) {
        state.currentIndex = Math.floor(Math.random() * state.playlist.length);
      } else {
        if (state.currentIndex < state.playlist.length - 1) {
          state.currentIndex += 1;
        } else if (state.repeat) {
          state.currentIndex = 0;
        } else {
          state.playing = false;
        }
      }
      state.currentUrl = state.playlist[state.currentIndex]?.url || null;
    },
    prevVideo: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
      } else if (state.repeat) {
        state.currentIndex = state.playlist.length - 1;
      }
      state.currentUrl = state.playlist[state.currentIndex]?.url || null;
    },
    setUrl: (state, action) => {
      state.currentIndex = action.payload;
      state.currentUrl = state.playlist[state.currentIndex]?.url || null;
      state.playing = true;
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
