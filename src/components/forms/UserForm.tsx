import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { User } from '../../types';

const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  birthdate: z.string().optional(),
  isAdmin: z.boolean().optional(),
  adminCreationKey: z.string().optional(),
  googleId: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
  isGoogleSignup?: boolean;
}

export function UserForm({ user, onSubmit, onCancel, isGoogleSignup }: UserFormProps) {
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
        }
      : {
          isAdmin: false,
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-white"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Username
        </label>
        <input
          type="text"
          id="username"
          {...register('username')}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-white"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username.message}</p>
        )}
      </div>

      {!user && (
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register('password')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-white"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Birthdate
        </label>
        <input
          type="date"
          id="birthdate"
          {...register('birthdate')}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isAdmin"
          {...register('isAdmin')}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Admin user
        </label>
      </div>

      {isAdmin && (
        <div>
          <label
            htmlFor="adminCreationKey"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Admin Creation Key
          </label>
          <input
            type="password"
            id="adminCreationKey"
            {...register('adminCreationKey')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-white"
          />
          {errors.adminCreationKey && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.adminCreationKey.message}
            </p>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : user ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
} 