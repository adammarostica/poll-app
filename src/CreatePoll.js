import './CreatePoll.css'
import { useEffect, useState } from "react";
import useDebounce from "./useDebounce";
import { useNavigate } from "react-router-dom";
import firebase from "./firebase";
import { getDatabase, ref, push, get, set } from "firebase/database";

export default function CreatePoll() {
  
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState([]);
  const [slug, setSlug] = useState('');
  const debouncedSlug = useDebounce(pollQuestion, 500);
  const navigate = useNavigate();

  // If each poll input has text, generate a new blank input
  useEffect(() => {
    if (pollOptions.every((option) => option.length > 0)) {
      const newOptions = [...pollOptions];
      newOptions.push('');
      setPollOptions(newOptions);
    }
  }, [pollOptions])

  // When the user stops typing their question, check if a kebab-ified version of the question already exists as a Firebase property.
  // If yes, the poll will be assigned a random code by Firebase. If no, prepare to set the poll with its custom code.
  // i.e. 'What time should we meet?' checks to see if 'What-time-should-we-meet' is an unused code.
  useEffect(() => {
    if (debouncedSlug) {
      const slugKebab = debouncedSlug.match(/[A-Za-z0-9]+/gi).join('-').slice(0, 24);
      const database = getDatabase(firebase);
      const dbRef = ref(database, `/${slugKebab}`);
      get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
          setSlug('');
        } else {
          setSlug(slugKebab);
        }
      })
    }
  }, [debouncedSlug])

  function handleQuestionChange(e) {
    setPollQuestion(e.target.value);
  }

  function handleOptionChange(e) {
    const newOptions = [...pollOptions];
    newOptions[e.target.id] = e.target.value;
    setPollOptions(newOptions);
  }

  // Prevent the enter key from submitting the form. Instead, make it focus on the next form element.
  function handleEnter(e) {
    if (e.key === 'Enter') {
      const form = e.target.form;
      const index = [...form].indexOf(e.target);
      form.elements[index + 1].focus();
      e.preventDefault();
    }
  }

  // Compile the question and answer into an object to be submitted to Firebase, then navigate the user to their created poll.
  function handleSubmit(e) {
    e.preventDefault();
    const database = getDatabase(firebase);
    const poll = {question: pollQuestion, options: {}, order: []};
    pollOptions.forEach((option) => {
      if (option) {
        poll.options[option] = 0;
        poll.order.push(option);
      }
    })
    if (poll.question && Object.entries(poll.options).length > 0) {
      if (slug === '') {
        const dbRef = ref(database);
        push(dbRef, poll)
          .then((response) => navigate(`../poll/${response.key}`));
      } else {
        const dbRef = ref(database, slug);
        set(dbRef, poll)
          .then(() => navigate(`../poll/${slug}`));
      }
      
    } else {
      console.log('nope');
    }
  }

  return (
    <div className="create">
      <h2>Poll Creator</h2>
      <form className="create__form" action="" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="poll-question">What's your question?</label>
        <textarea onChange={handleQuestionChange} value={pollQuestion} name="poll-question" id="poll-question" cols="30" rows="2" placeholder="What's your question?" required></textarea>

        <fieldset className="poll-options">
          <legend>Answers</legend>
          
          {
            pollOptions.map((option, index) => (
              <div className="poll-option" key={index}>
                <label className="sr-only" htmlFor={index}>Enter an answer here</label>
                <input
                  className="poll-option__input"
                  onChange={handleOptionChange}
                  onKeyDown={handleEnter}
                  value={option}
                  name={index}
                  id={index}
                  type="text"
                  placeholder={
                    index === 0
                      ? "An answer"
                      : "Another answer"
                  } />
              </div>
            ))
          }

        </fieldset>
        <button className="create__button" type="submit">Create Poll</button>
      </form>
    </div>
  );
}