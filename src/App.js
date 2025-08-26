import React from 'react'
import { useSelector } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import RootLayout from './pages/RootLayout'
import Results from './pages/Results'
import AddCandidateModal from './components/AddCandidateModal'
import Congrats from './pages/Congrats'
import ConfirmVote from './components/ConfirmVote'
import Elections from './pages/Elections'
import ElectionDetails from './pages/ElectionDetails'
import AddElectionModal from './components/AddElectionModal'
import Login from './pages/Login'
import Register from './pages/Register'
import UpdateElectionModal from './components/UpdateElectionModal'
import Candidates from './pages/Candidates'
import Logout from './pages/Logout';
import ErrorPage from './pages/ErrorPage';



const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "results",
        element: <Results />
      },
      {
        path: "elections/:id/candidates",
        element: <Candidates />
      },
      {
        path: 'congrats',
        element: <Congrats />
      },
      {
        path: 'elections',
        element: <Elections />
      },
      {
        path: 'election-details/:id',
        element: <ElectionDetails />
      },
      {
        path: '/logout',
        element: <Logout />
      }
    ]
  }
])


const App = () => {
  const addCandidateModalShowing = useSelector(state => state.ui.addCandidateModalShowing)
  const voteCandidateModalShowing = useSelector(state => state.ui.voteCandidateModalShowing)
  const electionModalShowing = useSelector(state => state.ui.electionModalShowing)
  const updateElectionModalShowing = useSelector(state => state.ui.updateElectionModalShowing)

  return (
    <>
      <RouterProvider router={router} />
      {addCandidateModalShowing && <AddCandidateModal />}
      {voteCandidateModalShowing &&<ConfirmVote />}
      {electionModalShowing && <AddElectionModal />}
      {updateElectionModalShowing && <UpdateElectionModal />}
    </>
  )
}

export default App