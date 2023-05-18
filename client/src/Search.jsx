import React from 'react'
import axios from 'axios'
import NavBar from './NavBar'

const Search = () => {
    return (
        <>
            <NavBar />
            <div className="flex justify-center w-full h-full p-10">
            <input type="text" className="bg-input" />
                <div className="bg-iris w-16 h-16">

                </div>
            </div>
        </>
    )
}

export default Search