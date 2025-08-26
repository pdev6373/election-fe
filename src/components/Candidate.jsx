import React from 'react'
import { useDispatch } from 'react-redux'
import { UiActions } from '../store/ui-slice'
import { voteActions } from '../store/vote-slice'



const Candidate = ({_id: id, fullName, image, motto}) => {
  const dispatch = useDispatch()

  const openModal = () => {
    dispatch(UiActions.openVoteCandidateModal())
    dispatch(voteActions.changeSelectedVoteCandidate(id));
  }



  return (
    <article className='candidate'>
        <div className="candidate__image">
            <img src={image} alt="" />
        </div>
        <h5>{fullName?.length > 20 ? fullName.substring(0, 20) + '...' : fullName}</h5>
        <small>{motto?.length > 25 ? motto.substring(0, 25) + '...' : motto}</small>
        <button className='btn primary' onClick={openModal}>Vote</button>
    </article>
  )
}

export default Candidate