import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function ButtonAppBar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography align="center" variant="h4" component="div" sx={{ flexGrow: 1 }}>
                    Hisaab
                </Typography>
            </Toolbar>
        </AppBar>
    );
}