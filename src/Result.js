export default function Result({resultValues, numTotalVotes}) {

  const [resultTitle, resultVotes] = resultValues;
  const style = {
    width: `${Math.max(resultVotes / numTotalVotes * 100, 1)}%`,
  }
  const flagValue = resultVotes === 1 ? '1 vote' : `${resultVotes} votes`;


  return (
    <div className="result">
      <p className="result__title">{resultTitle}</p>
      <div style={style} className="result__bar" votes={flagValue} right="-5rem" aria-hidden="true">
        <p className="result__title result__title--light">{resultTitle}</p>
        <div className="result__bar__flag">{flagValue}</div>
      </div>
      <div style={style} className="result__bar__shadow" aria-hidden="true"></div>
    </div>
  );
}