import React from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import dayjs from 'dayjs'

import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

const DateTimePicker = ({date, setDate, tz}) => { 
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault(tz);
    const today = new Date()
    return (
        <LocalizationProvider dateLibInstance={dayjs.tz} dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <div className="flex flex-col gap-8 justify-center">
                    <DatePicker minDate={dayjs(today)} sx={{bgcolor: '#F1EEEE'}} label="Date" value={date} onChange={(e) => { setDate(e) }} />
                    <StaticTimePicker minutesStep={5} sx={{bgcolor: '#F1EEEE'}} orientation="landscape" value={date} onChange={(e) => { setDate(e) }} />
                </div>
            </DemoContainer>
        </LocalizationProvider>
    )
}

export default DateTimePicker