import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
// import firebase from './firebase';
// import {getDatabase, ref, update, get, increment} from 'firebase/database';
// import uuid from 'react-uuid';
import Voting from './Voting';
import Results from './Results';

export default function DisplayPoll() {

  const {code} = useParams();
  // const [question, setQuestion] = useState(``);
  // const [choices, setChoices] = useState([]);
  // const [userChoice, setUserChoice] = useState('');
  const [userHasVoted, setUserHasVoted] = useState(false);

  useEffect(() => {
    setUserHasVoted(localStorage.getItem(code));
  }, [code]);

  // useEffect(() => {
  //   setUserHasVoted(localStorage.getItem(code));
  //   const database = getDatabase(firebase);
  //   console.log(code);
  //   const dbRef = ref(database, code);
    
  //   get(dbRef).then((snapshot) => {
  //     if (snapshot.exists()) {
  //       const data = snapshot.val()
  //       const newQuestion = data.question;
  //       setQuestion(newQuestion);
  //       const newChoices = [];
  //       for (let item in data.options) {
  //         newChoices.push(item);
  //       }
  //       setChoices(newChoices);
  //     } else {
  //       setQuestion(`We couldn't find your poll.`)
  //     }
  //   })
  // }, [code]);

  // function handleChange(e) {
  //   setUserChoice(e.target.value);
  // }

  // function handleSubmit(e) {
  //   e.preventDefault();
  //   if (localStorage.getItem(code)) {
  //     console.log('no more votes for you');
  //     return;
  //   }
  //   if (userChoice) {
  //     const database = getDatabase(firebase);
  //     update(ref(database, `${code}/options`), {
  //       [userChoice]: increment(1),
  //     })
  //   }
  //   localStorage.setItem(code, true);
  //   setUserHasVoted(localStorage.getItem(code));
  // }

  return(
    <>
      {
        userHasVoted
          ? <Results code={code} />
          : <Voting code={code} userHasVoted={userHasVoted} setUserHasVoted={setUserHasVoted} />
      }
    </>
   
    // <div className="poll">
    //   <h1>
    //     {
    //       question
    //         ? question
    //         : `Loading...`
    //     }
    //   </h1>
      

    //   <form onSubmit={handleSubmit}>
    //     {
    //       choices.map((choice) => (
    //         <div key={uuid()} className="poll-choice">
    //           <input
    //             onChange={handleChange}
    //             type="radio"
    //             id={choice}
    //             name="poll-choices"
    //             value={choice}
    //             checked={userChoice === choice}  
    //           />
    //           <label htmlFor={choice}>{choice}</label>
    //         </div>
    //       ))
    //     }
    //     {
    //       userChoice
    //         ? <button type="submit">Vote</button>
    //         : null
    //     }
    //   </form>

    // </div>
  );
}