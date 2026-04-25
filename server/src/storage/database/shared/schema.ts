import { pgTable, serial, timestamp, varchar, text, integer, boolean, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"


export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 用户表
export const users = pgTable(
	"users",
	{
		id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
		nickname: varchar("nickname", { length: 50 }).notNull().unique(), // 昵称（必填，唯一）
		avatar_url: varchar("avatar_url", { length: 1000 }), // 头像 URL
		bio: text("bio"), // 个人简介
		created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	},
	(table) => [
		index("users_nickname_idx").on(table.nickname), // 昵称索引
	]
);

// 梗表
export const memes = pgTable(
	"memes",
	{
		id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
		user_id: varchar("user_id", { length: 36 }).references(() => users.id, { onDelete: "set null" }), // 外键，关联用户表
		user_nickname: varchar("user_nickname", { length: 50 }), // 上传者昵称（冗余，方便查询）
		content: text("content").notNull(), // 梗文本（必填）
		image_key: varchar("image_key", { length: 500 }), // 配图的对象存储 key（兼容字段，现在指向梗名称图片）
		image_url: varchar("image_url", { length: 1000 }), // 配图的可访问 URL（兼容字段，现在指向梗名称图片）
		content_image_key: varchar("content_image_key", { length: 500 }), // 梗名称图片的对象存储 key（必填）
		content_image_url: varchar("content_image_url", { length: 1000 }), // 梗名称图片的可访问 URL
		explanation: text("explanation").notNull(), // 解释（必填）
		explanation_image_key: varchar("explanation_image_key", { length: 500 }), // 梗解释图片的对象存储 key（可选）
		explanation_image_url: varchar("explanation_image_url", { length: 1000 }), // 梗解释图片的可访问 URL
		is_ai_generated: boolean("is_ai_generated").default(false).notNull(), // 是否 AI 生成
		like_count: integer("like_count").default(0).notNull(), // 点赞数
		comment_count: integer("comment_count").default(0).notNull(), // 评论数
		created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	},
	(table) => [
		index("memes_user_id_idx").on(table.user_id), // 外键索引
		index("memes_created_at_idx").on(table.created_at), // 排序用
		index("memes_like_count_idx").on(table.like_count), // 热门排序用
	]
);

// 评论表
export const comments = pgTable(
	"comments",
	{
		id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
		meme_id: varchar("meme_id", { length: 36 }).notNull().references(() => memes.id, { onDelete: "cascade" }), // 外键，关联梗表
		user_id: varchar("user_id", { length: 36 }).references(() => users.id, { onDelete: "set null" }), // 外键，关联用户表
		user_nickname: varchar("user_nickname", { length: 50 }), // 评论者昵称（冗余，方便查询）
		content: text("content").notNull(), // 评论内容
		created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	},
	(table) => [
		index("comments_meme_id_idx").on(table.meme_id), // 外键索引
		index("comments_user_id_idx").on(table.user_id), // 外键索引
		index("comments_created_at_idx").on(table.created_at), // 排序用
	]
);
