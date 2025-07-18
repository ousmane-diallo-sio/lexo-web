import type { EntityConfig, NumberExercise } from '../../types';

export const numberExerciseEntityConfig: EntityConfig<NumberExercise> = {
  name: 'numberExercise',
  namePlural: 'numberExercises',
  apiEndpoint: 'exercises/number',
  displayName: 'Number Exercise',
  displayNamePlural: 'Number Exercises',
  primaryKey: 'id',
  fields: [
    {
      key: 'user',
      label: 'User ID',
      type: 'text',
      required: false,
      placeholder: 'User ID (optional)',
      readonly: true
    },
    {
      key: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      placeholder: 'Exercise title',
      validation: {
        min: 3,
        max: 100
      }
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      placeholder: 'Exercise description',
      validation: {
        min: 10,
        max: 500
      }
    },
    {
      key: 'durationMinutes',
      label: 'Duration (minutes)',
      type: 'text',
      required: true,
      placeholder: '10',
      validation: {
        pattern: '^[0-9]+$'
      }
    },
    {
      key: 'mainColor',
      label: 'Main Color',
      type: 'text',
      required: true,
      placeholder: '#FF5733'
    },
    {
      key: 'thumbnailUrl',
      label: 'Thumbnail URL',
      type: 'text',
      required: true,
      placeholder: 'https://example.com/image.jpg'
    },
    {
      key: 'xp',
      label: 'XP Points',
      type: 'text',
      required: true,
      placeholder: '100',
      validation: {
        pattern: '^[0-9]+$'
      }
    },
    {
      key: 'difficulty',
      label: 'Difficulty',
      type: 'select',
      required: true,
      options: [
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' }
      ]
    },
    {
      key: 'imageType',
      label: 'Image Type',
      type: 'select',
      required: true,
      options: [
        { value: 'regular', label: 'Regular' },
        { value: 'hand', label: 'Hand' }
      ]
    },
    {
      key: 'id',
      label: 'Exercise ID',
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
      key: 'title',
      label: 'Title'
    },
    {
      key: 'description',
      label: 'Description'
    },
    {
      key: 'durationMinutes',
      label: 'Duration'
    },
    {
      key: 'difficulty',
      label: 'Difficulty'
    },
    {
      key: 'imageType',
      label: 'Type'
    },
    {
      key: 'xp',
      label: 'XP'
    }
  ],
  actions: {
    create: true,
    edit: true,
    delete: true,
    view: true
  }
};
