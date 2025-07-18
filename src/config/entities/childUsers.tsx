import type { EntityConfig, ChildUser } from '../../types';

export const childUserEntityConfig: EntityConfig<ChildUser> = {
  name: 'childUser',
  namePlural: 'childUsers',
  apiEndpoint: 'child-users',
  displayName: 'Child User',
  displayNamePlural: 'Child Users',
  primaryKey: 'id',
  fields: [
    {
      key: 'parent',
      label: 'Parent User ID',
      type: 'text',
      required: true,
      placeholder: 'Parent user ID',
      validation: {
        min: 1
      }
    },
    {
      key: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'Child first name',
      validation: {
        min: 2,
        max: 50
      }
    },
    {
      key: 'username',
      label: 'Username',
      type: 'text',
      required: true,
      placeholder: 'Child username',
      validation: {
        min: 2,
        max: 50
      }
    },
    {
      key: 'birthdate',
      label: 'Birth Date',
      type: 'date',
      required: true
    },
    {
      key: 'avatarUrl',
      label: 'Avatar URL',
      type: 'text',
      required: false,
      placeholder: 'Avatar URL'
    },
    {
      key: 'xp',
      label: 'Experience Points',
      type: 'text',
      required: false,
      placeholder: '0',
      readonly: true
    },
    {
      key: 'gems',
      label: 'Gems',
      type: 'text',
      required: false,
      placeholder: '0',
      readonly: true
    },
    {
      key: 'id',
      label: 'Child User ID',
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
      key: 'firstName',
      label: 'First Name'
    },
    {
      key: 'username',
      label: 'Username'
    },
    {
      key: 'parent',
      label: 'Parent ID'
    },
    {
      key: 'birthdate',
      label: 'Birth Date'
    },
    {
      key: 'xp',
      label: 'XP'
    },
    {
      key: 'gems',
      label: 'Gems'
    }
  ],
  actions: {
    create: true,
    edit: true,
    delete: true,
    view: true
  }
};
