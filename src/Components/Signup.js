import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';


const Signup = (props) => {
  const [credential, setcredential] = useState({name:"",email : "", password:"", cpassword:""});
  let navigate = useNavigate();

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const {name, email, password} = credential;
    const response = await fetch('http://localhost:5000/api/auth/createuser',{
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          },
          body: JSON.stringify({name,email,password})
    });
    const json = await response.json();
   
    if(json.success){
      //Save the auth token and redirect
      localStorage.setItem('token', json.authtoken);
      navigate("/login");
      props.showalert("Account created Successfully", "succes")
  }
  else{
      props.showalert("Invalid details", "danger")
  }
    
}

  const onChange = (e) =>{
    setcredential({...credential, [e.target.name]: e.target.value})
}

  return (
    <>
    <div className="my-3">
           <h2> Create a account to continue with iNoteSync</h2>
        </div>
      <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <label htmlFor="name" className="form-label">Name </label>
    <input type="text" className="form-control" id="name" name="name" onChange={onChange}/>
  </div>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" id="email" name="email"  onChange={onChange} aria-describedby="emailHelp"/>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" id="password"  name="password" onChange={onChange} minLength={5} required/>
  </div>
  <div className="mb-3">
    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
    <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange} minLength={5} required/>
  </div>
  
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
    </>
  );
}

export default Signup;

