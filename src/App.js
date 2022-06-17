import './App.css';
import Welcome from './Welcome';
import CreatePoll from './CreatePoll';
import DisplayPoll from './DisplayPoll';
import { Routes, Route } from 'react-router-dom';

function App() {

  // const navigate = useNavigate();
  // useEffect(() => {
  //   const query = new URLSearchParams(window.location.search);
  //   if (query.get('thing') === 'hi') {
  //     navigate('/create');
  //   }
  // }, [navigate])

  return (
    <div className='app'>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/create" element={<CreatePoll />} />
        <Route path="/poll/:code" element={<DisplayPoll />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </div>
  );
}

export default App;
