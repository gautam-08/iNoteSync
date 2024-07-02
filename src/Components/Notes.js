import React, { useState, useContext, useEffect, useRef } from 'react';
import noteContext from '../Context/notes/noteContext';
import NoteItem from './NoteItem';
import NewNote from './NewNote';
import { useNavigate } from 'react-router-dom';


function Notes(props) {
    const context = useContext(noteContext);
    const { notes, getNote, editNote } = context;
    let navigate = useNavigate();
    useEffect(() => {
        if(localStorage.getItem('token')){
        getNote()
        }
        else{
          navigate("/login");  
        }
        // eslint-disable-next-line
    }, []);
    
    
    const ref = useRef(null);
    const refclose = useRef(null);
    const [note, setNote] = useState({id:"",etitle:"", edescription:"",etag:""});

    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({id: currentNote._id,etitle : currentNote.title ,edescription: currentNote.description, etag: currentNote.tag })
        }

    const handleclick = (e) =>{
        editNote(note.id, note.etitle, note.edescription, note.etag)
        refclose.current.click();
        props.showalert("Updated Successfully","success");
    }

    const onChange = (e) =>{
        setNote({...note, [e.target.name]: e.target.value})
    }

  

    return (
        <>
          <NewNote showalert={props.showalert}/>

            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Edit Note
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className='my-3'>
                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} onChange={onChange} minLength={5} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label">Description</label>
                                    <textarea type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} minLength={5} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refclose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button  disabled={note.etitle.length<5 || note.edescription.length<5} type="button" className="btn btn-primary" onClick={handleclick} >Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row container my-3">
                <h2>Your Note</h2>
                <div className="container">
                {notes.length===0 && 'No notes to display'}
                </div>
                {notes.map((notes) => {
                    return <NoteItem key={notes._id} updateNote={updateNote} notes={notes} showalert={props.showalert}/>
                })}
            </div>
        </>
    );
}

export default Notes;
