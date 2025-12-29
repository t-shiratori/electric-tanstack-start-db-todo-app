import { createFileRoute } from '@tanstack/react-router'
import { db } from '@/lib/db'

export const Route = createFileRoute('/api/users')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const users = await db.users.findAll()
          return Response.json(users)
        } catch (error) {
          return Response.json({ error: 'Failed to fetch users' }, { status: 500 })
        }
      },
    },
  },
})
