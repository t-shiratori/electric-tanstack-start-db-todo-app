import { createFileRoute } from '@tanstack/react-router'
import { db } from '@/lib/db'

export const Route = createFileRoute('/api/todos/$id')({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        try {
          // Optimistic Updatesを可視化するための遅延（1.5秒）
          await new Promise((resolve) => setTimeout(resolve, 1500))

          // エラーシミュレーションヘッダーをチェック
          const simulateError = request.headers.get('x-simulate-error') === 'true'
          if (simulateError) {
            return Response.json(
              { error: 'Simulated error: Server rejected the update' },
              { status: 500 }
            )
          }

          const { id } = params
          const body = await request.json()

          const result = await db.todos.update(id, body)

          if (!result) {
            return Response.json({ error: 'Todo not found' }, { status: 404 })
          }

          return Response.json({ ...result.todo, txid: result.txid })
        } catch (error) {
          return Response.json({ error: 'Failed to update todo' }, { status: 500 })
        }
      },
      DELETE: async ({ request, params }) => {
        try {
          // Optimistic Updatesを可視化するための遅延（1.5秒）
          await new Promise((resolve) => setTimeout(resolve, 1500))

          // エラーシミュレーションヘッダーをチェック
          const simulateError = request.headers.get('x-simulate-error') === 'true'
          if (simulateError) {
            return Response.json(
              { error: 'Simulated error: Server rejected the delete' },
              { status: 500 }
            )
          }

          const { id } = params
          const { success, txid } = await db.todos.delete(id)

          if (!success) {
            return Response.json({ error: 'Todo not found' }, { status: 404 })
          }

          return Response.json({ success: true, txid })
        } catch (error) {
          return Response.json({ error: 'Failed to delete todo' }, { status: 500 })
        }
      },
    },
  },
})
