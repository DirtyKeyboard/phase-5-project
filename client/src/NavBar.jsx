import React from 'react'
import { NavLink } from 'react-router-dom'
import user from './assets/user.png'

const NavBar = () => {
    return (
        <nav className="flex items-center gap-4 bg-blue2 h-[4.4rem] p-2">
            <NavLink to="/dashboard" className="nav-link">Dashboard </NavLink>
            <NavLink to="/" className="nav-link">Random</NavLink>
            <NavLink to="/" className="nav-link">Random</NavLink>
            <NavLink to="/" className="nav-link">Random</NavLink>
            <NavLink to='/my_account' className='ml-auto'><img src={user} className="w-14"/></NavLink>
        </nav>
    )
}

export default NavBar