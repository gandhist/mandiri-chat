import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import { Link } from 'react-router-dom';
import { API_URL } from '../../config/api';
import useToken from '../../utils/useToken';


const Login = () => {
    // const lokation = useLocation();
    // const { email, password } = lokation.state
    const history = useHistory()
    const { setToken } = useToken()

    const [login, setLogin] = useState({
        username: '',
        password: ''
    })

    const handleOnChange = (key, value) => {
        setLogin({ ...login, [key]: value })
    }

    const handleLogin = (e) => {
        e.preventDefault()
        fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(login)
        }).then(res => res.json())
            .then((res) => {
                if (res.status) {
                    setToken(res.data)
                    history.replace('/chat')
                } else {
                    alert(res.message)
                }
            })
            .catch((err) => {
                console.log('err', err)
            })
    }
    return (
        <div style={{ height: "100vh", background: "#2d405f" }}>

            <div className="d-flex align-items-center flex-column justify-content-center h-100 bg-secondary text-white">
                <div className="card text-white bg-dark mb-3" style={{ maxWidth: '18rem' }}>
                    <div className="card-header">Login</div>
                    <div className="card-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Userlogin</label>
                                <input type="text" className="form-control" id="username" name="username" value={login.username} onChange={e => handleOnChange(e.target.name, e.target.value)} />
                                <div id="emailHelp" className="form-text">We'll <strike>never ever over</strike> share your email with anyone else.</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label"  >Password</label>
                                <input type="password" className="form-control" id="password" name="password" value={login.password} onChange={e => handleOnChange(e.target.name, e.target.value)} />
                            </div>
                            <div className="d-flex justify-content-evenly">
                                <button type="submit" onClick={handleLogin} className="btn btn-primary">Sign In</button>
                                <Link to="/register" className="link-info">Join us</Link>
                            </div>
                        </form>
                    </div>
                </div>



            </div>
        </div>

    )
}

export default Login
