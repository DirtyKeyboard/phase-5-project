import React from 'react'
import moment from 'moment-timezone'
import { Modal } from '@mui/material'
import axios from 'axios'

const EventListCard = ({event, tz, delb, setDelb, setAllPlans, allPlans, toast}) => {
    function convert(input) {
        return moment(input).tz(tz).format('dddd, MM/DD/YYYY, h:mm A')
    }
    function handleModal(e) {
        e.stopPropagation()
        handleOpen()
    }
    function makeEndTime() {
        const d = moment(event.time).tz(tz)
        d.add(event.hours, 'hours')
        d.add(event.minutes, 'minutes')
        return d.format('h:mm A')
    }
    async function handleDel() {
        const r = await axios.delete(`/api/delete_event/${event.id}`)
        const newPlans = allPlans.filter(el => el.id !== event.id)
        setAllPlans(newPlans)
        setDelb(null)
        toast.success("Plan deleted successfully!", {position: toast.POSITION.BOTTOM_RIGHT})
        handleClose()
    }
    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <>
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
                <div className="flex gap-4 flex-col justify-center items-center h-screen text-center">
                    <h1 className="text-6xl text-white">Are you sure you want to delete this event?</h1>
                    <div className='flex gap-4'>
                        <button className="btn-default w-32" onClick={handleDel}>Yes</button>
                        <button className="btn-default w-32" onClick={handleClose}>No</button>
                    </div>
                </div>
                
            </Modal>
            <div onClick={()=> {
                if (delb === event.id)
                    setDelb(null)
                else
                    setDelb(event.id)
                }} className='flex bg-teal text-white font-bold h-10 items-center text-2xl rounded-full justify-center hover:bg-slate-300 transition-all hover:cursor-pointer'>
                <h1>{event.name}, {convert(event.time)} - {makeEndTime()}</h1>
                {delb === event.id ?
                <button onClick={handleModal} className="ml-20 w-4 h-4 flex justify-center items-center bg-red-500 p-4 rounded-full hover:scale-95 hover:bg-red-700 transition-all ease-in-out duration-200">X</button>
                : null}
            </div>
        </>
    )
}

export default EventListCard