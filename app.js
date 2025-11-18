// FIXED & ENHANCED FEEDBACK ENGINE WITH PROPER DATA HANDLING
const FeedbackEngine = {
  generateFeedback(e) {
    const { mode, data } = e;
    const handlers = {
      brainstorm: () => this.analyzeBrainstorm(data),
      organize: () => this.analyzeOrganize(data),
      inspire: () => this.analyzeInspire(data),
      experiment: () => this.analyzeExperiment(data)
    };
    return handlers[mode] ? handlers[mode]() : { error: 'Invalid mode' };
  },

  analyzeBrainstorm(data) {
    const ideas = data.ideas || [];
    const scenarios = data.scenarios || [];
    const themes = this.extractThemes([...ideas, ...scenarios]);
    
    let summary = '';
    if (ideas.length < 3) summary = "You're building momentum! Keep adding more ideas.";
    else if (ideas.length < 5) summary = "Good start! 5+ ideas help spot patterns.";
    else if (ideas.length < 8) summary = "Excellent volume across multiple angles!";
    else summary = "Outstanding! You're finding surprising combinations.";

    return {
      type: 'brainstorm',
      title: '💡 Brainstorm Analysis',
      summary: `You generated ${ideas.length} ideas and ${scenarios.length} scenarios. ${summary}`,
      insights: [
        {
          title: '💫 Your Idea Themes',
          content: themes.length > 0 ? `Themes: ${themes.join(", ")}. Look for how to merge these.` : 'Great breadth! Spot unexpected connections.',
          icon: '🎯'
        },
        {
          title: '⚡ Volume Check',
          content: ideas.length < 3 ? "Aim for 3-5 ideas" : "Now identify your top 3 strongest ideas",
          icon: '✓'
        }
      ],
      nextSteps: [
        'Combine your top 2-3 themes into 1 concept',
        'Ask: "What if I merged the best of each?"',
        'Test your strongest idea with someone'
      ]
    };
  },

  analyzeOrganize(data) {
    const priorities = data.priorities || [];
    const timeline = data.timeline || [];
    const isFocused = priorities.length <= 5;
    
    let summary = '';
    if (priorities.length === 0) summary = 'Ready to add your first priority?';
    else if (priorities.length < 3) summary = `${priorities.length} priority is focused!`;
    else if (priorities.length <= 5) summary = `${priorities.length} priorities is the sweet spot!`;
    else summary = `${priorities.length} priorities - consider narrowing to top 3-5.`;

    return {
      type: 'organize',
      title: '📋 Organization Assessment',
      summary: `${priorities.length} priorities across ${timeline.length} time slots. ${summary}`,
      insights: [
        {
          title: '🎯 Priority Health',
          content: isFocused ? "Perfect! This is manageable." : "Tip: Focus multiplies impact. Try narrowing to 3.",
          icon: '⏱️'
        },
        {
          title: '📅 Timeline Alignment',
          content: timeline.length === 0 ? "Add when each priority happens" : `Good coverage across ${timeline.length} time slots.`,
          icon: '📆'
        }
      ],
      nextSteps: isFocused ? ['Assign 1 owner per priority', 'Weekly check-ins', 'Track progress'] : ['Pick your top 3', 'Consolidate similar items', 'Re-time to 3-5 slots']
    };
  },

  analyzeInspire(data) {
    const references = data.references || [];
    const twists = data.twists || [];
    
    let summary = '';
    if (references.length < 2) summary = 'Start collecting references!';
    else if (references.length < 5) summary = 'Good foundation! Keep finding patterns.';
    else if (references.length < 10) summary = 'Impressive research breadth!';
    else summary = 'Expert level - time to remix and synthesize.';

    return {
      type: 'inspire',
      title: '🌟 Inspiration Audit',
      summary: `${references.length} references + ${twists.length} variations explored. ${summary}`,
      insights: [
        {
          title: '📚 Research Depth',
          content: references.length < 3 ? "Gather 3-5 references" : `You have ${references.length} references - look for patterns.`,
          icon: '🔍'
        },
        {
          title: '✨ Remixing',
          content: twists.length > 0 ? `Great! You're exploring ${twists.length} variations.` : 'Try combining 2-3 references unexpectedly.',
          icon: '⚡'
        }
      ],
      nextSteps: ['Create 1 mood board from references', 'Design 2 mashups', 'Share for feedback']
    };
  },

  analyzeExperiment(data) {
    const test = data.test || [];
    const metrics = data.metrics || [];
    const isFocused = test.length > 0 && test[0].length > 10;
    const hasMetrics = metrics.length > 0;

    return {
      type: 'experiment',
      title: '🧪 Experiment Validation',
      summary: `Scope: ${isFocused ? '✓ focused' : '⚠️ broad'} | Metrics: ${hasMetrics ? '✓ defined' : '⚠️ undefined'}`,
      insights: [
        {
          title: '🔬 Test Scope',
          content: isFocused ? "Perfect - narrow enough to learn fast." : "Make it narrower - pick ONE thing to test.",
          icon: '🎯'
        },
        {
          title: '📊 Metrics',
          content: hasMetrics ? `You can track: ${metrics.slice(0, 2).join(', ')}` : "Define how you'll measure success.",
          icon: '✓'
        }
      ],
      nextSteps: ['Set your baseline', 'Run test for 7 days', 'Document 3 learnings', 'Plan next iteration']
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

// ===== APP LOGIC =====
let sessionData = null;

const tools = {
  brainstorm: [
    { title: 'Rapid Fire Ideas', prompt: 'Write 3-5 quick ideas WITHOUT overthinking:', input: 'ideas' },
    { title: 'What if Scenarios', prompt: 'Explore "what if" possibilities:', input: 'scenarios' }
  ],
  organize: [
    { title: 'Priority Matrix', prompt: 'What are your 3 most important next steps?', input: 'priorities' },
    { title: 'Timeline', prompt: 'When do you want to complete each? (Week 1, End of month, etc)', input: 'timeline' }
  ],
  inspire: [
    { title: 'Reference Hunt', prompt: 'What existing projects/trends inspire you?', input: 'references' },
    { title: 'Remix Ideas', prompt: 'How can you combine different ideas?', input: 'twists' }
  ],
  experiment: [
    { title: 'Quick Test', prompt: 'What is the fastest way to test your idea?', input: 'test' },
    { title: 'Success Metrics', prompt: 'How will you know if it works?', input: 'metrics' }
  ]
};

function startSession(mode) {
  document.getElementById('modeButtons').style.display = 'none';
  document.getElementById('session').classList.add('active');
  
  sessionData = { mode: mode, data: {} };
  const titles = {
    brainstorm: '💡 Brainstorm',
    organize: '📋 Organize',
    inspire: '🌟 Inspire',
    experiment: '🧪 Experiment'
  };
  
  document.getElementById('sessionTitle').innerHTML = titles[mode];
  const content = document.getElementById('sessionContent');
  content.innerHTML = '';
  
  tools[mode].forEach(tool => {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.innerHTML = `
      <h3>${tool.title}</h3>
      <p>${tool.prompt}</p>
      <div class="input-group">
        <textarea id="${tool.input}" placeholder="Write in detail..."></textarea>
      </div>
      <button class="btn-add" onclick="addItem('${tool.input}')">+ Add</button>
      <div class="items-list" id="${tool.input}-list"></div>
    `;
    content.appendChild(card);
  });
}

function addItem(fieldId) {
  const input = document.getElementById(fieldId);
  const value = input.value.trim();
  if (!value) return;
  
  if (!sessionData.data[fieldId]) sessionData.data[fieldId] = [];
  sessionData.data[fieldId].push(value);
  renderList(fieldId);
  input.value = '';
}

function renderList(fieldId) {
  const list = document.getElementById(fieldId + '-list');
  list.innerHTML = sessionData.data[fieldId].map((item, i) => 
    `<div class="item"><span>${item}</span><button onclick="removeItem('${fieldId}',${i})" class="item-remove">✕</button></div>`
  ).join('');
}

function removeItem(fieldId, idx) {
  sessionData.data[fieldId].splice(idx, 1);
  renderList(fieldId);
}

function finalizeSession() {
  if (!sessionData) return;
  const feedback = FeedbackEngine.generateFeedback(sessionData);
  DataStore.saveSession(sessionData);
  showFeedback(feedback);
}

function showFeedback(feedback) {
  document.getElementById('session').classList.remove('active');
  document.getElementById('feedbackView').classList.add('active');
  const content = document.getElementById('feedbackContent');
  
  let html = `<div class="feedback-card">
    <h3>${feedback.title}</h3>
    <p><strong>${feedback.summary}</strong></p>
    ${feedback.insights.map(i => `<div class="insight-box"><strong>${i.title}</strong><p>${i.content}</p></div>`).join('')}
    <div class="next-steps"><h4>Next Steps:</h4><ol>${feedback.nextSteps.map(s => `<li>${s}</li>`).join('')}</ol></div>
    <button onclick="downloadFeedback(${JSON.stringify(feedback).replace(/"/g, '&quot;')})" class="btn-primary" style="margin-top:15px; width:100%;">📥 Download Feedback</button>
  </div>`;
  
  content.innerHTML = html;
}

function downloadFeedback(feedback) {
  const json = JSON.stringify(feedback, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `feedback-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
}

function exitSession() {
  document.getElementById('session').classList.remove('active');
  document.getElementById('feedbackView').classList.remove('active');
  document.getElementById('modeButtons').style.display = 'grid';
  sessionData = null;
}

window.startSession = startSession;
window.addItem = addItem;
window.removeItem = removeItem;
window.finalizeSession = finalizeSession;
window.exitSession = exitSession;}
