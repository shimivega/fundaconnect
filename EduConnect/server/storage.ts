import {
  users,
  studyGroups,
  studyGroupMembers,
  chatMessages,
  educationalVideos,
  quizzes,
  quizAttempts,
  contactMessages,
  educationalGames,
  donations,
  ads,
  scholarships,
  partnerResources,
  studyNotes,
  whiteboardSnapshots,
  audioLessons,
  playlists,
  playlistItems,
  moodLogs,
  sessionStates,
  resources,
  type User,
  type UpsertUser,
  type StudyGroup,
  type ChatMessage,
  type EducationalVideo,
  type Quiz,
  type ContactMessage,
  type EducationalGame,
  type InsertStudyGroup,
  type InsertChatMessage,
  type InsertContactMessage,
  type InsertQuiz,
  type InsertQuizAttempt,
  type Resource,
  type InsertResource,
  type Donation,
  type Ad,
  type Scholarship,
  type PartnerResource,
  type InsertDonation,
  type InsertAd,
  type InsertScholarship,
  type InsertPartnerResource,
  type StudyNote,
  type InsertStudyNote,
  type WhiteboardSnapshot,
  type InsertWhiteboardSnapshot,
  type AudioLesson,
  type InsertAudioLesson,
  type Playlist,
  type InsertPlaylist,
  type PlaylistItem,
  type InsertPlaylistItem,
  type MoodLog,
  type InsertMoodLog,
  type SessionState,
  type InsertSessionState,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Study Groups
  getStudyGroups(): Promise<StudyGroup[]>;
  getStudyGroup(id: string): Promise<StudyGroup | undefined>;
  createStudyGroup(studyGroup: InsertStudyGroup): Promise<StudyGroup>;
  
  // Chat Messages
  getGroupMessages(groupId: string): Promise<ChatMessage[]>;
  createMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Educational Videos
  getEducationalVideos(): Promise<EducationalVideo[]>;
  getVideosByGrade(gradeLevel: string): Promise<EducationalVideo[]>;
  
  // Quizzes
  getQuizzes(): Promise<Quiz[]>;
  getQuizzesByGrade(gradeLevel: string): Promise<Quiz[]>;
  createQuizAttempt(attempt: InsertQuizAttempt): Promise<void>;
  
  // Contact Messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  
  // Educational Games
  getEducationalGames(): Promise<EducationalGame[]>;
  getGamesByGrade(gradeLevel: string): Promise<EducationalGame[]>;

  // Resources
  createResource(resource: InsertResource): Promise<Resource>;
  getResources(): Promise<Resource[]>;
  getResourcesByGrade(gradeLevel: string): Promise<Resource[]>;
  getResourcesBySubject(subject: string): Promise<Resource[]>;
  deleteResource(id: string): Promise<void>;

  // Donations
  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonations(): Promise<Donation[]>;
  getDonationStats(): Promise<{ totalAmount: number; count: number }>;

  // Ads
  createAd(ad: InsertAd): Promise<Ad>;
  listAds(): Promise<Ad[]>;
  updateAd(id: string, update: Partial<Ad>): Promise<Ad>;
  deleteAd(id: string): Promise<void>;
  trackAdImpression(id: string): Promise<void>;
  trackAdClick(id: string): Promise<void>;

  // Scholarships
  createScholarship(s: InsertScholarship): Promise<Scholarship>;
  listScholarships(): Promise<Scholarship[]>;
  approveScholarship(id: string): Promise<Scholarship>;
  deleteScholarship(id: string): Promise<void>;

  // Partner Resources
  createPartnerResource(r: InsertPartnerResource): Promise<PartnerResource>;
  listPartnerResources(): Promise<PartnerResource[]>;

  // Study notes
  upsertStudyNote(note: InsertStudyNote): Promise<StudyNote>;
  listStudyNotes(userId: string): Promise<StudyNote[]>;

  // Whiteboard
  saveWhiteboardSnapshot(s: InsertWhiteboardSnapshot): Promise<WhiteboardSnapshot>;
  listWhiteboardSnapshots(groupId: string): Promise<WhiteboardSnapshot[]>;

  // Audio lessons
  createAudioLesson(a: InsertAudioLesson): Promise<AudioLesson>;
  listAudioLessons(groupId?: string): Promise<AudioLesson[]>;

  // Playlists
  createPlaylist(p: InsertPlaylist): Promise<Playlist>;
  addPlaylistItem(i: InsertPlaylistItem): Promise<PlaylistItem>;
  listPlaylists(): Promise<Playlist[]>;
  listPlaylistItems(playlistId: string): Promise<PlaylistItem[]>;

  // Mood logs
  createMoodLog(m: InsertMoodLog): Promise<MoodLog>;
  listMoodLogs(): Promise<MoodLog[]>;

  // Session state
  upsertSessionState(s: InsertSessionState): Promise<SessionState>;
  getSessionState(sessionKey: string): Promise<SessionState | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Study Groups
  async getStudyGroups(): Promise<StudyGroup[]> {
    return await db
      .select()
      .from(studyGroups)
      .where(eq(studyGroups.isActive, true))
      .orderBy(desc(studyGroups.createdAt));
  }

  async getStudyGroup(id: string): Promise<StudyGroup | undefined> {
    const [group] = await db
      .select()
      .from(studyGroups)
      .where(and(eq(studyGroups.id, id), eq(studyGroups.isActive, true)));
    return group;
  }

  async createStudyGroup(studyGroup: InsertStudyGroup): Promise<StudyGroup> {
    const [group] = await db
      .insert(studyGroups)
      .values(studyGroup)
      .returning();
    return group;
  }

  // Chat Messages
  async getGroupMessages(groupId: string): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.groupId, groupId))
      .orderBy(chatMessages.createdAt);
  }

  async createMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  // Educational Videos
  async getEducationalVideos(): Promise<EducationalVideo[]> {
    return await db
      .select()
      .from(educationalVideos)
      .where(eq(educationalVideos.isActive, true))
      .orderBy(desc(educationalVideos.createdAt));
  }

  async getVideosByGrade(gradeLevel: string): Promise<EducationalVideo[]> {
    return await db
      .select()
      .from(educationalVideos)
      .where(and(
        eq(educationalVideos.gradeLevel, gradeLevel),
        eq(educationalVideos.isActive, true)
      ))
      .orderBy(desc(educationalVideos.views));
  }

  // Quizzes
  async getQuizzes(): Promise<Quiz[]> {
    return await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.isActive, true))
      .orderBy(desc(quizzes.createdAt));
  }

  async getQuizzesByGrade(gradeLevel: string): Promise<Quiz[]> {
    return await db
      .select()
      .from(quizzes)
      .where(and(
        eq(quizzes.gradeLevel, gradeLevel),
        eq(quizzes.isActive, true)
      ))
      .orderBy(desc(quizzes.createdAt));
  }

  async createQuizAttempt(attempt: InsertQuizAttempt): Promise<void> {
    await db.insert(quizAttempts).values(attempt);
  }

  // Contact Messages
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db
      .insert(contactMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
  }

  // Educational Games
  async getEducationalGames(): Promise<EducationalGame[]> {
    return await db
      .select()
      .from(educationalGames)
      .where(eq(educationalGames.isActive, true))
      .orderBy(educationalGames.title);
  }

  async getGamesByGrade(gradeLevel: string): Promise<EducationalGame[]> {
    return await db
      .select()
      .from(educationalGames)
      .where(and(
        eq(educationalGames.gradeLevel, gradeLevel),
        eq(educationalGames.isActive, true)
      ))
      .orderBy(educationalGames.title);
  }

  // Resources
  async createResource(resourceData: InsertResource): Promise<Resource> {
    const [resource] = await db
      .insert(resources)
      .values(resourceData)
      .returning();
    return resource;
  }

  async getResources(): Promise<Resource[]> {
    return await db
      .select()
      .from(resources)
      .where(eq(resources.isActive, true))
      .orderBy(desc(resources.createdAt));
  }

  async getResourcesByGrade(gradeLevel: string): Promise<Resource[]> {
    return await db
      .select()
      .from(resources)
      .where(and(eq(resources.gradeLevel, gradeLevel), eq(resources.isActive, true)))
      .orderBy(desc(resources.createdAt));
  }

  async getResourcesBySubject(subject: string): Promise<Resource[]> {
    return await db
      .select()
      .from(resources)
      .where(and(eq(resources.subject, subject), eq(resources.isActive, true)))
      .orderBy(desc(resources.createdAt));
  }

  async deleteResource(id: string): Promise<void> {
    await db.delete(resources).where(eq(resources.id, id));
  }

  // Donations
  async createDonation(donation: InsertDonation): Promise<Donation> {
    const [row] = await db.insert(donations).values(donation).returning();
    return row;
  }
  async getDonations(): Promise<Donation[]> {
    return await db.select().from(donations).orderBy(desc(donations.createdAt));
  }
  async getDonationStats(): Promise<{ totalAmount: number; count: number }> {
    const rows = await db.select({ amount: donations.amount }).from(donations);
    const total = rows.reduce((s, r) => s + (r.amount || 0), 0);
    return { totalAmount: total, count: rows.length };
  }

  // Ads
  async createAd(ad: InsertAd): Promise<Ad> {
    const [row] = await db.insert(ads).values(ad).returning();
    return row;
  }
  async listAds(): Promise<Ad[]> {
    return await db.select().from(ads).orderBy(desc(ads.createdAt));
  }
  async updateAd(id: string, update: Partial<Ad>): Promise<Ad> {
    const [row] = await db.update(ads).set(update as any).where(eq(ads.id, id)).returning();
    return row;
  }
  async deleteAd(id: string): Promise<void> {
    await db.delete(ads).where(eq(ads.id, id));
  }
  async trackAdImpression(id: string): Promise<void> {
    await db.update(ads).set({ impressions: sql`COALESCE(impressions, 0) + 1` } as any).where(eq(ads.id, id));
  }
  async trackAdClick(id: string): Promise<void> {
    await db.update(ads).set({ clicks: sql`COALESCE(clicks, 0) + 1` } as any).where(eq(ads.id, id));
  }

  // Scholarships
  async createScholarship(s: InsertScholarship): Promise<Scholarship> {
    const [row] = await db.insert(scholarships).values(s).returning();
    return row;
  }
  async listScholarships(): Promise<Scholarship[]> {
    return await db.select().from(scholarships).orderBy(desc(scholarships.createdAt));
  }
  async approveScholarship(id: string): Promise<Scholarship> {
    const [row] = await db.update(scholarships).set({ status: 'approved', awardedAt: new Date() } as any).where(eq(scholarships.id, id)).returning();
    return row;
  }
  async deleteScholarship(id: string): Promise<void> {
    await db.delete(scholarships).where(eq(scholarships.id, id));
  }

  // Partner Resources
  async createPartnerResource(r: InsertPartnerResource): Promise<PartnerResource> {
    const [row] = await db.insert(partnerResources).values(r).returning();
    return row;
  }
  async listPartnerResources(): Promise<PartnerResource[]> {
    return await db.select().from(partnerResources).orderBy(desc(partnerResources.createdAt));
  }

  // Study notes
  async upsertStudyNote(note: InsertStudyNote): Promise<StudyNote> {
    const [row] = await db.insert(studyNotes).values(note).onConflictDoUpdate({ target: [studyNotes.userId], set: { content: note.content, updatedAt: new Date() } }).returning();
    return row;
  }
  async listStudyNotes(userId: string): Promise<StudyNote[]> {
    return await db.select().from(studyNotes).where(eq(studyNotes.userId, userId));
  }

  // Whiteboard
  async saveWhiteboardSnapshot(s: InsertWhiteboardSnapshot): Promise<WhiteboardSnapshot> {
    const [row] = await db.insert(whiteboardSnapshots).values(s).returning();
    return row;
  }
  async listWhiteboardSnapshots(groupId: string): Promise<WhiteboardSnapshot[]> {
    return await db.select().from(whiteboardSnapshots).where(eq(whiteboardSnapshots.groupId, groupId)).orderBy(desc(whiteboardSnapshots.createdAt));
  }

  // Audio lessons
  async createAudioLesson(a: InsertAudioLesson): Promise<AudioLesson> {
    const [row] = await db.insert(audioLessons).values(a).returning();
    return row;
  }
  async listAudioLessons(groupId?: string): Promise<AudioLesson[]> {
    if (groupId) return await db.select().from(audioLessons).where(eq(audioLessons.groupId, groupId));
    return await db.select().from(audioLessons);
  }

  // Playlists
  async createPlaylist(p: InsertPlaylist): Promise<Playlist> {
    const [row] = await db.insert(playlists).values(p).returning();
    return row;
  }
  async addPlaylistItem(i: InsertPlaylistItem): Promise<PlaylistItem> {
    const [row] = await db.insert(playlistItems).values(i).returning();
    return row;
  }
  async listPlaylists(): Promise<Playlist[]> {
    return await db.select().from(playlists).orderBy(desc(playlists.createdAt));
  }
  async listPlaylistItems(playlistId: string): Promise<PlaylistItem[]> {
    return await db.select().from(playlistItems).where(eq(playlistItems.playlistId, playlistId)).orderBy(playlistItems.order);
  }

  // Mood logs
  async createMoodLog(m: InsertMoodLog): Promise<MoodLog> {
    const [row] = await db.insert(moodLogs).values(m).returning();
    return row;
  }
  async listMoodLogs(): Promise<MoodLog[]> {
    return await db.select().from(moodLogs).orderBy(desc(moodLogs.createdAt));
  }

  // Session state
  async upsertSessionState(s: InsertSessionState): Promise<SessionState> {
    const [row] = await db.insert(sessionStates).values(s).onConflictDoUpdate({ target: [sessionStates.sessionKey], set: { data: s.data, updatedAt: new Date() } }).returning();
    return row;
  }
  async getSessionState(sessionKey: string): Promise<SessionState | undefined> {
    const [row] = await db.select().from(sessionStates).where(eq(sessionStates.sessionKey, sessionKey));
    return row;
  }
}

export const storage = new DatabaseStorage();
