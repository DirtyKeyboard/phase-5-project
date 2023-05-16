import {Typography as T} from '@mui/material'
import {Button} from '@mui/material'
import DateTimePicker from './DateTimePicker'
import React from 'react'
import {UserContext} from './context/UserContext'
import axios from 'axios'

function App() {
  const {user, setUser} = React.useContext(UserContext)
  return (
      <div className="flex flex-col h-screen justify-center items-center gap-4">
        
        <div className="flex gap-2">
          {user ? 
          <>
            <T variant="h1">User: {user.username}</T>
            <T variant='h1'>Logged in</T>
          </>
          :
          <>
            <Button variant='outlined'>Login</Button>
            <Button variant='outlined'>Create Account</Button>
          </>
          }
          
        </div>
      </div>
  )
}

export default App
