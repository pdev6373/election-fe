import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { UiActions } from "../store/ui-slice"
import { useEffect, useState } from "react";

import axios from "axios";


const UpdateElectionModal = () => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [thumbnail, setThumbnail] = useState('')
    const [error, setError] = useState('')

    const electionToUpdate = useSelector(state => state.vote.idOfElectionToUpdate)


    const token = useSelector(state => state?.vote?.currentVoter?.token)

    const closeElectionModalHandler = () => {
        dispatch(UiActions.closeUpdateElectionModal())
    }

    

  
  const fetchElection = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections/${electionToUpdate}`, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
      const election = await response.data;
      setTitle(election.title)
      setDescription(election.description)
    } catch (error) {
      console.log(error)
    }
}

useEffect(() => {
    fetchElection()
}, [])


const updateElection = async (e) => {
    e.preventDefault()

    const electionData = new FormData();
    electionData.set('title', title);
    electionData.set('description', description);
    electionData.set('thumbnail', thumbnail)

    try {
        const response = await axios.patch(`${process.env.REACT_APP_API_URL}/elections/${electionToUpdate}`, electionData, {
            withCredentials: true, headers: {Authorization: `Bearer ${token}`}
        })
        window.location.href = `${process.env.REACT_APP_CLIENT_URL}/elections`
    } catch (err) {
        if(err.response.data.message === "TypeError: Cannot read properties of null (reading 'thumbnail')") {
            setError("Please choose a thumbnail")
        } else {
            setError(err.response.data.message);
        }
    }
}




  return (
    <section className="modal">
        <div className="modal__content">
            <header className='modal__header'>
                <h4>Update Election</h4>
                <button className="modal__close" onClick={closeElectionModalHandler}>
                    <IoMdClose />
                </button>
            </header>
            <form onSubmit={updateElection}  encType="multipart/form-data" >
                <div>
                    <h6>Election Title:</h6>
                    <input type="text" value={title} name="title" onChange={e => setTitle(e.target.value)} />
                </div>
                <div>
                    <h6>Election Description:</h6>
                    <input type="text" value={description} name="description" onChange={e => setDescription(e.target.value)} />
                </div>
                <div>
                    <h6>Election Thumbnail:</h6>
                    <input type="file" onChange={e => setThumbnail(e.target.files[0])} accept="png, jpg, jpeg" />
                </div>
                <button type="submit" className='btn primary'>Update Election</button>
            </form>
        </div>
    </section>
  )
}

export default UpdateElectionModal