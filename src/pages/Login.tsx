import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../components/ui/use-toast";
import StylizedIcon from "../components/ui/StylizedIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBuilding, 
  faCheck,
  faTriangleExclamation,
  faRightToBracket,
  faLock
} from "@fortawesome/free-solid-svg-icons";
import { 
  faUser,
  faCircleXmark,
  faEnvelope,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-regular-svg-icons";
import api from '../services/api';
import "../styles/login.css";
import triangleExclamationIcon from '../assets/svg/triangle-exclamation.svg';
import circleXmarkIcon from '../assets/svg/circle-xmark.svg';
import checkIcon from '../assets/svg/check.svg';
import envelopeIcon from '../assets/svg/envelope.svg';
import buildingIcon from '../assets/svg/building.svg';
import lockIcon from '../assets/svg/lock.svg';
import eyeIcon from '../assets/svg/eye.svg';
import eyeSlashIcon from '../assets/svg/eye-slash.svg';
import rightToBracketIcon from '../assets/svg/right-to-bracket.svg';

/**
 * Componente de Login
 * Responsável pela autenticação do usuário no sistema
 * e redirecionamento para a página principal após o login bem-sucedido
 */
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);
  const [schoolName, setSchoolName] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  /**
   * Verifica se o usuário já está logado e redireciona para a página principal
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const validateToken = async () => {
        try {
          await api.get('/api/v1/auth/user');
          navigate('/');
        } catch (err) {
          localStorage.removeItem('token');
        }
      };
      validateToken();
    }
  }, [navigate]);

  /**
   * Busca informações da escola para exibir no login
   */
  useEffect(() => {
    const fetchSchoolInfo = async () => {
      try {
        const response = await api.get('/api/v1/school/info');
        if (response.data) {
          setSchoolName(response.data.nome);
          
          if (response.data.logo) {
            // Construir a URL completa do logo
            const logoUrl = `${api.defaults.baseURL}/storage/${response.data.logo}`;
            
            // Verificar se a URL do logo é válida
            const img = new Image();
            img.onload = () => {
              setLogoUrl(logoUrl);
              setLogoError(false);
            };
            img.onerror = () => {
              setLogoError(true);
              setLogoUrl(null);
              toast({
                title: "Aviso",
                description: "Não foi possível carregar o logo. Usando ícone padrão.",
                variant: "warning",
                icon: <img src={triangleExclamationIcon} alt="Warning" className="toast-icon" />,
              });
            };
            img.src = logoUrl;
          } else {
            setLogoError(true);
          }
        }
      } catch (err) {
        console.error('Erro ao buscar informações da escola', err);
        setLogoError(true);
        toast({
          title: "Aviso",
          description: "Não foi possível carregar as informações da escola. Usando configurações padrão.",
          variant: "warning",
          icon: <img src={triangleExclamationIcon} alt="Warning" className="toast-icon" />,
        });
      }
    };

    fetchSchoolInfo();
  }, [toast]);

  /**
   * Realiza o login do usuário
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
        icon: <img src={circleXmarkIcon} alt="Error" className="toast-icon" />,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await api.post('/api/v1/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      
      // Buscar informações do usuário
      try {
        const userResponse = await api.get('/api/v1/auth/user');
        if (userResponse.data.user?.image) {
          setUserImage(userResponse.data.user.image);
        }
      } catch (userErr) {
        console.error('Erro ao buscar informações do usuário', userErr);
      }
      
      toast({
        title: "Bem-vindo!",
        description: "Login realizado com sucesso. Redirecionando...",
        variant: "default",
        icon: <img src={checkIcon} alt="Success" className="toast-icon" />,
      });
      
      // Redirecionar após exibir mensagem de sucesso
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err: any) {
      let errorMsg = 'Erro ao autenticar. Tente novamente.';
      
      if (err.response?.status === 401) {
        errorMsg = 'Email ou senha incorretos.';
      } else if (err.response?.status === 429) {
        errorMsg = 'Muitas tentativas. Tente novamente em alguns minutos.';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      
      toast({
        title: "Erro de autenticação",
        description: errorMsg,
        variant: "destructive",
        icon: <StylizedIcon icon={<FontAwesomeIcon icon={faCircleXmark} size="lg" />} variant="error" effect="pulse" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Alternar visibilidade da senha
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo-container">
            {logoError ? (
              <div className="logo-placeholder">
                <img src={buildingIcon} alt="Building" className="logo-icon" />
              </div>
            ) : (
              logoUrl && (
                <img 
                  src={logoUrl} 
                  alt={`Logo ${schoolName}`}
                  className="logo-image"
                  onError={() => {
                    setLogoError(true);
                    toast({
                      title: "Aviso",
                      description: "Erro ao carregar o logo. Usando ícone padrão.",
                      variant: "warning",
                      icon: <StylizedIcon icon={<FontAwesomeIcon icon={faTriangleExclamation} size="lg" />} variant="warning" effect="glow" />,
                    });
                  }}
                />
              )
            )}
          </div>

        </div>

        {userImage && (
          <div className="user-image-container">
            <img 
              src={userImage} 
              alt="Imagem de Perfil" 
              className="user-image"
            />
          </div>
        )}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <div className="input-wrapper">
              <div className="icon-container">
                <img src={envelopeIcon} alt="Email" className="input-icon" />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu endereço de email"
                className="input-field"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <div className="input-wrapper">
              <div className="icon-container">
                <img src={lockIcon} alt="Senha" className="input-icon" />
              </div>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="input-field"
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                <img 
                  src={showPassword ? eyeSlashIcon : eyeIcon} 
                  alt="Mostrar/Ocultar senha" 
                  className="input-icon" 
                />
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              "Entrando..."
            ) : (
              <>
                <img src={rightToBracketIcon} alt="Login" className="button-icon" />
                <span>Entrar</span>
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login; 