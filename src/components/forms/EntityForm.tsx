import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { ImageSelector } from "@/components/ui/image-selector";
import type { EntityConfig, EntityField, BaseEntity } from '../../types';

interface EntityFormProps<T extends BaseEntity> {
  config: EntityConfig<T>;
  entity?: T;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}

// Create a dynamic schema based on entity configuration
function createSchema(fields: EntityField[]) {
  const schemaFields: Record<string, z.ZodType> = {};
  
  fields.forEach(field => {
    let fieldSchema: z.ZodType;
    
    switch (field.type) {
      case 'email':
        fieldSchema = z.string().email('Invalid email address');
        break;
      case 'password':
        fieldSchema = z.string().min(field.validation?.min || 6, `Must be at least ${field.validation?.min || 6} characters`);
        break;
      case 'date':
        fieldSchema = z.string();
        break;
      case 'boolean':
        fieldSchema = z.boolean();
        break;
      case 'textarea':
      case 'text':
      default:
        fieldSchema = z.string();
        if (field.validation?.min) {
          fieldSchema = (fieldSchema as z.ZodString).min(field.validation.min, `Must be at least ${field.validation.min} characters`);
        }
        if (field.validation?.max) {
          fieldSchema = (fieldSchema as z.ZodString).max(field.validation.max, `Must be at most ${field.validation.max} characters`);
        }
        break;
    }
    
    if (!field.required) {
      fieldSchema = fieldSchema.optional();
    }
    
    schemaFields[field.key] = fieldSchema;
  });
  
  return z.object(schemaFields);
}

