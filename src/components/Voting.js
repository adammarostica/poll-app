import {useState, useEffect} from 'react';
import firebase from '../firebase';
import {getDatabase, ref, update, get, increment} from 'firebase/database';
import uuid from 'react-uuid';

export default function Voting({code, userHasVoted, setUserHasVoted}) {

  const [pollQuestion, setPollQuestion] = useState(``);
  const [choices, setChoices] = useState([]);
  const [userChoice, setUserChoice] = useState('');


  // Generate the poll options
  useEffect(() => {
    const database = getDatabase(firebase);
    const dbRef = ref(database, code);
    
    get(dbRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        // Ensure question ends with an interrogation mark
        let newQuestion = data.question;
        if (newQuestion[newQuestion.length -1] !== '?') {
          newQuestion += '?';
        }
        setPollQuestion(newQuestion);
        setChoices(data.options);
      } else {
        setPollQuestion(`We couldn't find your poll.`)
      }
    })
  }, [code]);

  function handleChange(e) {
    setUserChoice(e.target.value);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      setUserChoice(e.target.innerText);
    }
  }
  
  // Submit the user's vote and note that they have voted in both state and localStorage so that <DisplayPoll /> displays <Results /> instead.
  function handleSubmit(e) {
    e.preventDefault();
    if (userHasVoted) {
      alert('You have already voted in this poll.')
      return;
    }

    if (userChoice) {
      // find index of chosen item to increment the corresponding entry of the votes array
      const voteIndex = choices.indexOf(userChoice);
      const database = getDatabase(firebase);
      update(ref(database, `${code}/votes`), {
        [voteIndex]: increment(1),
      })
    }
    localStorage.setItem(code, true);
    setUserHasVoted(true);
  }

  return(
    <section className="poll">
      <h2>{pollQuestion ? pollQuestion : 'Loading...'}</h2>
      
      
      <form onSubmit={handleSubmit}>
        {
          choices.map((choice) => (
            <div key={uuid()} className="poll__choice">
              <input
                className='sr-only'
                onChange={handleChange}
                type="radio"
                id={choice}
                name="poll-choices"
                value={choice}
                checked={userChoice === choice}
                tabIndex="-1"
              />
              <label onKeyDown={handleKeyDown} className="poll__choice__label" htmlFor={choice} aria-label="poll choice" tabIndex="0">{choice}</label>
            </div>
          ))
        }
        {
          userChoice
            ? <button className="poll__button" type="submit">Vote</button>
            : <button className="poll__button poll__button--hidden" tabIndex="-1" type="submit">Vote</button>
        }
      </form>

    </section>
  );
}