import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'


const Register = () => {
    const [userData, setUserData] = useState({fullName: "", email: "", password: "", password2: ""})
    const [error, setError] = useState('')
    const navigate = useNavigate()

    // function that communicates with our api to register a new user
    const registerUser = async (e) => {
        e.preventDefault();
       try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/voters/register`, userData)
        const newUser = await response.data;
        if(!newUser) {
            setError(newUser.data.message)
        }
        navigate('/')
       } catch (err) {
        // catch any failed feedback and show as error
        setError(err.response.data.message);
       }
    }


    // function to changes our controlled form inputs
    const changeInputHandler = (e) => {
        setUserData(prevState => {
            return {...prevState, [e.target.name]: e.target.value}
        })
    }



  return (
    <section className="register">
        <div className="container register__container">
            <h2>Sign Up</h2>
            <form onSubmit={registerUser}>
                {error && <p className='form__error-message'>{error}</p>}
                <input type="text" name='fullName' placeholder='Full Name' onChange={changeInputHandler} autoComplete='true' autoFocus />
                <input type="email" name='email' placeholder='Email' onChange={changeInputHandler} autoComplete='true' />
                <input type="password" name='password' placeholder='Password' onChange={changeInputHandler}  />
                <input type="password" name='password2' placeholder='Confirm Password' onChange={changeInputHandler}  />
                <p>Already have an account? <Link to="/">Sign in</Link></p>
                <button type="submit" className='btn primary'>Register</button>
            </form>
        </div>
    </section>
  )
}

export default Register