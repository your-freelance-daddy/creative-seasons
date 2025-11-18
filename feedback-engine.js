// Creative Pulse - Personalized Feedback Engine
// Smart analysis for creative sessions

const FeedbackEngine = {
  generateFeedback(sessionData) {
    const { mode, data } = sessionData;
    const analysis = {
      brainstorm: () => this.analyzeBrainstorm(data),
      organize: () => this.analyzeOrganize(data),
      inspire: () => this.analyzeInspire(data),
      experiment: () => this.analyzeExperiment(data)
    };
    return analysis[mode] ? analysis[mode]() : { error: 'Invalid mode' };
  },

  analyzeBrainstorm(data) {
    const ideas = data.ideas || [];
    const scenarios = data.scenarios || [];
    const themes = this.extractThemes([...ideas, ...scenarios]);
    
    return {
      type: 'brainstorm',
      title: '💡 Brainstorm Analysis',
      summary: `You generated ${ideas.length} ideas and ${scenarios.length} what-if scenarios.`,
      insights: [
        {
          title: 'Idea Themes',
          content: themes.length > 0 
            ? `Your ideas cluster around: ${themes.join(', ')}. These could combine into stronger concepts.`
            : 'Your ideas span different areas - that shows diverse thinking!',
          icon: '🎯'
        },
        {
          title: 'Quality Signal',
          content: ideas.length < 3 ? 'Keep brainstorming to find better patterns' : 'Good volume - now look for 2-3 strongest ideas',
          icon: '✓'
        }
      ],
      nextSteps: ['Merge 2-3 similar ideas', 'Create 1 mashup', 'Test top 3 with someone']
    };
  },

  analyzeOrganize(data) {
    const priorities = data.priorities || [];
    const timeline = data.timeline || [];
    const feasible = priorities.length <= 5;
    
    return {
      type: 'organize',
      title: '📋 Organization Assessment',
      summary: `You have ${priorities.length} priorities across ${timeline.length} time periods.`,
      insights: [
        {
          title: 'Feasibility Check',
          content: feasible ? `Good - ${priorities.length} priorities is manageable.` : `⚠️ ${priorities.length} is high. Focus matters more now.`,
          icon: '⏱️'
        },
        {
          title: 'Timeline Health',
          content: timeline.length < priorities.length ? 'You have more priorities than time slots' : 'Timeline aligns with priorities',
          icon: '📅'
        }
      ],
      nextSteps: feasible ? ['Assign owners', 'Weekly check-ins', 'Track progress'] : ['Cut to top 3', 'Merge overlapping', 'Re-prioritize']
    };
  },

  analyzeInspire(data) {
    const references = data.references || [];
    const twists = data.twists || [];
    const hasRemix = twists.length > 0;
    
    return {
      type: 'inspire',
      title: '🌟 Inspiration Audit',
      summary: `You found ${references.length} sources and explored ${twists.length} creative twists.`,
      insights: [
        {
          title: 'Research Depth',
          content: references.length < 3 ? 'Gather more references' : references.length < 8 ? 'Good breadth, go deeper' : 'Excellent breadth!',
          icon: '📚'
        },
        {
          title: 'Remixing',
          content: hasRemix ? `You're actively remixing (${twists.length} variations). Great!` : 'Try combining references in unexpected ways',
          icon: '✨'
        }
      ],
      nextSteps: ['Create mood board', 'Design 1 variation', 'Share for feedback']
    };
  },

  analyzeExperiment(data) {
    const tests = data.test || [];
    const metrics = data.metrics || [];
    const testGood = tests.length > 0 && tests[0].length > 5;
    const metricsGood = metrics.length > 0;
    
    return {
      type: 'experiment',
      title: '🧪 Experiment Validation',
      summary: `Test scope: ${testGood ? 'focused' : 'broad'} | Metrics: ${metricsGood ? 'defined' : 'unclear'}`,
      insights: [
        {
          title: 'Test Scope',
          content: testGood ? 'Perfect - narrow scope = faster learning' : 'Broader scope - consider starting smaller',
          icon: '🔬'
        },
        {
          title: 'Metrics',
          content: metricsGood ? 'Measurable - you can track success' : 'Define what success looks like first',
          icon: '📊'
        }
      ],
      nextSteps: ['Set baseline', 'Run 1 week', 'Document results', 'Iterate']
    };
  },

  extractThemes(items) {
    const words = items.join(' ').toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const freq = {};
    words.forEach(w => freq[w] = (freq[w] || 0) + 1);
    return Object.entries(freq).filter(([, c]) => c > 1).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([w]) => w);
  }
};

window.FeedbackEngine = FeedbackEngine;
