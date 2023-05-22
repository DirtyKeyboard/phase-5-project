import React from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import NavBar from './NavBar'
import DateTimePicker from './DateTimePicker'
import { ToastContainer, toast } from 'react-toastify';
import DayCard from './DayCard'
import moment from 'moment'


const Dashboard = () => {
    const [user, setUser] = React.useState({})
    const [plan, setPlan] = React.useState(false)
    const [date, setDate] = React.useState(null)
    const [name, setName] = React.useState('')
    const [ops, setOps] = React.useState(0)
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
            const newUser = await axios.get('/api/check')
            setDate(null)
            setName('')
            setUser(newUser.data.user)
            toast.success('Plan successfully added!', {position: toast.POSITION.BOTTOM_RIGHT})
        }
    }  
    let dayOne = new Date().toLocaleString()
    dayOne = dayOne.substring(0, dayOne.indexOf(','))
    
    let dayTwo = new Date()
    dayTwo.setDate(dayTwo.getDate() + 1)
    dayTwo = dayTwo.toLocaleString()
    dayTwo = dayTwo.substring(0, dayTwo.indexOf(','))

    let dayThree = new Date()
    dayThree.setDate(dayThree.getDate() + 2)
    dayThree = dayThree.toLocaleString()
    dayThree = dayThree.substring(0, dayThree.indexOf(','))

    let dayFour = new Date()
    dayFour.setDate(dayFour.getDate() + 3)
    dayFour = dayFour.toLocaleString()
    dayFour = dayFour.substring(0, dayFour.indexOf(','))

    let dayFive = new Date()
    dayFive.setDate(dayFive.getDate() + 4)
    dayFive = dayFive.toLocaleString()
    dayFive = dayFive.substring(0, dayFive.indexOf(','))

    let daySix = new Date()
    daySix.setDate(daySix.getDate() + 5)
    daySix = daySix.toLocaleString()
    daySix = daySix.substring(0, daySix.indexOf(','))

    let daySeven = new Date()
    daySeven.setDate(daySeven.getDate() + 6)
    daySeven = daySeven.toLocaleString()
    daySeven = daySeven.substring(0, daySeven.indexOf(','))

    const plansOne = []
    const plansTwo = []
    const plansThree = []
    const plansFour = []
    const plansFive = []
    const plansSix = []
    const plansSeven = []
    
    let convertedFromUser = ''
    if (user.plans) {
        user.plans.forEach(el => {
        convertedFromUser = el.time
        const year = convertedFromUser.substring(0, 4) //remove trailing 0
        let month = convertedFromUser.substring(5,7)
        let day = convertedFromUser.substring(8,convertedFromUser.indexOf('T'))
        if (month.charAt(0) === '0')
            month = month.substring(1)
        if (day.charAt(0) === '0')
            day = day.substring(1)
        convertedFromUser = `${month}/${day}/${year}`
        switch (convertedFromUser) {
            case dayOne: plansOne.push(el); break;
            case dayTwo: plansTwo.push(el); break;
            case dayThree: plansThree.push(el); break;
            case dayFour: plansFour.push(el); break;
            case dayFive: plansFive.push(el); break;
            case daySix: plansSix.push(el); break;
            case daySeven: plansSeven.push(el); break;
        }
        })
    }
    function compare(a, b) {
        if (a.time < b.time) {
            return -1;
        }
        if (a.time > b.time) {
            return 1;
        }
        return 0;
    }
    plansOne.sort(compare)
    plansTwo.sort(compare)
    plansThree.sort(compare)
    plansFour.sort(compare)
    plansFive.sort(compare)
    plansSix.sort(compare)
    plansSeven.sort(compare)
    
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
                    <div className="flex gap-4">
                        <DayCard toast={toast} date={dayOne} events={plansOne} ops={ops} setOps={setOps}/>
                        <DayCard toast={toast} date={dayTwo} events={plansTwo} ops={ops} setOps={setOps}/>
                        <DayCard toast={toast} date={dayThree} events={plansThree} ops={ops} setOps={setOps}/>
                        <DayCard toast={toast} date={dayFour} events={plansFour} ops={ops} setOps={setOps}/>
                        <DayCard toast={toast} date={dayFive} events={plansFive} ops={ops} setOps={setOps}/>
                        <DayCard toast={toast} date={daySix} events={plansSix} ops={ops} setOps={setOps}/>
                        <DayCard toast={toast} date={daySeven} events={plansSeven} ops={ops} setOps={setOps}/>
                    </div>
            </div>
            }
            </div>
        </>
    )
}

export default Dashboard