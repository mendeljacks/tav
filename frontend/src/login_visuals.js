import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { observer } from "mobx-react-lite";
import React from 'react';
import logo from './tav.png';
import './login_page.css';
import { login_store } from './login_store';
import { Button, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export const Login = observer(() => {
    /* eslint-disable-next-line*/
    const classes = useStyles();

    return (
        <div className="login-root">

            <div className='login-container'>
                <img width={150} src={logo} alt="No3rd Logo"></img>

                <Typography variant='subtitle1'>Staff Portal</Typography>
                <Typography style={{ color: 'indianred' }} variant='subtitle1'>{login_store.error}</Typography>

                <TextField
                    autoComplete="email"
                    onKeyPress={e => e.key === 'Enter' ? login_store.login() : ''} id="email"
                    label="Email" variant="outlined"
                    onChange={e => login_store.set_email(e.target.value)}
                    error={login_store.invalid_email}
                />

                <TextField
                    autoComplete="new-password"
                    onKeyPress={e => e.key === 'Enter' ? login_store.login() : ''} id="password"
                    label="Password" variant="outlined" type="Password"
                    onChange={e => login_store.set_password(e.target.value)}
                    error={login_store.invalid_password}
                />


                {login_store.loading_login ? 'Logging in...' :
                    <Button
                        style={{ marginTop: '10px', width: '150px' }}
                        color="primary"
                        variant="outlined"
                        disabled={login_store.login_disabled()}
                        onClick={() => login_store.login()}
                    >
                        Login
                </Button>
                }
                {login_store.invalid_password &&
                    <Button style={{ cursor: 'pointer', color: '#555' }}
                        onClick={() => login_store.forgot_password()}>
                        Forgot Password
                </Button>
                }

            </div>
        </div >
    );
})