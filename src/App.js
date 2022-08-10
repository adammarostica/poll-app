import './styles/App.css';
import Welcome from './components/Welcome';
import CreatePoll from './components/CreatePoll';
import DisplayPoll from './components/DisplayPoll';
import Header from './components/Header';
import Footer from './components/Footer';
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
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/create" element={<CreatePoll />} />
          <Route path="/poll/:code" element={<DisplayPoll />} />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
