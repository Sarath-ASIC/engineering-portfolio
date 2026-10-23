// Converts src/data/seed/*.json into seed.ndjson for a one-time import into Sanity:
//   npm run seed:ndjson
//   cd studio && npx sanity dataset import ../seed.ndjson production --replace
// Projects with "published": false are imported as DRAFTS (drafts.<id>), so they stay hidden until you publish them.
import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve('src/data/seed');
const read = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
const key = (i) => `k${i}`;
const slug = (s) => ({ _type: 'slug', current: s });
const docs = [];

const settings = read('settings.json');
docs.push({ _id: 'siteSettings', _type: 'siteSettings', ...settings });

for (const p of read('projects.json')) {
  const { published, slug: s, sections = [], links = [], ...rest } = p;
  const id = `project-${s}`;
  docs.push({
    _id: published === false ? `drafts.${id}` : id,
    _type: 'project',
    ...rest,
    slug: slug(s),
    sections: sections.map((x, i) => ({ _key: key(i), _type: 'section', ...x })),
    links: links.map((x, i) => ({ _key: key(i), _type: 'link', ...x })),
  });
}
for (const e of read('experience.json')) {
  const { slug: s, ...rest } = e;
  docs.push({ _id: `experience-${s}`, _type: 'experience', slug: slug(s), ...rest });
}
for (const r of read('research.json')) {
  const { slug: s, ...rest } = r;
  docs.push({ _id: `research-${s}`, _type: 'research', slug: slug(s), ...rest });
}
read('skills.json').forEach((k, i) => {
  const { projects = [], ...rest } = k;
  docs.push({
    _id: `skill-${i + 1}`, _type: 'skill', ...rest,
    projects: projects.map((s, j) => ({ _key: key(j), _type: 'reference', _ref: `project-${s}`, _weak: true })),
  });
});

fs.writeFileSync('seed.ndjson', docs.map((d) => JSON.stringify(d)).join('\n') + '\n');
console.log(`Wrote seed.ndjson with ${docs.length} documents.`);
