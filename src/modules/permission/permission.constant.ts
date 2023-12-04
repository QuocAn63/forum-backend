export const permissionConstants = [
  {
    key: 'POST',
    actions: [
      {
        suffix: 'UPLOAD',
        description: 'User can upload posts.',
      },
      {
        suffix: 'DELETE',
        description: 'User can delete other user posts.',
      },
      {
        suffix: 'RATE',
        description: 'User can rate posts.',
      },
      {
        suffix: 'BOOKMARK',
        description: 'User can bookmark posts.',
      },
    ],
  },
  {
    key: 'COMMENT',
    actions: [
      {
        suffix: 'CREATE',
        description: 'User can comment on posts.',
      },
      {
        suffix: 'DELETE',
        description: 'User can delete other users comment.',
      },
      {
        suffix: 'RATE',
        description: 'User can rate comments.',
      },
    ],
  },
  {
    key: 'USER',
    actions: [
      {
        suffix: 'BAN',
        description: 'User can ban other users',
      },
    ],
  },
];
