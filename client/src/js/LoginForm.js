import { useState } from "react";
import {Form, Button} from 'react-bootstrap';

function MyLoginForm(props) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const credentials = { username, password };
        
        let valid = true;
        if(username === '' || password === '' || password.length < 6)
            valid = false;

        if(valid)
        {
          props.login(credentials);
        }
        else {
          props.setMessage({msg: `Incorrect email and/or password.`, type: 'danger'})
        }
    };
  
    return (
        
        <Form  className='mx-auto mt-5'>
        <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control required type="email" placeholder="Enter email" value={username} onChange={ev => setUsername(ev.target.value)}/>
            <Form.Text className="text-muted">
            We'll never share your email with anyone else.
            </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control required type="password" placeholder="Password" value={password} onChange={ev => setPassword(ev.target.value)} />
        </Form.Group>
 
        <Button variant="primary" type="submit"  onClick={handleSubmit}>
            Submit
        </Button>
        </Form>
    )
  }
  
  export default MyLoginForm;