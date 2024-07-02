import React, { useState } from "react";
import noteContext from '../notes/noteContext'

const NoteState = (props) => {
  const host = 'http://localhost:5000'
  // const s1 = {
  //     "name" : "Gautam",
  //     "age" : "23"
  // };
  // const [state, setstate] = useState(s1);

  // const update = () =>{
  //     setTimeout(() => {
  //         setstate({
  //             "name":"Gomzi",
  //             "age" : "25"
  //         });
  //     }, 1000);
  // }
  const notesInitial = []
  const [notes, setNotes] = useState(notesInitial);

  //Get All notes

  const getNote = async () => {
    //API Call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
      },
      }
    );
    const json = await response.json()
    
    setNotes(json)
  }


  //Add a Note
  const addNote = async (title, description, tag) => {
        //API Call

        const response = await fetch(`${host}/api/notes/addnotes`, {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
          },
          body: JSON.stringify({title, description, tag}) // body data type must match "Content-Type" header
        });
        const note = await response.json()
       
  
    setNotes(notes.concat(note))
  }


  //Delete a Note
  const deleteNote = async (id) => {
    //API Call

    const response = await fetch(`${host}/api/notes/deletenotes/${id}`, {
      method: "DELETE", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      });
    const json = response.json();
  
    const newNotes = notes.filter((notes) => { return notes._id !== id });
    setNotes(newNotes)

  }

  //Edit a Note
  const editNote = async (id, title, description, tag) => {

    //API Call

    const response = await fetch(`${host}/api/notes/updatenotes/${id}`, {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({title, description, tag}) // body data type must match "Content-Type" header
    });
    const json = await response.json();
  
    let newNote = JSON.parse(JSON.stringify(notes))
    //Logic to edit in client
    for (let index = 0; index < newNote.length; index++) {
      const element = newNote[index];
      if (element._id === id) {
        newNote[index].title = title;
        newNote[index].description = description;
        newNote[index].tag = tag;
        break;
      }
    }
    setNotes(newNote);
  }

  return (
    <noteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNote }}>
      {props.children}
    </noteContext.Provider>
  );
}

export default NoteState;


