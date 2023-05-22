import React from 'react'
import EventCard from './EventCard'

const DayCard = ({date, events, toast, ops, setOps}) => {
    return (
        <div className='flex items-center gap-2 flex-col rounded-xl p-4 h-96 w-60 bg-teal text-smoke text-3xl font-bold shadow-lg'>
            <h1>{date}</h1>
            {events.length > 0 ? 
            events.map(el => (
            <EventCard key={el.id} toast={toast} el={el} ops={ops} setOps={setOps}/>
            ))
            :
            <h1>No Events</h1>}
        </div>
    )
}

export default DayCard