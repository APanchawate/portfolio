import facts from './careerAvailability.json'

// Public career facts are shared with Vite's HTML metadata through careerAvailability.json.
export const careerAvailability = Object.freeze({
  date: facts.availableFrom,
  hero: `Available from ${facts.availableFrom.replace(/^\d+\s+/, '')} · ${facts.relocationCountry}-wide mobility`,
  relocation: `Open to relocation throughout ${facts.relocationCountry} (${facts.preferredLocation} preferred)`,
  relocationDetail: `Open to relocation throughout ${facts.relocationCountry}, with ${facts.preferredLocation} as my preferred location.`,
  mobilitySummary: `${facts.preferredLocation} preferred · Open to relocation throughout ${facts.relocationCountry} · Up to ${facts.maxBusinessTravelPercent}% business travel`,
  travelShort: `Up to ${facts.maxBusinessTravelPercent}% business travel`,
  travelDetail: `Available for up to ${facts.maxBusinessTravelPercent}% business travel, depending on project requirements.`,
  summary: `Available from ${facts.availableFrom} | Open to relocation throughout ${facts.relocationCountry} (${facts.preferredLocation} preferred) | Up to ${facts.maxBusinessTravelPercent}% business travel`,
})
