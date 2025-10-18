import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setPlaying,
  setPlayerReady,
  nextVideo,
} from "../store/playerSlice";

export default function Player() {
  const dispatch = useDispatch();
  const { playlist, currentIndex, currentUrl, playing, repeat, playerReady } = useSelector((state) => state.player);
  const playerRef = useRef(null);
  const apiLoadedRef = useRef(false);

  // player initialization (runs everytime the playlist changes)
  useEffect(() => {
    
    //console.log("readyToLoad: ", readyToLoad());
    console.log("playlist: ", playlist);
    if (!playlist[0]) return;

    // loading the API script only once
    if (!apiLoadedRef.current) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      apiLoadedRef.current = true;
    }
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("ytplayer", {
        height: "480",
        width: "854",
        videoId: extractVideoId(currentUrl),
        playerVars: {
          autoplay: 1, // playing ? 1 : 0
          controls: 1,
          modestbranding: 0,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onReady: () => dispatch(setPlayerReady(true)),
          onStateChange: (e) => {
            // 0 ended, 1 playing, 2 paused
            if (e.data === window.YT.PlayerState.PLAYING) {
              dispatch(setPlaying(true));
            }
            if (e.data === window.YT.PlayerState.PAUSED) {  // its a real pause if the video played before
              const currentTime = playerRef.current?.getCurrentTime?.() ?? 0;
              if (currentTime > 0.5) {
                dispatch(setPlaying(false));
              }
            }

            //if (e.data === 1) dispatch(setPlaying(true));
            //if (e.data === 2) dispatch(setPlaying(false));
            if (e.data === 0) {
              if (repeat) playerRef.current.loadVideoById(extractVideoId(playlist[currentIndex - 1].url));
              else dispatch(nextVideo());
            }
          },
        },
      });
    };
  }, [playlist]);

  // loads video when URL changes
  useEffect(() => {
    if (playerRef.current && currentUrl) {  
      playerRef.current.loadVideoById(extractVideoId(currentUrl));
    }
  }, [currentUrl]);

  // play / pause effect
  useEffect(() => {
    if (playerRef.current && playerReady) {
      if (playing) {
        playerRef.current.playVideo();
      }
      else {
        playerRef.current.pauseVideo();
      }
    }
  }, [playing, playerReady]);
  
  if (!currentUrl) {
    return <div style={{ textAlign: "center", padding: "1rem" }}>No song selected</div>;
  }
  
  // first div had style={{ margin: "29px auto 0px auto", maxWidth: "800px" }}
  return (
    <div style={{ margin: "8px auto 0px auto"}}>
      <div id="ytplayer"></div>
    </div>
  );
}


function extractVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|embed)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url?.match(regex);
  return match ? match[1] : null;
}