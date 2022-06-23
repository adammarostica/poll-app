import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import Voting from './Voting';
import Results from './Results';

export default function DisplayPoll() {

  const {code} = useParams();
  const [userHasVoted, setUserHasVoted] = useState(false);

  useEffect(() => {
    setUserHasVoted(localStorage.getItem(code));
  }, [code]);

  return(
    <>
      {
        userHasVoted
          ? <Results code={code} />
          : <Voting code={code} userHasVoted={userHasVoted} setUserHasVoted={setUserHasVoted} />
      }
    </>
  );
}