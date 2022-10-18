import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'

import jwt_decode from 'jwt-decode'

import { LoadingButton } from '@mui/lab'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import LoginIcon from '@mui/icons-material/Login'

const google_client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID
const LoginComponent = ({ setUser, setIsLoginPage }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const loginWithGoogle = async (googleEmail, googleId) => {
    try {
      console.log('Google said ok')
      const { data } = await axios.post(
        'http://localhost:5000/api/users/google/login',
        {
          email: googleEmail,
          googleId,
        },
        config
      )
      console.log(data)
      setUser(data)
    } catch (error) {
      console.error('Sign up user did not go well')
      console.error(error)
    }
  }

  const handleLoginCallbackResponse = (googleResponse) => {
    const googleUserObj = jwt_decode(googleResponse.credential)
    console.log('Google user obj', googleUserObj)
    const { sub: googleId, email } = googleUserObj
    loginWithGoogle(email, googleId)

    //TODO: login or signup user to google user api
  }

  const loginHandler = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/users/login',
        {
          email,
          password,
        },
        config
      )
      console.log(data)
    } catch (error) {
      console.error('Log in user did not go well')
      console.error(error)
    }
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: google_client_id,
      callback: handleLoginCallbackResponse,
      context: 'sign_in',
    })
  }, [])

  useEffect(() => {
    google.accounts.id.renderButton(document.getElementById('loginButton'), {
      // https://developers.google.com/identity/gsi/web/reference/js-reference
      // type: 'icon',
      theme: 'filled_blue',
      size: 'large',
      text: 'signin', // signin_with or signup_with
      logo_alignment: 'left', //left or center
      shape: 'pill', // pill, rectangular, circle
    })

    google.accounts.id.prompt()
  })

  return (
    <div>
      <form onSubmit={loginHandler}>
        <Grid container spacing={3} direction='column'>
          <Typography>Login</Typography>
          <Grid item>
            <TextField
              id='email'
              name='email'
              label='Email'
              type='email'
              value={email}
              required
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              id='password'
              name='password'
              label='Password'
              type={showPassword ? 'text' : 'password'}
              required
              fullWidth
              helperText={
                !password ? '' : 'Your password must be at least 8 characters.'
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid display={'flex'} justifyContent='center' item>
            <LoadingButton
              endIcon={<LoginIcon />}
              variant='contained'
              type='submit'
              size='large'
              color='primary'
            >
              <Typography>Login</Typography>
            </LoadingButton>
          </Grid>
          <Grid item>
            <div id='loginButton'></div>
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                setIsLoginPage(false)
              }}
            >
              Go to sign up
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default LoginComponent
