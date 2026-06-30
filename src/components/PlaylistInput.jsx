import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPlaylist } from "../store/playerSlice";
import { Grid, TextField, Button } from "@mui/material";

export default function PlaylistInput() {
  const [url, setUrl] = useState("");
  const dispatch = useDispatch();
  const [loadPlaylistPressed, setLoadPlaylistPressed] = useState(false);

  // a shared link (?list=<playlistId>) pre-fills the input and auto-loads
  // the playlist once on mount, so the recipient lands straight in the player
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get("list");
    if (sharedId) {
      setUrl(`https://www.youtube.com/playlist?list=${sharedId}`);
      loadPlaylistById(sharedId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadPlaylist = async () => {
    const playlistId = extractPlaylistId(url);
    if (!playlistId) {
      alert("Invalid playlist URL");
      return;
    }
    loadPlaylistById(playlistId);
  };

  const loadPlaylistById = async (playlistId) => {

    console.log("Loading playlist ID:", playlistId);
    const apiKey = process.env.REACT_APP_YT_API_KEY;

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`
      );
      const data = await res.json();

      const videos = data.items.map((item) => ({
        url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
        videoId: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        channel:
          item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle,
      }));

      dispatch(setPlaylist({ videos, playlistId }));
    } catch (err) {
      console.error("Failed to load playlist:", err);
      alert("Could not load playlist. Check your API key and URL.");
    }
  };

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center" style={{ marginBottom: "1rem" }}>
      <TextField
        variant="outlined"
        color="#170d27"
        placeholder="Paste YouTube playlist URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        size="medium"
        // responsive: 100% on xs, ~60% on sm+
        sx={{
          width: { xs: "100%", sm: "60%" },
          mr: "0.5rem",
          // adjust inner padding to resemble plain input
          "& .MuiOutlinedInput-input": {
            padding: "10px 12px",
          },
        }}
        inputProps={{
          // keep native accessibility and behavior
          "aria-label": "YouTube playlist URL",
        }}
        onKeyDown={(e) => e.key === 'Enter' && handleLoadPlaylist() && setLoadPlaylistPressed(true)}
      />
      <Button 
        variant="outlined"
        color="#170d27"
        onClick={() => {
          handleLoadPlaylist();
          setLoadPlaylistPressed(true);
        }}>
          Load Playlist
      </Button>
    </Grid>
  );
}

//extract playlist ID from URL
function extractPlaylistId(url) {
  const regex = /[?&]list=([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
