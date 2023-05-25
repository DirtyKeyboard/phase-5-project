import React from 'react'
import EventCard from './EventCard'
import moment from 'moment-timezone'

const DayCard = ({date, events, toast, ops, setOps, timeZone, allPlans, setAllPlans}) => {
    return (
        <div className='flex items-center gap-2 flex-col rounded-xl p-4 h-96 w-60 bg-teal text-smoke text-3xl font-bold shadow-lg'>
            <h1>{moment(new Date(date)).format('dddd')}</h1>
            <h1>{date}</h1>
            {events.length > 0 ? 
                <div className={`flex items-center gap-2 flex-col p-4 h-96 w-60 ${events.length > 3 ? 'overflow-y-scroll' : null}`}>
                    {events.map(el => (
                    <EventCard key={el.id} toast={toast} el={el} ops={ops} setOps={setOps} timeZone={timeZone} allPlans={allPlans} setAllPlans={setAllPlans}/>
                    ))}
                </div>
            :
            <h1>No Events</h1>}
        </div>
    )
}

export default DayCard