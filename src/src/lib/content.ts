/**
 * Content layer.
 * - If SANITY_PROJECT_ID is set, content comes from Sanity at build time.
 * - Otherwise it comes from src/data/seed/*.json (same shape), so the site always builds.
 * If Sanity is configured but a request fails, the build FAILS rather than publishing an empty site.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';
import settingsSeed from '../data/seed/settings.json';
import projectsSeed from '../data/seed/projects.json';
import experienceSeed from '../data/seed/experience.json';
import skillsSeed from '../data/seed/skills.json';
import researchSeed from '../data/seed/research.json';

export type Status = 'completed' | 'in-progress' | 'prototype' | 'planned';
export interface Section { heading: string; body: string }
export interface Link { label: string; url: string; kind?: string }
export interface Project {
  title: string; slug: string; status: Status; featured: boolean; published?: boolean; order: number;
  summary: string; categories: string[]; tags: string[]; tools: string[];
  kind?: string; contribution?: string; period?: string;
  sections: Section[]; links: Link[]; diagramUrl?: string; diagramAlt?: string;
}
export interface Experience {
  slug: string; kind: 'internship' | 'education' | 'academic'; title: string; org: string; location?: string;
  start?: string; end?: string; current?: boolean; responsibilities: string[]; tools: string[];
  achievements: string[]; upcoming?: string; note?: string; order: number;
}
export interface Skill { name: string; category: string; level: 'used' | 'working' | 'learning'; evidence?: string; projects: string[]; order: number }
export interface Research { title: string; slug: string; kind: string; status: string; summary: string; year?: string; url?: string; order: number }
export interface Settings {
  name: string; roleLines: string[]; intro: string; stage: string; openTo: string; location: string;
  email: string; github: string; linkedin: string; siteUrl: string; seoDescription: string; resumeUrl?: string;
}

const env = import.meta.env;
const projectId = env.SANITY_PROJECT_ID as string | undefined;
const preview = env.SANITY_PREVIEW === 'true' && !!env.SANITY_READ_TOKEN;

const client = projectId
  ? createClient({
      projectId,
      dataset: (env.SANITY_DATASET as string) || 'production',
      apiVersion: '2024-10-01',
      useCdn: false,
      token: preview ? (env.SANITY_READ_TOKEN as string) : undefined,
      perspective: preview ? 'drafts' : 'published',
    })
  : null;

export const usingSanity = !!client;

const STATUS_RANK: Record<string, number> = { completed: 0, 'in-progress': 1, prototype: 2, planned: 3 };

async function q<T>(groq: string, fallback: T): Promise<T> {
  if (!client) return fallback;
  return (await client.fetch<T>(groq)) ?? fallback;
}

let cache: Record<string, unknown> = {};
async function once<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (!(key in cache)) cache[key] = fn();
  return cache[key] as Promise<T>;
}

export const getSettings = () => once<Settings>('settings', async () => {
  const s = await q<Settings>(
    `*[_type=="siteSettings"][0]{name,roleLines,intro,stage,openTo,location,email,github,linkedin,siteUrl,seoDescription,"resumeUrl":resume.asset->url}`,
    settingsSeed as Settings,
  );
  // Fall back to a local file only if no CMS résumé exists.
  if (!s.resumeUrl && fs.existsSync(path.join(process.cwd(), 'public', 'resume.pdf'))) s.resumeUrl = '/resume.pdf';
  return s;
});

export const getProjects = () => once<Project[]>('projects', async () => {
  const raw = await q<Project[]>(
    `*[_type=="project"]{title,"slug":slug.current,status,featured,order,summary,categories,tags,tools,kind,contribution,period,sections,links,"diagramUrl":diagram.asset->url,diagramAlt}`,
    projectsSeed as Project[],
  );
  return raw
    .filter((p) => p.published !== false && p.slug)
    .map((p) => ({ ...p, categories: p.categories ?? [], tags: p.tags ?? [], tools: p.tools ?? [], sections: p.sections ?? [], links: (p.links ?? []).filter((l) => l?.url) }))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || (STATUS_RANK[a.status] ?? 9) - (STATUS_RANK[b.status] ?? 9) || (a.order ?? 99) - (b.order ?? 99));
});

export const getExperience = () => once<Experience[]>('experience', async () => {
  const raw = await q<Experience[]>(`*[_type=="experience"]{"slug":slug.current,kind,title,org,location,start,end,current,responsibilities,tools,achievements,upcoming,note,order}`, experienceSeed as Experience[]);
  return raw.map((e) => ({ ...e, responsibilities: e.responsibilities ?? [], tools: e.tools ?? [], achievements: e.achievements ?? [] })).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
});

export const getSkills = () => once<Skill[]>('skills', async () => {
  const raw = await q<Skill[]>(`*[_type=="skill"]{name,category,level,evidence,"projects":projects[]->slug.current,order}`, skillsSeed as Skill[]);
  return raw.map((s) => ({ ...s, projects: (s.projects ?? []).filter(Boolean) })).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
});

export const getResearch = () => once<Research[]>('research', async () => {
  const raw = await q<Research[]>(`*[_type=="research"]{title,"slug":slug.current,kind,status,summary,year,url,order}`, researchSeed as Research[]);
  return raw.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
});

export const STATUS_LABEL: Record<string, string> = { completed: 'Completed', 'in-progress': 'In progress', prototype: 'Prototype', planned: 'Planned' };
export const LEVEL_LABEL: Record<string, string> = { used: 'Used in project', working: 'Working knowledge', learning: 'Currently learning' };

/** Split a plain-text body into paragraphs and "- " bullet lists. */
export function parseBody(body: string): ({ type: 'p'; text: string } | { type: 'ul'; items: string[] })[] {
  const out: ({ type: 'p'; text: string } | { type: 'ul'; items: string[] })[] = [];
  for (const block of (body ?? '').split(/\n{2,}/)) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    let list: string[] = [];
    const flush = () => { if (list.length) { out.push({ type: 'ul', items: list }); list = []; } };
    const para: string[] = [];
    const flushP = () => { if (para.length) { out.push({ type: 'p', text: para.join(' ') }); para.length = 0; } };
    for (const l of lines) {
      if (l.startsWith('- ')) { flushP(); list.push(l.slice(2)); } else { flush(); para.push(l); }
    }
    flush(); flushP();
  }
  return out;
}
