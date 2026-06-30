import { useState } from "react";
import { useSelector } from "react-redux";
import { IconButton, Snackbar } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";

export default function ShareButton() {
  const playlistId = useSelector((state) => state.player.playlistId);
  const [toastOpen, setToastOpen] = useState(false);

  // the share link is the current page URL with the playlist id in the query
  // string — opening it auto-loads this playlist for whoever receives it
  const shareUrl = playlistId
    ? `${window.location.origin}${window.location.pathname}?list=${playlistId}`
    : null;

  const handleShare = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // clipboard API can be blocked (http, permissions) — fall back to the
      // legacy execCommand path so the feature still works on plain http
      const tmp = document.createElement("textarea");
      tmp.value = shareUrl;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand("copy");
      document.body.removeChild(tmp);
    }
    setToastOpen(true);
  };

  return (
    <div>
      <IconButton
        onClick={handleShare}
        disabled={!playlistId}
        title={playlistId ? "Copy share link" : "Load a playlist first"}
      >
        <ShareIcon />
      </IconButton>
      <Snackbar
        open={toastOpen}
        autoHideDuration={60000}
        onClose={() => setToastOpen(false)}
        message="Share link copied to clipboard"
      />
    </div>
  );
}
