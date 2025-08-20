import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  // Local auth fields
  passwordHash: varchar("password_hash"),
  approved: boolean("approved").default(true),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: ["learner", "teacher", "abet", "admin"] }).default("learner"),
  preferredLanguage: varchar("preferred_language").default("en"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const studyGroups = pgTable("study_groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  subject: varchar("subject").notNull(),
  gradeLevel: varchar("grade_level").notNull(),
  isPrivate: boolean("is_private").default(false),
  inviteCode: varchar("invite_code"),
  maxMembers: integer("max_members").default(20),
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const studyGroupMembers = pgTable("study_group_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").references(() => studyGroups.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
  role: varchar("role", { enum: ["member", "moderator"] }).default("member"),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").references(() => studyGroups.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  messageType: varchar("message_type", { enum: ["text", "file", "voice"] }).default("text"),
  fileUrl: varchar("file_url"),
  fileName: varchar("file_name"),
  isPinned: boolean("is_pinned").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const educationalVideos = pgTable("educational_videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  youtubeId: varchar("youtube_id").notNull(),
  thumbnailUrl: varchar("thumbnail_url"),
  duration: varchar("duration"),
  gradeLevel: varchar("grade_level").notNull(),
  subject: varchar("subject").notNull(),
  language: varchar("language").default("en"),
  views: integer("views").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Resources (PDFs, textbooks, videos, links)
export const resources = pgTable("resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  type: varchar("type", { enum: ["pdf", "video", "link", "image", "audio"] }).notNull(),
  url: varchar("url").notNull(),
  thumbnailUrl: varchar("thumbnail_url"),
  subject: varchar("subject"),
  gradeLevel: varchar("grade_level"),
  createdBy: varchar("created_by").references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  subject: varchar("subject").notNull(),
  gradeLevel: varchar("grade_level").notNull(),
  language: varchar("language").default("en"),
  questions: jsonb("questions").notNull(), // Array of question objects
  timeLimit: integer("time_limit"), // in minutes
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quizId: varchar("quiz_id").references(() => quizzes.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  answers: jsonb("answers").notNull(),
  score: integer("score"),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  subject: varchar("subject").notNull(),
  message: text("message").notNull(),
  status: varchar("status", { enum: ["new", "in_progress", "resolved"] }).default("new"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const educationalGames = pgTable("educational_games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  gameType: varchar("game_type").notNull(), // math-quiz, word-search, etc.
  difficulty: varchar("difficulty", { enum: ["easy", "medium", "hard"] }).default("medium"),
  subject: varchar("subject").notNull(),
  gradeLevel: varchar("grade_level").notNull(),
  language: varchar("language").default("en"),
  gameData: jsonb("game_data").notNull(), // Game-specific configuration
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Monetization and Admin
export const donations = pgTable("donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  amount: integer("amount").notNull(), // in cents
  currency: varchar("currency").default("ZAR"),
  provider: varchar("provider", { enum: ["stripe", "paypal"] }).notNull(),
  providerId: varchar("provider_id"),
  donorName: varchar("donor_name"),
  donorEmail: varchar("donor_email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ads = pgTable("ads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  link: varchar("link").notNull(),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const scholarships = pgTable("scholarships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sponsor: varchar("sponsor").notNull(),
  learnerId: varchar("learner_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(), // in cents
  status: varchar("status", { enum: ["pending", "approved", "rejected"] }).default("pending"),
  awardedAt: timestamp("awarded_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const partnerResources = pgTable("partner_resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  type: varchar("type", { enum: ["pdf", "video", "link"] }).notNull(),
  url: varchar("url").notNull(),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Study group add-ons
export const studyNotes = pgTable("study_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const whiteboardSnapshots = pgTable("whiteboard_snapshots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").references(() => studyGroups.id).notNull(),
  dataUrl: text("data_url").notNull(),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const audioLessons = pgTable("audio_lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  groupId: varchar("group_id").references(() => studyGroups.id),
  url: varchar("url").notNull(),
  durationSec: integer("duration_sec"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const playlists = pgTable("playlists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const playlistItems = pgTable("playlist_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playlistId: varchar("playlist_id").references(() => playlists.id).notNull(),
  itemType: varchar("item_type", { enum: ["resource", "video", "quiz"] }).notNull(),
  itemId: varchar("item_id").notNull(),
  order: integer("order").default(0),
});

export const moodLogs = pgTable("mood_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  mood: varchar("mood", { enum: ["happy", "stressed", "tired", "neutral"] }).notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessionStates = pgTable("session_states", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionKey: varchar("session_key").notNull(),
  userId: varchar("user_id").references(() => users.id),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  studyGroupsCreated: many(studyGroups),
  studyGroupMemberships: many(studyGroupMembers),
  chatMessages: many(chatMessages),
  quizzesCreated: many(quizzes),
  quizAttempts: many(quizAttempts),
  resources: many(resources),
  donations: many(donations),
}));

export const studyGroupsRelations = relations(studyGroups, ({ one, many }) => ({
  creator: one(users, {
    fields: [studyGroups.createdBy],
    references: [users.id],
  }),
  members: many(studyGroupMembers),
  messages: many(chatMessages),
}));

export const studyGroupMembersRelations = relations(studyGroupMembers, ({ one }) => ({
  group: one(studyGroups, {
    fields: [studyGroupMembers.groupId],
    references: [studyGroups.id],
  }),
  user: one(users, {
    fields: [studyGroupMembers.userId],
    references: [users.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  group: one(studyGroups, {
    fields: [chatMessages.groupId],
    references: [studyGroups.id],
  }),
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  creator: one(users, {
    fields: [quizzes.createdBy],
    references: [users.id],
  }),
  attempts: many(quizAttempts),
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
  creator: one(users, {
    fields: [resources.createdBy],
    references: [users.id],
  }),
}));

export const playlistsRelations = relations(playlists, ({ many, one }) => ({
  items: many(playlistItems),
  creator: one(users, { fields: [playlists.createdBy], references: [users.id] })
}));

export const quizAttemptsRelations = relations(quizAttempts, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizAttempts.quizId],
    references: [quizzes.id],
  }),
  user: one(users, {
    fields: [quizAttempts.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  role: true,
  preferredLanguage: true,
});

export const insertUserLocalSchema = createInsertSchema(users).pick({
  email: true,
  passwordHash: true,
  firstName: true,
  lastName: true,
  role: true,
});

export const insertStudyGroupSchema = createInsertSchema(studyGroups).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
  status: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
  id: true,
  completedAt: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

export const insertDonationSchema = createInsertSchema(donations).omit({ id: true, createdAt: true });
export const insertAdSchema = createInsertSchema(ads).omit({ id: true, impressions: true, clicks: true, createdAt: true });
export const insertScholarshipSchema = createInsertSchema(scholarships).omit({ id: true, createdAt: true, awardedAt: true, status: true });
export const insertPartnerResourceSchema = createInsertSchema(partnerResources).omit({ id: true, createdAt: true });
export const insertStudyNoteSchema = createInsertSchema(studyNotes).omit({ id: true });
export const insertWhiteboardSnapshotSchema = createInsertSchema(whiteboardSnapshots).omit({ id: true, createdAt: true });
export const insertAudioLessonSchema = createInsertSchema(audioLessons).omit({ id: true, createdAt: true });
export const insertPlaylistSchema = createInsertSchema(playlists).omit({ id: true, createdAt: true });
export const insertPlaylistItemSchema = createInsertSchema(playlistItems).omit({ id: true });
export const insertMoodLogSchema = createInsertSchema(moodLogs).omit({ id: true, createdAt: true });
export const insertSessionStateSchema = createInsertSchema(sessionStates).omit({ id: true, updatedAt: true });

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type Resource = typeof resources.$inferSelect;
export type Donation = typeof donations.$inferSelect;
export type Ad = typeof ads.$inferSelect;
export type Scholarship = typeof scholarships.$inferSelect;
export type PartnerResource = typeof partnerResources.$inferSelect;
export type StudyNote = typeof studyNotes.$inferSelect;
export type WhiteboardSnapshot = typeof whiteboardSnapshots.$inferSelect;
export type AudioLesson = typeof audioLessons.$inferSelect;
export type Playlist = typeof playlists.$inferSelect;
export type PlaylistItem = typeof playlistItems.$inferSelect;
export type MoodLog = typeof moodLogs.$inferSelect;
export type SessionState = typeof sessionStates.$inferSelect;
export type StudyGroup = typeof studyGroups.$inferSelect;
export type StudyGroupMember = typeof studyGroupMembers.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type EducationalVideo = typeof educationalVideos.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type EducationalGame = typeof educationalGames.$inferSelect;
export type InsertStudyGroup = z.infer<typeof insertStudyGroupSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type InsertAd = z.infer<typeof insertAdSchema>;
export type InsertScholarship = z.infer<typeof insertScholarshipSchema>;
export type InsertPartnerResource = z.infer<typeof insertPartnerResourceSchema>;
export type InsertStudyNote = z.infer<typeof insertStudyNoteSchema>;
export type InsertWhiteboardSnapshot = z.infer<typeof insertWhiteboardSnapshotSchema>;
export type InsertAudioLesson = z.infer<typeof insertAudioLessonSchema>;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type InsertPlaylistItem = z.infer<typeof insertPlaylistItemSchema>;
export type InsertMoodLog = z.infer<typeof insertMoodLogSchema>;
export type InsertSessionState = z.infer<typeof insertSessionStateSchema>;
