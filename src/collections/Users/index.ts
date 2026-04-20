import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { isAdmin } from '../../access/isAdmin' // we'll create this helper

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        // Add other roles as needed
      ],
      defaultValue: [],
      access: {
        // Only admins can update roles
        update: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
        create: ({ req: { user } }) => user?.roles?.includes('admin') ?? false,
      },
    },
  ],
  timestamps: true,
}
