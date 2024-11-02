import { Box, Button, FormControl, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { makePOSTCall } from "../api";
import { User } from "../types";

interface HisaabLoginProps {
    onLogin: (user: User) => void
}

export default function HisaabLogin(props: HisaabLoginProps) {
    const emailRegex: RegExp = /\S+@\S+\.\S+/;
    const [view, setView] = useState('LOGIN');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [loginErrorMessage, setLoginErrorMessage] = useState("");
    const [isFormFilled, setIsFormFilled] = useState(false);

    const handleLogin = async () => {
        const isEmailValid = validateEmail(email);
        if (!isEmailValid) {
            setEmailErrorMessage("Please enter a valid email");
        } else {
            try {
                const response = await makePOSTCall(
                    '/log/in', {
                    email,
                    password
                });
                const data = await response.json();
                if (response?.status === 200 && data.user) {
                    props.onLogin(data.user);
                } else {
                    setLoginErrorMessage("Incorrect credentials");
                }
            } catch (error) {
                console.log("Error logging user", error);
                setLoginErrorMessage("Something went wrong. Please try again");
            }
        }
    }

    function validateEmail(email: string) {
        return emailRegex.test(email);
    }

    const onChangeEmailField = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        if (event.target.value !== "" && password !== "") {
            setIsFormFilled(true);
        } else {
            setIsFormFilled(false);
        }
    };

    const onChangePasswordField = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        if (email !== "" && event.target.value !== "") {
            setIsFormFilled(true);
        } else {
            setIsFormFilled(false);
        }
    };

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
                        value={email}
                        onChange={onChangeEmailField}
                        required
                        fullWidth
                        error={emailErrorMessage !== ''}
                        helperText={emailErrorMessage !== '' && "Please enter a valid email"}
                    />
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={onChangePasswordField}
                        required
                        fullWidth
                    />
                    {loginErrorMessage !== "" && <Typography variant="body1" color="error">{loginErrorMessage}</Typography>}
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!isFormFilled}
                        onClick={handleLogin}>
                        Sign In
                    </Button>
                    {/* <Button variant="text" onClick={() => { setView('FORGOT_PASSWORD') }}>Forgot Password?</Button> */}
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