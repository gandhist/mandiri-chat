import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom';
import { API_URL } from '../../config/api';


const Register = () => {

    const history = useHistory()

    const [register, setRegister] = useState({
        name: '',
        email: '',
        no_hp: '',
        tipe_user: 'peserta',
        picture: 'https://assets.chucknorris.host/img/avatar/chuck-norris.png',
        password: ''
    })

    const handleOnChange = (key, value) => {
        setRegister({ ...register, [key]: value })
    }

    const handleRegister = (e) => {
        e.preventDefault()
        fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(register)
        }).then(res => res.json())
            .then((res) => {
                if (res.status) {
                    history.push({ pathname: '/login', state: register }) // bring the old value
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
                    <div className="card-header">Register to begin chat</div>
                    <div className="card-body">
                        <form onSubmit={handleRegister} >
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Nama</label>
                                <input type="text" required className="form-control" id="name" name="name" value={register.name} onChange={e => handleOnChange(e.target.name, e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" required aria-describedby="emailHelp" className="form-control" id="email" name="email" value={register.email} onChange={e => handleOnChange(e.target.name, e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="no_hp" className="form-label">No HP</label>
                                <input type="number" className="form-control" id="no_hp" name="no_hp" value={register.no_hp} onChange={e => handleOnChange(e.target.name, e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label"  >Password</label>
                                <input type="password" required className="form-control" id="password" name="password" value={register.password} onChange={e => handleOnChange(e.target.name, e.target.value)} />
                            </div>
                            <div className="d-flex justify-content-evenly">
                                <button type="submit" className="btn btn-primary">Register</button>
                                <Link to="/login" className="link-info">Already have account?</Link>
                            </div>
                        </form>
                    </div>
                </div>



            </div>
        </div>
    )
}

export default Register
