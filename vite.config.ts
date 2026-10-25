import { defineConfig } from 'vite'
import career from './src/careerAvailability.json' with { type: 'json' }
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), {
    name: 'career-availability-metadata',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const description = `Enterprise Test Management, SAP S/4HANA UAT governance, Jira/Xray automation, international rollout coordination and Python-based testing solutions. Available from ${career.availableFrom}. Open to relocation throughout ${career.relocationCountry} (${career.preferredLocation} preferred). Up to ${career.maxBusinessTravelPercent}% business travel, depending on business needs.`
        const attribute = description.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        return html.split('__CAREER_DESCRIPTION__').join(attribute)
      },
    },
  }],
  base: '/portfolio/',
  build: { rolldownOptions: { output: { codeSplitting: { groups: [{ name: 'translations', test: /src\/i18n\/(?:en|de)\.ts$/ }] } } } },
})
