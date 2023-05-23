import React from 'react'
import NavBar from './NavBar'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import defaultPic from './assets/user.png'
import { useNavigate } from 'react-router-dom'
import DateTimePicker from './DateTimePicker'
import {ToastContainer, toast} from 'react-toastify'

const UserProfile = () => {
    const nav = useNavigate()
    const {username} = useParams()
    const [user, setUser] = React.useState({})
    const [cur, setCur] = React.useState({})
    const [planner, setPlanner] = React.useState(false)
    const [buttonState, setButtonState] = React.useState({})
    const [date, setDate] = React.useState('')
    const [name, setName] = React.useState('')

    React.useEffect(() => {
        const getU = async() => {
            const r = await axios.get(`/api/user/${username}`)
            const r2 = await axios.get('/api/check')
            const r3 = await axios.get('/api/friends')
            const recieved = await axios.get(`/api/incoming_friend_requests_from/${username}`)
            if (JSON.stringify(r3.data.friends).includes(JSON.stringify(r.data.user)))
                {
                    setButtonState({...buttonState, text: 'Remove Friend', show: true, behavior: "unadd"})
                }
            else
                {
                    //check if outgoing request
                    const outgoing = await axios.get('/api/outgoing_friend_requests')
                    console.log(outgoing.data)
                    if (JSON.stringify(outgoing.data.sent).includes(r.data.user.id))
                    {
                        console.log('already sent')
                        let requestId;
                        outgoing.data.sent.forEach(el => {
                            if (el.to_id == r.data.user.id)
                                requestId = outgoing.data.sent.indexOf(el)
                        })
                        const status = outgoing.data.sent[requestId].status
                        setButtonState({...buttonState, text: "Pending...", disable: true, show: true, behavior: "n"})
                    }
                    else {
                        if (recieved.data.incoming[0] !== undefined) {
                            console.log(recieved.data.incoming[0])
                            setButtonState({...buttonState, text: "Accept Friend Request", show: true, behavior: "acceptRequest", requestId: recieved.data.incoming[0].id})
                        }
                        else if (r.data.user.username === r2.data.user.username) 
                            setButtonState({...buttonState, text: "Edit Account", show: true, behavior: "editAccount"})
                        else
                            setButtonState({...buttonState, text: 'Send Friend Request', show: true, behavior: "sendRequest"})
                    }
                }
            
            setUser(r.data.user)
            setCur(r2.data.user)
        }
        getU()
    }, [])
    const handleClick = async() => {

        console.log(buttonState) //behavior: unadd, n, sendRequest
        if (buttonState.behavior === "unadd") {
            const r = await axios.post('/api/remove_friend', {username})
        }
        else if (buttonState.behavior === "sendRequest") {
            const r = await axios.post('/api/send_friend_request', {username})
        }
        else if (buttonState.behavior === "acceptRequest") {
            const r = await axios.post(`/api/accept_request/${buttonState.requestId}`)
        }
        else if (buttonState.behavior === "editAccount") {
            nav('/edit_account')
        }
        else {
            console.error("INVALID BTN BEHAVIOR " + buttonState.behavior) //behavior
        }
    }  

    async function handleDeclineClick() {
        const r = await axios.post(`/api/decline_request/${buttonState.requestId}`)
    }
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
            //SUBMIT
            // name: req.body.name,
            // time: req.body.time,
            // reciever_user_id: req.body.recieverId,
            // sent_user_id: req.cookies.user.id
            //app.post /create_entry_request
            try {
                const r = await axios.post('/api/create_entry_request', {name: name, time: date, recieverId: user.id})
                console.log(r)
                setPlanner(false)
                setDate('')
                setName('')
                toast.success("Plan request successfully sent!", {position: toast.POSITION.BOTTOM_RIGHT})
            }
            catch (err) {
                toast.error(err.message, {position: toast.POSITION.BOTTOM_RIGHT})
            }
            
        }
    }
    return (
        <>
            <ToastContainer />
            <NavBar />
            <div className={`flex justify-start p-10 flex-col items-center gap-12 my-10 bg-darksmoke mx-80 ${planner ? null : 'h-[84vh]'}`}>
                <img src={user.profilePicture ? user.profilePicture : defaultPic} className="h-56" />
                <h1 className="text-5xl">{username}</h1>
                <div className="flex gap-4 flex-col">
                    {buttonState.show ? 
                    <>
                        <div className="flex gap-4">
                        <button disabled={buttonState.disable} className="btn-default" onClick={() => {handleClick(); window.location.reload()}}>{buttonState.text}</button>
                        {
                            buttonState.behavior === 'acceptRequest' ? 
                            <button className="btn-default" onClick={() => {handleDeclineClick(); window.location.reload()}}>Decline Friend Request</button>
                            :
                            null
                        }
                        {
                            buttonState.behavior === 'unadd' ? <a href='#form'><button className='btn-default' onClick={() => {setPlanner(!planner)}}>Plan with Friend</button></a> : null
                            
                        }
                        </div>
                    </>

                    :
                    null
                    }
                </div>
                {planner ? 
                            <form id='form' className="flex flex-col text-center items-center gap-10 p-4" onSubmit={handleSubmit}>
                                <label>Name for Event</label>
                                <input type='text' className='bg-smoke w-96 h-8 p-2 border rounded-full border-teal' value={name} onChange={(e) => setName(e.target.value)}/>
                                <DateTimePicker date={date} setDate={setDate} />
                                <button type="submit" className='btn-default bg-iris hover:bg-baby text-white'>Confirm Event</button>
                            </form>
                        : null}
            </div>
        </>
    )
}

export default UserProfile