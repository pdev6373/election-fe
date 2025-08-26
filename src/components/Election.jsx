import React from 'react'
import {Link} from 'react-router-dom'
import { UiActions } from '../store/ui-slice';
import { useDispatch, useSelector } from 'react-redux';
import { voteActions } from '../store/vote-slice';

const Election = ({id, title, description, thumbnail}) => {
  const dispatch = useDispatch()

  const openModal = (id) => {
    dispatch(UiActions.openUpdateElectionModal())
    dispatch(voteActions.changeIdOfElectionToUpdate(id))
  }

  const isAdmin = useSelector(state => state?.vote?.currentVoter?.isAdmin)

  return (
    <article className="election">
        <div className="election__image">
            <img src={thumbnail} alt="Chinese Flag" />
        </div>
        <div className="election__info">
            <Link to={`/election-details/${id}`}><h4>{title}</h4></Link>
            <p>{description?.length > 255 ? description.substring(0, 255) + '...' : description}</p>
            <div className="election__cta">
                <Link to={`/election-details/${id}`} className="btn sm">View</Link>
                {isAdmin && <button className="btn sm primary" onClick={() => openModal(id)}>Edit</button>}
            </div>
        </div>
    </article>
  )
}

export default Election