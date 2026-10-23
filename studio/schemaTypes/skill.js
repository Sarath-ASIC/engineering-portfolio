import { defineType, defineField } from 'sanity';

export const skill = defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'category', type: 'string', validation: (r) => r.required(),
      options: { list: [
        'HDL and RTL Design', 'Verification', 'FPGA and Implementation', 'ASIC Synthesis and Timing',
        'CDC, Lint and Formal', 'Embedded Systems', 'Scripting and Automation', 'Computer Architecture',
        'Memory Systems', 'Simulation and Tools', 'Analog and Layout',
      ] },
    }),
    defineField({
      name: 'level', type: 'string', initialValue: 'learning', validation: (r) => r.required(),
      options: { layout: 'radio', list: [
        { title: 'Used in project', value: 'used' },
        { title: 'Working knowledge', value: 'working' },
        { title: 'Currently learning', value: 'learning' },
      ] },
      description: 'Pick "Used in project" only if a listed project actually uses it.',
    }),
    defineField({ name: 'evidence', type: 'string', description: 'One factual line of evidence.' }),
    defineField({ name: 'projects', type: 'array', of: [{ type: 'reference', to: [{ type: 'project' }] }] }),
    defineField({ name: 'order', type: 'number', initialValue: 50 }),
  ],
  preview: { select: { title: 'name', subtitle: 'level' } },
});
