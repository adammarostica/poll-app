import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Welcome() {
  
  const [userInput, setUserInput] = useState('');
  const navigate = useNavigate();

  function handleChange(e) {
    setUserInput(e.target.value)
  }
  
  function handleClick(e) {
    if (userInput) {
      navigate(`poll/${userInput}`);
    }
  }

  return (
    <section className="welcome">
      <h1>Poll Maker</h1>
      <button>
        <Link to="/create">Create a Poll</Link>
      </button>
      <p>- or -</p>
      <label htmlFor="pollId">Enter a poll code</label>
      <input onChange={handleChange} type="text" name="pollId" id="pollId" value={userInput}></input>
      <button onClick={handleClick}>
        Join a Poll
      </button>
    </section>
  ); 
}