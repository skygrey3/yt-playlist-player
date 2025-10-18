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
      <IconButton onClick={() => dispatch(prevVideo())}>
        <SkipPrevious />
      </IconButton>

      <IconButton onClick={() => dispatch(togglePlay())}>
        {playing ? <Pause /> : <PlayArrow />}
      </IconButton>

      <IconButton onClick={() => dispatch(nextVideo())}>
        <SkipNext />
      </IconButton>

      <IconButton onClick={() => dispatch(toggleShuffle())} color={shuffle ? "primary" : "default"}>
        <Shuffle />
      </IconButton>

      <IconButton onClick={() => dispatch(toggleRepeat())} color={repeat ? "primary" : "default"}>
        <Repeat />
      </IconButton>
    </div>
  );
}
