import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';


const LogedIn = (props) => {
    const [credential, setcredential] = useState({email : "", password:""});
    let navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/auth/login',{
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
              "Content-Type": "application/json",
              },
              body: JSON.stringify({email:credential.email, password:credential.password})
        });
        const json = await response.json();
        
        if(json.success){
            //Save the auth token and redirect
            localStorage.setItem('token', json.authtoken);
            navigate("/");
            props.showalert("Logged In Successfully", "success");
        }
        else{
            props.showalert("Invalid credentials", "danger");
        }
    }

    const onChange = (e) =>{
        setcredential({...credential, [e.target.name]: e.target.value})
    }

    return (
        <>
        <div className="my-3">
           <h2> Login to continue with iNoteSync</h2>
        </div>
            <form  onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" value={credential.email} onChange={onChange} aria-describedby="emailHelp" />
                    </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={credential.password} onChange={onChange}  />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </>
    );
}

export default LogedIn;
