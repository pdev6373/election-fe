import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {voteActions} from '../store/vote-slice'



const Logout = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(voteActions.changeCurrentVoter(null))
        localStorage.removeItem('currentUser');
        navigate('/')
    }, [])
    const navigate = useNavigate()
  return (
    <div></div>
  )
}

export default Logout