import React from 'react'
const UserContext = React.createContext(null)
export const useUserContext = () => React.useContext(UserContext)

const UserProvider = ({children}) => {
    const [user, setUser] = React.useState(null)
    return <UserContext.Provider value={[user, setUser]}>{children}</UserContext.Provider>
}


export default UserProvider