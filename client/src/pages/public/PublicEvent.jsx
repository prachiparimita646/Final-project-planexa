import { useEffect, useState } from "react";
import axios from "axios";

const PublicEvents = () => {

  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:800/api/events")
      .then(res => {
        setEvents(res.data);
      })
      .catch(err => {
        console.log("Error:", err);
      });
  }, []);

  return (
    <div>
      <h2>All Events</h2>

      {events.length === 0 ? (
        <p>No events available</p>
      ) : (
        events.map(event => (
          <div key={event._id} style={{border:"1px solid black", margin:"10px", padding:"10px"}}>
            
            <img
              src={event.image}
              alt={event.title}
              style={{width:"300px", height:"200px", objectFit:"cover"}}
            />

            <h3>{event.title}</h3>
            <p>Date: {event.date}</p>
            <p>Location: {event.location}</p>
            <p>{event.description}</p>

          </div>
        ))
      )}
    </div>
  );
};

export default PublicEvents;
