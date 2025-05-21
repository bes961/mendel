import axios, { AxiosError, AxiosResponse } from 'axios';

/**
 * Configuração da instância do Axios para comunicação com a API
 */
const api = axios.create({
    baseURL: 'https://mendelapi.domcloud.dev/',
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
    console.log('Token de autenticação:', token); // Log para depuração
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error: AxiosError) => {
    console.error('Erro no interceptor de requisição:', error);
    return Promise.reject(error);
});

/**
 * Interceptor para tratamento global de erros
 */
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        console.error('Erro na resposta da API:', error.response); // Log do erro para depuração

        // Verificar se é erro de autenticação (401) e não está na rota de login
        if (error.response?.status === 401 && !error.config?.url?.includes('auth/login')) {
            console.log('Token expirado ou inválido. Redirecionando para login...');
            localStorage.removeItem('token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

/**
 * Serviço para obter informações da escola
 */
export const schoolService = {
    /**
     * Obtém informações da escola
     */
    getInfo: async (): Promise<AxiosResponse<ApiResponse>> => {
        try {
            console.log('Enviando requisição para obter informações da escola...');
            const response = await api.get('/api/v1/school/info');
            console.log('Resposta da API:', response.data); // Log da resposta
            return response;
        } catch (error) {
            console.error('Erro ao obter informações da escola:', error);
            throw error; // Lança novamente o erro para ser tratado por quem chamou
        }
    }
};

/**
 * Função para testar o serviço da escola
 */
const testSchoolService = async () => {
    try {
        const response = await schoolService.getInfo();
        console.log('Informações da escola:', response.data);
    } catch (error) {
        console.error('Erro ao chamar o serviço da escola:', error);
        alert('Erro ao obter informações da escola. Confira o console para mais detalhes.');
    }
};

// Chamada do teste de serviço (pode ser usada no componente ou onde necessário)
testSchoolService();

