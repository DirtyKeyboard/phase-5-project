import React from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import dayjs from 'dayjs'

const DateTimePicker = ({date, setDate}) => {
    // const [date, setDate] = useState(null);
    const today = new Date()
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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