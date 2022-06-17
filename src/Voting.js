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
        const newQuestion = data.question;
        setPollQuestion(newQuestion);
        const newChoices = [];
        for (let item in data.options) {
          newChoices.push(item);
        }
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
      <h1>
        {
          pollQuestion
            ? pollQuestion
            : `Loading...`
        }
      </h1>
      
      
      <form onSubmit={handleSubmit}>
        {
          choices.map((choice) => (
            <div key={uuid()} className="poll-choice">
              <input
                onChange={handleChange}
                type="radio"
                id={choice}
                name="poll-choices"
                value={choice}
                checked={userChoice === choice}  
              />
              <label htmlFor={choice}>{choice}</label>
            </div>
          ))
        }
        {
          userChoice
            ? <button type="submit">Vote</button>
            : null
        }
      </form>

    </div>
  );
}