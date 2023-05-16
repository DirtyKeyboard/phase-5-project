import React from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import dayjs from 'dayjs'
import { useState } from 'react'

const DateTimePicker = () => {
    const [date, setDate] = useState(null);
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <div className="flex flex-col gap-8 justify-center">
                    <DatePicker label="Date" value={date} onChange={(e) => { setDate(e) }} />
                    <StaticTimePicker onAccept={() => alert('hi')} orientation="landscape" value={date} onChange={(e) => { setDate(e); console.log(date) }} />
                </div>
            </DemoContainer>
        </LocalizationProvider>
    )
}

export default DateTimePicker