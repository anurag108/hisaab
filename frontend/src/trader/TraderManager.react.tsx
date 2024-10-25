import { Box, Button } from "@mui/material";
import mockTraders from '../data/traders.json';
import { useState } from "react";
import TradersCrud from "./TradersCrud.react";
import InviteTrader from "./InviteTrader.react";

export default function TraderManager() {
    const [view, setView] = useState('CRUD');

    const handleBackButton = () => {
        setView('CRUD');
    };

    const handleInvite = async () => {
        setView('INVITE');
    };

    return (<Box>
        {view === 'CRUD' && <TradersCrud traders={mockTraders} onClickInvite={handleInvite} />}
        {view === 'INVITE' &&
            <Box>
                <Button variant="contained" onClick={handleBackButton}>Back</Button>
                <Box sx={{ mt: 3 }}>
                    <InviteTrader />
                </Box>
            </Box>
        }
    </Box>);
}