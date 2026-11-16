import type { Job } from './kanto';
export const gcashMerchant = { number: '09241748668', name: 'Jonel M', appUrl: 'gcash://' };
export function matchesSearch(job: Job, query: string) {
  return `${job.title} ${job.category} ${job.description}`.toLowerCase().includes(query.trim().toLowerCase());
}