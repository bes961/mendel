import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../components/ui/use-toast';
import api from '../services/api';
import { 
    BuildingIcon,
    ArrowUpIcon, 
    ArrowDownIcon, 
    PackageIcon, 
    FileTextIcon, 
    UserIcon,
    AlertIcon,
    CheckIcon,
    XIcon,
    LogOutIcon,
    ScanIcon
} from '../assets/icons/icons';
import '../styles/LerQRCode.css';

// Adicionar media queries para mobile
const mobileStyles = `
@media (max-width: 768px) {
    .qrcode-page {
        padding: 0;
    }

    .header {
        padding: 0.75rem 1rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .logo img {
        height: 32px;
        max-width: 100px;
    }

    .user-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.75rem;
    }
    
    .user-details {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .user-name {
        font-size: 0.85rem;
        margin-bottom: 0.25rem;
    }

    .logout-btn {
        padding: 0;
        font-size: 0.8rem;
        background: none;
        border: none;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        gap: 0.3rem;
    }

    .user-avatar, .user-avatar-placeholder {
        width: 36px !important;
        height: 36px !important;
    }

    .main-content {
        padding: 1rem;
    }

    .scanner-section {
        margin-bottom: 1rem;
    }

    .reader-container {
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
    }

    .product-card {
        padding: 1rem;
        margin: 1rem 0;
    }

    .product-header {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
    }

    .product-info {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }

    .movement-form {
        gap: 1rem;
    }

    .type-buttons {
        flex-direction: row;
        gap: 0.5rem;
    }

    .type-button {
        flex: 1;
        padding: 0.75rem;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .quantity-input {
        width: 100%;
    }

    .notes-input {
        min-height: 100px;
    }

    .submit-button {
        width: 100%;
        margin-top: 1rem;
    }
}
`;

// Adicionar os estilos ao documento
const styleSheet = document.createElement("style");
styleSheet.innerText = mobileStyles;
document.head.appendChild(styleSheet);

interface Product {
    id: number;
    nome: string;
    descricao: string;
    qrcode_label: string;
    estoque: number;
    estoque_minimo: number;
    status: string;
    posicao: string;
    ativo: boolean;
}

interface User {
    name: string;
    email: string;
    image: string;
}

interface SchoolInfo {
    nome: string;
    logo: string;
}

