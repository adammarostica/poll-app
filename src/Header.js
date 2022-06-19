import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <Link to="/">
        <h1>Poll in the Wall</h1>
      </Link>
      <Link to="/create">
        <p>Make your own</p>
      </Link>
    </header>
  );
}