import React from 'react'
import NavBar from './NavBar'
import {useParams} from 'react-router-dom'
import axios from 'axios'

const UserProfile = () => {
    const {username} = useParams()
    const [user, setUser] = React.useState({})
    const [cur, setCur] = React.useState({})
    const [buttonState, setButtonState] = React.useState({text: "", disable: false, show: false, behavior: ""})

    React.useEffect(() => {
        const getU = async() => {
            const r = await axios.get(`/api/user/${username}`)
            const r2 = await axios.get('/api/check')
            const r3 = await axios.get('/api/friends')
            console.log(r3.data)
            const recieved = await axios.get('/api/incoming_friend_requests')

            if (JSON.stringify(r3.data.friends).includes(JSON.stringify(r.data.user)))
                {
                    setButtonState({text: 'Remove Friend', show: true, behavior: "unadd"})
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
                        setButtonState({text: "Pending...", disable: true, show: true, behavior: "n"})
                    }
                    else {
                        if (recieved.data.incoming[0] !== undefined) {
                            setButtonState({text: "Accept Friend Request", show: true, behavior: "acceptRequest", requestId: recieved.data.incoming[0].id})
                        }
                        else {
                            setButtonState({text: 'Send Friend Request', show: true, behavior: "sendRequest"})
                        }
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
            setButtonState({text: 'Send Friend Request', show: true, behavior: "sendRequest"})
        }
        else if (buttonState.behavior === "sendRequest") {
            const r = await axios.post('/api/send_friend_request', {username})
            setButtonState({text: "Pending...", disable: true, show: true, behavior: "n"})
        }
        else if (buttonState.behavior === "acceptRequest") {
            console.log(buttonState)
            const r = await axios.post(`/api/accept_request/${buttonState.requestId}`)
            console.log(r.data)
        }
        else {
            console.error("INVALID BTN BEHAVIOR " + buttonState.behavior) //behavior
        }

    }  
    return (
        <>
            <NavBar />
            <div className="flex justify-start p-10 flex-col items-center gap-12 my-10 bg-darksmoke mx-80 h-[84vh]">
                <img src={user.profilePicture} className="h-56" />
                <h1 className="text-5xl">{username}</h1>
                <div className="flex gap-4">
                    {buttonState.show ? 

                        <button disabled={buttonState.disable} className="btn-default" onClick={handleClick}>{buttonState.text}</button>

                    :
                    null
                    }
                    
                    
                    {/* <> DEBUGGING BUTTONS */}
                        {/* <button className="btn-default bg-green-200" onClick={async() => {
                            const r = await axios.post('/api/send_friend_request', {username})
                            console.log(r.data)
                        }}>send fr req</button>

                        <button className="btn-default bg-green-200" onClick={async() => {
                            await axios.post('/api/force_add', {username})
                        }}>force add</button>

                        <button className="btn-default bg-green-200" onClick={async() => {
                            await axios.post('/api/remove_friend', {username})
                        }}>unadd</button>
                    </> DEBUGGING BUTTONS */}
                </div>
            </div>
        </>
    )
}

export default UserProfile