import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { UiActions } from "../store/ui-slice";
import { useState } from "react";

import axios from "axios";


const AddElectionModal = () => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [thumbnail, setThumbnail] = useState('')
    const [error, setError] = useState('')


    const token = useSelector(state => state?.vote?.currentVoter.token)
    const {currentVoter} = useSelector(state => state.vote)


    const closeElectionModalHandler = () => {
        dispatch(UiActions.closeElectionModal())
    }

    const createElection = async (e) => {
        e.preventDefault()        
        try {
            const electionData = new FormData();
            electionData.set('title', title);
            electionData.set('description', description);
            electionData.set('thumbnail', thumbnail)
            electionData.set('currentVoter', currentVoter.id)
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/elections`, electionData, {
                withCredentials: true, headers: {Authorization: `Bearer ${token}`}
            })
            console.log(response)
            closeElectionModalHandler()
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
                <h4>Create New Election</h4>
                <button className="modal__close" onClick={closeElectionModalHandler}>
                    <IoMdClose />
                </button>
            </header>
            <form onSubmit={createElection}  encType="multipart/form-data" >
                <div>
                    <h6>Election Title:</h6>
                    <input type="text" name="title" onChange={e => setTitle(e.target.value)} />
                </div>
                <div>
                    <h6>Election Description:</h6>
                    <input type="text" name="description" onChange={e => setDescription(e.target.value)} />
                </div>
                <div>
                    <h6>Election Thumbnail:</h6>
                    <input type="file" onChange={e => setThumbnail(e.target.files[0])} accept="png, jpg, jpeg" />
                </div>
                <button type="submit" className='btn primary'>Submit</button>
            </form>
        </div>
    </section>
  )
}

export default AddElectionModal