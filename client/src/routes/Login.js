import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = {
            username: username,
            password: password
        };

        console.log(form);
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group size="lg" className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                    type="username" 
                    placeholder="ex: echeng23"
                    onChange={(e) => setUsername(e.target.value)}
                ></Form.Control>
            </Form.Group>
            <Form.Group size="lg" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type="password"
                    placeholder="Enter your password..."
                    onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary">
                Submit
            </Button>
        </Form>
        // <form onSubmit={submitHandler}>
        //     <div className='form-inner'>
        //         <h2>Login</h2>
        //         {(error !="") ? ( <div className="error">{error}</div>) : ""}
        //         <div className="form-group">
        //             <label htmlFor="name">Name: </label>
        //             <input type="text" name="name" id="name" onChange={e => setDetails({...details, name: e.target.value})} value={details.name}/>
        //         </div>
        //         <div className='form-group'>
        //             <label htmlFor="email">Email: </label>
        //             <input type="email" name="email" id="email" onChange={e => setDetails({...details, email: e.target.value})} value={details.email}/>
        //         </div>

        //         <div className='form-group'>
        //             <label htmlFor="password">Password: </label>
        //             <input type="password" name="password" id="password" onChange={e => setDetails({...details, password: e.target.value})} value={details.password}/>
        //         </div>
        //         <input type="submit" value="Login" />

        //     </div>
        // </form>
    )
}