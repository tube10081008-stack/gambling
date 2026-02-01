import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './lib/store';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Bank from './pages/Bank';
import GameCenter from './pages/GameCenter';
import GameList from './pages/GameList';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/bank" element={
              <PrivateRoute>
                <Bank />
              </PrivateRoute>
            } />
            <Route path="/game" element={
              <PrivateRoute>
                <GameCenter />
              </PrivateRoute>
            } />
            <Route path="/game/list" element={
              <PrivateRoute>
                <GameList />
              </PrivateRoute>
            } />
          </Routes>
        </Layout>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
