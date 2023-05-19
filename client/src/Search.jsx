import React from 'react'
import axios from 'axios'
import NavBar from './NavBar'
import UserCard from './UserCard'

const Search = () => {
    const [search, setSearch] = React.useState("")
    const [page, setPage] = React.useState(0)
    const [results, setResults] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    React.useEffect(() => {
        const delayDebounceFn = setTimeout(async() => {
            if (search !== "") {
                const r = await axios.post('/api/search', {username: search, page: page})
                setResults(r.data.users)
                setLoading(false)
            }
            else
            {
                setLoading(false)
                setResults([])
            }
        }, 1500)
        return () => clearTimeout(delayDebounceFn)
    }, [search])

    const [show, setShow] = React.useState(false)
    function handleChange(e) {
        setResults([])
        setLoading(true)
        setSearch(e.target.value)
    }
    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center gap-8 justify-center h- p-10">
                <h1 className='text-5xl'>Search Users</h1>
                <input type="text" value={search} placeholder='Search...' onChange={handleChange} className="bg-input w-96 h-8 p-2 border rounded-full border-teal" />
                <div className="flex flex-col gap-4 w-[50vw] items-center">
                    {loading ? <div className="w-16 h-16 border border-x-iris border-y-smoke rounded-full animate-spin" /> : null}
                    {results.map(el => <UserCard key={el.id} user={el}/>)}
                </div>
            </div>
        </>
    )
}

export default Search