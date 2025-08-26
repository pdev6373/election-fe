import React, { useState } from 'react'
import { IoMdTrash } from "react-icons/io";
import axios from 'axios';
import { useSelector } from 'react-redux';


const ElectionCandidate = ({fullName, image, motto, _id: id, isAdmin}) => {

  const addCandidateElectionId = useSelector(state => state?.vote.addCandidateElectionId);

  const token = useSelector(state => state?.vote?.currentVoter?.token)

  const deleteCandidate = async () => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/candidates/${id}`, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}});
      const removedCandidate = await response.data;
      window.location.href = `${process.env.REACT_APP_CLIENT_URL}/election-details/${addCandidateElectionId}`
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <article className="electionCandidate">
        <div className="electionCandidate__image">
            <img src={image} alt="John Dramani Mahama" />
        </div>
        <div>
            <h5>{fullName}</h5>
            <small>{motto.length > 34 ? motto.substring(0, 34) + "..." : motto}</small>
            {isAdmin && <button className="electionCandidate__btn" onClick={deleteCandidate}><IoMdTrash /></button>}
        </div>
    </article>
  )
}

export default ElectionCandidate