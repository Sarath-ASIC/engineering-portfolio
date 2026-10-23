import { defineType, defineField, defineArrayMember } from 'sanity';

export const CATEGORIES = [
  'RTL Design', 'Design Verification', 'FPGA', 'ASIC Design', 'STA and Timing',
  'CDC and Lint', 'Embedded Systems', 'Research and Academic',
];

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  // Sanity drafts: until you press Publish, the public site does not show changes.
  // To hide a published project, use Unpublish in the document menu.
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title', maxLength: 60 }, validation: (r) => r.required() }),
    defineField({
      name: 'status', type: 'string', initialValue: 'in-progress',
      options: { list: [
        { title: 'Completed', value: 'completed' }, { title: 'In progress', value: 'in-progress' },
        { title: 'Prototype', value: 'prototype' }, { title: 'Planned', value: 'planned' },
      ], layout: 'radio' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'featured', type: 'boolean', initialValue: false, description: 'Shown on the home page (first three).' }),
    defineField({ name: 'order', type: 'number', initialValue: 50, description: 'Lower numbers appear first within the same status.' }),
    defineField({ name: 'summary', type: 'text', rows: 3, validation: (r) => r.required().max(400), description: 'Two or three factual sentences. No adjectives you cannot back up.' }),
    defineField({ name: 'kind', title: 'Project type', type: 'string', description: 'e.g. Academic minor project, Personal project, Team project.' }),
    defineField({ name: 'contribution', type: 'string', description: 'Your individual contribution, e.g. "Individual" or "RTL and testbench; teammate did report".' }),
    defineField({ name: 'period', type: 'string' }),
    defineField({ name: 'categories', type: 'array', of: [{ type: 'string' }], options: { list: CATEGORIES } }),
    defineField({ name: 'tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'tools', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' }, description: 'Only tools you actually used on this project.' }),
    defineField({ name: 'diagram', title: 'Architecture diagram / screenshot', type: 'image', options: { hotspot: false } }),
    defineField({ name: 'diagramAlt', title: 'Diagram caption / alt text', type: 'string' }),
    defineField({
      name: 'sections', title: 'Case-study sections', type: 'array',
      description: 'Add only sections that apply: Problem, Architecture, Interfaces, Verification, Results, Limitations, Lessons… In the body, blank line = new paragraph; start a line with "- " for a bullet.',
      of: [defineArrayMember({
        type: 'object', name: 'section',
        fields: [
          defineField({ name: 'heading', type: 'string', validation: (r) => r.required() }),
          defineField({ name: 'body', type: 'text', rows: 8 }),
        ],
        preview: { select: { title: 'heading', subtitle: 'body' } },
      })],
    }),
    defineField({
      name: 'links', title: 'Repository, report and evidence links', type: 'array',
      of: [defineArrayMember({
        type: 'object', name: 'link',
        fields: [
          defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
          defineField({ name: 'url', type: 'url', validation: (r) => r.required().uri({ scheme: ['https', 'http'] }) }),
          defineField({ name: 'kind', type: 'string', options: { list: ['GitHub', 'Report', 'Slides', 'Demo', 'Waveform', 'Synthesis report', 'Coverage report'] } }),
        ],
        preview: { select: { title: 'label', subtitle: 'url' } },
      })],
    }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'status' } },
});
