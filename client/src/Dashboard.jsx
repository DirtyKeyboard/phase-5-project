import React from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import NavBar from './NavBar'
import DateTimePicker from './DateTimePicker'

const Dashboard = () => {
    const [user, setUser] = React.useState({})
    const nav = useNavigate()
    React.useEffect(() => {
        const fetchData = async() => {
            try {
                const r = await axios.get('/api/check')
                setUser(r.data.user)
            }
            catch (e) {
                nav('/')
            }
        }
        fetchData()
    }, [])
    return (
        <>
            <NavBar />
            <div>
                <h1>Dashboard for {user.username}</h1>
            </div>
        </>
    )
}

export default Dashboard