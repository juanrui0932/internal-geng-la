import { pgTable, serial, timestamp, varchar, text, integer, boolean, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"


export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 梗表
export const memes = pgTable(
	"memes",
	{
		id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
		content: text("content").notNull(), // 梗文本（必填）
		image_key: varchar("image_key", { length: 500 }), // 配图的对象存储 key（必填，可为 AI 生成或用户上传）
		image_url: varchar("image_url", { length: 1000 }), // 配图的可访问 URL（持久化时优先存 key，此字段用于显示）
		explanation: text("explanation"), // 解释（可选）
		is_ai_generated: boolean("is_ai_generated").default(false).notNull(), // 是否 AI 生成
		like_count: integer("like_count").default(0).notNull(), // 点赞数
		comment_count: integer("comment_count").default(0).notNull(), // 评论数
		created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	},
	(table) => [
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
		content: text("content").notNull(), // 评论内容
		created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	},
	(table) => [
		index("comments_meme_id_idx").on(table.meme_id), // 外键索引
		index("comments_created_at_idx").on(table.created_at), // 排序用
	]
);
