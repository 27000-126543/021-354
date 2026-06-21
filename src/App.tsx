import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import RiskRanking from './pages/RiskRanking';
import ProjectDetail from './pages/ProjectDetail';
import RectificationPage from './pages/Rectification';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<RiskRanking />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/rectification" element={<RectificationPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
