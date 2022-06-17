import { useEffect, useState } from "react";
import firebase from "./firebase";
import {getDatabase, ref, push} from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function CreatePoll() {
  
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (pollOptions.every((option) => option.length > 0)) {
      const newOptions = [...pollOptions];
      newOptions.push('');
      setPollOptions(newOptions);
    }
  }, [pollOptions])

  function handleQuestionChange(e) {
    setPollQuestion(e.target.value);
  }

  function handleOptionChange(e) {
    const newOptions = [...pollOptions];
    newOptions[e.target.id] = e.target.value;
    setPollOptions(newOptions);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const database = getDatabase(firebase);
    const dbRef = ref(database);
    const poll = {question: pollQuestion, options: {}};
    pollOptions.forEach((option) => {
      if (option) {
        poll.options[option] = 0;
      }
    })
    if (poll.question && Object.entries(poll.options).length > 0) {
      push(dbRef, poll)
        .then((response) => navigate(`../poll/${response.key}`));
    } else {
      console.log('nope');
    }
  }

  return (
    <div className="create">

      <h1>Let's Make a Poll!</h1>

      <form action="" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="poll-question">What would you like to ask?</label>
        <textarea onChange={handleQuestionChange} value={pollQuestion} name="poll-question" id="poll-question" cols="30" rows="2" required></textarea>

        <fieldset className="poll-options">
          <legend>Which answers would you like to offer?</legend>
          
          {
            pollOptions.map((option, index) => (
              <div className="poll-option" key={index}>
                <label className="sr-only" htmlFor={index}>Enter an answer here</label>
                <input onChange={handleOptionChange} value={option} name={index} id={index} type="text" placeholder="Another answer" />
              </div>
            ))
          }

        </fieldset>
        <button type="submit">Create Poll</button>
      </form>
    </div>
  );
}