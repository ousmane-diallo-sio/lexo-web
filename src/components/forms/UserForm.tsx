import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { User } from '../../types';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";

const userSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    birthdate: z.string().optional(),
    isAdmin: z.boolean().optional(),
    adminCreationKey: z.string().optional(),
    googleId: z.string().optional(),
    emailVerified: z.boolean().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .refine((data) => {
    // If isAdmin is true, adminCreationKey should be provided
    return !data.isAdmin || (data.isAdmin && data.adminCreationKey && data.adminCreationKey.length > 0);
  }, {
    message: "Admin creation key is required for admin users",
    path: ["adminCreationKey"]
  });

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
}

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user
      ? {
          email: user.email,
          username: user.username,
          birthdate: user.birthdate?.toISOString().split('T')[0],
          isAdmin: user.isAdmin,
          googleId: user.googleId,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt?.toISOString(),
          updatedAt: user.updatedAt?.toISOString(),
        }
      : {
          isAdmin: false,
          emailVerified: false,
        },
  });

  const isAdmin = watch('isAdmin');

  const handleFormSubmit = async (data: UserFormData) => {
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

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" aria-label={user ? "Update user form" : "Create user form"} noValidate>
      <div className="mb-6 pb-4 border-b border-border">
        <h3 className="text-lg font-medium" id="form-heading">User Information</h3>
        <p className="text-sm text-muted-foreground">Enter the required details to {user ? "update" : "create"} a user.</p>
      </div>

      {user && (
        <div className="space-y-2">
          <label htmlFor="userId" className="block text-sm font-medium">
            User ID
          </label>
          <Input
            id="userId"
            type="text"
            value={user.id}
            className="text-muted-foreground"
            disabled
            aria-readonly="true"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Unique identifier for this user (read-only)
          </p>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium form-label">
          Email <span aria-hidden="true">*</span>
          <span className="sr-only"> (required)</span>
        </label>
        <Input
          type="email"
          id="email"
          {...register('email')}
          className={errors.email ? "border-destructive" : ""}
          placeholder="user@example.com"
          autoComplete="email"
          aria-required="true"
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <FormError message={errors.email.message} id="email-error" />
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium form-label">
          Username <span aria-hidden="true">*</span>
          <span className="sr-only"> (required)</span>
        </label>
        <Input
          type="text"
          id="username"
          {...register('username')}
          className={errors.username ? "border-destructive" : ""}
          placeholder="username"
          autoComplete="username"
          aria-required="true"
          aria-invalid={errors.username ? "true" : "false"}
          aria-describedby={errors.username ? "username-error" : undefined}
          minLength={3}
        />
        {errors.username && (
          <FormError message={errors.username.message} id="username-error" />
        )}
      </div>

      {!user && (
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password <span aria-hidden="true">*</span>
            <span className="sr-only"> (required)</span>
          </label>
          <Input
            type="password"
            id="password"
            {...register('password')}
            className={errors.password ? "border-destructive" : ""}
            placeholder="••••••••"
            autoComplete="new-password"
            aria-required="true"
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby="password-requirements password-error"
            minLength={6}
          />
          {errors.password && (
            <FormError message={errors.password.message} id="password-error" />
          )}
          <p className="text-xs text-muted-foreground mt-1" id="password-requirements">
            Must be at least 6 characters
          </p>
        </div>
      )}

      <div className="my-6 flex items-center">
        <div className="h-px flex-1 bg-border"></div>
        <span className="px-3 text-xs text-muted-foreground font-medium">Additional Information</span>
        <div className="h-px flex-1 bg-border"></div>
      </div>

      <div className="space-y-2">
        <label htmlFor="birthdate" className="block text-sm font-medium">
          Birthdate
        </label>
        <div className="relative">
          <Input
            id="birthdate"
            type="date"
            placeholder="YYYY-MM-DD"
            {...register('birthdate')}
            className={`w-full justify-start text-left font-normal pl-10 ${
              errors.birthdate ? "border-destructive" : ""
            }`}
            aria-invalid={errors.birthdate ? "true" : "false"}
            aria-describedby={errors.birthdate ? "birthdate-error" : undefined}
            // Hide the default calendar icon
            style={{ 
              colorScheme: 'light',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
            }}
          />
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        </div>
        {errors.birthdate && (
          <FormError message={errors.birthdate.message} id="birthdate-error" />
        )}
        <p className="text-xs text-muted-foreground mt-1">
          User's date of birth (optional)
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="googleId" className="block text-sm font-medium">
          Google ID
        </label>
        <Input
          id="googleId"
          type="text"
          {...register('googleId')}
          className={errors.googleId ? "border-destructive" : ""}
          placeholder="Google account ID"
          aria-invalid={errors.googleId ? "true" : "false"}
          aria-describedby={errors.googleId ? "googleId-error" : undefined}
        />
        {errors.googleId && (
          <FormError message={errors.googleId.message} id="googleId-error" />
        )}
        <p className="text-xs text-muted-foreground mt-1">
          User's Google account identifier (if applicable)
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="emailVerified"
            {...register('emailVerified')}
            className="h-4 w-4 rounded border-gray-300 focus:ring-offset-2 focus:ring-2 focus:ring-primary"
            aria-describedby="emailVerified-description"
          />
          <div>
            <label htmlFor="emailVerified" className="text-sm font-medium cursor-pointer form-label">
              Email verified
            </label>
            <p id="emailVerified-description" className="text-xs text-muted-foreground mt-1">
              Indicates whether the user's email address has been verified
            </p>
          </div>
        </div>
      </div>

      {user && (
        <>
          <div className="space-y-2">
            <label htmlFor="createdAt" className="block text-sm font-medium">
              Created At
            </label>
            <Input
              id="createdAt"
              type="datetime-local"
              {...register('createdAt')}
              className="text-muted-foreground"
              disabled
              aria-readonly="true"
            />
            <p className="text-xs text-muted-foreground mt-1">
              When the user account was created (read-only)
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="updatedAt" className="block text-sm font-medium">
              Updated At
            </label>
            <Input
              id="updatedAt"
              type="datetime-local"
              {...register('updatedAt')}
              className="text-muted-foreground"
              disabled
              aria-readonly="true"
            />
            <p className="text-xs text-muted-foreground mt-1">
              When the user account was last updated (read-only)
            </p>
          </div>
        </>
      )}

      <div className="flex items-center space-x-2 py-4">
        <input
          type="checkbox"
          id="isAdmin"
          {...register('isAdmin')}
          className="h-4 w-4 rounded border-gray-300 focus:ring-offset-2 focus:ring-2 focus:ring-primary"
          aria-describedby="admin-description"
        />
        <div>
          <label htmlFor="isAdmin" className="text-sm font-medium cursor-pointer form-label">
            Admin user
          </label>
          <span className="ml-2 inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
            Special privileges
          </span>
          <p id="admin-description" className="text-xs text-muted-foreground mt-1">
            Admin users have full access to manage all users and system settings
          </p>
        </div>
      </div>

      {isAdmin && (
        <div className="space-y-2 mt-2 p-3 border border-primary/20 rounded-md bg-primary/5">
          <label
            htmlFor="adminCreationKey"
            className="block text-sm font-medium form-label"
          >
            Admin Creation Key <span aria-hidden="true">*</span>
            <span className="sr-only"> (required for admin users)</span>
          </label>
          <Input
            type="password"
            id="adminCreationKey"
            {...register('adminCreationKey')}
            className={errors.adminCreationKey ? "border-destructive" : ""}
            placeholder="••••••••"
            aria-required="true"
            aria-invalid={errors.adminCreationKey ? "true" : "false"}
            aria-describedby={errors.adminCreationKey ? "admin-key-error" : "admin-key-help"}
            autoComplete="off"
          />
          {errors.adminCreationKey && (
            <FormError message={errors.adminCreationKey.message} id="admin-key-error" />
          )}
          <p className="text-xs text-muted-foreground mt-1" id="admin-key-help">
            Required for admin creation. This key is provided by system administrators.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 p-3 rounded-md mt-4" role="alert">
          <FormError message={error} className="text-destructive font-medium" />
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-6 mt-4 border-t" role="group" aria-label="Form actions">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="px-6"
          aria-label="Cancel form submission"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-6 min-w-28 font-medium"
          aria-live="polite"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="sr-only">Saving changes</span>
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            </>
          ) : user ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
} 