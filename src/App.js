import About from './Components/About';
import './App.css';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NoteState from './Context/notes/NoteState';
import Alert from './Components/Alert';
import Signup from './Components/Signup';
import LogedIn from './Components/LogedIn';
import { useState } from 'react';



function App() {
  const [alert, setalert] = useState(null);

  const showalert = (message, type) => {
    setalert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setalert(null)
    }, 1500);
  }

  return (
    <>
      <NoteState>
        <Router>
          <Navbar />
          
          <div className="container">
            <h1 className="">This is iNoteSync</h1>
            <Alert alert={alert}/>
            <Routes>
              <Route exact path="/" element={<Home showalert={showalert}/>}></Route>
              <Route exact path="/about" element={<About />}></Route>

              <Route exact path="/login" element={<LogedIn showalert={showalert} /> }></Route>
              <Route exact path="/signup" element={<Signup showalert={showalert} />}></Route>
            </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
