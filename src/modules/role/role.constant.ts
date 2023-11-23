export const roleConstants = [
    {
        id: 'USER',
        name: 'NGUOI DUNG',
        permissions: ['POST_UPLOAD', 'POST_LIKE', 'POST_DISLIKE', 'POST_BOOKMARK', 'COMMENT_CREATE', 'COMMET_LIKE', 'COMMENT_DISLIKE']
    },
    {
        id: 'ADMIN',
        name: 'QUAN TRI VIEN',
        permissions: ['POST_UPLOAD', 'POST_LIKE', 'POST_DISLIKE', 'POST_BOOKMARK', 'POST_DELETE', 'COMMENT_CREATE', 'COMMET_LIKE', 'COMMENT_DISLIKE', 'COMMENT_DELETE', 'USER_BAN']
    },
]