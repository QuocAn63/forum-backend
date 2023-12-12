export enum NotificationType {
  PostLike = 'POST_LIKE',
  PostDislike = 'POST_DISLIKE',
  PostComment = 'POST_COMMENT',
  CommentLike = 'COMMENT_LIKE',
  CommentDislike = 'COMMENT_DSILIKE',
  CommentReply = 'COMMENT_REPLY',
}

export const NotificationContent = {
  [NotificationType.PostLike]: '[:Subject] liked your post.',
  [NotificationType.PostDislike]: '[:Subject] disliked your post.',
  [NotificationType.PostComment]: '[:Subject] commented on your post.',
  [NotificationType.CommentLike]: '[:Subject] liked your comment.',
  [NotificationType.CommentDislike]: '[:Subject] disliked your comment.',
  [NotificationType.CommentReply]: '[:Subject] replied your comment.',
};

export const NotificationURL = {
  [NotificationType.PostLike]: '[:URL]/posts/[:PostId]',
  [NotificationType.PostDislike]: '[:URL]/posts/[:PostId]',
  [NotificationType.PostComment]: '[:URL]/posts/[:PostId]?comment=[:CommentId]',
  [NotificationType.CommentLike]: '[:URL]/posts/[:PostId]?comment=[:CommentId]',
  [NotificationType.CommentDislike]:
    '[:URL]/posts/[:PostId]?comment=[:CommentId]',
  [NotificationType.CommentReply]:
    '[:URL]/posts/[:PostId]?comment=[:CommentId]',
};
