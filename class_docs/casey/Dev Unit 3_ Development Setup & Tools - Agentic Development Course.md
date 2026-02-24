Dev Unit 3: Development Setup &
Tools
Setting up your AI-powered workspace
Agentic Development Course
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 1/67
What We'll Cover Today
1
Claude Code vs Cursor
Choosing your AI platform
2
GitHub Setup
Repository essentials
3
The Two-Folder Pattern
aiDocs/ (tracked) vs ai/ (gitignored)
4
MCP Overview
Extending AI capabilities
5
Cross-Platform & Retrofitting
Real-world considerations
6
Collaborative Prompting, Bias Toward Truth & The Frenemy
Working WITH AI
7
Setup Verification
Hands-on practice (15 min)
Note: This isn't the only way to achieve agentic development - but it's an evolved workflow I've had high
personal success with.
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 2/67
Forklifts
"Everyone's going to become a forklift
driver. No one's going to be carrying
boxes anymore."
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 3/67
Part 1
Claude Code vs Cursor
Choosing your AI development platform
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 4/67
Two Paths to AI Development
Many tools exist: Cursor, Claude Code, GitHub Copilot,
Codex, Augment, Cody, Windsurf...
Why we focus on Cursor and Claude Code:
State-of-the-art for agentic development
Support the workflows we'll teach (instruction files,
sub-agents, MCP)
Concepts transfer to other tools as they mature
Tool Best For
Claude
Code
Terminal-first developers, script
automation, MCP power users
Cursor
IDE-first developers, visual editing,
integrated workflow
Bottom line: Both can reach the same capability level
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 5/67
Claude Code vs Cursor: Feature Comparison
Feature Claude Code Cursor
Auto-read
file
claude.md .cursorrules
MCP
support
Native,
extensive
Limited/developing
Environment
Terminalbased
IDE (VS Code fork)
Multi-model
Claude
only
Claude, GPT,
others
Code
context
Manual file
reading
Automatic file
awareness
CLI scripts Excellent Good
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 6/67
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 7/67
Reaching Equivalent Setup
In Claude Code:
In Cursor:
# claude.md
Read aiDocs/context.md for project
context.
Follow coding style in aiDocs/codingstyle.md
Ask for opinion before complex work.
# .cursorrules
Read aiDocs/context.md for project
context.
Follow coding style in aiDocs/codingstyle.md
Ask for opinion before complex work.
Same core instructions — MCP tools are configured
separately and available automatically.
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 8/67
In Practice
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 9/67
Part 2
GitHub Setup
Repository essentials
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 10/67
Creating a Repository
# Create new repo on GitHub (via web or CLI)
gh repo create meme-generator -public
# Or initialize locally
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https: /github.com/you/repo
git push -u origin main
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 11/67
Essential .gitignore
Critical patterns for AI development:
# AI working space (local process artifacts)
ai/
# Tool-specific config (personal workflow)
claude.md
.cursorrules
# Test environment (may contain secrets)
.testEnvVars
# Dependencies
node_modules/
venv/
_pycache _/
# Environment
.env
.env.local
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 12/67
What IS and ISN'T Tracked
Tracked (committed) Gitignored (local only)
aiDocs/ - permanent
project knowledge
ai/ - temporary working
space
Source code
claude.md /
.cursorrules - personal
tool config
.gitignore .testEnvVars - secrets
aiDocs/ is shared. ai/ is personal.
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 13/67
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 14/67
Branching Basics
start branch merge continue
feature branch
main
# Create feature branch
git checkout -b feature/add-caption-generator
# Make changes, commit
git add .
git commit -m "Add caption generation script"
# Push to remote
git push -u origin feature/add-caption-generator
# Create PR (via GitHub or gh CLI)
gh pr create
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 15/67
When to Commit
Good commit triggers:
Feature complete and tested
Before trying something risky ("checkpoint")
Before switching contexts
End of work session
AI can help:
"Review my changes and suggest a commit
message"
"What should be in this commit vs the next one?"
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 16/67
In Practice
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 17/67
Part 3
The Two-Folder Pattern
aiDocs/ vs ai/
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 18/67
aiDocs/ vs ai/
Folder Tracked? Purpose Contents
aiDocs/ Yes
Permanent
project
knowledge
context.md,
PRD, MVP,
architecture,
coding style,
changelog
ai/ No
Temporary
working
space
Roadmaps,
plans,
research,
brainstorming
Rule of thumb: Would a new engineer need this to
understand the project? → aiDocs/ . Is it a process
artifact? → ai/ .
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 19/67
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 20/67
Project Structure
project-root/
├── aiDocs/ # ← TRACKED in git
│ ├── context.md # THE most important file
│ ├── prd.md # Product requirements
(immutable)
│ ├── mvp.md # MVP definition
│ ├── architecture.md # System architecture
│ ├── coding-style.md # Code style guide
│ └── changelog.md # Concise change history
├── ai/ # ← GITIGNORED
│ ├── guides/ # Library docs, research
output
│ ├── roadmaps/ # Task checklists, plans
│ └── notes/ # Brainstorming
├── claude.md # ← GITIGNORED (personal
config)
├── .cursorrules # ← GITIGNORED (personal
config)
└── scripts/ # CLI scripts
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 21/67
Why claude.md is Gitignored
It's personal tool config, not project knowledge:
Different team members may use different tools
Different MCP setups per person
Just a local pointer: "read aiDocs/context.md "
Project knowledge belongs in aiDocs/
Exception: If entire team uses same tool, you could
track it
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 22/67
The Most Important File: context.md
# Project Context
# Critical Files to Review
- PRD: aiDocs/prd.md
- Architecture: aiDocs/architecture.md
- Style Guide: aiDocs/coding-style.md
# Tech Stack
- Frontend: React, TypeScript
- Backend: Node.js, Express
- Image Analysis: OpenAI GPT-5 Vision
# Important Notes
- All scripts return JSON to stdout
- Use structured logging to files
- Never commit .testEnvVars
# Current Focus
Building caption generation CLI script
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 23/67
The Concise Changelog
Purpose: Quick historical context without parsing git
log
# Changelog
# 2026-02-01
- Added caption generation CLI (JPG/PNG input, JSON
output)
- Switched from OpenAI to Anthropic Vision API for cost
# 2026-01-28
- Initial project setup: React frontend, Express
backend
- Created PRD and MVP definition
Rules: What changed and why (not how). 1-2 lines
each. AI tends verbose - trim it.
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 24/67
Key Principles for context.md
Keep it concise - bullet points, not essays
List references with 1-2 sentence descriptions -
like a bookshelf with labeled spines
Update regularly - especially "Current Focus"
AI reads files on demand - picks only what's
relevant to the task
The Bookshelf Analogy:
You don't read every book on a shelf - you scan titles
and pick the relevant ones. AI does the same with
context.md: scans descriptions, reads only what's
needed.
Why? Prevents "context pollution" - too much
unneeded data for any given task.
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 25/67
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 26/67
The claude.md / .cursorrules File
Auto-read on every prompt (local, gitignored)
# Project Instructions
# Context
Read the context file: aiDocs/context.md
# Required Tools
- Web Research: Use Firecrawl MCP
- Library Docs: Use Context7 MCP
# Behavioral Guidelines
- Ask for opinion before complex work
- Don't make changes during review phase
- Avoid over-engineering
- Match style in aiDocs/coding-style.md
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 27/67
Plans vs Roadmaps (Brief Recap)
Plan Roadmap
The WHAT and HOW The checklist
Detailed approach Task list by phases
Technical decisions Progress tracking
Both go in ai/roadmaps/ (gitignored) - process
artifacts, not permanent docs
Why Both?
Without roadmap, AI misses tasks
Plan provides depth; roadmap ensures
completeness
Create plan first, then roadmap from the plan
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 28/67
Creating Plans & Roadmaps
Example prompt:
"Create a plan doc and then a concise roadmap doc
in ai/roadmaps for what we just discussed.
Prefix the filenames with the current date.
Make sure they reference each other.
Include a note in each file to avoid over-engineering,
cruft, and legacy-compatibility features or comments
in this clean-code project."
Add this if you're using sub-agents:
"Deploy a sub-agent to thoroughly examine the plans
and the files they would change to verify that we're
not missing anything and that the plans are in
alignment with the codebase."
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 29/67
In Practice
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 30/67
Part 4
MCP Overview
Model Context Protocol - Extending AI capabilities
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 31/67
What is MCP?
Model Context Protocol
Standard for extending AI capabilities beyond text
Gives AI access to tools (like browser extensions for
AI)
Tools run locally, results fed back to AI
Developed by Anthropic, open standard
Simple mental model: AI can REQUEST actions → Tools EXECUTE →
AI sees results
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 32/67
MCP Architecture (High Level)
┌─────────────────┐
│ Your Prompt │
└────────┬────────┘
▼
┌─────────────────┐
│ AI (Claude) │ → "I need React docs..."
└────────┬────────┘
▼
┌─────────────────┐
│ MCP Router │
└────────┬────────┘
┌────┴────┬────────────┐
▼ ▼ ▼
┌───────┐ ┌────────┐ ┌───────────┐
│Context│ │Perplex │ │Playwright │
│ 7 │ │ ity │ │ │
└───────┘ └────────┘ └───────────┘
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 33/67
Context7: Library Documentation
What it does:
Searches and retrieves latest library docs
More current than AI training data
Stores docs locally for future reference
When to use:
Learning a new library
Checking current API syntax
Finding library-specific best practices
Alternative tools: Official docs (manual), library
websites, Stack Overflow (less reliable)
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 34/67
Context7: Example
Use Context7 to research the best React
state management libraries for our use case.
Pull the documentation for the top recommendation
and store it in ai/guides/ with suffix _context7.md
AI will:
1. Search Context7 for React state management
options
2. Retrieve documentation for the best fit
3. Save to ai/guides/zustand_context7.md (for
example)
4. Use that documentation to answer your question
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 35/67
Perplexity: Deep Research (Optional)
What it does:
Web-connected search with citations
Synthesizes multiple sources
Great for best practices and "how people solve X"
Cost note: Perplexity MCP requires a paid API. For
most research, it's cheaper to search yourself and
paste results into Claude.
When to use: General research (not specific library
docs), best practices,
"How do people typically handle
OAuth2 in React?"
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 36/67
Web Scraper MCPs: Firecrawl & Bright Data
What they do:
Search the web and fetch pages
Parse web pages into markdown AI can read
Free tiers available - good for students
Our recommendation: Use Firecrawl as your primary web research
tool. It can search and scrape, then Claude synthesizes the results.
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 37/67
MCP Tool Comparison
Tool Type Best For Cost
Context7
Library
docs
Specific
package API
docs
Free
Firecrawl Web
research
Search +
scrape, Claude
synthesizes
Free
tier
Bright
Data
Web
research
Similar to
Firecrawl
Free
tier
Perplexity
Deep
research
Presynthesized
answers
(optional)
Paid
All store results in ai/guides/ (gitignored working
reference)
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 38/67
How to Add an MCP Server
Config location: ~/.config/claude/mcp.json (Claude
Code)
{
"mcpServers": {
"context7": {
"command": "npx",
"args": ["-y",
"@context7/mcp"]
},
"perplexity": {
"command": "npx",
"args": ["-y",
"@perplexity/mcp"],
"env": {
"PERPLEXITY_API_KEY": "your-key-here"
}
}
}
}
For Cursor: Check Cursor documentation for MCP
configuration
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 39/67
...Or Ask the AI to Add It
Example prompt:
"Please add the MCP server for 'chrome-devtools'
following the guide under
ai/guides/external/chromeDevToolsMcp_perplexity.md"
The AI will read the guide and update your MCP config
for you.
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 40/67
Part 5
Cross-Platform & Retrofitting
Real-world considerations
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 41/67
Windows vs Mac/Linux Gotchas
Issue Mac/Linux Windows
Shell scripts
./script.sh
works
May need WSL
or Git Bash
Path
separators
/
\ (but / often
works)
Line endings LF
CRLF
(configure git)
Environment
vars
export
VAR=value
set VAR=value
or PowerShell
Shebangs
!/bin/bash
works
Ignored (use
explicit bash )
Best practice: Use Node.js scripts when possible
(cross-platform)
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 42/67
Retrofitting AI into Existing Projects
You inherit a codebase. Now what?
1. Add aiDocs/ folder - Start with context.md
2. Add ai/ folder - Even if empty at first
3. Create context.md - Document what you discover
4. Add .gitignore - Protect ai/, claude.md, .cursorrules,
.testEnvVars
5. Ask AI to analyze - "Review this codebase and
create a context.md"
AI can help reverse-engineer: Architecture patterns,
tech stack details, testing approaches
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 43/67
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 44/67
Mermaid Diagrams for Codebase
Understanding
Ask AI to generate diagrams and store in
aiDocs/diagrams/ :
Diagram Type What It Shows
Class Diagram
Classes, inheritance,
relationships
Sequence
Diagram
Process flow between
components
ER Diagram
Database tables and
relationships
Flowchart Logic and decision paths
"Analyze this codebase and create Mermaid diagrams
for the class structure and main request flow.
Save them in aiDocs/diagrams/"
Benefits: You can visually review to understand the
codebase - and AI benefits too when diagrams are
referenced in context.md.
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 45/67
Part 6
Collaborative Prompting & Bias Toward
Truth
Working WITH AI effectively
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 46/67
Collaborative Prompting: Tentative Approach
Don't do this:
Do this instead:
"Add JWT authentication to the
API"
"We need to add authentication.
I'm thinking JWT tokens but I'm not
sure
if that's the best approach here.
What do you think?"
Why this works:
Invites AI to provide expert opinion
AI can identify better approaches you hadn't
considered
Reduces risk of implementing wrong solution
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 47/67
Pattern: Context-First
Context
Understanding
Planning Opinion
Implementation
1 2 3 4 5
Review the context file.
Then review how [feature] currently works.
Understand it thoroughly.
Now here's what we need to change:
[requirements]
What's your opinion on the best approach?
Don't make any code changes yet.
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 48/67
Positivity Matters
Don't:
Do:
"This code is terrible. Fix it."
"This code has some issues we need to address.
Can you help identify what needs improvement?"
Why:
Research shows negativity causes erratic AI
behavior
Positivity produces more neutral, focused results
Clear and positive = best combination
You don't need to flatter AI, just stay positive,
unaccusing, and clear (same as with people!)
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 49/67
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 50/67
Bias Toward Truth
Prompting Strategies That Bias Toward Truth
Truthful
Output
Chain-of-Thought
"Show your reasoning steps"
Structured Output
JSON/schemas reduce creativity
Explicit Uncertainty
"Say 'I don't know' vs guess"
Context Clarification
Give AI what it needs to know
Multi-Step Verification
Generate → Verify → Refine
hallucination
✕
hallucination ✕
hallucination
✕
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 51/67
Hallucinations Happen
Why AI generates plausible but wrong answers:
LLMs predict "likely next tokens" - plausible does
not equal true
Gaps in training data get filled with confident
guesses
No built-in fact-checking mechanism
Your job: Create prompting habits that bias AI toward
truth
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 52/67
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 53/67
5 Strategies You Can Use Today
Strategy How
Generate Verify Refine Present
gaps found?
AI creates sub-agent checks address feedback deliver result
Chain-of-Thought
"Show your reasoning step
by step"
Structured Output
Request JSON - reduces
creative drift
Explicit
Uncertainty
"Say 'I don't know' rather
than guessing"
Context
Clarification
Give AI the files and facts it
needs
Multi-Step
Verification
Generate → Verify → Refine
→ Present
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 54/67
Bias Toward Truth: In Practice
Before implementing, please:
1. Show your reasoning step by step
2. Flag anything you're uncertain about
3. If you don't know something, say so
rather than guessing
4. Before you answer, verify against
the project context
Add this pattern to your claude.md or .cursorrules
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 55/67
The Frenemy Prompt: Adversarial Review
You've learned to collaborate. Now learn to stresstest.
Collaborative prompting builds things up. The Frenemy
tears them down — on purpose.
Regarding the following prompt, respond with direct,
critical analysis. Prioritize clarity over kindness.
Do not compliment me or soften the tone of your answer.
Identify my logical blind spots and point out the flaws
in my assumptions. Fact-check my claims. Refute my
conclusions where you can. Assume I'm wrong and make
me prove otherwise.
Paste this before your PRD, plan, architecture doc, or
any decision you want to pressure-test.
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 56/67
The Two-Step Frenemy Workflow
Step 1: Frenemy Session (adversarial)
Step 2: Fresh Collaborative Session
(synthesis)
[Frenemy prompt]
Here is my PRD for the meme generator
project:
[paste PRD]
AI will ruthlessly identify cracks,
contradictions, missing pieces, and
weak assumptions.
I ran an adversarial review of my PRD.
Here are the criticisms it raised:
[paste frenemy output]
Review these against my actual PRD.
Which are truly valid and actionable?
Which are noise? What should I change?
Collaboration decides which criticisms
actually matter.
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 57/67
The combination is powerful: Frenemy finds the cracks.
Collaboration decides which ones matter.
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 58/67
When to Use the Frenemy
Use Case What You're Stress-Testing
PRDs & Plans
Missing requirements, scope
gaps, contradictions
Architecture
Scalability issues, wrong tool
choices, over-engineering
Code
Reviews
Edge cases, security holes,
maintainability concerns
Assumptions
“Is this actually true, or do I just
believe it?”
When NOT to use it:
During initial brainstorming (too early — kills ideas
before they form)
When you need encouragement to keep going (use
collaborative mode)
On trivial decisions (overkill)
Rule of thumb: Build collaboratively first. Frenemy it before you
commit.
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 59/67
Part 7
Setup Verification
Hands-on practice (15 min)
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 60/67
Your Turn.
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 61/67
Hands-On Activity (15 min)
Goal: Verify your AI development environment is ready
1. Create a GitHub repository for your project
2. Add .gitignore with ai/, claude.md, .cursorrules, .testEnvVars
3. Create aiDocs/ with context.md (reference PRD, list tech stack)
4. Create ai/ folder structure (guides/, roadmaps/, notes/)
5. Create claude.md or .cursorrules pointing to aiDocs/context.md
6. Ask AI to read context.md and summarize your project
7. Verify AI can see your project context
Success criteria: AI can describe your project from
aiDocs/context.md
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 62/67
Key Takeaways
1
Claude Code vs Cursor
Both excellent, choose based on workflow preference
2
Two-folder pattern
aiDocs/ (tracked) vs ai/ (gitignored)
3
context.md is your AI brain
Lives in aiDocs/, shared with team
4
claude.md is personal config
Gitignored, points to aiDocs/context.md
5
MCP extends AI
Context7 for docs, Firecrawl for web research
6
Bias toward truth
Prompt habits that reduce hallucinations
7
Collaborate, don't command
"What do you think?" gets better results
8
Frenemy for stress-testing
Adversarial review before you commit to a plan
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 63/67
Quick Reference
PROJECT STRUCTURE
aiDocs/ ← TRACKED (permanent knowledge)
├── context.md ← Main AI context
├── prd.md ← Product requirements
├── coding-style.md ← Code style guide
└── changelog.md ← Concise change history
ai/ ← GITIGNORED (working space)
├── guides/ ← Library docs, research
├── roadmaps/ ← Plans, task checklists
└── notes/ ← Brainstorming
claude.md ← GITIGNORED (personal config)
MCP TOOLS
Context7 → Library docs → ai/guides/
Firecrawl → Web research → ai/guides/
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 64/67
Before Next Time
Do this individually (even if you're in a project group -
everyone needs the practice):
1. Complete workspace setup - repo, aiDocs/, ai/, .gitignore, claude.md
2. Have AI generate your planning docs (then review & refine
collaboratively):
- aiDocs/prd.md - product requirements
- aiDocs/mvp.md - MVP scope definition
- aiDocs/architecture.md - system design
- aiDocs/coding-style.md - code style guide
3. Create context.md - reference all docs with 1-2 sentence
descriptions
4. Plan implementation phases with AI:
"Review my PRD and MVP. Break down the MVP into logical phases.
How many phases? Should each have its own plan/roadmap, or group
some together?"
For groups: Later, use AI to compare/contrast and
merge your individual ideas together.
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 65/67
Resources
💻 Claude Code docs.anthropic.com/claude-code
🖥 Cursor cursor.sh
🔌 MCP Protocol modelcontextprotocol.io
📚 Context7 context7.io
🛠 GitHub CLI cli.github.com
📈 Mermaid Diagrams mermaid.js.org
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 66/67
See you next time!
Next: Implementation & Iteration
Agentic Development Course
Speaker notes
2/23/26, 10:35 PM Dev Unit 3: Development Setup & Tools - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic3WebSlides/ 67/67