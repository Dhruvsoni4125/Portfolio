// AI Agent Terminal Logic
const responses = {
  help: `Available commands:
  [/skills]      - List technical skills, tools & concepts
  [/experience]  - Show work experience & internships
  [/projects]    - Detail completed AI projects
  [/updates]     - Show recent updates to this portfolio
  [/contact]     - Display contact channels
  [/about]       - Provide education and objective summary
  [/joke]        - Tell an agent-themed developer joke
  [/clear]       - Clear the screen`,

  about: `[PROFILE: DHRUV SONI]
  ------------------------------------
  Role: Generative AI & Agentic AI Engineer
  Location: Delhi, India
  Education: Bachelor of Computer Applications (BCA)
  Institution: Manav Rachna International Institute (Faridabad)
  CGPA: 7.0 / 10
  
  Objective: Hands-on developer specializing in building Multi-Agent Systems,
  RAG applications, and LLM reasoning pipelines.`,

  skills: `[SKILL CLOUD SETTINGS]
  ------------------------------------
  * TECHNICAL SKILLS:       Python, DSA, OOPs, Machine Learning, NLP, Generative AI, Agentic AI
  * FRAMEWORKS & TOOLS:     LangChain, PyTorch, TensorFlow, Scikit-learn, Pandas, NumPy, Streamlit, RESTAPI, Git, GitHub
  * MODELS & PLATFORMS:     OpenAI, Llama 3/3.1, Gemini, Hugging Face, Ollama
  * DATABASES & VECTOR:     MySQL, ChromaDB, FAISS, Vector Databases
  * METHODOLOGIES:          Prompt Engineering, RAG, AI Agents, LLM
  * CLOUD & DEPLOYMENT:     Docker, REST APIs, Model Deployment, Streamlit Cloud`,

  experience: `[EXPERIENCE LOGS]
  ------------------------------------
  1. ARTIFICIAL INTELLIGENCE INTERN @ Codec Technologies (Sep-Nov 2025)
     - Built machine learning pipelines using Python, Pandas, and Scikit-learn.
     - Processed data in real-time and trained predictive models.
  
  2. MACHINE LEARNING INTERN @ KODACY (Jul-Aug 2025)
     - Cleaned data, performed feature engineering and hyperparameter tuning.
  
  3. ROBOTICS AI & IOT INTERN @ IIT Mandi (Jun-Jul 2025)
     - Programmed autonomous robot control systems with obstacle avoidance.
  
  4. ARTIFICIAL INTELLIGENCE INTERN @ GTI Textiles (May-Jun 2025)
     - Implemented anomaly detection and quality inspection algorithms using Python.`,

  projects: `[SELECTED PROJECTS]
  ------------------------------------
  * MULTI-AGENT RAG SYSTEM:
    - Multi-Agent document router, reasoning loops, and self-correction cycles.
    - Stack: Python, LangGraph, LangChain, Gemini, FAISS, Streamlit.
  
  * RAG-BASED BUG FIXER:
    - Analyzes runtime errors and queries vector-indexed code to write contextual fixes.
    - Stack: Python, LangChain, Gemini, FAISS, Streamlit.
  
  * COLD EMAIL GENERATOR:
    - Scrapes jobs, semantic-matches resume, generates customized pitch emails.
    - Stack: Python, LangChain, Groq, ChromaDB, Streamlit.

  * AGENTIC AI JOB APPLICATION BOT:
    - Automates ATS resume generation and job applications.
    - Stack: Python, Playwright, LangGraph, Llama 3.1, ATS Automation.`,

  updates: `[RECENT PORTFOLIO UPDATES]
  ------------------------------------
  * SYSTEM LOG: Skills Database expanded to 6 comprehensive categories matching core resume capabilities.
  * SYSTEM LOG: Deployed new native Resume viewing and download section.
  * SYSTEM LOG: Added 'Agentic AI Job Application Bot' to the Projects catalog.
  * STATUS: All systems optimal and matching current candidate specifications.`,

  contact: `[COMMUNICATION FREQUENCIES]
  ------------------------------------
  - Email:    dhruvsoni4125@gmail.com
  - Phone:    +91 9625138140
  - Location: Delhi, India
  - GitHub:   https://github.com/dhruvsoni4125
  - LinkedIn: https://www.linkedin.com (Placeholder)`,

  joke: `[JOKE MODULE INIT]
  ------------------------------------
  * Q: Why did the AI Agent cross the road?
  * A: To optimize the cost function of getting to the other side!
  ------------------------------------
  * Q: Why do AI developers prefer dark mode?
  * A: Because light attracts bugs, and shadows hide the hallucinations!`
};

