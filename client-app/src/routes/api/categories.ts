import { createFileRoute } from '@tanstack/react-router'
import { db } from '@/lib/db'

export const Route = createFileRoute('/api/categories')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const categories = await db.categories.findAll()
          return Response.json(categories)
        } catch (error) {
          return Response.json({ error: 'Failed to fetch categories' }, { status: 500 })
        }
      },
    },
  },
})
