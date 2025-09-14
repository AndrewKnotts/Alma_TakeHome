import { Lead } from './types';

const leads: Lead[] = [];

export const db = {
  list(): Lead[] {
    return leads;
  },
  add(lead: Lead) {
    leads.unshift(lead);
  },
  updateState(id: string, state: Lead['state']) {
    const idx = leads.findIndex(l => l.id === id);
    if (idx >= 0) leads[idx].state = state;
  },
  get(id: string) {
    return leads.find(l => l.id === id);
  }
};
