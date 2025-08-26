import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { UiActions } from "../store/ui-slice";
import { useState } from "react";
import axios from 'axios'


const Modal = () => {
    const dispatch = useDispatch();

    const addCandidateElectionId = useSelector(state => state?.vote?.addCandidateElectionId)
    const currentVoter = useSelector(state => state?.vote?.currentVoter)

    const [fullName, setFullName] = useState('')
    const [motto, setMotto] = useState('')
    const [image, setImage] = useState('')
    const [error, setError] = useState('')

    const token = useSelector(state => state?.vote?.currentVoter?.token)

    const closeAddCandidateModal = () => {
        dispatch(UiActions.closeAddCandidateModal())
    }



    const addCandidate = async (e) => {
        e.preventDefault()
        const candidateInfo = new FormData();
        candidateInfo.set('fullName', fullName);
        candidateInfo.set('motto', motto);
        candidateInfo.set('image', image)
        candidateInfo.set('currentElection', addCandidateElectionId)
        candidateInfo.set('currentVoter', currentVoter?.id)

        try {
            closeAddCandidateModal()
            await axios.post(`${process.env.REACT_APP_API_URL}/candidates`, candidateInfo, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
            window.location.href = `${process.env.REACT_APP_CLIENT_URL}/election-details/${addCandidateElectionId}`
        } catch (err) {
            console.log(err)
        }
    }


  return (
    <section className="modal">
        <div className="modal__content">
            <header className='modal__header'>
                <h4>Add Candidate</h4>
                <button className="modal__close" onClick={closeAddCandidateModal}>
                    <IoMdClose />
                </button>
            </header>
            <form onSubmit={addCandidate} encType="multipart/form-data">
                {error && <p className="form__error-message">{error}</p>}
                <div>
                    <h6>Candidate Name:</h6>
                    <input type="text" name="fullName" onChange={e => setFullName(e.target.value)} />
                </div>
                <div>
                    <h6>Candidate Motto:</h6>
                    <input type="text" name="motto" onChange={e => setMotto(e.target.value)} />
                </div>
                <div>
                    <h6>Candidate Photo:</h6>
                    <input type="file" name="image" onChange={e => setImage(e.target.files[0])} accept="png, jpg, jpeg" />
                </div>
                <button type="submit" className='btn primary'>Submit</button>
            </form>
        </div>
    </section>
  )
}

export default Modal