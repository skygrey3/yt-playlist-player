import { Card, CardContent, CardHeader, Divider, Box, Grid } from "@mui/material";
import Player from "../components/Player";
import Controls from "../components/Controls";
import AnimatedList from '../components/AnimatedList';
const items = []; 

export default function PlayerContainer() {
    return (
        <Card
            elevation={6}
            sx={{
            maxWidth: 1476,
            minHeight: 660,
            mx: "auto",
            mt: 4,
            borderRadius: 3,
            overflow: "hidden",
            backgroundColor: "background.paper",
            }}
        >
            <CardHeader
            sx={{
                backgroundColor: "#170d27",
                color: "primary.contrastText",
                py: 2,
                px: 3,
            }}
            />
            <Divider />
            <CardContent
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
                p: 3,
            }}
            >
            {/* IFRAME PLAYER */}
            <Box
                sx={{
                    bgcolor: "background.card", // or "background.default"
                    flex: 1.5,
                    minHeight: 480,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 2,
                }}
            >
                <Player />
            </Box>

            {/* PLAYLIST LIST */}
            <Box
                sx={{
                    bgcolor: "background.paper", // or "background.default"
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                    borderRadius: 2,
                    p: 1,
                    overflow: "clip",
                    maxHeight: { xs: 480, md: 540 },
                }}
            >
                <AnimatedList
                    items={items}
                    onItemSelect={(item, index) => console.log(item, index)}
                    showGradients={false}
                    enableArrowNavigation={true}
                    displayScrollbar={true} 
                />
            </Box>
            </CardContent>
            <Controls />
        </Card>
    );
}