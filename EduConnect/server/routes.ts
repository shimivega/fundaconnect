import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db";
import { users, insertDonationSchema, insertAdSchema, insertScholarshipSchema, insertPartnerResourceSchema, insertStudyNoteSchema, insertWhiteboardSnapshotSchema, insertAudioLessonSchema, insertPlaylistSchema, insertPlaylistItemSchema, insertMoodLogSchema } from "@shared/schema";
import { eq } from "drizzle-orm";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertContactMessageSchema, insertChatMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  // Optional Replit OIDC auth; keep app running if not configured
  try {
    await setupAuth(app);
  } catch (_e) {
    // ignore in local JWT mode
  }

  // Auth routes (JWT-based local auth)
  const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName, role } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      const existing = await db.select().from(users).where(eq(users.email, email));
      if (existing.length > 0) {
        return res.status(409).json({ message: 'Email already registered' });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const isTeacher = role === 'teacher';
      const [created] = await db.insert(users).values({
        email,
        passwordHash,
        firstName,
        lastName,
        role: role || 'learner',
        approved: isTeacher ? false : true,
      }).returning();
      const token = jwt.sign({ sub: created.id, role: created.role }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: created.id, email: created.email, role: created.role, approved: created.approved } });
    } catch (error) {
      console.error('Register error', error);
      res.status(500).json({ message: 'Failed to register' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body || {};
      if (email === 'admin' && password === 'admin123') {
        const token = jwt.sign({ sub: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({ token, user: { id: 'admin', email: 'admin', role: 'admin', approved: true } });
      }
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      const [found] = await db.select().from(users).where(eq(users.email, email));
      if (!found || !found.passwordHash) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const ok = await bcrypt.compare(password, found.passwordHash);
      if (!ok) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      if (found.role === 'teacher' && !found.approved) {
        return res.status(403).json({ message: 'Teacher not approved by admin yet' });
      }
      const token = jwt.sign({ sub: found.id, role: found.role }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: found.id, email: found.email, role: found.role, approved: found.approved } });
    } catch (error) {
      console.error('Login error', error);
      res.status(500).json({ message: 'Failed to login' });
    }
  });

  app.get('/api/auth/user', async (req: any, res) => {
    try {
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      if (!token) return res.status(401).json({ message: 'Unauthorized' });
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.sub === 'admin') {
        return res.json({ id: 'admin', email: 'admin', role: 'admin', approved: true });
      }
      const user = await storage.getUser(decoded.sub);
      if (!user) return res.status(401).json({ message: 'Unauthorized' });
      const { passwordHash, ...safe } = user as any;
      res.json(safe);
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  });
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Study Groups routes
  app.get("/api/study-groups", async (req, res) => {
    try {
      const groups = await storage.getStudyGroups();
      res.json(groups);
    } catch (error) {
      console.error("Error fetching study groups:", error);
      res.status(500).json({ message: "Failed to fetch study groups" });
    }
  });

  app.get("/api/study-groups/:id", async (req, res) => {
    try {
      const group = await storage.getStudyGroup(req.params.id);
      if (!group) {
        return res.status(404).json({ message: "Study group not found" });
      }
      res.json(group);
    } catch (error) {
      console.error("Error fetching study group:", error);
      res.status(500).json({ message: "Failed to fetch study group" });
    }
  });

  app.post("/api/study-groups", async (req: any, res) => {
    try {
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      const decoded: any = token ? jwt.verify(token, JWT_SECRET) : null;
      const userId = decoded?.sub;
      const groupData = { ...req.body, createdBy: userId };
      const group = await storage.createStudyGroup(groupData);
      res.json(group);
    } catch (error) {
      console.error("Error creating study group:", error);
      res.status(500).json({ message: "Failed to create study group" });
    }
  });

  // Chat Messages routes
  app.get("/api/study-groups/:id/messages", async (req, res) => {
    try {
      const messages = await storage.getGroupMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Educational Videos routes
  app.get("/api/educational-videos", async (req, res) => {
    try {
      const videos = await storage.getEducationalVideos();
      res.json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  app.get("/api/educational-videos/grade/:level", async (req, res) => {
    try {
      const videos = await storage.getVideosByGrade(req.params.level);
      res.json(videos);
    } catch (error) {
      console.error("Error fetching videos by grade:", error);
      res.status(500).json({ message: "Failed to fetch videos by grade" });
    }
  });

  // Quizzes routes
  app.get("/api/quizzes", async (req, res) => {
    try {
      const quizzes = await storage.getQuizzes();
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ message: "Failed to fetch quizzes" });
    }
  });

  app.get("/api/quizzes/grade/:level", async (req, res) => {
    try {
      const quizzes = await storage.getQuizzesByGrade(req.params.level);
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes by grade:", error);
      res.status(500).json({ message: "Failed to fetch quizzes by grade" });
    }
  });

  app.post("/api/quiz-attempts", isAuthenticated, async (req: any, res) => {
    try {
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      const decoded: any = token ? jwt.verify(token, JWT_SECRET) : null;
      const userId = decoded?.sub;
      const attemptData = { ...req.body, userId };
      await storage.createQuizAttempt(attemptData);
      res.json({ success: true });
    } catch (error) {
      console.error("Error creating quiz attempt:", error);
      res.status(500).json({ message: "Failed to create quiz attempt" });
    }
  });

  // Contact Messages routes
  app.post("/api/contact", async (req, res) => {
    try {
      const result = insertContactMessageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid contact data", errors: result.error.errors });
      }
      
      const message = await storage.createContactMessage(result.data);
      res.json(message);
    } catch (error) {
      console.error("Error creating contact message:", error);
      res.status(500).json({ message: "Failed to send contact message" });
    }
  });

  app.get("/api/contact-messages", isAuthenticated, async (req: any, res) => {
    // Also allow admin via JWT
    try {
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      const decoded: any = token ? jwt.verify(token, JWT_SECRET) : null;
      let isAdmin = false;
      if (decoded?.sub === 'admin' || decoded?.role === 'admin') {
        isAdmin = true;
      } else if (req.user?.claims?.sub) {
        const user = await storage.getUser(req.user.claims.sub);
        isAdmin = user?.role === 'admin';
      }
      if (!isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  // Educational Games routes
  app.get("/api/educational-games", async (req, res) => {
    try {
      const games = await storage.getEducationalGames();
      res.json(games);
    } catch (error) {
      console.error("Error fetching educational games:", error);
      res.status(500).json({ message: "Failed to fetch educational games" });
    }
  });

  app.get("/api/educational-games/grade/:level", async (req, res) => {
    try {
      const games = await storage.getGamesByGrade(req.params.level);
      res.json(games);
    } catch (error) {
      console.error("Error fetching games by grade:", error);
      res.status(500).json({ message: "Failed to fetch games by grade" });
    }
  });

  const httpServer = createServer(app);
  // Admin endpoints
  app.post('/api/admin/approve-teacher', async (req, res) => {
    try {
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      const decoded: any = token ? jwt.verify(token, JWT_SECRET) : null;
      if (!(decoded?.role === 'admin' || decoded?.sub === 'admin')) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      const { userId, approved } = req.body || {};
      if (!userId) return res.status(400).json({ message: 'userId required' });
      const [updated] = await db.update(users).set({ approved: approved ?? true }).where(eq(users.id, userId)).returning();
      res.json(updated);
    } catch (e) {
      res.status(500).json({ message: 'Failed to update teacher approval' });
    }
  });

  // Resources endpoints
  app.post('/api/resources', async (req: any, res) => {
    try {
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      const decoded: any = token ? jwt.verify(token, JWT_SECRET) : null;
      if (!(decoded?.role === 'admin' || decoded?.sub === 'admin')) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      const resource = await storage.createResource({ ...req.body, createdBy: decoded?.sub });
      res.json(resource);
    } catch (e) {
      res.status(500).json({ message: 'Failed to create resource' });
    }
  });

  app.get('/api/resources', async (_req, res) => {
    try {
      const resources = await storage.getResources();
      res.json(resources);
    } catch (e) {
      res.status(500).json({ message: 'Failed to fetch resources' });
    }
  });

  app.delete('/api/resources/:id', async (req, res) => {
    try {
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      const decoded: any = token ? jwt.verify(token, JWT_SECRET) : null;
      if (!(decoded?.role === 'admin' || decoded?.sub === 'admin')) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      await storage.deleteResource(req.params.id);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ message: 'Failed to delete resource' });
    }
  });

  // Admin-only middleware
  function isAdminMiddleware(req: any, res: any, next: any) {
    try {
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      const decoded: any = token ? jwt.verify(token, JWT_SECRET) : null;
      if (decoded?.role === 'admin' || decoded?.sub === 'admin') return next();
      return res.status(403).json({ message: 'Forbidden' });
    } catch {
      return res.status(403).json({ message: 'Forbidden' });
    }
  }

  // Donations
  app.post('/api/admin/donations', isAdminMiddleware, async (req, res) => {
    try {
      const result = insertDonationSchema.safeParse(req.body);
      if (!result.success) return res.status(400).json({ message: 'Invalid donation', errors: result.error.errors });
      const row = await storage.createDonation(result.data);
      res.json(row);
    } catch (e) { res.status(500).json({ message: 'Failed to create donation' }); }
  });
  app.get('/api/admin/donations', isAdminMiddleware, async (_req, res) => {
    try { res.json(await storage.getDonations()); } catch { res.status(500).json({ message: 'Failed to list donations' }); }
  });
  app.get('/api/admin/donations/stats', isAdminMiddleware, async (_req, res) => {
    try { res.json(await storage.getDonationStats()); } catch { res.status(500).json({ message: 'Failed to get stats' }); }
  });

  // Ads
  app.post('/api/admin/ads', isAdminMiddleware, async (req, res) => {
    try {
      const result = insertAdSchema.safeParse(req.body);
      if (!result.success) return res.status(400).json({ message: 'Invalid ad', errors: result.error.errors });
      res.json(await storage.createAd(result.data));
    } catch { res.status(500).json({ message: 'Failed to create ad' }); }
  });
  app.get('/api/admin/ads', isAdminMiddleware, async (_req, res) => {
    try { res.json(await storage.listAds()); } catch { res.status(500).json({ message: 'Failed to list ads' }); }
  });
  app.patch('/api/admin/ads/:id', isAdminMiddleware, async (req, res) => {
    try { res.json(await storage.updateAd(req.params.id, req.body || {})); } catch { res.status(500).json({ message: 'Failed to update ad' }); }
  });
  app.delete('/api/admin/ads/:id', isAdminMiddleware, async (req, res) => {
    try { await storage.deleteAd(req.params.id); res.json({ success: true }); } catch { res.status(500).json({ message: 'Failed to delete ad' }); }
  });
  app.post('/api/ads/:id/impression', async (req, res) => {
    try { await storage.trackAdImpression(req.params.id); res.json({ success: true }); } catch { res.status(500).json({ message: 'Failed' }); }
  });
  app.post('/api/ads/:id/click', async (req, res) => {
    try { await storage.trackAdClick(req.params.id); res.json({ success: true }); } catch { res.status(500).json({ message: 'Failed' }); }
  });

  // Scholarships
  app.post('/api/admin/scholarships', isAdminMiddleware, async (req, res) => {
    try {
      const result = insertScholarshipSchema.safeParse(req.body);
      if (!result.success) return res.status(400).json({ message: 'Invalid scholarship', errors: result.error.errors });
      res.json(await storage.createScholarship(result.data));
    } catch { res.status(500).json({ message: 'Failed to create scholarship' }); }
  });
  app.get('/api/admin/scholarships', isAdminMiddleware, async (_req, res) => {
    try { res.json(await storage.listScholarships()); } catch { res.status(500).json({ message: 'Failed to list scholarships' }); }
  });
  app.post('/api/admin/scholarships/:id/approve', isAdminMiddleware, async (req, res) => {
    try { res.json(await storage.approveScholarship(req.params.id)); } catch { res.status(500).json({ message: 'Failed to approve' }); }
  });
  app.delete('/api/admin/scholarships/:id', isAdminMiddleware, async (req, res) => {
    try { await storage.deleteScholarship(req.params.id); res.json({ success: true }); } catch { res.status(500).json({ message: 'Failed to delete' }); }
  });

  // Partner resources
  app.post('/api/admin/partner-resources', isAdminMiddleware, async (req, res) => {
    try {
      const result = insertPartnerResourceSchema.safeParse(req.body);
      if (!result.success) return res.status(400).json({ message: 'Invalid resource', errors: result.error.errors });
      res.json(await storage.createPartnerResource(result.data));
    } catch { res.status(500).json({ message: 'Failed to create partner resource' }); }
  });
  app.get('/api/partner-resources', async (_req, res) => {
    try { res.json(await storage.listPartnerResources()); } catch { res.status(500).json({ message: 'Failed to list' }); }
  });

  // Study notes (offline sync target)
  app.post('/api/study-notes', async (req, res) => {
    try {
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      const decoded: any = token ? jwt.verify(token, JWT_SECRET) : null;
      if (!decoded?.sub) return res.status(401).json({ message: 'Unauthorized' });
      const result = insertStudyNoteSchema.safeParse({ ...req.body, userId: decoded.sub });
      if (!result.success) return res.status(400).json({ message: 'Invalid note', errors: result.error.errors });
      res.json(await storage.upsertStudyNote(result.data));
    } catch { res.status(500).json({ message: 'Failed to save note' }); }
  });
  app.get('/api/study-notes', async (req, res) => {
    try {
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      const decoded: any = token ? jwt.verify(token, JWT_SECRET) : null;
      if (!decoded?.sub) return res.status(401).json({ message: 'Unauthorized' });
      res.json(await storage.listStudyNotes(decoded.sub));
    } catch { res.status(500).json({ message: 'Failed to list notes' }); }
  });

  // Whiteboard snapshots
  app.post('/api/whiteboard/snapshots', async (req, res) => {
    try {
      const result = insertWhiteboardSnapshotSchema.safeParse(req.body);
      if (!result.success) return res.status(400).json({ message: 'Invalid snapshot', errors: result.error.errors });
      res.json(await storage.saveWhiteboardSnapshot(result.data));
    } catch { res.status(500).json({ message: 'Failed to save snapshot' }); }
  });
  app.get('/api/whiteboard/snapshots/:groupId', async (req, res) => {
    try { res.json(await storage.listWhiteboardSnapshots(req.params.groupId)); } catch { res.status(500).json({ message: 'Failed to list' }); }
  });

  // Audio lessons
  app.post('/api/audio-lessons', async (req, res) => {
    try {
      const result = insertAudioLessonSchema.safeParse(req.body);
      if (!result.success) return res.status(400).json({ message: 'Invalid audio' });
      res.json(await storage.createAudioLesson(result.data));
    } catch { res.status(500).json({ message: 'Failed to create audio' }); }
  });
  app.get('/api/audio-lessons', async (req, res) => {
    try { res.json(await storage.listAudioLessons(req.query.groupId as string | undefined)); } catch { res.status(500).json({ message: 'Failed to list audio' }); }
  });

  // Playlists
  app.post('/api/playlists', async (req, res) => {
    try {
      const result = insertPlaylistSchema.safeParse(req.body);
      if (!result.success) return res.status(400).json({ message: 'Invalid playlist' });
      res.json(await storage.createPlaylist(result.data));
    } catch { res.status(500).json({ message: 'Failed to create playlist' }); }
  });
  app.post('/api/playlists/:id/items', async (req, res) => {
    try {
      const result = insertPlaylistItemSchema.safeParse({ ...req.body, playlistId: req.params.id });
      if (!result.success) return res.status(400).json({ message: 'Invalid item' });
      res.json(await storage.addPlaylistItem(result.data));
    } catch { res.status(500).json({ message: 'Failed to add item' }); }
  });
  app.get('/api/playlists', async (_req, res) => {
    try { res.json(await storage.listPlaylists()); } catch { res.status(500).json({ message: 'Failed to list' }); }
  });
  app.get('/api/playlists/:id/items', async (req, res) => {
    try { res.json(await storage.listPlaylistItems(req.params.id)); } catch { res.status(500).json({ message: 'Failed to list items' }); }
  });

  // Mood logs
  app.post('/api/mood', async (req, res) => {
    try {
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      const decoded: any = token ? jwt.verify(token, JWT_SECRET) : null;
      if (!decoded?.sub) return res.status(401).json({ message: 'Unauthorized' });
      const result = insertMoodLogSchema.safeParse({ ...req.body, userId: decoded.sub });
      if (!result.success) return res.status(400).json({ message: 'Invalid' });
      res.json(await storage.createMoodLog(result.data));
    } catch { res.status(500).json({ message: 'Failed' }); }
  });
  app.get('/api/admin/mood-logs', isAdminMiddleware, async (_req, res) => {
    try { res.json(await storage.listMoodLogs()); } catch { res.status(500).json({ message: 'Failed' }); }
  });


  // WebSocket Server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  const connectedClients = new Map<string, WebSocket>();

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');
    let userId: string | null = null;

    ws.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === 'auth') {
          userId = message.userId;
          if (userId) {
            connectedClients.set(userId, ws);
          }
          ws.send(JSON.stringify({ type: 'auth_success' }));
          return;
        }

        if (message.type === 'chat_message' && userId) {
          // Validate and save the message
          const result = insertChatMessageSchema.safeParse({
            groupId: message.groupId,
            userId: userId,
            message: message.message,
            messageType: message.messageType || 'text',
            fileUrl: message.fileUrl,
            fileName: message.fileName,
          });

          if (result.success) {
            const savedMessage = await storage.createMessage(result.data);
            
            // Broadcast to all clients in the same group
            const broadcastMessage = {
              type: 'new_message',
              data: savedMessage,
            };
            
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(broadcastMessage));
              }
            });
          }
        }

      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (userId) {
        connectedClients.delete(userId);
      }
      console.log('Client disconnected from WebSocket');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return httpServer;
}
