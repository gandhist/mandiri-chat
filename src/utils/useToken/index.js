import { useState } from 'react'

const useToken = () => {
    const getToken = () => {
        const tokenString = localStorage.getItem('userlogin');
        const userToken = JSON.parse(tokenString);
        return userToken?.token
    }
    const [token, setToken] = useState(getToken())

    const storeToken = (userToken) => {
        localStorage.setItem('userlogin', JSON.stringify(userToken))
        setToken(userToken.token)
    }


    return {
        setToken: storeToken,
        token
    }
}

export default useToken
