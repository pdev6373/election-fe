import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { voteActions } from '../store/vote-slice'
import axios from 'axios'

const Login = () => {
    const [userData, setUserData] = useState({email: "", password: ""})
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()


    // function that communicates with our api to login user
    const loginUser = async (e) => {
        e.preventDefault();
       try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/voters/login`, userData)
        const newUser = await response.data;
        if(newUser) {
            // store new user in local storage and in redux store
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            dispatch(voteActions.changeCurrentVoter(newUser))
        } else {
            setError("Coundn't login user. Please try again.")
        }
        navigate('/results')
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
            <h2>Sign In</h2>
            <form onSubmit={loginUser}>
                {error && <p className='form__error-message'>{error}</p>}
                <input type="email" name='email' placeholder='Email' onChange={changeInputHandler} autoFocus />
                <input type="password" name='password' placeholder='Password' onChange={changeInputHandler} />
                <p>Don't have an account? <Link to="/register">Sign up</Link></p>
                <button type="submit" className='btn primary'>Login</button>
            </form>
        </div>
    </section>
  )
}

export default Login