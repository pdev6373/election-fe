import React, { useEffect, useState } from 'react'
import Candidate from '../components/Candidate'
import axios from 'axios'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { voteActions } from '../store/vote-slice'


const GetCandidates = () => {
  const [candidates, setCandidates] = useState([])
  const {id} = useParams()

  const navigate = useNavigate()
    
  const token = useSelector(state => state?.vote?.currentVoter?.token)

  // ACCESS CONTROL
  useEffect(() => {
    if(!token) {
      navigate('/')
    }
  }, [])
    
  
  const dispatch = useDispatch()
  dispatch(voteActions.changeSelectedElection(id))

  const selectedElection = useSelector(state => state.vote.selectedElection)
  const {id: currentVoter} = useSelector(state => state.vote.currentVoter)

  const [canVote, setCanVote] = useState(true)
  
  

  // that belong to 1 particular elections
  const getCandidates = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections/${id}/candidates`,  {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
      setCandidates(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  
  // check if user has already voted
  const getUser = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/voters/${currentVoter}`, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
      const userElection = await response.data.votedElections;
      if(userElection.includes(selectedElection)) {
        setCanVote(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCandidates();
    getUser()
  }, [])


  return (
    <section className="candidates">
      {!canVote ? <header className="candidates__header">
              <h1>Already voted!</h1>
              <p>You are only permitted to vote once in this election. Please vote in another election or sign out.</p>
              <Link to="/results" className='btn primary'>Check Results</Link>
            </header> : <>
          {candidates.length > 0 ? <header className="candidates__header">
              <h1>vote your candidate</h1>
              <p>These are the candidates for this election. Please vote once and wisely, because you won't be allowed to vote in this election again. </p>
            </header> : <header className="candidates__header">
              <h1>Inactive Election</h1>
              <p>There are no candidates found for this election. Please check back later.</p>
            </header> }
          <div className="container candidates__container">
            {
              candidates.map(candidate => <Candidate key={candidate._id} {...candidate} />)
            }
          </div>
        </>}
        
            
    </section>
  )
}

export default GetCandidates