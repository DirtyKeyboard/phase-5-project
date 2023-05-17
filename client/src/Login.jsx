import React from 'react'
import { useUserContext } from './context/UserContext'

const Login = () => {
    const [user, setUser] = useUserContext()
    return (
        <div>Login</div>
    )
}

export default Login