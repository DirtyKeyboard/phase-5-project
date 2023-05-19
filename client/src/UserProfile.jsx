import React from 'react'
import NavBar from './NavBar'
import {useParams} from 'react-router-dom'
import axios from 'axios'

const UserProfile = () => {
    const {username} = useParams()
    const [user, setUser] = React.useState({})
    const [cur, setCur] = React.useState({})
    React.useEffect(() => {
        const getU = async() => {
            const r = await axios.get(`/api/user/${username}`)
            const r2 = await axios.get('/api/check')
            setUser(r.data.user)
            setCur(r2.data.user)
        }
        getU()
    }, [])
    return (
        <>
            <NavBar />
            <div className="flex justify-center flex-col items-center gap-4 mt-10">
                <h1 className="text-5xl">{username}</h1>
                <img src={user.profilePicture} className="h-56" />
            </div>
        </>
    )
}

export default UserProfile