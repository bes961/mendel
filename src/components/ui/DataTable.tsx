import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortUp, faSortDown, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';

interface Column<T> {
  /**
   * Título da coluna
   */
  header: string;
  
  /**
   * Chave para acessar os dados (pode ser uma função para campos calculados)
   */
  accessor: keyof T | ((item: T) => React.ReactNode);
  
  /**
   * Se a coluna é ordenável
   */
  sortable?: boolean;
  
  /**
   * Renderizador personalizado para a célula
   */
  cell?: (value: any, item: T, index: number) => React.ReactNode;
  
  /**
   * Classes adicionais para a coluna
   */
  className?: string;
  
  /**
   * Largura da coluna (ex: 200px, 20%, etc.)
   */
  width?: string;
}

interface DataTableProps<T> {
  /**
   * Dados para exibir na tabela
   */
  data: T[];
  
  /**
   * Definições das colunas
   */
  columns: Column<T>[];
  
  /**
   * Chave única para identificar cada linha
   */
  keyField: keyof T;
  
  /**
   * Se a tabela deve mostrar o cabeçalho
   */
  showHeader?: boolean;
  
  /**
   * Se deve mostrar a paginação
   */
  pagination?: boolean;
  
  /**
   * Número de linhas por página
   */
  rowsPerPage?: number;
  
  /**
   * Se deve mostrar a barra de pesquisa
   */
  searchable?: boolean;
  
  /**
   * Campos para pesquisar (se não fornecido, pesquisa em todos os campos)
   */
  searchFields?: Array<keyof T>;
  
  /**
   * Função para lidar com cliques em linha
   */
  onRowClick?: (item: T) => void;
  
  /**
   * Classes adicionais para a tabela
   */
  className?: string;
  
  /**
   * Texto a exibir quando não há dados
   */
  noDataText?: string;
  
  /**
   * Indica se os dados estão sendo carregados
   */
  loading?: boolean;
  
  /**
   * Texto a exibir durante o carregamento
   */
  loadingText?: string;
}

/**
 * Componente de tabela reutilizável com diversos recursos
 * 
 * Suporta ordenação, paginação, pesquisa, renderização personalizada e outros recursos
 */
function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  showHeader = true,
  pagination = true,
  rowsPerPage = 10,
  searchable = true,
  searchFields,
  onRowClick,
  className = '',
  noDataText = 'Nenhum dado encontrado',
  loading = false,
  loadingText = 'Carregando dados...',
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  // Função para ordenar dados
  const handleSort = (field: keyof T | ((item: T) => React.ReactNode)) => {
    if (typeof field === 'function') return; // Não ordena campos calculados

    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field as keyof T);
      setSortDirection('asc');
    }
  };

  // Filtrar dados com base no termo de pesquisa
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const lowercasedTerm = searchTerm.toLowerCase();
    
    return data.filter(item => {
      if (searchFields && searchFields.length > 0) {
        // Pesquisar apenas nos campos especificados
        return searchFields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(lowercasedTerm);
        });
      } else {
        // Pesquisar em todos os campos
        return Object.values(item).some(
          value => value && String(value).toLowerCase().includes(lowercasedTerm)
        );
      }
    });
  }, [data, searchTerm, searchFields]);

  // Ordenar dados
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      
      if (valA === valB) return 0;
      
      let comparison = 0;
      if (valA === null || valA === undefined) comparison = -1;
      else if (valB === null || valB === undefined) comparison = 1;
      else comparison = valA > valB ? 1 : -1;
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortField, sortDirection]);

  // Paginar dados
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, pagination, page, rowsPerPage]);

  // Total de páginas para paginação
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  // Renderizador personalizado para o cabeçalho
  const renderHeader = () => {
    if (!showHeader) return null;

    return (
      <thead>
        <tr>
          {columns.map((column, index) => {
            const isSorted = column.accessor === sortField && typeof column.accessor !== 'function';
            
            return (
              <th 
                key={index}
                className={`table-header ${column.className || ''} ${column.sortable ? 'sortable' : ''}`}
                style={{ width: column.width }}
                onClick={column.sortable && typeof column.accessor !== 'function' 
                  ? () => handleSort(column.accessor) 
                  : undefined
                }
              >
                <div className="header-content">
                  {column.header}
                  
                  {column.sortable && typeof column.accessor !== 'function' && (
                    <span className="sort-icon">
                      <FontAwesomeIcon 
                        icon={isSorted 
                          ? (sortDirection === 'asc' ? faSortUp : faSortDown)
                          : faSort
                        } 
                        size="xs"
                      />
                    </span>
                  )}
                </div>
              </th>
            );
          })}
        </tr>
      </thead>
    );
  };

  // Renderizador para o corpo da tabela
  const renderBody = () => {
    if (loading) {
      return (
        <tbody>
          <tr>
            <td colSpan={columns.length} className="text-center py-8">
              <div className="flex flex-col items-center justify-center">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" className="mb-2" />
                <p>{loadingText}</p>
              </div>
            </td>
          </tr>
        </tbody>
      );
    }

    if (paginatedData.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan={columns.length} className="text-center py-8">
              {noDataText}
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {paginatedData.map((item, rowIndex) => (
          <tr 
            key={String(item[keyField])}
            className={onRowClick ? 'clickable' : ''}
            onClick={onRowClick ? () => onRowClick(item) : undefined}
          >
            {columns.map((column, colIndex) => {
              // Extrair o valor com base no accessor
              let value;
              if (typeof column.accessor === 'function') {
                value = column.accessor(item);
              } else {
                value = item[column.accessor];
              }

              // Renderizar a célula
              return (
                <td 
                  key={`${rowIndex}-${colIndex}`} 
                  className={column.className || ''}
                >
                  {column.cell 
                    ? column.cell(value, item, rowIndex)
                    : value !== null && value !== undefined ? String(value) : ''}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    );
  };

  // Renderizador para a paginação
  const renderPagination = () => {
    if (!pagination || totalPages <= 1) return null;

    return (
      <div className="pagination">
        <button 
          onClick={() => setPage(0)} 
          disabled={page === 0}
          className="pagination-button"
        >
          Início
        </button>
        
        <button 
          onClick={() => setPage(p => Math.max(0, p - 1))} 
          disabled={page === 0}
          className="pagination-button"
        >
          Anterior
        </button>
        
        <span className="pagination-info">
          Página {page + 1} de {totalPages}
        </span>
        
        <button 
          onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} 
          disabled={page >= totalPages - 1}
          className="pagination-button"
        >
          Próxima
        </button>
        
        <button 
          onClick={() => setPage(totalPages - 1)} 
          disabled={page >= totalPages - 1}
          className="pagination-button"
        >
          Fim
        </button>
      </div>
    );
  };

  // Renderizador para a barra de pesquisa
  const renderSearchBar = () => {
    if (!searchable) return null;

    return (
      <div className="search-bar">
        <div className="search-input-wrapper">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input 
            type="text"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setPage(0); // Voltar para a primeira página ao pesquisar
            }}
            className="search-input"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="data-table-container">
      {renderSearchBar()}
      
      <div className="table-wrapper">
        <table className={`data-table ${className}`}>
          {renderHeader()}
          {renderBody()}
        </table>
      </div>
      
      {renderPagination()}
    </div>
  );
}

export default DataTable; 