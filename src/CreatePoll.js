import {ReactComponent as LoadingDots} from './assets/loading-dots.svg'
import { useEffect, useState, useRef } from "react";
import useDebounce from "./useDebounce";
import { useNavigate } from "react-router-dom";
import firebase from "./firebase";
import { getDatabase, ref, push, get, set, connectDatabaseEmulator } from "firebase/database";

export default function CreatePoll() {
  
  const [pollQuestion, setPollQuestion] = useState('');
  const debouncedQuestion = useDebounce(pollQuestion, 500);
  const [pollOptions, setPollOptions] = useState([]);
  const [inputSlug, setInputSlug] = useState('');
  const debouncedSlug = useDebounce(inputSlug, 500);
  const [submissionSlug, setSubmissionSlug] = useState('');
  const navigate = useNavigate();
  const slugNeedsVerification = useRef(false);

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
    try {
      // If able to compare to the database, create a slug based on what is returned
      if (debouncedQuestion) {
        setSubmissionSlug('loading');
        const slugKebab = debouncedQuestion.match(/[A-Za-z0-9]+/gi).join('-').slice(0, 24);
        const database = getDatabase(firebase);
        const dbRef = ref(database, `/${slugKebab}`);
        get(dbRef).then((snapshot) => {
          if (snapshot.exists()) {
            setInputSlug(slugKebab.slice(0, 21) + Math.floor(Math.random() * 1000));
            setSubmissionSlug(slugKebab.slice(0, 21) + Math.floor(Math.random() * 1000));
          } else {
            setInputSlug(slugKebab);
            setSubmissionSlug(slugKebab);
          }
        })
      } else {
        // If unable to compare user question to database, set an empty slug so that the poll is pushed instead of set
        setInputSlug('');
        setSubmissionSlug('');
      }
    } catch {
      // If there is an error, set an empty slug
      setInputSlug('');
      setSubmissionSlug('');
    }
  }, [debouncedQuestion])

  useEffect(() => {

    if (debouncedSlug === '') {
      setSubmissionSlug('');
    } else if (debouncedSlug.length > 24) {
      setSubmissionSlug('too long');
    } else if (debouncedSlug && debouncedSlug.match(/[\s.$[\]#/]/)) {
      setSubmissionSlug('invalid slug');
      return;
    } else if (slugNeedsVerification && debouncedSlug !== '') {
      slugNeedsVerification.current = false;
      const database = getDatabase(firebase);
      const dbRef = ref(database, `/${debouncedSlug}`);
      get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
          setSubmissionSlug('invalid slug');
        } else {
          setSubmissionSlug(inputSlug);
        }
      })
    }

  }, [debouncedSlug, inputSlug]);


  function handleQuestionChange(e) {
    setPollQuestion(e.target.value);
  }

  function handleOptionChange(e) {
    const newOptions = [...pollOptions];
    newOptions[e.target.id] = e.target.value;
    setPollOptions(newOptions);
  }

  function handleSlugChange(e) {
    slugNeedsVerification.current = true;
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
      if (option) {
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
      console.log('nope');
    }
  }

  return (
    <section className="create">
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

        <div className="slug__container">
          <p className="slug__text">Your poll code/address:</p>
          <div className="slug__input__container">
            <input className="slug__input" onChange={handleSlugChange} type="text" value={inputSlug}></input>
            {
            submissionSlug === "invalid slug" || submissionSlug === "too long"
              ? <i className="fa-solid fa-xmark"></i>
              : submissionSlug === "loading"
              ? <LoadingDots className="loading__dots" />
              : submissionSlug
              ? <i className="fa-solid fa-check"></i>
              : null
            }
            {
              submissionSlug === "invalid slug"
                ? <p className="slug__warning">No ., $, &#91;, &#93;, #, /, or spaces allowed</p>
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