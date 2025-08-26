import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ResultElection from '../components/ResultElection';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Results = () => {
  const [elections, setElections] = useState([]);

  const navigate = useNavigate();

  const token = useSelector((state) => state?.vote?.currentVoter?.token);

  // ACCESS CONTROL
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, []);

  // GET ALL ELECTIONS from database
  const getElections = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/elections`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const elections = await response.data;
      setElections(elections);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getElections();
  }, []);

  return (
    <section
      className="results"
      style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        className="container results__container"
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {elections?.length ? (
          elections.map((election) => (
            <ResultElection key={election._id} {...election} />
          ))
        ) : (
          <div
            style={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <p
              style={{
                fontWeight: '600',
                fontSize: 18,
              }}
            >
              No election result
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Results;
