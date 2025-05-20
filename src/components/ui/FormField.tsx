import React from 'react';
import { Input } from './input';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import StylizedIcon from './StylizedIcon';
import { useToast } from './use-toast';

interface FormFieldProps {
  /**
   * ID único do campo
   */
  id: string;
  
  /**
   * Nome do campo para associação com o formulário
   */
  name: string;
  
  /**
   * Tipo do campo de entrada (text, email, password, etc.)
   */
  type: string;
  
  /**
   * Texto do label do campo
   */
  label: string;
  
  /**
   * Valor atual do campo
   */
  value: string;
  
  /**
   * Função para atualizar o valor do campo
   */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  /**
   * Texto de placeholder
   */
  placeholder?: string;
  
  /**
   * Ícone para exibir no início do campo
   */
  icon?: IconDefinition;
  
  /**
   * Indica se o campo é obrigatório
   */
  required?: boolean;
  
  /**
   * Propriedades de preenchimento automático
   */
  autoComplete?: string;
  
  /**
   * Texto de erro para exibir quando a validação falhar
   */
  errorMessage?: string;
  
  /**
   * Função para validar o campo
   */
  validate?: (value: string) => boolean;
  
  /**
   * Ícone de alternância no final do campo (útil para campos de senha)
   */
  endAdornment?: React.ReactNode;
  
  /**
   * Classes CSS adicionais para customização
   */
  className?: string;
  
  /**
   * Classes CSS adicionais para o input
   */
  inputClassName?: string;
}

/**
 * Componente de campo de formulário reutilizável
 * 
 * Este componente pode ser usado para diferentes tipos de campos de entrada,
 * com suporte para ícones, validação, mensagens de erro e customização.
 */
const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  type,
  label,
  value,
  onChange,
  placeholder,
  icon,
  required = false,
  autoComplete,
  errorMessage,
  validate,
  endAdornment,
  className = '',
  inputClassName = '',
}) => {
  const { toast } = useToast();
  
  // Validar campo ao perder o foco, se uma função de validação for fornecida
  const handleBlur = () => {
    if (validate && value && !validate(value)) {
      toast({
        title: "Validação",
        description: errorMessage || `Campo ${label} inválido`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="input-wrapper">
        {icon && (
          <span className="input-icon-container">
            <StylizedIcon 
              icon={<FontAwesomeIcon icon={icon} />} 
              className="input-icon"
              variant="primary" 
            />
          </span>
        )}
        <Input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={validate ? handleBlur : undefined}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={`input-field ${icon ? 'with-icon' : ''} ${inputClassName}`}
          style={{ 
            paddingLeft: icon ? '3.5rem' : '1rem'
          }}
        />
        {endAdornment}
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default FormField; 