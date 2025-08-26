import React, { useEffect } from 'react'
import Image from '../assets/404.gif'
import { useNavigate } from 'react-router-dom'

const ErrorPage = () => {
    const navigate = useNavigate()

    useEffect(() => {
        // redirect to results page after 6 seconds
        setTimeout(() => {
            navigate('/results')
        }, 6000);
    }, [])




  return (
    <section className="errorPage">
        <div className="errorPage__container">
            <img src={Image} alt="Page Not Found" />
            <h1>404</h1>
            <p>This page does not exist. You will be redirected home shortly.</p>
        </div>
    </section>
  )
}

export default ErrorPage