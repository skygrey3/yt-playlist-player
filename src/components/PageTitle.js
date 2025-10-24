import { Grid, Typography, IconButton } from "@mui/material";
import { GitHub } from "@mui/icons-material";

export default function PageTitle() {
    return (
        <Grid direction="column" container spacing={2} alignItems="center" justifyContent="center" style={{ marginBottom: "2rem", marginTop: "1rem"}}>  
            
            <Grid item>
                <IconButton
                    component="a"
                    href="https://github.com/skygrey3/yt-playlist-player"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                    color: "#bdbac9",
                    transition: "color 0.2s ease",
                    "&:hover": { color: "#000" }, // black or darker shade on hover
                    }}
                >
                    <GitHub fontSize="large" />
                </IconButton>
            </Grid>
            <Grid item>
                <Typography variant='h4' fontFamily="monospace">Youtube Playlist player</Typography>
            </Grid>
        </Grid>
    );
}
