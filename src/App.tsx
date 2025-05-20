import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import LerQRCode from './pages/LerQRCode';
import { ToastProvider } from './components/ui/use-toast';
import ProtectedRoute from './components/ProtectedRoute';
import IconGradients from './components/ui/IconGradients';

const App: React.FC = () => {
  return (
    <ToastProvider>
      <Router>
        {/* Definições de gradientes SVG para ícones */}
        <IconGradients />
        
        <Routes>
          {/* Rota pública para login */}
          <Route path="/login" element={<Login />} />

          {/* Rotas protegidas que requerem autenticação */}
          <Route element={<ProtectedRoute />}>
            <Route path="/ler-qrcode" element={<LerQRCode />} />
            <Route path="/" element={<Navigate to="/ler-qrcode" />} />
          </Route>

          {/* Rota fallback para qualquer URL desconhecida */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default App;
