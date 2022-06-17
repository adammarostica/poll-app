import './Results.css'
import {ReactComponent as LoadingBlob} from './blocks-wave.svg'
import Result from './Result';
import {useState, useEffect} from 'react';
import firebase from './firebase';
import {getDatabase, ref, onValue} from 'firebase/database';
import uuid from 'react-uuid';


export default function Results({code}) {
  
  const [pollQuestion, setPollQuestion] = useState(``);
  const [pollResults, setPollResults] = useState([]);
  const [numTotalVotes, setNumTotalVotes] = useState(0);
  console.log(numTotalVotes);
  useEffect(function getResults() {
    const database = getDatabase(firebase);
    const dbRef = ref(database, code);
    
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const newQuestion = data.question;
        setPollQuestion(newQuestion);
        const newResults = [];
        for (let item in data.options) {
          newResults.push([item, data.options[item]]);
        }
        newResults.sort((a, b)=> b[1] - a[1]);
        setPollResults(newResults);
      } else {
        setPollQuestion(`We couldn't find your poll.`)
      }
    })
  }, [code]);

  useEffect(function updateVoteCount() {
    setNumTotalVotes(pollResults.reduce((prev, curr) => {
      return prev + curr[1]
    }, 0));
  }, [pollResults])

  return (
    <div className="poll">
      <h1>Results</h1>
      <h2>{pollQuestion}</h2>
      {
        pollResults.length > 0 ?
          <ul className="results__list">
            {
              pollResults.map((result, index) => (
                <Result key={uuid()} resultValues={result} numTotalVotes={numTotalVotes} />
              ))
            }
            <div className="results__list__percentage results__list__percentage--25">25%</div>
            <div className="results__list__percentage results__list__percentage--50">50%</div>
            <div className="results__list__percentage results__list__percentage--75">75%</div>
          </ul>
          : <LoadingBlob />
      }
    </div>
  );
}