import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './Home';
import { RepositoryDetail } from './RepositoryDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/repositories/:id" element={<RepositoryDetail />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;