let isTyping = false;

document.addEventListener('DOMContentLoaded', () => {
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  const sendBtn = document.getElementById('terminal-send-btn');
  const quickCmdBtns = document.querySelectorAll('.quick-cmd-btn');

  if (!terminalBody || !terminalInput) return;

  // Add click handlers for quick commands
  quickCmdBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isTyping) return;
      const cmd = btn.getAttribute('data-cmd');
      terminalInput.value = cmd;
      handleSubmit();
    });
  });

  // Handle enter key press
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  });

  // Handle send button click
  sendBtn.addEventListener('click', handleSubmit);

  function handleSubmit() {
    if (isTyping) return;
    const rawInput = terminalInput.value.trim();
    if (!rawInput) return;

    terminalInput.value = '';
    
    // Add user line
    appendLine(rawInput, 'user-msg');
    
    // Process input
    setTimeout(() => {
      processCommand(rawInput.toLowerCase());
    }, 400);
  }

  function appendLine(text, className) {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.innerText = text;
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
    return line;
  }

  function processCommand(input) {
    // Clear screen command
    if (input === '/clear' || input === 'clear') {
      terminalBody.innerHTML = '';
      appendLine('[SYSTEM] Terminal cleared. Ask me a question or type /help.', 'system-msg');
      return;
    }

    let responseText = '';

    // Direct command match
    if (input === '/help' || input === 'help') {
      responseText = responses.help;
    } else if (input === '/skills' || input === 'skills') {
      responseText = responses.skills;
    } else if (input === '/experience' || input === 'experience' || input === 'jobs' || input === 'intern') {
      responseText = responses.experience;
    } else if (input === '/projects' || input === 'projects' || input === 'work') {
      responseText = responses.projects;
    } else if (input === '/updates' || input === 'updates' || input === 'recent') {
      responseText = responses.updates;
    } else if (input === '/contact' || input === 'contact' || input === 'email') {
      responseText = responses.contact;
    } else if (input === '/about' || input === 'about' || input === 'dhruv') {
      responseText = responses.about;
    } else if (input === '/joke' || input === 'joke') {
      responseText = responses.joke;
    } else {
      // Natural language processing fallback keywords
      if (input.includes('skill') || input.includes('techno') || input.includes('lang') || input.includes('python')) {
        responseText = responses.skills;
      } else if (input.includes('job') || input.includes('intern') || input.includes('work') || input.includes('experience')) {
        responseText = responses.experience;
      } else if (input.includes('project') || input.includes('code') || input.includes('system')) {
        responseText = responses.projects;
      } else if (input.includes('update') || input.includes('recent') || input.includes('new') || input.includes('change')) {
        responseText = responses.updates;
      } else if (input.includes('contact') || input.includes('email') || input.includes('phone') || input.includes('call')) {
        responseText = responses.contact;
      } else if (input.includes('who') || input.includes('about') || input.includes('education') || input.includes('school') || input.includes('college')) {
        responseText = responses.about;
      } else if (input.includes('hello') || input.includes('hi ') || input.includes('hey') || input.includes('greetings')) {
        responseText = "Hello, user! I am Dhruv's AI Assistant. Type /help to see how I can help you navigate this portfolio.";
      } else {
        responseText = `Command "${input}" not recognized. 
  
  [PROMPT ERROR] No relevant vector node matches found.
  Type /help to list available system frequencies.`;
      }
    }

    typeWriterOutput(responseText);
  }

  function typeWriterOutput(text) {
    isTyping = true;
    
    // Create lines to stream
    const agentLine = document.createElement('div');
    agentLine.className = 'terminal-line agent-msg';
    terminalBody.appendChild(agentLine);
    
    const lines = text.split('\n');
    let lineIndex = 0;
    let charIndex = 0;

    function typeChar() {
      if (lineIndex < lines.length) {
        const currentLine = lines[lineIndex];
        
        // If it's a new line, create a line element container inside agent-msg
        if (charIndex === 0) {
          const lineDiv = document.createElement('div');
          lineDiv.className = 'agent-sub-line';
          agentLine.appendChild(lineDiv);
        }
        
        const currentLineDiv = agentLine.lastChild;
        
        if (charIndex < currentLine.length) {
          // Add char
          currentLineDiv.textContent += currentLine[charIndex];
          charIndex++;
          terminalBody.scrollTop = terminalBody.scrollHeight;
          setTimeout(typeChar, 5); // very fast typing
        } else {
          // Line finished, go to next line
          lineIndex++;
          charIndex = 0;
          setTimeout(typeChar, 15); // pause briefly between lines
        }
      } else {
        isTyping = false;
      }
    }

    typeChar();
  }
});
