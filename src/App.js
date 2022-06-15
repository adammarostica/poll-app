import './App.css';
import Welcome from './Welcome';
import CreatePoll from './CreatePoll';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className='app'>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/create" element={<CreatePoll />} />
      </Routes>
    </div>
  );
}

export default App;
