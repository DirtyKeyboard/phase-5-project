import React, {useEffect} from 'react'
import { NavLink } from 'react-router-dom'
import user from './assets/user.png'
import { useNavigate } from 'react-router-dom' 
import axios from 'axios'
import settings from './assets/settings.png'
import log from './assets/log.svg'
import bell from './assets/BELL_F.png'

const NavBar = () => {
    const [username, setUsername] = React.useState(null)
    const [picture, setPicture] = React.useState(null)
    const [modal, setShowModalInternal] = React.useState(false)
    const [notiWindow, setShowNotisInternal] = React.useState(false)
    const [notis, setNotis] = React.useState([])
    useEffect(() => {
        async function fetchData() {
            const r = await axios.get('/api/check')
            const req = await axios.get('/api/incoming_friend_requests')
            setPicture(r.data.user.profilePicture)
            setUsername(r.data.user.username)
            setNotis(req.data.incoming)
            console.log(req.data.incoming)
        }
        fetchData()
    },[])
    const nav = useNavigate()
    function showModal() {
        setShowModalInternal(true)
        setTimeout(() => {setShowModalInternal(false)}, 5000)
    }

    function showNotis() {
        setShowNotisInternal(true)
        setTimeout(() => {setShowNotisInternal(false)}, 5000)
    }
    return (
        <>
        <nav className="flex items-center gap-4 bg-iris h-[4.4rem] p-2">
            <NavLink to="/dashboard" className="nav-link">Dashboard </NavLink>
            <NavLink to="/search" className="nav-link">Search</NavLink>
            <NavLink to="/friends" className="nav-link">Friends</NavLink>
            <NavLink to="/" className="nav-link">X</NavLink>
            <h1 className="ml-auto text-2xl p-2 text-smoke">{username}</h1>
            <img src={bell} className="w-10 hover:cursor-pointer" onClick={showNotis}/>
            {/* Notification Blips */}
            <img src={picture ? picture : user} className="w-14 hover:cursor-pointer p-1" onClick={showModal} />
        </nav>
        <div className='fixed p-2 right-0'>
            <div className="flex flex-col justify-center gap-4">
                <img src={settings} className={`w-8 transition-all ease-in-out duration-300 hover:animate-spin hover:cursor-pointer ${modal ? null : 'translate-x-20'}`} onClick={() => nav('/edit_account')}/>
                <img src={log} className={`w-10 transition-all ease-in-out duration-300 hover:cursor-pointer ${modal ? null : 'translate-x-20'}`} onClick={async() => {
                    await axios.get('/api/logout')
                    nav('/')
                }}/>
            </div>
        </div>
        <div className=" fixed p-2 right-[4rem]">
                <div className={`${notiWindow ? 'translate-x-0 opacity-100 bg-slate-200' : 'opacity-0'} flex flex-col gap-2 -translate-x-32 transition-all ease-in-out duration-300`}>
                    {notis.length > 0 ? 
                    <>
                    {notis.map(el => <h1 key={el.id} className="hover:bg-slate-300 hover:cursor-pointer" onClick={() => {nav(`/users/${el.from.username}`); window.location.reload()}}>Incoming Friend Request : {el.from.username}</h1>)}
                    </>
                    :
                    <h1>No new notifications.</h1>
                    }
                </div>  
        </div>
        </>
    )
}

export default NavBar