import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { todos } from "../db/schema";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get all todos for logged-in user
 *     tags: [Todos]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of todos }
 */
router.get("/", async (req: AuthRequest, res) => {
  const data = await db.query.todos.findMany({
    where: eq(todos.userId, req.userId!),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });
  res.json({ todos: data });
});

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create a todo
 *     tags: [Todos]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *     responses:
 *       201: { description: Todo created }
 */
router.post("/", async (req: AuthRequest, res) => {
  const { title } = req.body;
  if (!title) {
    res.status(400).json({ error: "Title required" });
    return;
  }

  const [todo] = await db
    .insert(todos)
    .values({ userId: req.userId!, title })
    .returning();
  res.status(201).json({ todo });
});

/**
 * @swagger
 * /todos/{id}:
 *   patch:
 *     summary: Toggle todo completed
 *     tags: [Todos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Todo updated }
 */
router.patch("/:id", async (req: AuthRequest, res) => {
  const todo = await db.query.todos.findFirst({
    where: and(eq(todos.id, req.params.id), eq(todos.userId, req.userId!)),
  });
  if (!todo) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const [updated] = await db
    .update(todos)
    .set({ completed: !todo.completed })
    .where(eq(todos.id, req.params.id))
    .returning();
  res.json({ todo: updated });
});

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Todo deleted }
 */
router.delete("/:id", async (req: AuthRequest, res) => {
  await db
    .delete(todos)
    .where(and(eq(todos.id, req.params.id), eq(todos.userId, req.userId!)));
  res.json({ message: "Deleted" });
});

export default router;
