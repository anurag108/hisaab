import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@mui/material";
import { randomId } from "@mui/x-data-grid-generator";

interface InviteTraderProps {
    open: boolean,
    handleDialogClose: () => void,
    handleSuccessfulInvite: (id: string, email: string, creationTime: string, updateTime: string) => void,
}

export default function InviteTrader(props: InviteTraderProps) {
    const { open, handleDialogClose, handleSuccessfulInvite } = props;
    return (
        <Dialog
            open={open}
            onClose={handleDialogClose}
            PaperProps={{
                component: 'form',
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries((formData as any).entries());
                    const email = formJson.email;
                    // TODO: Call Invite Trader API
                    const id = randomId();
                    const time = Date.now().toString();
                    handleDialogClose();
                    handleSuccessfulInvite(id, email, time, time);
                },
            }}
        >
            <DialogTitle>Invite Trader</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    We will send them an email with your invitation
                </DialogContentText>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="email"
                    name="email"
                    label="Trader Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button type="submit" variant="contained">Invite</Button>
            </DialogActions>
        </Dialog>
    );
}
