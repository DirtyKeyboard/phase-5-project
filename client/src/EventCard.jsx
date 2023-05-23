import React from 'react'
import moment from 'moment'
import { Modal } from '@mui/material'
import axios from 'axios'

const EventCard = ({el, toast, ops, setOps, timeZone}) => {
    function convert(input) {
        return moment(input).tz(timeZone).format('hh:mm A')
    }
    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    function handleModal(e, id) {
        e.stopPropagation()
        handleOpen()
    }
    async function handleDel(e) {
        handleClose()
        try {
            const r = await axios.delete(`/api/delete_event/${ops}`)
            window.location.reload()
        }
        catch (err) {
            toast.error('Event could not be deleted, please try again.', {position: toast.POSITION.BOTTOM_RIGHT})
        }
        
    }
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
        <div key={el.id} className="text-slate-600 rounded-full text-lg bg-smoke font-bold w-[stretch] hover:cursor-pointer hover:bg-slate-200 transition-all ease-in-out duration-200" onClick={() => {
            if (ops !== el.id)
                setOps(el.id)
            else
                setOps(-1)
            }}>
                <h1>{el.name}</h1>
                <h1>{convert(el.time)}</h1>
                {ops === el.id ?
                <button className="w-6 h-6 bg-red-500 hover:bg-red-700 transition-all ease-in-out duration-200 text-white rounded-full"
                onClick={(e) => handleModal(e, el.id)}>X</button> 
                : null}
                
            </div>
        </>
    )
}

export default EventCard