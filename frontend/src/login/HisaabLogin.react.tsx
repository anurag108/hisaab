import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { makeGETCall, makePOSTCall } from "../api";

interface HisaabLoginProps {
    onLogin: () => void
}

export default function HisaabLogin(props: HisaabLoginProps) {
    const [view, setView] = useState('LOGIN');
    const [formState, setFormState] = useState({
        email: '',
        password: ''
    });

    const handleLogin = async () => {
        try {
            const response = await makePOSTCall(
                '/log/in', {
                email: formState.email,
                password: formState.password
            });
            if (response?.status === 200) {
                console.log('status', response?.status);
                props.onLogin();
            } else {
                alert('status' + response?.status);
            }
        } catch (error) {
            console.log("Error logging user", error);
        }
    }

    const handleResetPassword = async () => {
        // TODO: Call Reset Password API
        setView('FORGOT_PASSWORD_SUCCESS');
    }

    return (
        <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {
                view === 'LOGIN' &&
                <Stack spacing={2} sx={{ width: 405 }}>
                    <h1>Login</h1>
                    <TextField
                        id="email"
                        label="Email"
                        type="email"
                        variant="outlined"
                        value={formState.email}
                        onChange={(event) => {
                            setFormState({
                                email: event.target.value,
                                password: formState.password
                            });
                        }}
                        required
                        fullWidth
                    />
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={formState.password}
                        onChange={(event) => {
                            setFormState({
                                email: formState.email,
                                password: event.target.value
                            });
                        }}
                        required
                        fullWidth
                    />
                    <Button variant="contained" color="primary" onClick={handleLogin}>Sign In</Button>
                    <Button variant="text" onClick={() => { setView('FORGOT_PASSWORD') }}>Forgot Password?</Button>
                </Stack>
            }
            {
                view === 'FORGOT_PASSWORD' &&
                <Stack spacing={2} sx={{ width: 405 }}>
                    <h1>Forgot Password</h1>
                    <TextField
                        id="email"
                        label="Email"
                        type="email"
                        variant="outlined"
                        required
                        fullWidth
                    />
                    <Stack direction="row" spacing={1}>
                        <Button variant="contained" color="primary" onClick={() => setView('LOGIN')}>Back to Login</Button>
                        <Button variant="contained" color="primary" onClick={handleResetPassword}>Send Reset Password Link</Button>
                    </Stack>
                </Stack>
            }
        </Box>
    );
}