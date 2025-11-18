// Seasonal Content - Real creative briefs for each season
const SeasonalContent = {
  seasons: {
    winter: {
      title: '❄️ Winter Sprint: Monochrome Minimalism',
      description: 'Design with only black, white, and one accent color. Embrace simplicity and clarity.',
      color: '#2c3e50',
      tools: [
        { title: 'Constraint Challenge', prompt: 'Create 3 designs using ONLY 2 colors (black + 1 choice). What can you express with limits?' },
        { title: 'Visual Hierarchy', prompt: 'Design a poster using only typography. No images. How do you guide the viewer?'  },
        { title: 'Pattern Play', prompt: 'Create a repeating pattern using only geometric shapes in your 2-color palette.' }
      ]
    },
    spring: {
      title: '🌱 Spring Renewal: Brand Refresh',
      description: 'Update an existing brand with spring energy. New colors, fonts, maybe new icon system.',
      color: '#27ae60',
      tools: [
        { title: 'Color Workshop', prompt: 'Pick 5 colors that represent "new beginning". Explain your choices.' },
        { title: 'Logo Evolution', prompt: 'Take an existing logo and redesign it for spring 2025. What changes?' },
        { title: 'Mood Board', prompt: 'Curate 10 images that inspire your spring brand direction. Find patterns.' }
      ]
    },
    summer: {
      title: '☀️ Summer Campaign: Short-Form Sprint',
      description: '3-day challenge: Create a complete social media campaign (5 posts + 1 story template).',
      color: '#f39c12',
      tools: [
        { title: 'Copy + Design', prompt: 'Write 5 punchy captions (max 100 chars). Then design 5 posts to match.' },
        { title: 'Series Cohesion', prompt: 'Design 5 related posts that feel like one campaign, not random posts.' },
        { title: 'Story Sequence', prompt: 'Design 3 story frames that tell a narrative. What\'s the arc?' }
      ]
    },
    autumn: {
      title: '🍂 Autumn Retrospective: Portfolio Review',
      description: 'Reflect on your year. Showcase your best 3-5 projects with new case studies.',
      color: '#d35400',
      tools: [
        { title: 'Project Documentation', prompt: 'Pick your best project. Document: Brief, Process, Outcome, Learning.' },
        { title: 'Before/After', prompt: 'Show a redesign you did. What changed? Why? What did you learn?' },
        { title: 'Growth Narrative', prompt: 'Compare your work from 6 months ago vs. now. What has evolved?' }
      ]
    }
  },

  getSeason() {
    const month = new Date().getMonth();
    if (month < 3) return 'winter';
    if (month < 6) return 'spring';
    if (month < 9) return 'summer';
    return 'autumn';
  },

  getCurrentBrief() {
    const season = this.getSeason();
    return this.seasons[season];
  },

  getBriefByName(name) {
    return this.seasons[name] || null;
  },

  getToolsForSeason(season) {
    return this.seasons[season]?.tools || [];
  }
};

window.SeasonalContent = SeasonalContent;
