import React from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import NavBar from './NavBar'
import DateTimePicker from './DateTimePicker'
import { ToastContainer, toast } from 'react-toastify';
import DayCard from './DayCard'
import moment from 'moment-timezone'

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
                console.log(e)
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
            const r = await axios.post("/api/create_event", {name: name, time: date})
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
        convertedFromUser = moment(el.time).tz(user.timeZone).format('MM/DD/YYYY')
        switch (convertedFromUser) {
            case moment(dayOne).format('MM/DD/YYYY'): plansOne.push(el); break;
            case moment(dayTwo).format('MM/DD/YYYY'): plansTwo.push(el); break;
            case moment(dayThree).format('MM/DD/YYYY'): plansThree.push(el); break;
            case moment(dayFour).format('MM/DD/YYYY'): plansFour.push(el); break;
            case moment(dayFive).format('MM/DD/YYYY'): plansFive.push(el); break;
            case moment(daySix).format('MM/DD/YYYY'): plansSix.push(el); break;
            case moment(daySeven).format('MM/DD/YYYY'): plansSeven.push(el); break;
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
                <DateTimePicker date={date} setDate={setDate} tz={user.timeZone} />
                <button type="submit" className='btn-default bg-iris hover:bg-baby text-white'>Confirm Event</button>
            </form>
            :
            <div>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <DayCard timeZone={user.timeZone} toast={toast} date={dayOne} events={plansOne} ops={ops} setOps={setOps}/>
                        <DayCard timeZone={user.timeZone} toast={toast} date={dayTwo} events={plansTwo} ops={ops} setOps={setOps}/>
                        <DayCard timeZone={user.timeZone} toast={toast} date={dayThree} events={plansThree} ops={ops} setOps={setOps}/>
                        <DayCard timeZone={user.timeZone} toast={toast} date={dayFour} events={plansFour} ops={ops} setOps={setOps}/>
                        <DayCard timeZone={user.timeZone} toast={toast} date={dayFive} events={plansFive} ops={ops} setOps={setOps}/>
                        <DayCard timeZone={user.timeZone} toast={toast} date={daySix} events={plansSix} ops={ops} setOps={setOps}/>
                        <DayCard timeZone={user.timeZone} toast={toast} date={daySeven} events={plansSeven} ops={ops} setOps={setOps}/>
                        {/*Add a see more button to see more days*/}
                    </div>
            </div>
            }
            </div>
        </>
    )
}

export default Dashboard