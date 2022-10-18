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

const SignUpComponent = ({ setUser, setIsLoginPage }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const signupHandler = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/users/sign-up',
        {
          name,
          email,
          password,
        },
        config
      )
      console.log(data)
    } catch (error) {
      console.error('Sign up user did not go well')
      console.error(error)
    }
  }

  const signUpWithGoogle = async (
    googleName,
    googleEmail,
    googleId,
    pictureURL
  ) => {
    try {
      console.log('Google said ok')
      const { data } = await axios.post(
        'http://localhost:5000/api/users/google/sign-up',
        {
          name: googleName,
          email: googleEmail,
          googleId,
          pictureURL,
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

  const handleCallbackResponse = (googleResponse) => {
    const googleUserObj = jwt_decode(googleResponse.credential)
    console.log('Google user obj', googleUserObj)
    const { name, sub: googleId, picture, email } = googleUserObj
    signUpWithGoogle(name, email, googleId, picture)

    //TODO: login or signup user to google user api
  }
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: google_client_id,
      callback: handleCallbackResponse,
      context: 'signup',
    })
  }, [])

  useEffect(() => {
    google.accounts.id.renderButton(document.getElementById('signupButton'), {
      // https://developers.google.com/identity/gsi/web/reference/js-reference
      // type: 'icon',
      theme: 'filled_blue',
      size: 'large',
      text: 'signup_with', // signin_with or signup_with
      logo_alignment: 'left', //left or center
      shape: 'pill', // pill, rectangular, circle
    })

    google.accounts.id.prompt()
  })

  return (
    <div>
      {' '}
      <form onSubmit={signupHandler}>
        <Grid container spacing={3} direction='column'>
          <Typography>Sign up</Typography>
          <Grid item>
            <TextField
              id='name'
              name='name'
              label='Full name'
              type='name'
              value={name}
              required
              fullWidth
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
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
              <Typography>sign up</Typography>
            </LoadingButton>
          </Grid>
          <Grid item>
            <div id='signupButton'></div>
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                setIsLoginPage(true)
              }}
            >
              Go to login
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default SignUpComponent
