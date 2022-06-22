import './Results.css'
import Result from './Result';
import {ReactComponent as LoadingBlob} from './blocks-wave.svg'
import {useState, useEffect} from 'react';
import firebase from './firebase';
import {getDatabase, ref, onValue} from 'firebase/database';
import uuid from 'react-uuid';


export default function Results({code}) {
  
  const [pollQuestion, setPollQuestion] = useState(``);
  const [pollResults, setPollResults] = useState([]);
  const [numTotalVotes, setNumTotalVotes] = useState(0);
  
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

  // Calculate the number of total votes
  useEffect(function updateVoteCount() {
    setNumTotalVotes(pollResults.reduce((prev, curr) => {
      return prev + curr[1]
    }, 0));
  }, [pollResults])


  async function handleShare() {
    const shareData = {
      title: 'Poll in the Wall',
      text: pollQuestion,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator
          .share(shareData)
          .then(() =>
            console.log("Hooray! Your content was shared to tha world")
          );
      } catch (error) {
        console.log(`Oops! I couldn't share to the world because: ${error}`);
      }
    } else {
      alert(`Your browser doesn't support web share. Sorry.`)
    }
  }

  return (
    <div className="results">
      <h2>{pollQuestion}</h2>
      {
        pollResults.length > 0 ?
          <section className="results__list">
            {
              pollResults.map((result) => (
                <Result key={uuid()} resultValues={result} numTotalVotes={numTotalVotes} />
              ))
            }
            <div className="results__list__percentage results__list__percentage--25">25%</div>
            <div className="results__list__percentage results__list__percentage--50">50%</div>
            <div className="results__list__percentage results__list__percentage--75">75%</div>
            <div className="results__list__background"></div>
            <div className="results__list__vote-count">
            {numTotalVotes === 1
              ? `${numTotalVotes} vote`
              : `${numTotalVotes} votes`}
            </div>
          </section>
          : <LoadingBlob />
      }
      <div className="results__share">
        {
          navigator.share && <button className="results__share__button" onClick={handleShare}>Share this poll <i class="fa-solid fa-share-nodes"></i></button>
        }
      </div>
    </div>
  );
}