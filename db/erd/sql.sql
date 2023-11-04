drop table if exists "notificationSubject";
drop table if exists "notification";
drop table if exists "userBookmark";
drop table if exists "userLikesOrDislikesPost";
drop table if exists "post";
drop table if exists "userLikesOrDislikesComment";
drop table if exists "comment";
drop table if exists "userLimitedPermission";
drop table if exists "rolePermission";
drop table if exists "permission";
drop table if exists "user";
drop table if exists "role";

drop type if exists "notificationType";
drop type if exists "interactionType";
drop type if exists "postStatusType";
drop type if exists "genderEnumType";
drop type if exists "commentStatusType";

create type "notificationType" as enum ('POST_LIKE', 'POST_DISLIKE', 'POST_BOOKMARK', 'POST_COMMENT', 'POST_DELETE', 'COMMENT_LIKE', 'COMMENT_DISLIKE', 'COMMENT_DELETE');
create type "interactionType" as enum ('LIKE', 'DISLIKE', 'CANCEL_LIKE', 'CANCEL_DISLIKE');
create type "postStatusType" as enum ('PUBLIC', 'PRIVATE', 'DRAFT', 'DELETED');
create type "genderEnumType" as enum ('MALE', 'FEMALE');
create type "commentStatusType" as enum ('PUBLIC', 'DELETED');

create table "role" (
	"id" varchar(11) not null unique,
	"slug" varchar(20) not null,
	"name" varchar(20) not null,
	"active" boolean default false,
	"createdAt" timestamp default current_timestamp,
	"updatedAt" timestamp default current_timestamp,
	constraint "role_pk" primary key ("id")
);

create table "permission" (
	"id" varchar(20) not null unique,
	"description" text not null,
	"active" boolean default false,
	"createdAt" timestamp default current_timestamp,
	"updatedAt" timestamp default current_timestamp,
	constraint "permission_pk" primary key ("id")
);

create table "rolePermission" (
	"roleId" varchar(11) not null,
	"permissionId" varchar(20) not null,
	"createdAt" timestamp default current_timestamp,
	"updatedAt" timestamp default current_timestamp,
	constraint "rolePermission_pk" primary key ("roleId", "permissionId"),
	constraint "rolePermission_roleId_fk" foreign key ("roleId") references "role"("id"),
	constraint "rolePermission_permissionId_fk" foreign key ("permissionId") references "permission"("id")
);

create table "user" (
	"id" varchar(11) not null unique,
	"username" varchar(20) not null unique,
	"password" varchar(50) not null,
	"displayName" varchar(20),
	"dob" date,
	"gender" "genderEnumType",
	"mailAddress" varchar(50) not null unique,
	"phoneNumber" varchar(11) unique,
	"lastLoginAt" timestamp,
	"createdAt" timestamp default current_timestamp,
	"updatedAt" timestamp default current_timestamp,
	"roleId" varchar(11) not null,
	constraint "user_pk" primary key ("id"),
	constraint "user_roleId_fk" foreign key ("roleId") references "role"("id")
);

create table "userLimitedPermission" (
	"id" varchar(11) not null unique,
	"userId" varchar(11) not null,
	"permissionId" varchar(20) not null,
	"createdAt" timestamp default current_timestamp,
	"endAt" timestamp not null check ("endAt" > "createdAt"),
	"expired" boolean default false,
	constraint "userLimitedPermission_pk" primary key ("id"),
	constraint "userLimitedPermission_userId_fk" foreign key ("userId") references "user"("id"),
	constraint "userLimitedPermission_permissionId_fk" foreign key ("permissionId") references "permission"("id")
);

create table "post" (
	"id" varchar(11) not null unique,
	"authorId" varchar(11) not null,
	"title" varchar(100) not null,
	"slug" text not null,
	"content" text not null,
	"createdAt" timestamp default current_timestamp,
	"updatedAt" timestamp default current_timestamp,
	"status" "postStatusType",
	constraint "post_pk" primary key ("id"),
	constraint "post_authorId_fk" foreign key ("authorId") references "user"("id")
);

create table "userLikesOrDislikesPost" (
	"userId" varchar(11) not null,
	"postId" varchar(11) not null,
	"action" "interactionType",
	"createdAt" timestamp default current_timestamp,
	"updatedAt" timestamp default current_timestamp,
	constraint "userLikesOrDislikesPost_pk" primary key ("userId", "postId"),
	constraint "userLikesOrDislikesPost_userId_fk" foreign key("userId") references "user"("id"),
	constraint "userLikesOrDislikesPost_postId_fk" foreign key("postId") references "post"("id")
);

create table "userBookmark" (
	"userId" varchar(11) not null,
	"postId" varchar(11) not null,
	"createdAt" timestamp default current_timestamp,
	constraint "userBookmark_pk" primary key ("userId", "postId"),
	constraint "userBookmark_userId_fk" foreign key("userId") references "user"("id"),
	constraint "userBookmark_postId_fk" foreign key("postId") references "post"("id")
);

create table "comment" (
	"id" varchar(11) not null unique,
	"authorId" varchar(11) not null,
	"postId" varchar(11) not null,
	"parentId" varchar(11),
	"content" text,
	"createdAt" timestamp default current_timestamp,
	"updatedAt" timestamp default current_timestamp,
	"deletedAt" timestamp default current_timestamp,
	"status" "commentStatusType",
	constraint "comment_pk" primary key ("id"),
	constraint "comment_authorId_fk" foreign key ("authorId") references "user"("id"),
	constraint "comment_postId_fk" foreign key ("postId") references "post"("id"),
	constraint "comment_parentId_fk" foreign key ("parentId") references "post"("id")
);

create table "userLikesOrDislikesComment" (
	"userId" varchar(11) not null,
	"commentId" varchar(11) not null,
	"action" "interactionType",
	"createdAt" timestamp default current_timestamp,
	"updatedAt" timestamp default current_timestamp,
	constraint "userLikesOrDislikesComment_pk" primary key ("userId", "commentId"),
	constraint "userLikesOrDislikesComment_userId_fk" foreign key("userId") references "user"("id"),
	constraint "userLikesOrDislikesComment_commentId_fk" foreign key("commentId") references "comment"("id")
);

create table "notification" (
	"id" varchar(11) not null unique,
	"type" "notificationType",
	"userId" varchar(11) not null,
	"content" text not null,
	"createdAt" timestamp default current_timestamp,
	"updatedAt" timestamp default current_timestamp,
	"readAt" timestamp default null,
	"notificationURL" text,
	constraint "notification_pk" primary key ("id"),
	constraint "notification_userId_fk" foreign key ("userId") references "user"("id")
);

create table "notificationSubject" (
	"notificationId" varchar(11) not null,
	"userId" varchar(11) not null,
	"createdAt" timestamp default current_timestamp,
	constraint "notificationSubject_pk" primary key ("notificationId", "userId"),
	constraint "notificationSubject_userId_fk" foreign key ("userId") references "user"("id"),
	constraint "notificationSubject_notificationId_fk" foreign key ("notificationId") references "notification"("id")
);