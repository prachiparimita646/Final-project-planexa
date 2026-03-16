import { useEffect, useState } from "react";
import axios from "axios";

const Events = () => {

  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/events")
      .then(res => setEvents(res.data));
  }, []);

  console.log(events)
  

  return (
    <div>
      <h2>Upcoming Events</h2>

      {events.map(event => (
        <div key={event._id}>
          <h3>{event.title}</h3>
          <p>{event.location}</p>
          <p>{new Date(event.date).toDateString()}</p>
          <p>{event.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Events;