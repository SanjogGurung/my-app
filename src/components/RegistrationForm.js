import React, { useState } from 'react';

export default function RegistrationForm() {
   
     const initialFormMessage = {
        firstNameMessage : "Please enter your First Name",
        lastNameMessage : "Please enter your Last Name",
        emailMessage : "Please enter your Email",
        passwordMessage : "Please enter your password no less than 8 digits",
        phoneNumberMessage : "Please enter your Phone Number"
     }

    const [ formData, setFormData ] = useState({
        firstName : "",
        lastName : "",
        email : "",
        password : "",
        phoneNumber : ""
    });
    const [ formMessage, setFormMessage ] = useState(initialFormMessage);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData(
            { ...formData, [name] : value }
        ); 
        
        // Validate Forms Dynamically
        switch (name) {
            case 'firstName':
                if (value.length > 0) {
                    setFormMessage({
                        ...formMessage, firstNameMessage : '' 
                    })
                }
                else {
                    setFormMessage({
                        ...formMessage, firstNameMessage : 'Please enter your First Name'
                    })
                }
                break;

            case 'lastName':
                if (value.length > 0) {
                    setFormMessage({
                        ...formMessage, lastNameMessage : '' 
                    })
                }
                else {
                    setFormMessage({
                        ...formMessage, lastNameMessage : 'Please enter your Last Name'
                    })
                }
                break;
                
            case 'email':
                if (value.length > 0) {
                    setFormMessage({
                        ...formMessage, emailMessage : '' 
                    })
                }
                else {
                    setFormMessage({
                        ...formMessage, emailMessage : 'Please enter your Email'
                    })
                }
                break;
                
            case 'password':
                if (value.length > 7) {
                    setFormMessage({
                        ...formMessage, passwordMessage : '' 
                    })
                }
                else {
                    setFormMessage({
                        ...formMessage, passwordMessage : 'Please enter your Password no less than 8 digits'
                    })
                }
                break;
                
            case 'phoneNumber':
                if (value.length === 10) {
                    setFormMessage({
                        ...formMessage, phoneNumberMessage : '' 
                    })
                }
                else {
                    setFormMessage({
                        ...formMessage, phoneNumberMessage : 'Please enter your Phone Number equal to 10 digits'
                    })
                }
                break;
            default:
                break;
        }   
    }

    function submitForm(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData);  

        console.log(payload)
        fetch("http://localhost:8080/user/add",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(payload)
        }).then(() => {
            console.log("New User Added Successfully")
        })

       
            
    }

   

    return (
        <>
        <h3>Registration Form</h3>
        <form onSubmit = {submitForm}>
            <label>First Name</label>
            <br></br>
            <input type = "text" name = "firstName" onChange = {handleChange} required/>
            <br></br>
            <i>{formMessage.firstNameMessage}</i>
            <br>
            </br>

            <label>Last Name</label>
            <br></br>
            <input type = "text" name = "lastName" onChange = {handleChange} required/>
            <br></br>
            <i>{formMessage.lastNameMessage}</i>
            <br>
            </br>

            <label>Email</label>
            <br></br>
            <input type = "text" name = "email" onChange = {handleChange} required/>
            <br></br>
            <i>{formMessage.emailMessage}</i>
            <br>
            </br>

            <label>Password</label>
            <br></br>
            <input type = "text" name = "password" onChange = {handleChange} required/>
            <br></br>
            <i>{formMessage.passwordMessage}</i>
            <br>
            </br>

            <label>Phone Number</label>
            <br></br>
            <input type = "text" name = "phoneNumber" onChange = {handleChange} required/>
            <br></br>
            <i>{formMessage.phoneNumberMessage}</i>
            <br>
            </br>
           
            <input type = "submit"></input>

        </form>

        </>
    )
}
        