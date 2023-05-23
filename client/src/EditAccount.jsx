import React, { useState, useEffect } from 'react'
import NavBar from './NavBar'
import ReactDOM from 'react-dom'
import TimezoneSelect from 'react-timezone-select'
import { Switch } from '@mui/material'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

const EditAccount = () => { //timeZone user.timeZoneValue
    const nav = useNavigate()
    const [form, setForm] = useState({timeZone: '', profilePicture: "", role: "BASIC", tzOffset: 0})
    useEffect(() => {
        async function getUser() {
            try {
                const r = await axios.get('api/check')
                setForm({timeZone: r.data.user.timeZone, profilePicture: r.data.user.profilePicture, role: r.data.user.role, tzOffset: r.data.user.tzOffset})
            } 
            catch(err) {
                nav('/')
            }
        }
        getUser()
    }, [])
    
    const handleSubmit = async(e) => {
        e.preventDefault()
        await axios.patch('/api/update_user', form)
        nav('/dashboard')
    }
    const switchClick = () => {
        if (form.role === "BASIC")
            setForm({...form, role: "MANAGER"})
        else
            setForm({...form, role: "BASIC"})
    }
    return (
        <>
            <NavBar />
            <div className="flex justify-center items-center m-14">
                {/* value, label, offset, abbrev, altName */}
                <form className="flex flex-col gap-8 text-center" onSubmit={handleSubmit}>
                    <h1 className="text-6xl mb-12">Account Settings</h1>
                    <label>Select Timezone</label>
                    <TimezoneSelect value={form.timeZone} onChange={(e) => {  
                        setForm({...form, timeZone: e.value, tzOffset: e.offset})  
                        }} />
                    <label>Profile Picture URL</label>
                    <input type="text" value={form.profilePicture} className='w-[stretch] h-7' name="profilePicture" onChange={(e) => {setForm({...form, profilePicture: e.target.value})}}/>
                    {/* <div>
                        <label>Manager?</label>
                        <Switch checked={form.role === 'MANAGER' ? true : false} onChange={switchClick}/>
                    </div> */}
                    <button type="submit" className="btn-default bg-white">Submit</button>
                    <button className="btn-default bg-white" onClick={() => nav('/dashboard')}>Back To Dashboard</button>
                </form>
            </div>
        </>
    )
}

export default EditAccount