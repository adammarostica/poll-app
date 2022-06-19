export default function Result({resultValues, numTotalVotes, index}) {

  const [resultTitle, resultVotes] = resultValues;
  const style = {
    width: `${Math.max(resultVotes / numTotalVotes * 100, 1)}%`,
  }

  return (
    <li className="result">
      <p className="result__title">{resultTitle}</p>
      <div style={style} className="result__bar" aria-hidden="true">
        <p className="result__title result__title--light">{resultTitle}</p>
      </div>
      <div style={style} className="result__bar__shadow" aria-hidden="true"></div>
    </li>
  );
}