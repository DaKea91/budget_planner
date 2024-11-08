import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Typography } from '@mui/material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
    const router = useRouter();

    // Handle login submission
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
            callbackUrl: '/home' // Redirect after successful login
        });

        if (res?.error) {
            setError(res.error);
        } else if (!res.ok) {
            setError('Failed to sign in. Please try again.');
        } else {
            router.push(res.url || '/home');
        }
    };

    // Handle registration submission
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Send registration data to the correct API path
        const res = await fetch('/api/register', {  // Update to correct API path
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password,
            }),
        });

        const data = await res.json();

        if (data.error) {
            setError(data.error); // Display any registration error
        } else {
            // Optionally log the user in after successful registration
            const loginRes = await signIn('credentials', {
                redirect: false,
                email,
                password,
                callbackUrl: '/home',
            });

            if (loginRes?.error) {
                setError('Login after registration failed. Please try again.');
            } else {
                router.push(loginRes.url || '/home');
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>
                {isRegistering ? 'Register' : 'Login'}
            </Typography>
            <form onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit}>
                {/* Show the username field only when registering */}
                {isRegistering && (
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                )}

                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '1rem' }}>
                    {isRegistering ? 'Register' : 'Login'}
                </Button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <p>
                {isRegistering ? (
                    <span>
                        Already have an account?{' '}
                        <Button onClick={() => setIsRegistering(false)} color="primary">
                            Login
                        </Button>
                    </span>
                ) : (
                    <span>
                        Don&apos;t have an account?{' '}
                        <Button onClick={() => setIsRegistering(true)} color="primary">
                            Register
                        </Button>
                    </span>
                )}
            </p>
        </div>
    );
};

export default Login;
