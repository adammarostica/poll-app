import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Welcome() {
  
  const [userInput, setUserInput] = useState('');

  function handleChange(e) {
    setUserInput(e.target.value)
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
      <button>
        Join a Poll
      </button>
    </section>
  ); 
}