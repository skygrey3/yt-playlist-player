import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import { PlayArrow, Pause, SkipNext, SkipPrevious, Shuffle, Repeat } from "@mui/icons-material";
import { prevVideo, togglePlay, nextVideo, toggleShuffle, toggleRepeat } from "../store/playerSlice";

export default function Controls() {
  const dispatch = useDispatch();
  const { playing, shuffle, repeat } = useSelector((state) => state.player);
  /*
  const handleVideoSelect = () => {
    dispatch(setUrl("https://www.youtube.com/embed/cfuldQW0j6k")); // Example URL
  };
  */
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
      <IconButton onClick={() => dispatch(prevVideo())} sx={{ color: "#bdbac9"}}>
        <SkipPrevious />
      </IconButton>

      <IconButton onClick={() => dispatch(togglePlay())} sx={{ color: "#bdbac9"}}>
        {playing ? <Pause /> : <PlayArrow />}
      </IconButton>

      <IconButton onClick={() => dispatch(nextVideo())} sx={{ color: "#bdbac9"}}>
        <SkipNext />
      </IconButton>

      <IconButton onClick={() => dispatch(toggleShuffle())} sx={{ color: shuffle ? "#90caf9" : "#bdbac9", }}>
        <Shuffle />
      </IconButton>

    </div>
  );
}
/*  TODO: add loop button after doing the functionality
      <IconButton onClick={() => dispatch(toggleRepeat())} color={repeat ? "primary" : "default"}>
        <Repeat />
      </IconButton>
*/