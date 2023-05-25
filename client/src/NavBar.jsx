import React from 'react'
import { NavLink } from 'react-router-dom'
import user from './assets/user.png'
import { useNavigate } from 'react-router-dom' 
import axios from 'axios'
import settings from './assets/settings.png'
import log from './assets/log.svg'
import bell from './assets/BELL_F.png'
import {v4 as uuid} from 'uuid'
import { Modal } from '@mui/material'
import moment from 'moment-timezone'

const NavBar = () => {
    const [user, setUser] = React.useState(null)
    const [picture, setPicture] = React.useState(null)
    const [modal, setShowModalInternal] = React.useState(false)
    const [notiWindow, setShowNotisInternal] = React.useState(false)
    const [notis, setNotis] = React.useState([])
    const [blips, setBlips] = React.useState()
    React.useEffect(() => {
        async function fetchData() {
            const r = await axios.get('/api/check')
            const req = await axios.get('/api/incoming_friend_requests')
            const ent = await axios.get('/api/incoming_entry_request')
            setPicture(r.data.user.profilePicture)
            setUser(r.data.user)
            setNotis([...req.data.incoming, ...ent.data.entries])
            setBlips(req.data.incoming.length + ent.data.entries.length)
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

    
    const [open, setOpen] = React.useState(false)
    const [clickedEvent, setClickedEvent] = React.useState({})
    const handleClose = () => { setOpen(false); setClickedEvent({})}
    async function handleAccept() {
        try {
            const r = await axios.patch(`/api/accept_request/${clickedEvent.id}`)
            const newNotis = notis.filter(el => el.id !== clickedEvent.id)
            setNotis(newNotis)
            setBlips(blips-1)
            window.location.reload()
        }
        catch(err){
            console.log(err.message)
        }
        handleClose()
    }
    async function handleDecline() {
        try {
            const r = await axios.patch(`/api/decline_request/${clickedEvent.id}`)
            const newNotis = notis.filter(el => el.id !== clickedEvent.id)
            setNotis(newNotis)
            setBlips(blips-1)
        }
        catch(err){
            console.log(err.message)
        }
        handleClose()
    }
    return (
        <>
        { user ?
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                    <div className='flex justify-center items-center m-auto w-screen h-screen'>
                        <div className="text-center flex flex-col gap-4 justify-center items-center w-[70vw]">
                            <h1 className="text-6xl text-white">You've been invited to an event by {clickedEvent.sent_by?.username}!</h1>
                            <h1 className='text-5xl text-white'>Event Name: {clickedEvent.name}</h1>
                            <h1 className='text-4xl text-white'>Date Of Event: {moment(clickedEvent.time).tz(user.timeZone).format('MM/DD/YYYY')}</h1>
                            <h1 className='text-3xl text-white'>Time Of Event: {moment(clickedEvent.time).tz(user.timeZone).format('h:mm A')}</h1>
                            <div className='flex gap-2'>
                                <button className="btn-default" onClick={handleAccept}>Accept</button>
                                <button className="btn-default" onClick={() => {handleDecline();}}>Decline</button>
                            </div>
                        </div>
                    </div>
                </Modal>
                :
                null
        }
        
        <nav className="flex items-center gap-4 bg-iris h-[4.4rem] p-2">
            <NavLink to="/dashboard" className="nav-link">Dashboard </NavLink>
            <NavLink to="/search" className="nav-link">Search</NavLink>
            <NavLink to="/friends" className="nav-link">Friends</NavLink>
            <h1 className="ml-auto text-2xl p-2 text-smoke">{user?.username}</h1>
            <img src={bell} className="w-10 hover:cursor-pointer" onClick={showNotis}/>
            {blips > 0 ? 
            <span className={` ${blips >= 100 ? 'text-xs' : null} flex justify-center items-center absolute w-5 h-5 right-[5rem] top-[2rem] bg-red-600 rounded-full text-white hover:cursor-pointer`}
            onClick={showNotis}>{blips}</span>
            : null}
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
                    {notis.map(el => {
                    
                    if (el.hasOwnProperty('from')) {
                        return <h1 key={uuid()} className="hover:bg-slate-300 hover:cursor-pointer" onClick={() => 
                        {nav(`/users/${el.from.username}`); window.location.reload()}}>
                            Incoming Friend Request : {el.from.username}
                            </h1>
                    }
                    else {
                        return <h1 key={uuid()} className="hover:bg-slate-300 hover:cursor-pointer"
                                onClick={() => {setClickedEvent(el); setOpen(true)}}>
                            Incoming Plan Request : {el.sent_by.username}
                            </h1>
                    }
                    }
                    )}
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