import './App.css'
import { useState } from 'react'
import { Button } from '@mui/material'

import LoginComponent from './components/LoginComponent'
import SignUpComponent from './components/SignUpComponent'

function App() {
  const [user, setUser] = useState({})
  const [isLoginPage, setIsLoginPage] = useState(true)

  return (
    <div className='App'>
      {user.email === undefined ? (
        <div className='app-container'>
          {isLoginPage ? (
            <LoginComponent setUser={setUser} setIsLoginPage={setIsLoginPage} />
          ) : (
            <SignUpComponent
              setUser={setUser}
              setIsLoginPage={setIsLoginPage}
            />
          )}
        </div>
      ) : (
        <>
          <img src={user.picture} />
          <div>{user.email}</div>
          <div>{user.name}</div>
          <Button onClick={() => setUser({})} color='error' variant='contained'>
            Logout
          </Button>
        </>
      )}
    </div>
  )
}

export default App
