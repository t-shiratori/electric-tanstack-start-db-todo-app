import { createFileRoute } from '@tanstack/react-router'
import { db } from '@/lib/db'

export const Route = createFileRoute('/api/todos')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const todos = await db.todos.findAll()
          return Response.json(todos)
        } catch (error) {
          return Response.json({ error: 'Failed to fetch todos' }, { status: 500 })
        }
      },
      POST: async ({ request }) => {
        try {
          // Optimistic Updatesを可視化するための遅延（1.5秒）
          await new Promise((resolve) => setTimeout(resolve, 1500))

          // エラーシミュレーションヘッダーをチェック
          const simulateError = request.headers.get('x-simulate-error') === 'true'
          if (simulateError) {
            return Response.json(
              { error: 'Simulated error: Server rejected the request' },
              { status: 500 }
            )
          }

          const body = await request.json()
          const { title, userId, categoryId } = body

          if (!title || typeof title !== 'string') {
            return Response.json({ error: 'Title is required' }, { status: 400 })
          }

          const { todo, txid } = await db.todos.create({
            title,
            completed: false,
            userId,
            categoryId,
          })

          return Response.json({ ...todo, txid }, { status: 201 })
        } catch (error) {
          return Response.json({ error: 'Failed to create todo' }, { status: 500 })
        }
      },
    },
  },
})
