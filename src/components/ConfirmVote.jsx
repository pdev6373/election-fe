import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { UiActions } from '../store/ui-slice'
import Loader from '../components/Loader'
import axios from 'axios'
import { voteActions } from '../store/vote-slice'

const ConfirmVote = ({id, presidents}) => {
  const dispatch = useDispatch()
  const [modalCandidate, setModalCandidate] = useState({})
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector(state => state?.vote?.currentVoter?.token)
  
  const selectedCandidate = useSelector(state => state.vote.selectedVoteCandidate)
  const currentVoter = useSelector(state => state.vote.currentVoter)
  const currentVoterId = useSelector(state => state.vote.currentVoter.id)
  const selectedElection = useSelector(state => state.vote.selectedElection);
  

  const closeCandidateModal = () => {
    dispatch(UiActions.closeVoteCandidateModal())
  }

  const fetchCandidate = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/candidates/${selectedCandidate}`,  {withCredentials: true, headers: {Authorization: `Bearer ${token}`}});
      setModalCandidate(await response.data)
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false)
  }



  const confirmVote = async () => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_URL}/candidates/${selectedCandidate}`, {currentVoterId, selectedElection}, {
        withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
        const voteResult = await response.data;
        dispatch(voteActions.changeCurrentVoter({...currentVoter, votedElections: voteResult}))
        // manually change path to congrats (since this confirmVote component isn't part of the react router routes, we can't use useNavigate)
        window.location.href = `${process.env.REACT_APP_CLIENT_URL}/congrats`
    } catch (error) {
      console.log(error)
    }
    closeCandidateModal()
  }



  useEffect(() => {
    fetchCandidate()
  }, [])




  return (
    <section className="modal">
        <div className="modal__content confirm__vote-content">
          {isLoading && <Loader />}
            <h5>Please confirm your vote</h5>
            <div className="confirm__vote-image">
                <img src={modalCandidate.image} alt={modalCandidate.fullName} />
            </div>
            <h2>{modalCandidate.fullName?.length > 17 ? modalCandidate.fullName?.substring(0, 17) + '...' : modalCandidate.fullName}</h2>
            <p>{modalCandidate.motto?.length > 45 ? modalCandidate.motto?.substring(0, 45) + '...' : modalCandidate?.motto}</p>
            <div className="confirm__vote-cta">
                <button className="btn" onClick={closeCandidateModal}>Cancel</button>
                <button className="btn primary" onClick={confirmVote}>Confirm</button>
            </div>
        </div>
    </section>
  )
}

export default ConfirmVote