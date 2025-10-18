import { Grid, Typography } from "@mui/material";

export default function PageTitle() {
    return (
        <Grid container spacing={2} alignItems="center" justifyContent="center" style={{ marginBottom: "2rem", marginTop: "1rem"}}>  
            <Grid item>
                <Typography variant='h4' fontFamily="monospace">Youtube Playlist player</Typography>
            </Grid>
        </Grid>
    );
}
