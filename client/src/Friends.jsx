import React from 'react'
import NavBar from './NavBar'
import UserCard from './UserCard'
import axios from 'axios'

const Friends = () => {
    const [results, setResults] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    React.useEffect(() => {
        async function getFriends() {
            const r = await axios.get('/api/friends')
            setResults(r.data.friends)
            setLoading(false)
        }
        getFriends()
    }, [])
    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center gap-8 justify-center h- p-10">
                <h1 className='text-5xl'>Your Friends</h1>
                <div className="flex flex-col gap-4 w-[50vw] items-center">
                    {loading ? <div className="w-16 h-16 border border-x-iris border-y-smoke rounded-full animate-spin" /> : null}
                    {results.map(el => <UserCard key={el.id} user={el}/>)}
                </div>
            </div>
        </>
    )
}

export default Friends