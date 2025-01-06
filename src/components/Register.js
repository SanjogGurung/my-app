import React, { useState } from 'react';

export default function RegistrationForm() {
   

    const [ firstName, setFirstName ] = useState('');
    const [ firstNameMessege, setFirstNameMessege ] = useState('Please enter First Name with length more than 8');

    function submitForm(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData);   
        console.log(payload)
    }

    function handleChange(event) {
        setFirstName(event.target.value);

        const { name, value } = event.target;

        if (name == "firstName") {
            if (value.length > 8) {
                setFirstNameMessege('Great !!! Your First Name is greater than 8 characters');
            } else {
                setFirstNameMessege('Please enter First Name with length more than 8');
            }
        }
            
    }

    return (
        <>
        <h3>Registration Form</h3>
        <form onSubmit = {submitForm}>
            <label>First Name</label>
            <br></br>
            <input type = "text" name = "firstName" onChange = {handleChange} required/>
            <br></br>
            <i>{firstNameMessege}</i>
            <br>
            </br>
            {/* <labe>Last Name</labe>
            <input type = "text" name = "lastName" required/>
            <br></br>
            <labe>Email</labe>
            <input type = "email" name = "email" required/>
            <br></br>
            <labe>Password</labe>
            <input type = "password" name = "password" required/>
            <br></br> */}
            <input type = "submit"></input>

        </form>

        <p>{firstName}</p>
        </>
    )
}