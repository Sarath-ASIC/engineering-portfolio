import { defineType, defineField } from 'sanity';

export const research = defineType({
  name: 'research',
  title: 'Research / learning item',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'kind', type: 'string', options: { list: ['publication', 'literature-review', 'academic-report', 'presentation', 'certification', 'article'] } }),
    defineField({ name: 'status', type: 'string', initialValue: 'ongoing', options: { list: ['published', 'submitted', 'ongoing', 'planned'], layout: 'radio' } }),
    defineField({ name: 'summary', type: 'text', rows: 3, description: 'If you are reading someone else\'s paper, say so.' }),
    defineField({ name: 'year', type: 'string' }),
    defineField({ name: 'url', type: 'url' }),
    defineField({ name: 'order', type: 'number', initialValue: 50 }),
  ],
  preview: { select: { title: 'title', subtitle: 'status' } },
});