export function EntityForm<T extends BaseEntity>({ config, entity, onSubmit, onCancel }: EntityFormProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const schema = createSchema(config.fields);
  type FormData = z.infer<typeof schema>;

  // Create default values
  const defaultValues: Record<string, unknown> = {};
  config.fields.forEach(field => {
    if (entity && field.key in entity) {
      const value = entity[field.key as keyof T];
      if (field.type === 'date') {
        if (value instanceof Date) {
          defaultValues[field.key] = value.toISOString().split('T')[0];
        } else if (typeof value === 'string') {
          // Handle date strings from API
          const date = new Date(value);
          defaultValues[field.key] = isNaN(date.getTime()) ? value : date.toISOString().split('T')[0];
        } else {
          defaultValues[field.key] = '';
        }
      } else if (field.type === 'boolean') {
        defaultValues[field.key] = Boolean(value);
      } else {
        defaultValues[field.key] = value;
      }
    } else {
      defaultValues[field.key] = field.type === 'boolean' ? false : '';
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError('');
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: EntityField) => {
    const fieldError = errors[field.key as keyof FormData];
    const errorMessage = fieldError?.message as string | undefined;

    switch (field.type) {
      case 'boolean':
        return (
          <div key={field.key} className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={field.key}
                {...register(field.key as keyof FormData)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                disabled={field.readonly}
                aria-invalid={errorMessage ? "true" : "false"}
                aria-describedby={errorMessage ? `${field.key}-error` : undefined}
              />
              <label htmlFor={field.key} className="text-sm font-medium">
                {field.label}
                {field.required && <span aria-hidden="true" className="text-red-500 ml-1">*</span>}
              </label>
            </div>
            {errorMessage && (
              <FormError message={errorMessage} id={`${field.key}-error`} />
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.key} className="space-y-2">
            <label htmlFor={field.key} className="block text-sm font-medium">
              {field.label}
              {field.required && <span aria-hidden="true" className="text-red-500 ml-1">*</span>}
            </label>
            <select
              id={field.key}
              {...register(field.key as keyof FormData)}
              className={`w-full rounded-md border px-3 py-2 text-sm ${
                errorMessage ? "border-destructive" : "border-input"
              }`}
              disabled={field.readonly}
              aria-invalid={errorMessage ? "true" : "false"}
              aria-describedby={errorMessage ? `${field.key}-error` : undefined}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errorMessage && (
              <FormError message={errorMessage} id={`${field.key}-error`} />
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.key} className="space-y-2">
            <label htmlFor={field.key} className="block text-sm font-medium">
              {field.label}
              {field.required && <span aria-hidden="true" className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              id={field.key}
              {...register(field.key as keyof FormData)}
              className={`w-full rounded-md border px-3 py-2 text-sm ${
                errorMessage ? "border-destructive" : "border-input"
              }`}
              placeholder={field.placeholder}
              disabled={field.readonly}
              rows={4}
              aria-invalid={errorMessage ? "true" : "false"}
              aria-describedby={errorMessage ? `${field.key}-error` : undefined}
            />
            {errorMessage && (
              <FormError message={errorMessage} id={`${field.key}-error`} />
            )}
          </div>
        );

      default:
        // Special handling for image URL fields
        if (field.key.toLowerCase().includes('url') && 
            (field.key.toLowerCase().includes('image') || 
             field.key.toLowerCase().includes('thumbnail') || 
             field.key.toLowerCase().includes('avatar'))) {
          
          // Determine the appropriate image category based on field context
          let imageCategory: 'letters' | 'animals' | 'numbers' | 'hand_numbers' | 'fruits' | 'general' = 'general';
          
          if (field.key.toLowerCase().includes('thumbnail')) {
            // For exercise thumbnails, try to determine category from the config name
            const configName = config.name.toLowerCase();
            if (configName.includes('letter')) imageCategory = 'letters';
            else if (configName.includes('animal')) imageCategory = 'animals';
            else if (configName.includes('number')) imageCategory = 'numbers';
            else if (configName.includes('color')) imageCategory = 'fruits';
            else imageCategory = 'general';
          } else if (field.key.toLowerCase().includes('avatar')) {
            imageCategory = 'general';
          } else {
            // Infer category from the field key or form context
            const keyLower = field.key.toLowerCase();
            if (keyLower.includes('letter')) imageCategory = 'letters';
            else if (keyLower.includes('animal')) imageCategory = 'animals';
            else if (keyLower.includes('number')) imageCategory = 'numbers';
            else if (keyLower.includes('hand')) imageCategory = 'hand_numbers';
            else if (keyLower.includes('color') || keyLower.includes('fruit')) imageCategory = 'fruits';
          }

          return (
            <div key={field.key}>
              <ImageSelector
                label={field.label + (field.required ? ' *' : '')}
                value={watch(field.key as keyof FormData) as string || ''}
                onChange={(url) => {
                  setValue(field.key as keyof FormData, url as FormData[keyof FormData]);
                }}
                category={imageCategory}
                placeholder={field.placeholder}
              />
              {errorMessage && (
                <FormError message={errorMessage} id={`${field.key}-error`} />
              )}
            </div>
          );
        }

        // Regular text input for non-image fields
        return (
          <div key={field.key} className="space-y-2">
            <label htmlFor={field.key} className="block text-sm font-medium">
              {field.label}
              {field.required && <span aria-hidden="true" className="text-red-500 ml-1">*</span>}
            </label>
            <Input
              id={field.key}
              type={field.type}
              {...register(field.key as keyof FormData)}
              className={errorMessage ? "border-destructive" : ""}
              placeholder={field.placeholder}
              disabled={field.readonly}
              aria-invalid={errorMessage ? "true" : "false"}
              aria-describedby={errorMessage ? `${field.key}-error` : undefined}
            />
            {errorMessage && (
              <FormError message={errorMessage} id={`${field.key}-error`} />
            )}
          </div>
        );
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(handleFormSubmit)} 
      className="space-y-6" 
      aria-label={entity ? `Update ${config.displayName.toLowerCase()} form` : `Create ${config.displayName.toLowerCase()} form`}
      noValidate
    >
      <div className="mb-6 pb-4 border-b border-border">
        <h3 className="text-lg font-medium" id="form-heading">
          {config.displayName} Information
        </h3>
        <p className="text-sm text-muted-foreground">
          Enter the required details to {entity ? "update" : "create"} {entity ? "this" : "a"} {config.displayName.toLowerCase()}.
        </p>
      </div>

      {config.fields.map(renderField)}

      {error && (
        <div className="rounded-md bg-destructive/15 p-3">
          <div className="text-sm text-destructive">{error}</div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting 
            ? `${entity ? 'Updating' : 'Creating'}...` 
            : `${entity ? 'Update' : 'Create'} ${config.displayName}`
          }
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
