import React, { useEffect, useState } from 'react';
import { IoAddOutline } from 'react-icons/io5';
import ElectionCandidate from '../components/ElectionCandidate';
import { UiActions } from '../store/ui-slice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { voteActions } from '../store/vote-slice';
import Loader from '../components/Loader';

import axios from 'axios';

const ElectionDetails = () => {
  const dispatch = useDispatch();
  const [currentElection, setCurrentElection] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const token = useSelector((state) => state?.vote?.currentVoter?.token);

  // ACCESS CONTROL
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, []);

  const [voters, setVoters] = useState([]);
  const { isAdmin } = useSelector((state) => state.vote.currentVoter);

  const [candidates, setCandidates] = useState([]);

  const { id } = useParams();

  const openModal = () => {
    dispatch(UiActions.openAddCandidateModal());
  };

  // get the current election from db
  const getElection = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/elections/${id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCurrentElection(response.data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  // get the candidates that belongs to this election
  const getCandidates = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/elections/${id}/candidates`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const candidates = await response.data;
      setCandidates(candidates);
    } catch (error) {
      console.log(error);
    }
  };

  // get the voters of this election
  const getVoters = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/elections/${id}/voters`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setVoters(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // function to delete election from db
  const deleteElection = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/elections/${id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      navigate('/elections');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getElection();
    getCandidates();
    getVoters();
    dispatch(voteActions.changeAddCandidateElectionId(id));
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <section className="electionDetails">
          <div className="container electionDetails__container">
            {isLoading && <Loader />}
            <h2>{currentElection.title}</h2>
            <p>{currentElection.description}</p>
            <div className="electionDetails__image">
              <img src={currentElection.thumbnail} alt="Chinese Flag" />
            </div>

            <div className="electionDetails__candidates">
              {candidates.map((candidate) => (
                <ElectionCandidate
                  key={candidate._id}
                  {...candidate}
                  isAdmin={isAdmin}
                />
              ))}
              {isAdmin && (
                <button className="add__candidate-btn" onClick={openModal}>
                  <IoAddOutline />
                </button>
              )}
            </div>

            <article className="voters">
              <h2>Voters</h2>
              <table className="voters__table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {voters.map((voter) => (
                    <tr className="voter" key={voter._id}>
                      <td>
                        <h5>{voter.fullName.split(' ')[0].slice(0, 3)}...</h5>
                      </td>
                      <td>
                        <small>{voter.updatedAt}</small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>

            {isAdmin && (
              <button className="btn danger full" onClick={deleteElection}>
                Delete Election
              </button>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default ElectionDetails;
