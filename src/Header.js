import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <Link to="/">
        <h1 className="depth" title="Poll in the Wall">Poll in the Wall</h1>
      </Link>
      <Link to="/create">
        <p>Make your own</p>
      </Link>
    </header>
  );
}