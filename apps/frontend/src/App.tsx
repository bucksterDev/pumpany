import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import DocsPage from './pages/DocsPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/company/:id" element={<DashboardPage />} />
        <Route path="/docs" element={<DocsPage />} />
      </Routes>
    </div>
  );
}

export default App;
