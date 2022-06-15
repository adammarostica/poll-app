import { useState } from "react";

export default function CreatePoll() {
  
  const [pollQuestion, setPollQuestion] = useState('');
  const [newOption, setNewOption] = useState('');
  const [pollOptions, setPollOptions] = useState([]);

  function handleQuestionChange(e) {
    setPollQuestion(e.target.value);
  }

  function handleOptionChange(e) {
    setNewOption(e.target.value);
  }

  function addPollOption(e) {
    e.preventDefault();
    const options = [...pollOptions];
    options.push(newOption);
    setPollOptions(options);
    setNewOption('');
  }
  
  function removePollOption(e, index) {
    console.log(e, index);
    e.preventDefault();
    let options = [...pollOptions];
    options.splice(index, 1);
    setPollOptions(options);
  }

  function handleKeyDown(e) {
    if (e.key !== 'Enter') return;
    addPollOption(e);
  }

  return (
    <div className="create">
      <h1>Create a poll</h1>
      <label htmlFor="poll-question">What question would you like to ask?</label>
      <input onChange={handleQuestionChange} value={pollQuestion} type="text" name="poll-question" id="poll-question" placeholder="ex.: Which is the best ninja turtle?" />

      <fieldset className="poll-options">
        <legend>Which poll options would you like to provide?</legend>
        {pollOptions.map((option, index) => (
          <div key={index} className="poll-option">
            <p>{option}</p>
            <button onClick={(e) => removePollOption(e, index)} className="poll-option__button poll-option__button--remove">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        ))}
        <form>
          <div className="poll-option">
            <label className="sr-only" htmlFor="poll-option">Write a new option here</label>
            <input onKeyDown={handleKeyDown} onChange={handleOptionChange} value={newOption} type="text" name="poll-option" id="poll-option" placeholder="ex.: Donatello" />
            <button onClick={addPollOption} className="poll-option__button poll-option__button--add">
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
        </form>
      </fieldset>
    </div>
  );
}