import React from 'react'
import logo from './assets/LOGO.png'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

const Home = () => {
    const [user, setUser] = React.useState(null)
    const nav = useNavigate()
    React.useEffect(() => {
        async function f() {
            const r = await axios.get('/api/check')
            console.log(r.data)
            if (r.data.user)
            {
                setUser(r.data.user)
                nav('/dashboard')
            }
        }
        f()
    },[])
    return (
        <>
            <div className="flex justify-center items-center h-[50vh]">
                <img src={logo} />
            </div>
            <div className="flex flex-col gap-4 justify-center items-center h-[50vh] bg-blue1">
                <h1 className="text-8xl text-white">Welcome to LaunchPad!</h1>
                <h1 className="text-4xl text-white">Please log in, or create an account.</h1>
                <div className="flex gap-4">
                    <button className="btn-default" onClick={() => nav('/login')}>Login</button>
                    <button className="btn-default" onClick={() => nav('/register')}>Register</button>
                </div>
            </div>
        </>
    )
}

export default Home