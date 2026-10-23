import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'roleLines', title: 'Headline role lines', type: 'array', of: [{ type: 'string' }], description: 'Shown under the name, one per line.' }),
    defineField({ name: 'intro', type: 'text', rows: 4 }),
    defineField({ name: 'stage', title: 'Current academic / professional stage', type: 'string' }),
    defineField({ name: 'openTo', type: 'string' }),
    defineField({ name: 'location', type: 'string' }),
    defineField({ name: 'email', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'github', type: 'url' }),
    defineField({ name: 'linkedin', type: 'url' }),
    defineField({ name: 'resume', title: 'Résumé (PDF)', type: 'file', options: { accept: 'application/pdf' }, description: 'Upload a new file here to replace the résumé. The download button appears only when a file exists.' }),
    defineField({ name: 'siteUrl', type: 'url' }),
    defineField({ name: 'seoDescription', title: 'Search / social description', type: 'text', rows: 2, validation: (r) => r.max(200) }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});
