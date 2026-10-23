import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes/index.js';

// Replace with your project ID from sanity.io/manage (it is not a secret).
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'YOUR_PROJECT_ID';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

// Site settings is a single document: show it directly instead of as a list.
const structure = (S) =>
  S.list().title('Portfolio').items([
    S.listItem().title('Site settings & résumé').id('siteSettings')
      .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    S.divider(),
    S.documentTypeListItem('project').title('Projects'),
    S.documentTypeListItem('experience').title('Experience & education'),
    S.documentTypeListItem('skill').title('Skills'),
    S.documentTypeListItem('research').title('Research & learning'),
  ]);

export default defineConfig({
  name: 'portfolio',
  title: 'Sarath K C — Portfolio CMS',
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
  document: {
    // Prevent creating a second settings document.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global' ? prev.filter((t) => t.templateId !== 'siteSettings') : prev,
  },
});
