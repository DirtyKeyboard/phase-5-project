import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const Login = () => {
    const [form, setForm] = React.useState({email: '', password: ''})
    const nav = useNavigate()
    
    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = async(e) => {
            e.preventDefault()
            try {
                const r = await axios.post('/api/login', form)
                nav('/dashboard')
            }
            catch (err) {
                toast.error('Invalid email or password, please try again.', {position: toast.POSITION.BOTTOM_RIGHT})
            }
            
        }

    return (
        <div className="bg-iris h-screen p-12 flex justify-center items-center">
            <ToastContainer />
            <div className="h-[stretch] w-[50vw] bg-smoke flex flex-col items-center gap-8 p-8">
                <h1 className="text-6xl">Login</h1>
                <form className="flex flex-col gap-10 items-center m-12 w-[stretch] h-[stretch]" onSubmit={handleSubmit}>
                    <label className="text-4xl">Email</label>
                    <input onChange={handleChange} value={form.email} name="email" className="bg-[#e4e4e4] w-[stretch] h-7" type='text' />
                    <label className="text-4xl">Password</label>
                    <input onChange={handleChange} value={form.password} name="password" className="bg-[#e4e4e4] w-[stretch] h-7" type='password' />
                    <div className="flex gap-4">
                        <button type="submit" className="btn-default bg-iris text-smoke font-bold hover:bg-baby">Submit</button>
                        <button onClick={() => {nav('/')}} className="btn-default bg-iris text-smoke font-bold hover:bg-baby">Go Back</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login