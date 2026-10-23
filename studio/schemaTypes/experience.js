import { defineType, defineField } from 'sanity';

export const experience = defineType({
  name: 'experience',
  title: 'Experience / education entry',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'kind', type: 'string', initialValue: 'internship', options: { list: ['internship', 'education', 'academic'], layout: 'radio' } }),
    defineField({ name: 'org', title: 'Employer / institution', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'location', type: 'string' }),
    defineField({ name: 'start', type: 'string', description: 'e.g. 2026-06 or 2025' }),
    defineField({ name: 'end', type: 'string' }),
    defineField({ name: 'current', type: 'boolean', initialValue: false }),
    defineField({ name: 'responsibilities', type: 'array', of: [{ type: 'string' }], description: 'Never include confidential employer information.' }),
    defineField({ name: 'tools', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'achievements', type: 'array', of: [{ type: 'string' }], description: 'Only verified, publishable achievements.' }),
    defineField({ name: 'upcoming', type: 'string', description: 'Upcoming work, if cleared for public listing.' }),
    defineField({ name: 'note', type: 'text', rows: 2 }),
    defineField({ name: 'order', type: 'number', initialValue: 50 }),
  ],
  preview: { select: { title: 'title', subtitle: 'org' } },
});
