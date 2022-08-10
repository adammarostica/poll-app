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
  
  function handleJoin(e) {
    e.preventDefault();
    if (userInput.length > 0) {
      navigate(`poll/${userInput}`);
    }
  }

  return (
    <section className="welcome">
      <button onClick={handleCreate}>
        <Link className="link-button" to="/create">Create a Poll</Link>
      </button>
      <p>or</p>
      <form action="" onSubmit={handleJoin}>
        <label className="sr-only" htmlFor="pollId">Enter a poll code</label>
        <input className="welcome__pollId__input" onChange={handleChange} type="text" name="pollId" id="pollId" value={userInput} placeholder="Enter a poll code and..." required></input>
        <button className="welcome__pollId__button">
          Join a Poll
        </button>
      </form>
    </section>
  ); 
}