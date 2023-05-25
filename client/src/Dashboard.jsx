import React from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import NavBar from './NavBar'
import DateTimePicker from './DateTimePicker'
import { ToastContainer, toast } from 'react-toastify';
import DayCard from './DayCard'
import moment from 'moment-timezone'
import EventListCard from './EventListCard'
import {v4 as uuid} from 'uuid'

const Dashboard = () => {
    const [user, setUser] = React.useState({})
    const [plan, setPlan] = React.useState(false)
    const [date, setDate] = React.useState(null)
    const [name, setName] = React.useState('')
    const [length, setLength] = React.useState({hours: '', minutes: '0'})
    const [ops, setOps] = React.useState(null)
    const [seeMore, setSeeMore] = React.useState(false)
    const [delb, setDelb] = React.useState(null)
    const [allPlans, setAllPlans] = React.useState([])
    const nav = useNavigate()
    function compare(a, b) {
        if (a.time < b.time) {
            return -1;
        }
        if (a.time > b.time) {
            return 1;
        }
        return 0;
    }
    React.useEffect(() => {
        const fetchData = async() => {
            try {
                const r = await axios.get('/api/check')
                setUser(r.data.user)
                const alp = r.data.user.plans
                alp.sort(compare)
                setAllPlans(alp)
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
        if (!name)
            toast.error("Please select a name for your event.", {position: toast.POSITION.BOTTOM_RIGHT})
        else if (!date)
            toast.error("Please select a date and time for your event.", {position: toast.POSITION.BOTTOM_RIGHT})
        else if ((today.getMonth()+1 + " " + today.getDate() + " " + today.getFullYear()) === (date.$M+1 + " " + date.$D + " " + date.$y) && today.getHours() >= date.$H)
            toast.error("You cannot schedule an event for this day and hour, please schedule events at least 1 hour ahead of the current date and time.", {position: toast.POSITION.BOTTOM_RIGHT})
        else if (name.length >= 16) {
            toast.error("Please keep the event name to 15 characters or under.", {position: toast.POSITION.BOTTOM_RIGHT})
        }
        else if (length.hours === '' && length.minutes === '0')
            toast.error("Please enter the length of time for this event.", {position: toast.POSITION.BOTTOM_RIGHT})
        else
        {
            console.log(length)
            const r = await axios.post("/api/create_event", {name: name, time: date, ...length})
            setDate(null)
            setName('')
            const alp = [...allPlans, r.data.plan]
            alp.sort(compare)
            setAllPlans(alp)
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
    if (allPlans) {
        allPlans.forEach(el => {
        convertedFromUser = moment(new Date(el.time)).tz(user.timeZone).format('MM/DD/YYYY')
        switch (convertedFromUser) {
            case moment(new Date(dayOne)).format('MM/DD/YYYY'): plansOne.push(el); break;
            case moment(new Date(dayTwo)).format('MM/DD/YYYY'): plansTwo.push(el); break;
            case moment(new Date(dayThree)).format('MM/DD/YYYY'): plansThree.push(el); break;
            case moment(new Date(dayFour)).format('MM/DD/YYYY'): plansFour.push(el); break;
            case moment(new Date(dayFive)).format('MM/DD/YYYY'): plansFive.push(el); break;
            case moment(new Date(daySix)).format('MM/DD/YYYY'): plansSix.push(el); break;
            case moment(new Date(daySeven)).format('MM/DD/YYYY'): plansSeven.push(el); break;
        }
        })
    }

    plansOne.sort(compare)
    plansTwo.sort(compare)
    plansThree.sort(compare)
    plansFour.sort(compare)
    plansFive.sort(compare)
    plansSix.sort(compare)
    plansSeven.sort(compare)
    function handleChange(e) {
        if (e.target.name === 'hours' && e.target.value === '0')
            setLength({[e.target.name]: e.target.value, minutes: '15'})
        else
            setLength({...length, [e.target.name]: e.target.value})
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
                <DateTimePicker date={date} setDate={setDate} tz={user.timeZone} />
                <label>How long is this event?</label>
                <div className='flex gap-4'>
                    <input min="0" max="12" type='number' name="hours" value={length.hours} onChange={handleChange} className='bg-input w-32 h-10 p-2 border rounded-full border-teal' placeholder=' Hours...'/>
                    <select name="minutes" value={length.minutes} onChange={handleChange} className='bg-input rounded-full h-10 p-2 border w-32 border-teal'>
                        <option disabled={length.hours > 0 ? false : true} value={0}>0 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                    </select>
                </div>
                <button type="submit" className='btn-default bg-iris hover:bg-baby text-white'>Confirm Event</button>
            </form>
            :
            <div>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <DayCard timeZone={user.timeZone} toast={toast} date={dayOne} events={plansOne} ops={ops} setOps={setOps} allPlans={allPlans} setAllPlans={setAllPlans}/>
                        <DayCard timeZone={user.timeZone} toast={toast} date={dayTwo} events={plansTwo} ops={ops} setOps={setOps} allPlans={allPlans} setAllPlans={setAllPlans}/>
                        <DayCard timeZone={user.timeZone} toast={toast} date={dayThree} events={plansThree} ops={ops} setOps={setOps} allPlans={allPlans} setAllPlans={setAllPlans}/>
                        <DayCard timeZone={user.timeZone} toast={toast} date={dayFour} events={plansFour} ops={ops} setOps={setOps} allPlans={allPlans} setAllPlans={setAllPlans}/>
                        <DayCard timeZone={user.timeZone} toast={toast} date={dayFive} events={plansFive} ops={ops} setOps={setOps} allPlans={allPlans} setAllPlans={setAllPlans}/>
                        <DayCard timeZone={user.timeZone} toast={toast} date={daySix} events={plansSix} ops={ops} setOps={setOps} allPlans={allPlans} setAllPlans={setAllPlans}/>
                        <DayCard timeZone={user.timeZone} toast={toast} date={daySeven} events={plansSeven} ops={ops} setOps={setOps} allPlans={allPlans} setAllPlans={setAllPlans}/>
                    </div>
                    <a href='#moreView'>
                    <button className='btn-default text-white bg-iris hover:bg-baby mt-4' onClick={() => {setSeeMore(!seeMore)}}>{seeMore ? 'See Less' : 'See More'}</button>
                    </a>
                    {
                        seeMore ?
                        <div id='moreView' className='flex gap-2 flex-col p-4 w-3/4 m-auto'>
                            {allPlans.map(el => <EventListCard key={uuid()} event={el} tz={user.timeZone} delb={delb} setDelb={setDelb} setAllPlans={setAllPlans} allPlans={allPlans}
                            toast={toast}/>)}
                        </div>
                        :
                        null
                    }
            </div>
            }
            </div>
        </>
    )
}

export default Dashboard