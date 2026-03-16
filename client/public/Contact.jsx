import React, { useState } from 'react';
import axios from 'axios';
const Contact = () => {
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [phone,setPhone] = useState("");
    const [message,setMessage] = useState("");

    const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    const handleSubmit = async () => {

        try {
            const postUrl = url + "Contact/add";
            const res = await axios.post(postUrl, {

                name,
                email,
                phone,
                message,
            });
            if(res?.data?.status){
                alert(res?.data?.message);
                setName("");
                setEmail("");
                setPhone("");
                setMessage("");
            }else{
                alert("Something went wrong");
            }
    } catch (error) {
        console.log(error);
        console.log("lets add dat into database",name,email,phone,message);
    }

    
  return (
    <div className="border grid gap-2 w-1/2 mx-auto p-4 mt-4 rounded shadow bg-white">
         <input className="normal-input" type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
         <input className="normal-input" type="text" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
         <input className="normal-input" type="text" placeholder="Enter Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
         <input className="normal-input" type="text" placeholder="Enter Message" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button  onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
       
    </div>
  );
};}

export default Contact;