import { useState } from "react";
import axios from "axios";

const AdminEvents = () => {

  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    description: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:8000/api/events", form, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    alert("Event Added Successfully");
  };

  return (
    <div>
      <h2>Add Event</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} required />
        <input type="date" name="date" onChange={handleChange} required />
        <input name="location" placeholder="Location" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

export default AdminEvents;