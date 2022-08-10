import {ReactComponent as LoadingDots} from '../assets/loading-dots.svg'
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import firebase from "../firebase";
import { getDatabase, ref, push, set } from "firebase/database";
import useVerifiedValue from '../hooks/useVerifiedValue';

export default function CreatePoll() {
  
  const [pollQuestion, setPollQuestion] = useState('');
  const debouncedQuestion = useDebounce(pollQuestion, 500);
  const [pollOptions, setPollOptions] = useState([]);
  const navigate = useNavigate();

  const [inputSlug, setInputSlug, submissionSlug] = useVerifiedValue(debouncedQuestion);

  // If each poll input has text, generate a new blank input
  useEffect(() => {
    if (pollOptions.every((option) => option.trim().length > 0)) {
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

  function handleSlugChange(e) {
    setInputSlug(e.target.value.slice(0, 24));
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
    const poll = {question: pollQuestion, options: [], votes: []};
    pollOptions.forEach((option) => {
      if (option.trim().length > 0) {
        poll.options.push(option);
        poll.votes.push(0);
      }
    })
    if (poll.question && poll.options.length > 0) {
      if (submissionSlug === ''
          || submissionSlug === 'invalid slug'
          || submissionSlug === 'too long') {
        const dbRef = ref(database);
        push(dbRef, poll)
          .then((response) => navigate(`../poll/${response.key}`));
      } else {
        const dbRef = ref(database, submissionSlug);
        set(dbRef, poll)
          .then(() => navigate(`../poll/${submissionSlug}`));
      }
      
    } else {
      console.error('nope');
    }
  }

  return (
    <section className="create">
      <h2>Poll Creator</h2>
      <form className="create__form" action="" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="poll-question">What's your question?</label>
        <textarea onChange={handleQuestionChange} value={pollQuestion} name="poll-question" id="poll-question" cols="30" rows="3" placeholder="What's your question?" required></textarea>

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

        <div className="slug__container">
          <p className="slug__text">Your poll code/address:</p>
          <div className="slug__input__container">
            <input className="slug__input" onChange={handleSlugChange} type="text" value={inputSlug}></input>
            {
            submissionSlug === "invalid slug" || submissionSlug === "already used"
              ? <i className="fa-solid fa-xmark"></i>
              : submissionSlug === "loading"
              ? <LoadingDots className="loading__dots" />
              : submissionSlug
              ? <i className="fa-solid fa-check"></i>
              : null
            }
            {
              submissionSlug === "invalid slug"
                ? <p className="slug__warning">Your custom address can only contain letters, numbers, and dashes.</p>
                : submissionSlug === "already used"
                ? <p className="slug__warning">This code has already been used.</p>
                : submissionSlug === "too long"
                ? <p className="slug__warning">Must be 24 characters or less</p>
                : null
            }
          </div>
        </div>
      </form>
    </section>
  );
}