/**
 * Composant générique de formulaire pour l'admin Hendrix
 */

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminFieldConfig, FieldChoice } from '../../types';

interface AdminFormProps {
  fields: AdminFieldConfig[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel?: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export const AdminForm: React.FC<AdminFormProps> = ({
  fields,
  initialData,
  onSubmit,
  onCancel,
  title,
  description,
  isLoading = false
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: initialData
  });

  const handleFormSubmit = async (data: Record<string, any>) => {
    try {
      await onSubmit(data);
      if (!initialData) {
        reset(); // Reset form for create mode
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const renderField = (field: AdminFieldConfig) => {
    const { name, label, type, required, readonly, choices } = field;

    switch (type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <div key={name} className="space-y-2">
            <label htmlFor={name} className="text-sm font-medium">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              id={name}
              type={type}
              readOnly={readonly}
              {...register(name, { required: required ? `${label} est requis` : false })}
              className={errors[name] ? 'border-red-500' : ''}
            />
            {errors[name] && (
              <p className="text-sm text-red-500">{errors[name]?.message as string}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={name} className="space-y-2">
            <label htmlFor={name} className="text-sm font-medium">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              id={name}
              readOnly={readonly}
              rows={4}
              {...register(name, { required: required ? `${label} est requis` : false })}
              className={`w-full p-2 border rounded-md ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors[name] && (
              <p className="text-sm text-red-500">{errors[name]?.message as string}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={name} className="space-y-2">
            <label htmlFor={name} className="text-sm font-medium">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              id={name}
              disabled={readonly}
              {...register(name, { required: required ? `${label} est requis` : false })}
              className={`w-full p-2 border rounded-md ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Sélectionner...</option>
              {choices?.map((choice: FieldChoice) => (
                <option key={choice.value} value={choice.value}>
                  {choice.label}
                </option>
              ))}
            </select>
            {errors[name] && (
              <p className="text-sm text-red-500">{errors[name]?.message as string}</p>
            )}
          </div>
        );

      case 'boolean':
        return (
          <div key={name} className="flex items-center space-x-2">
            <input
              id={name}
              type="checkbox"
              disabled={readonly}
              {...register(name)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={name} className="text-sm font-medium">
              {label}
            </label>
          </div>
        );

      case 'date':
      case 'datetime':
        return (
          <div key={name} className="space-y-2">
            <label htmlFor={name} className="text-sm font-medium">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              id={name}
              type={type === 'datetime' ? 'datetime-local' : 'date'}
              readOnly={readonly}
              {...register(name, { required: required ? `${label} est requis` : false })}
              className={errors[name] ? 'border-red-500' : ''}
            />
            {errors[name] && (
              <p className="text-sm text-red-500">{errors[name]?.message as string}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {fields.map(renderField)}
          
          <div className="flex justify-end space-x-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
