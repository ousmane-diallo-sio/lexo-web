import type { EntityConfig, User } from '../../types';

export const userEntityConfig: EntityConfig<User> = {
  name: 'user',
  namePlural: 'users',
  apiEndpoint: 'users',
  displayName: 'User',
  displayNamePlural: 'Users',
  primaryKey: 'id',
  fields: [
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'user@example.com',
      validation: {
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
      }
    },
    {
      key: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'John',
      validation: {
        min: 2,
        max: 50
      }
    },
    {
      key: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
      placeholder: 'Doe',
      validation: {
        min: 2,
        max: 50
      }
    },
    {
      key: 'password',
      label: 'Password',
      type: 'password',
      required: false,
      placeholder: 'Password (leave empty to keep current)',
      validation: {
        min: 6
      }
    },
    {
      key: 'googleId',
      label: 'Google ID',
      type: 'text',
      required: false,
      placeholder: 'Google account ID',
      readonly: true
    },
    {
      key: 'isAdmin',
      label: 'Admin User',
      type: 'boolean',
      required: false
    },
    {
      key: 'adminCreationKey',
      label: 'Admin Creation Key',
      type: 'password',
      required: false,
      placeholder: 'Required for admin users'
    },
    // Legacy fields for backward compatibility
    {
      key: 'username',
      label: 'Username',
      type: 'text',
      required: false,
      placeholder: 'username',
      validation: {
        min: 3,
        max: 50
      }
    },
    {
      key: 'birthdate',
      label: 'Birth Date',
      type: 'date',
      required: false
    },
    {
      key: 'emailVerified',
      label: 'Email Verified',
      type: 'boolean',
      required: false
    },
    {
      key: 'id',
      label: 'User ID',
      type: 'text',
      required: false,
      readonly: true,
      placeholder: 'Auto-generated'
    },
    {
      key: 'createdAt',
      label: 'Created At',
      type: 'text',
      required: false,
      readonly: true
    },
    {
      key: 'updatedAt',
      label: 'Updated At',
      type: 'text',
      required: false,
      readonly: true
    }
  ],
  tableColumns: [
    {
      key: 'id',
      label: 'ID',
      render: (value: unknown) => (
        <span className="text-xs font-mono">{(value as string)?.slice(0, 8)}...</span>
      )
    },
    {
      key: 'googleId',
      label: 'Google ID',
      render: (value: unknown) => (value as string) || 'N/A'
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'username',
      label: 'Username'
    },
    {
      key: 'emailVerified',
      label: 'Status',
      render: (value: unknown) => (
        value ? (
          <span className="inline-flex rounded-full bg-green-500/10 px-2 text-xs font-semibold leading-5 text-green-700">Verified</span>
        ) : (
          <span className="inline-flex rounded-full bg-red-500/10 px-2 text-xs font-semibold leading-5 text-red-700">Not Verified</span>
        )
      )
    },
    {
      key: 'isAdmin',
      label: 'Role',
      render: (value: unknown) => (
        value ? (
          <span className="inline-flex items-center gap-1 rounded bg-yellow-100 px-2 text-xs font-semibold text-yellow-800">
            Admin
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 text-xs font-semibold text-blue-800">
            User
          </span>
        )
      )
    }
  ],
  detailFields: [
    {
      key: 'id',
      label: 'ID'
    },
    {
      key: 'googleId',
      label: 'Google ID',
      render: (value: unknown) => (value as string) || 'N/A'
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'username',
      label: 'Username'
    },
    {
      key: 'birthdate',
      label: 'Birthdate',
      render: (value: unknown) => value ? new Date(value as string).toLocaleDateString() : 'N/A'
    },
    {
      key: 'emailVerified',
      label: 'Email Verification',
      render: (value: unknown) => (
        value ? (
          <span className="inline-flex rounded-full bg-green-500/10 px-2 text-xs font-semibold leading-5 text-green-700">Verified</span>
        ) : (
          <span className="inline-flex rounded-full bg-red-500/10 px-2 text-xs font-semibold leading-5 text-red-700">Not Verified</span>
        )
      )
    },
    {
      key: 'isAdmin',
      label: 'Role',
      render: (value: unknown) => (
        value ? (
          <span className="inline-flex items-center gap-1 rounded bg-yellow-100 px-2 text-xs font-semibold text-yellow-800">
            Admin
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 text-xs font-semibold text-blue-800">
            User
          </span>
        )
      )
    },
    {
      key: 'createdAt',
      label: 'Created At',
      render: (value: unknown) => new Date(value as string).toLocaleString()
    },
    {
      key: 'updatedAt',
      label: 'Updated At',
      render: (value: unknown) => new Date(value as string).toLocaleString()
    }
  ],
  actions: {
    create: true,
    edit: true,
    delete: {
      enabled: true,
      condition: (item, currentUser) => {
        // Prevent users from deleting themselves
        // Only allow deletion if the current user is different from the item being deleted
        // and the current user is an admin
        return Boolean(currentUser?.isAdmin && item.id !== currentUser.id);
      }
    },
    view: true
  }
};
