export const roleConstants = [
  {
    id: 'USER',
    name: 'NGUOI DUNG',
    permissions: [
      'POST_UPLOAD',
      'POST_RATE',
      'POST_BOOKMARK',
      'COMMENT_CREATE',
      'COMMENT_RATE',
    ],
  },
  {
    id: 'ADMIN',
    name: 'QUAN TRI VIEN',
    permissions: [
      'POST_UPLOAD',
      'POST_RATE',
      'POST_BOOKMARK',
      'POST_DELETE',
      'COMMENT_CREATE',
      'COMMENT_RATE',
      'COMMENT_DELETE',
      'USER_BAN',
    ],
  },
];
