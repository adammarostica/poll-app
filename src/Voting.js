import './Voting.css';
import {useState, useEffect} from 'react';
import firebase from './firebase';
import {getDatabase, ref, update, get, increment} from 'firebase/database';
import uuid from 'react-uuid';

export default function Voting({code, userHasVoted, setUserHasVoted}) {

  const [pollQuestion, setPollQuestion] = useState(``);
  const [choices, setChoices] = useState([]);
  const [userChoice, setUserChoice] = useState('');

  useEffect(() => {
    const database = getDatabase(firebase);
    const dbRef = ref(database, code);
    
    get(dbRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        let newQuestion = data.question;
        if (newQuestion[newQuestion.length -1] !== '?') {
          newQuestion += '?';
        }
        setPollQuestion(newQuestion);
        const newChoices = [];
        data.order.forEach(item => {
          newChoices.push(item);
        });
        setChoices(newChoices);
      } else {
        setPollQuestion(`We couldn't find your poll.`)
      }
    })
  }, [code]);

  function handleChange(e) {
    setUserChoice(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (userHasVoted) {
      alert('You have already voted in this poll.')
      return;
    }
    if (userChoice) {
      const database = getDatabase(firebase);
      update(ref(database, `${code}/options`), {
        [userChoice]: increment(1),
      })
    }
    localStorage.setItem(code, true);
    setUserHasVoted(true);
  }

  return(
    <div className="poll">
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
              />
              <label tabIndex="0" className="poll__choice__label" htmlFor={choice}>{choice}</label>
            </div>
          ))
        }
        {
          userChoice
            ? <button className="poll__button" type="submit">Vote</button>
            : <button className="poll__button poll__button--hidden" type="submit">Vote</button>
        }
      </form>

    </div>
  );
}