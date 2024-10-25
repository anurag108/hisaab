import { Button, Grid2, TextField } from "@mui/material";

export default function InviteTrader() {
    return (
        <Grid2 container spacing={2} sx={{ justifyContent: 'center' }}>
            <Grid2 size={4.5}>
                <TextField sx={{ width: 400 }} name="email" required type="email" label="Enter Trader email"></TextField>
            </Grid2>
            <Grid2 size={2}>
                <Button sx={{ height: 53 }} variant="contained">Invite Trader</Button>
            </Grid2>
        </Grid2>
    );
}