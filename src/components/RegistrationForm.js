import React, { useState } from 'react';

export default function RegistrationForm() {
    const messegeList = [
        'Please enter your First Name',
        'Please enter your Last Name',
        'Please enter your Email',
        'Please enter your Password'
    ]
    const [ firstNameMessege, setFirstNameMessege ] = useState(messegeList[0]);
    const [ lastNameMessege, setLastNameMessege ] = useState(messegeList[1]);
    const [ emailMessege, setEmailMessege ] = useState(messegeList[2]);
    const [ passwordMessege, setPasswordMessege ] = useState(messegeList[3]);

    function submitForm(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData);  

        console.log(payload)
    }

    function handleChange(event) {
        const { name, value } = event.target;

        if (name == "firstName") {
            if (value.length > 0) {
                setFirstNameMessege('');
            } else setFirstNameMessege(messegeList[0])
        }
        else if (name == "lastName") {
            if (value.length > 0) {
                setLastNameMessege('');
            } else setLastNameMessege(messegeList[1])
        }
        else if (name == "email") {
            if (value.length > 0) {
                setEmailMessege('');
            } else setEmailMessege(messegeList[2])
        }
        else {
            if (value.length > 0) {
                setPasswordMessege('');
            } else setPasswordMessege(messegeList[3])
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

            <label>Last Name</label>
            <br></br>
            <input type = "text" name = "lastName" onChange = {handleChange} required/>
            <br></br>
            <i>{lastNameMessege}</i>
            <br>
            </br>

            <label>Email</label>
            <br></br>
            <input type = "text" name = "email" onChange = {handleChange} required/>
            <br></br>
            <i>{emailMessege}</i>
            <br>
            </br>

            <label>Password</label>
            <br></br>
            <input type = "text" name = "password" onChange = {handleChange} required/>
            <br></br>
            <i>{passwordMessege}</i>
            <br>
            </br>
           
            <input type = "submit"></input>

        </form>

        </>
    )
}