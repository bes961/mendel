import React from 'react';

/**
 * IconGradients - Componente que define gradientes SVG para uso com ícones
 * Este componente deve ser adicionado uma vez no layout principal da aplicação
 */
const IconGradients: React.FC = () => {
  return (
    <svg className="gradient-defs" aria-hidden="true" width="0" height="0">
      {/* Gradiente padrão */}
      <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
      
      {/* Gradiente azul-roxo */}
      <linearGradient id="blue-purple-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
      
      {/* Gradiente verde-azul */}
      <linearGradient id="green-blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      
      {/* Gradiente laranja-vermelho */}
      <linearGradient id="orange-red-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
      
      {/* Gradiente roxo-rosa */}
      <linearGradient id="purple-pink-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
      
      {/* Gradiente ciano-verde */}
      <linearGradient id="cyan-green-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#22c55e" />
      </linearGradient>
    </svg>
  );
};

export default IconGradients; 