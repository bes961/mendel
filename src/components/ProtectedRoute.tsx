import { ReactNode, useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useToast } from './ui/use-toast';
import { AlertIcon } from '../assets/icons/icons';

interface ProtectedRouteProps {
  children?: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        await api.get('/api/v1/auth/user');
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        
        toast({
          title: "Sessão expirada",
          description: "Por favor, faça login novamente.",
          variant: "warning",
          icon: <AlertIcon size={20} color="#f59e0b" />,
        });
      }
    };

    verifyAuth();
  }, [toast]);

  // Mostra uma tela de loading enquanto verifica a autenticação
  if (isAuthenticated === null) {
    return (
      <div className="loading-auth">
        <div className="loading-spinner"></div>
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redireciona para o login mantendo a URL original como state
    // para poder redirecionar de volta após o login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se está autenticado, permite o acesso ao componente filho ou ao Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute; 