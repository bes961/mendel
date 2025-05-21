import axios, { AxiosError, AxiosResponse } from 'axios';

/**
 * Configuração da instância do Axios para comunicação com a API
 */
const api = axios.create({
    baseURL: 'https://2035-189-109-78-139.ngrok-free.app',
    // withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

/**
 * Interface para as respostas padrão da API
 */
export interface ApiResponse<T = any> {
    data?: T;
    message?: string;
    status?: string;
    error?: string;
}

/**
 * Interface para paginação
 */
export interface PaginatedResponse<T = any> {
    data: T[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
        links?: {
            url?: string;
            label: string;
            active: boolean;
        }[];
    };
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
}

/**
 * Interceptor para adicionar o token de autenticação em cada requisição
 */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Interceptor para tratamento global de erros
 */
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Verificar se é erro de autenticação (401) e não está na rota de login
        if (error.response?.status === 401 && !error.config?.url?.includes('auth/login')) {
            localStorage.removeItem('token');
            
            // Redirecionar para login quando o token expirar
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

/**
 * Serviços de autenticação
 */
export const authService = {
    /**
     * Executa o login do usuário
     */
    login: async (email: string, password: string): Promise<AxiosResponse<ApiResponse>> => {
        return api.post('/api/v1/auth/login', { email, password });
    },
    
    /**
     * Executa o logout do usuário
     */
    logout: async (): Promise<void> => {
        await api.post('/api/v1/auth/logout');
        localStorage.removeItem('token');
    },
    
    /**
     * Obtém informações do usuário logado
     */
    getCurrentUser: async (): Promise<AxiosResponse<ApiResponse>> => {
        return api.get('/api/v1/auth/user');
    },
    
    /**
     * Verifica se o usuário está autenticado
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    }
};

/**
 * Serviços de configuração da escola
 */
export const schoolService = {
    /**
     * Obtém informações da escola
     */
    getInfo: async (): Promise<AxiosResponse<ApiResponse>> => {
        return api.get('/api/v1/school/info');
    }
};

/**
 * Serviços para gerenciamento de produtos
 */
export const productService = {
    /**
     * Lista todos os produtos (com paginação)
     */
    getAll: async (page = 1, search = ''): Promise<AxiosResponse<PaginatedResponse>> => {
        return api.get('/api/v1/products', { params: { page, search } });
    },
    
    /**
     * Obtém um produto específico
     */
    getById: async (id: number): Promise<AxiosResponse<ApiResponse>> => {
        return api.get(`/api/v1/products/${id}`);
    },
    
    /**
     * Cria um novo produto
     */
    create: async (data: any): Promise<AxiosResponse<ApiResponse>> => {
        return api.post('/api/v1/products', data);
    },
    
    /**
     * Atualiza um produto existente
     */
    update: async (id: number, data: any): Promise<AxiosResponse<ApiResponse>> => {
        return api.put(`/api/v1/products/${id}`, data);
    },
    
    /**
     * Remove um produto
     */
    delete: async (id: number): Promise<AxiosResponse<ApiResponse>> => {
        return api.delete(`/api/v1/products/${id}`);
    }
};

/**
 * Serviços para gerenciamento de movimentação de estoque
 */
export const stockService = {
    /**
     * Registra um movimento de entrada no estoque
     */
    addStock: async (productId: number, quantity: number, locationId: number): Promise<AxiosResponse<ApiResponse>> => {
        return api.post('/api/v1/stock/add', { product_id: productId, quantity, location_id: locationId });
    },
    
    /**
     * Registra um movimento de saída no estoque
     */
    removeStock: async (productId: number, quantity: number, reason: string): Promise<AxiosResponse<ApiResponse>> => {
        return api.post('/api/v1/stock/remove', { product_id: productId, quantity, reason });
    },
    
    /**
     * Obtém o histórico de movimentações
     */
    getMovements: async (page = 1, filters = {}): Promise<AxiosResponse<PaginatedResponse>> => {
        return api.get('/api/v1/stock/movements', { params: { page, ...filters } });
    },
    
    /**
     * Obtém o resumo do estoque atual
     */
    getStockSummary: async (): Promise<AxiosResponse<ApiResponse>> => {
        return api.get('/api/v1/stock/summary');
    }
};

/**
 * Serviços para gerenciamento de categorias
 */
export const categoryService = {
    /**
     * Lista todas as categorias
     */
    getAll: async (): Promise<AxiosResponse<ApiResponse>> => {
        return api.get('/api/v1/categories');
    },
    
    /**
     * Cria uma nova categoria
     */
    create: async (name: string): Promise<AxiosResponse<ApiResponse>> => {
        return api.post('/api/v1/categories', { name });
    },
    
    /**
     * Atualiza uma categoria existente
     */
    update: async (id: number, name: string): Promise<AxiosResponse<ApiResponse>> => {
        return api.put(`/api/v1/categories/${id}`, { name });
    },
    
    /**
     * Remove uma categoria
     */
    delete: async (id: number): Promise<AxiosResponse<ApiResponse>> => {
        return api.delete(`/api/v1/categories/${id}`);
    }
};

/**
 * Serviços para manipulação de QR Code
 */
export const qrCodeService = {
    /**
     * Valida um QR Code lido
     */
    validateQRCode: async (code: string): Promise<AxiosResponse<ApiResponse>> => {
        return api.post('/api/v1/qrcode/validate', { code });
    },
    
    /**
     * Gera um QR Code para um produto
     */
    generateForProduct: async (productId: number): Promise<AxiosResponse<ApiResponse>> => {
        return api.get(`/api/v1/qrcode/generate/${productId}`);
    }
};

export default api; 