const LerQRCode: React.FC = () => {
    const [produto, setProduto] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState<number>(1);
    const [type, setType] = useState<'entrada' | 'saida'>('entrada');
    const [notes, setNotes] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);
    const navigate = useNavigate();
    const { toast } = useToast();

    // Buscar informações da escola
    useEffect(() => {
        const fetchSchoolInfo = async () => {
            try {
                const response = await api.get('/api/v1/school/info');
                if (response.data) {
                    setSchoolInfo(response.data);
                }
            } catch (err) {
                console.error('Erro ao buscar informações da escola', err);
            }
        };

        fetchSchoolInfo();
    }, []);

    // Buscar informações do usuário
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await api.get('/api/v1/auth/user');
                if (response.data.user) {
                    setUser(response.data.user);
                }
            } catch (err) {
                console.error('Erro ao buscar informações do usuário', err);
                // Se não conseguir buscar usuário, provavelmente o token expirou
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        fetchUserInfo();
    }, [navigate]);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: window.innerWidth < 768 ? 200 : 250,
                height: window.innerWidth < 768 ? 200 : 250,
            },
            fps: 5,
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true,
            showZoomSliderIfSupported: true,
            defaultZoomValueIfSupported: 2,
            formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ],
        }, false);

        scanner.render(onScanSuccess, onScanError);

        // Adicionar listener para redimensionamento da janela
        const handleResize = () => {
            scanner.clear();
            scanner.render(onScanSuccess, onScanError);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            scanner.clear();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const onScanSuccess = async (decodedText: string) => {
        setLoading(true);
        setProduto(null);

        try {
            const response = await api.get(`/api/v1/products/qrcode/${decodedText}`);
            setProduto(response.data);
            toast({
                title: "QR Code lido com sucesso!",
                description: `Produto: ${response.data.nome}`,
                variant: "default",
                icon: <CheckIcon size={20} color="#22c55e" />,
            });
        } catch (err: any) {
            let errorMsg = 'Erro ao ler QR code';
            
            if (err.response?.status === 400) {
                errorMsg = 'QR code inválido. Use um QR code no formato MDL-XXXXX-Y';
            } else if (err.response?.status === 404) {
                errorMsg = 'Produto não encontrado';
            } else if (err.response?.status === 401) {
                // Se não autorizado, redireciona para o login
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            
            toast({
                title: "Erro na leitura",
                description: errorMsg,
                variant: "destructive",
                icon: <XIcon size={20} color="#ef4444" />,
            });
        } finally {
            setLoading(false);
        }
    };

    const onScanError = (err: string) => {
        console.error(err);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!produto) return;

        setLoading(true);

        try {
            const response = await api.post(`/api/v1/products/qrcode/${produto.qrcode_label}/stock`, {
                type,
                quantity,
                notes
            });

            setProduto(prevProduto => {
                if (!prevProduto) return null;
                return {
                    ...prevProduto,
                    estoque: response.data.product.estoque,
                    status: response.data.product.status
                };
            });

            toast({
                title: "Operação realizada!",
                description: "Estoque atualizado com sucesso.",
                variant: "default",
                icon: <CheckIcon size={20} color="#22c55e" />,
            });
            
            setQuantity(1);
            setNotes('');
        } catch (err: any) {
            let errorMsg = 'Erro ao atualizar estoque';
            
            if (err.response?.status === 401) {
                // Se não autorizado, redireciona para o login
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            
            if (err.response?.data?.message) {
                errorMsg = err.response.data.message;
            }
            
            toast({
                title: "Erro na movimentação",
                description: errorMsg,
                variant: "destructive",
                icon: <XIcon size={20} color="#ef4444" />,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="qrcode-page">
            <header className="header">
                <div className="logo">
                    {schoolInfo?.logo && (
                        <img 
                            src={`${api.defaults.baseURL}/storage/${schoolInfo.logo}`} 
                            alt={schoolInfo.nome}
                            style={{ maxWidth: '150px', height: 'auto' }}
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                    )}
                </div>
                
                {user && (
                    <div className="user-info">
                        {user.image ? (
                            <img 
                                src={user.image} 
                                alt={user.name}
                                className="user-avatar"
                                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                            />
                        ) : (
                            <div className="user-avatar-placeholder">
                                <UserIcon size={20} />
                            </div>
                        )}
                        <div className="user-details">
                            {/* <span className="user-name">{user.name}</span> */}
                            <button onClick={handleLogout} className="logout-btn">
                                <LogOutIcon size={16} />
                                <span>Sair</span>
                            </button>
                        </div>
                    </div>
                )}
            </header>

            <main className="main-content">
                <div className="scanner-section">
                    <h2 className="section-title">
                        <ScanIcon size={24} color="#2563eb" />
                        <span>Leitor de QR Code</span>
                    </h2>
                    <div id="reader" className="reader-container"></div>
                </div>

                {loading && (
                    <div className="loading-indicator">
                        <div className="loading-spinner"></div>
                        <span>Carregando...</span>
                    </div>
                )}

                {produto && (
                    <div className="product-card">
                        <div className="product-header">
                            <h2 className="product-title">{produto.nome}</h2>
                            <span className={`status-badge status-${produto.status.toLowerCase()}`}>
                                {produto.status}
                            </span>
                        </div>

                        <div className="product-info">
                            <div className="info-item">
                                <span className="info-label">QR Code</span>
                                <span className="info-value">{produto.qrcode_label}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Estoque Atual</span>
                                <span className="info-value">{produto.estoque}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Estoque Mínimo</span>
                                <span className="info-value">{produto.estoque_minimo}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Posição</span>
                                <span className="info-value">{produto.posicao}</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="movement-form">
                            <div className="form-group">
                                <label className="form-label">Tipo de Movimentação</label>
                                <div className="type-buttons">
                                    <button
                                        type="button"
                                        className={`type-button ${type === 'entrada' ? 'active' : ''}`}
                                        onClick={() => setType('entrada')}
                                    >
                                        <ArrowUpIcon size={18} />
                                        Entrada
                                    </button>
                                    <button
                                        type="button"
                                        className={`type-button ${type === 'saida' ? 'active' : ''}`}
                                        onClick={() => setType('saida')}
                                    >
                                        <ArrowDownIcon size={18} />
                                        Saída
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="quantity" className="form-label">Quantidade</label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="quantity-input"
                                    leftIcon={<PackageIcon size={18} color="#6b7280" />}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="notes" className="form-label">Observações</label>
                                <div className="textarea-wrapper">
                                    <FileTextIcon size={18} className="textarea-icon" />
                                    <textarea
                                        id="notes"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="notes-input"
                                        placeholder="Adicione observações sobre a movimentação"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="submit-button"
                                disabled={loading}
                                variant="primary"
                                iconLeft={!loading ? <CheckIcon size={18} /> : undefined}
                            >
                                {loading ? "Processando..." : "Confirmar Movimentação"}
                            </Button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default LerQRCode; 