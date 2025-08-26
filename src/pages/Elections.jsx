import React, { useEffect, useState } from 'react';
import Election from '../components/Election';
import { useDispatch, useSelector } from 'react-redux';
import { UiActions } from '../store/ui-slice';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import Loader from '../components/Loader';

const Elections = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const token = useSelector((state) => state?.vote?.currentVoter?.token);

  // ACCESS CONTROL
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, []);

  const isAdmin = useSelector((state) => state?.vote?.currentVoter?.isAdmin);

  const showElectionModalHandler = () => {
    dispatch(UiActions.openElectionModal());
  };

  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getElections = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/elections`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setElections(response.data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getElections();
  }, []);

  return (
    <div
      className="elections"
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
      }}
    >
      <div
        className="container elections__container"
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <header className="elections__header">
          <h1>Ongoing Elections</h1>
          {isAdmin && (
            <button className="btn primary" onClick={showElectionModalHandler}>
              Create New Election
            </button>
          )}
        </header>
        {isLoading ? (
          <Loader />
        ) : (
          <menu
            className="elections__menu"
            style={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {elections?.length ? (
              elections.map(({ _id: id, title, thumbnail, description }) => (
                <Election
                  key={id}
                  id={id}
                  title={title}
                  thumbnail={thumbnail}
                  description={description}
                />
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
                  No ongoing election
                </p>
              </div>
            )}
          </menu>
        )}
      </div>
    </div>
  );
};

export default Elections;
