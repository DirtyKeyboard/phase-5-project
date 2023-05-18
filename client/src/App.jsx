import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import Dashboard from './Dashboard'
import Home from './Home'
import EditAccount from './EditAccount'
import Search from './Search'

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/edit_account" element={<EditAccount/>} />
      <Route path="/search" element={<Search />} />
    </Routes>
  )
}

export default App
