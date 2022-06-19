import Heading from './Heading';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Welcome() {
  
  const [userInput, setUserInput] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    setUserInput(e.target.value)
  }

  function handleCreate() {
    navigate('/create');
  }
  
  function handleJoin() {
    if (userInput) {
      navigate(`poll/${userInput}`);
    }
  }

  return (
    <section className="welcome">
      <Heading text="Poll in the Wall" />
      <button onClick={handleCreate}>
        <Link role="button" className="link-button" to="/create">Create a Poll</Link>
      </button>
      <p>or</p>
      <label className="sr-only" htmlFor="pollId">Enter a poll code</label>
      <input className="welcome__pollId" onChange={handleChange} type="text" name="pollId" id="pollId" value={userInput} placeholder="Enter a poll code and..."></input>
      <button onClick={handleJoin}>
        <Link role="button" className="link-button" to={`/poll/${userInput}`}>Join a Poll</Link>
      </button>
    </section>
  ); 
}