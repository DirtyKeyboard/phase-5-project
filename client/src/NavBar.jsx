import React, {useEffect} from 'react'
import { NavLink } from 'react-router-dom'
import user from './assets/user.png'
import { useNavigate } from 'react-router-dom' 
import axios from 'axios'

const NavBar = () => {
    const [picture, setPicture] = React.useState(null)
    useEffect(() => {
        async function fetchData() {
            const r = await axios.get('/api/check')
            setPicture(r.data.user.profilePicture)
        }
        fetchData()
    },[])
    const nav = useNavigate()
    return (
        <nav className="flex items-center gap-4 bg-iris h-[4.4rem] p-2">
            <NavLink to="/dashboard" className="nav-link">Dashboard </NavLink>
            <NavLink to="/" className="nav-link">Random</NavLink>
            <NavLink to="/" className="nav-link">Random</NavLink>
            <NavLink to="/" className="nav-link">Random</NavLink>
            <img src={picture ? picture : user} className="w-14 ml-auto hover:cursor-pointer" onClick={() => nav('/edit_account')} />
        </nav>
    )
}

export default NavBar