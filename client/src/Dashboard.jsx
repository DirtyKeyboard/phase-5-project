import React from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import NavBar from './NavBar'
import DateTimePicker from './DateTimePicker'
import { ToastContainer, toast } from 'react-toastify';

const Dashboard = () => {
    const [user, setUser] = React.useState({})
    const [plan, setPlan] = React.useState(false)
    const [date, setDate] = React.useState(null)
    const [name, setName] = React.useState('')
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
    async function handleSubmit(e) {
        e.preventDefault()
        const today = new Date()
        if (!name) {
            toast.error("Please select a name for your event.", {position: toast.POSITION.BOTTOM_RIGHT})
            return 0;           
        }
        if (!date)
        {
            toast.error("Please select a date and time for your event.", {position: toast.POSITION.BOTTOM_RIGHT})
            return 0;
        }
        if ((today.getMonth()+1 + " " + today.getDate() + " " + today.getFullYear()) === (date.$M+1 + " " + date.$D + " " + date.$y) && today.getHours() >= date.$H)
            toast.error("You cannot schedule an event for this day and hour, please schedule events at least 1 hour ahead of the current date and time.", {position: toast.POSITION.BOTTOM_RIGHT})
        else
        {
            const r = await axios.post("/api/create_event", {name: name, time: date}) //setback date by 5 hrs
            setDate(null)
            setName('')
            toast.success('Plan successfully added!', {position: toast.POSITION.BOTTOM_RIGHT})
        }
    }  
    
    return (
        <>
            <ToastContainer />
            <NavBar />
            <div className="flex flex-col text-center items-center gap-10 p-10">
                <h1 className='text-5xl'>Dashboard</h1>
                <button className="btn-default bg-iris text hover:bg-baby text-white" onClick={() => setPlan(!plan)}>{plan ? 'Show Events' : 'Create An Event'}</button>
            {plan ? 
            <form className="flex flex-col text-center items-center gap-10" onSubmit={handleSubmit}>
                <label>Name for Event</label>
                <input type='text' className='bg-input w-96 h-8 p-2 border rounded-full border-teal' value={name} onChange={(e) => setName(e.target.value)}/>
                <DateTimePicker date={date} setDate={setDate} />
                <button type="submit" className='btn-default bg-iris hover:bg-baby text-white'>Confirm Event</button>
                {/* <div className="bg-smoke border border-red-500 w-44 h-12 fixed bottom-[18rem] right-[720px]" name="button-hider"/> */}
            </form>
            :
            <div>
                {user.plans?.length > 0 ? user.plans.map(el => {
                const planDate = new Date(el.time.substring(0, el.time.indexOf('T')) + ' ' + el.time.substring(el.time.indexOf('T')+1, el.time.indexOf('.')))
                return <h1 key={el.id}>Plan: {el.name}, Date/Time: {planDate.toString()}</h1>
                }) : "NO PLANS"}
            </div>
            }
            </div>
        </>
    )
}

export default Dashboard