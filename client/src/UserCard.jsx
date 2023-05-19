import React from 'react'
import defPic from './assets/user.png'
import {useNavigate} from 'react-router-dom'

function checkIfImageExists(url) {
    const img = new Image();
    img.src = url;

    if (img.complete) {
        return true;
    } else {
        img.onload = () => {
            return true;
        };

        img.onerror = () => {
            return false;
        };
    }
}

const UserCard = ({ user }) => {
    const nav = useNavigate()
    return (
        <div onClick={() => nav(`/users/${user.username}`)}
        className="flex gap-4 bg-darksmoke rounded-full w-[stretch] hover:bg-slate-300 hover:cursor-pointer shadow-md hover:translate-y-1 transition-all ease-in-out duration-200">
            <img className="w-16 h-16 rounded-full" src={checkIfImageExists(user.profilePicture) ? user.profilePicture : defPic} />
            <h1 className="text-2xl self-center ml-4">{user.username}</h1>
        </div>
    )
}

export default UserCard