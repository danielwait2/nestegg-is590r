Generative AI Fundamentals
& How Agents Work
Understanding the technology before using it
Agentic Development Course
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 1/52
What We'll Cover Today
1
What is Generative AI?
GPT, tokens, training
2
Fun Exercises
Creative generation
3
From Autocomplete to Agents
ReAct framework
4
Lab
Hands-on experimentation
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 2/52
Part 1
What is Generative AI?
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 3/52
Understanding AI Training
Two short videos explaining how AI learns:
🎬
Part 1: ML Basics (genetic breeding)
youtube.com/watch?v=R9OHn5ZF4Uo
🎬
Part 2: Recursive Neural Networks
youtube.com/watch?v=wvWpdrfoEv0
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 4/52
A Brief History of Generative AI
Year Milestone
1957
Perceptron - First trainable neural
network
1961
ELIZA - First chatbot (early
generative AI)
1979
Neocognitron - First deep learning
neural network
1989
Backpropagation - Deep learning
becomes practical
1997
LSTM - Long short-term memory for
speech recognition
Source: dataversity.net/articles/a-brief-history-ofgenerative-ai
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 5/52
The Modern Era of Generative AI
Year Breakthrough
2014
GANs - Generate realistic images,
video, audio
2017
Transformers - "Attention Is All You
Need" paper
2022 ChatGPT - LLMs go mainstream
2023+
Agentic AI - Systems that plan and
take actions
💡 Most of what we call "AI" today happened in the last 10 years
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 6/52
GPT = ?
G
Generative
Creates new content
P
Pre-trained
Learned from massive data before you use it
T
Transformer
The architecture that made this possible (2017)
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 7/52
The Core Insight
"World's Best Autocomplete"
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 8/52
The Core Insight
"World's Best Autocomplete"
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 9/52
The Core Insight
"World's Best Autocomplete"
At its heart: predicting "what word comes next"
Trained on billions of text examples
Does prediction SO well it appears intelligent
Not "thinking" — pattern matching at
unprecedented scale
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 10/52
How Generative AI Works (Interactive)
🔗
ig.ft.com/generative-ai
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 11/52
How Training Works
1
Feed billions of text examples
Books, websites, code, conversations
2
Learn to predict next token
Given previous tokens
3
Scale up
More data + more parameters = emergent capabilities
4
Fine-tune for conversation
RLHF (Reinforcement Learning from Human Feedback)
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 12/52
Key Concept: Tokens
Tokens ≠ Words
Tokens are subword pieces (~4 characters average)
Text Tokens
"hello" 1 token
"uncomfortable"
["un"
,
"comfort"
,
"able"] = 3
tokens
Code
Often more tokens per line than
English
Why it matters: You pay per token, limits are in
tokens
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 13/52
Key Concept: Context Window
The model's "working memory"
System prompt Conversation history Your current message
Documents/code
Claude
~200K tokens
GPT-4
~128K tokens
Gemini 1.5
~1M tokens
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 14/52
Key Concept: Temperature
🔧 Lower for code/facts
🎨 Higher for creative writing
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 15/52
Key Concept: Hallucinations
Why AI makes things up
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 16/52
Key Concept: Hallucinations
Model generates plausible next tokens
Plausible ≠ True
Confident prediction ≠ Factual information
⚠️ Always verify important outputs
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 17/52
The Jagged Frontier of AI
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 18/52
The Jagged Frontier - Key Insights
🏆
Superhuman at unexpected tasks
Medical diagnosis, complex math, sophisticated code
🤔
Struggles with "simple" tasks
Visual puzzles, counting, physical reasoning
🎯
Jaggedness doesn't match intuition
Passes bar exam, fails at basic visual tasks
🤝
Creates collaboration opportunities
Humans fill AI gaps, AI amplifies human strengths
Source: Ethan Mollick,
"The Shape of AI"
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 19/52
The Equation of Agentic Work
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 20/52
The Equation - Key Factors
1
Human Baseline Time
How long would this take YOU to do?
2
Probability of Success
How likely is AI to succeed? (Remember the jagged frontier)
3
AI Process Time
Agents run in background while you work on other things
💡 Management skills become your superpower with AI
agents
Source: Ethan Mollick,
"Management as AI
Superpower"
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 21/52
Management as AI Superpower
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 22/52
Part 2
Fun Generative Exercises
These aren't just games — they reveal how the model
works
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 23/52
Exercise: The Dinosaur Rewrite 🦖
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 24/52
Exercise: The Dinosaur Rewrite 🦖
Take this news article: [paste any recent news]
Rewrite it so that a dinosaur is somehow
centrally involved in the incident.
Keep the same journalistic tone and structure.
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 25/52
Exercise: The Tone Dial ️
Original email:
"The project deadline was missed again. This is
unacceptable. We need to discuss this."
1. Furious
→
2. Frustrated
→
3. Neutral
→
4. Understanding
→
5. Gracious
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 26/52
Exercise: Format Juggling 🔄
Input:
"John Smith is a 34-year-old software engineer
from Seattle. He earns $150,000 at TechCorp..."
JSON YAML Bullet points SQL INSERT Haiku 🎋 Movie trailer 🎬
Same information, endless formats!
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 27/52
Exercise: The Accordion 🪗
Start with: "The server crashed."
↗️ Expand Incident report (1 paragraph)
↗️ Expand Post-mortem (3 paragraphs)
↘️ Compress Tweet (280 chars)
↘️ Compress Single emoji
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 28/52
Part 3
From Autocomplete to Agents
The conceptual leap that changes everything
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 29/52
The Limitation
LLMs can only produce text
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 30/52
The Limitation
✗ Can't browse the web
✗ Can't run code
✗ Can't read files
✗ Can't call APIs
"All talk, no action"
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 31/52
The Solution: Tools
Give the LLM ability to request actions
User "What's the weather in Seattle?"
↓
LLM thinks "I need weather data..."
↓
LLM outputs {"tool": "get_weather", "location": "Seattle"}
↓
System executes {"temp": 52, "condition": "rainy"}
↓
LLM responds "It's 52°F and rainy in Seattle."
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 32/52
The ReAct Framework
Reasoning + Acting
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 33/52
The ReAct Framework
Reasoning + Acting
🤔
THINK
Reason about task
→
⚡
ACT
Tool call
→
️
OBSERVE
See result
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 34/52
Why ReAct Works
1
Explicit reasoning
Prevents rushing to wrong actions
2
Observation step
Allows course correction
3
Loop continues
Until task is complete
4
More reliable
Than single-shot generation
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 35/52
Activity: Be the LLM
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 36/52
Activity: Be the LLM
🧠
1 student = The LLM Reads prompt, generates
response
🔧
1 student = Tool Executor Runs tools, returns
results
LLM outputs either:
TOOL: [name], INPUT: [value] or ANSWER:
[response]
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 37/52
Prompt → LLM (Round 1)
SYSTEM:
You are a helpful assistant. Follow this loop:
1. THINK out loud about what you need to do
2. ACT by calling a tool if needed
3. OBSERVE the result
4. REPEAT until you can answer
Tools: calculator(expression), web_search(query)
USER:
What is the square root of 65536?
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 38/52
LLM Response (Round 1)
[LLM reasoning]
TOOL: calculator
INPUT: sqrt(65536)
Tool Executor: run the calculation
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 39/52
Tool Result
256
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 40/52
Prompt → LLM (Round 2)
SYSTEM:
You are a helpful assistant. Follow this loop:
1. THINK out loud about what you need to do
2. ACT by calling a tool if needed
3. OBSERVE the result
4. REPEAT until you can answer
Tools: calculator(expression),
web_search(query)
USER:
What is the square root of 65536?
ASSISTANT:
[LLM's reasoning from Round 1]
TOOL: calculator
INPUT: sqrt(65536)
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 41/52
LLM Response (Round 2)
[LLM reasoning]
ANSWER: The square root of 65536 is 256.
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 42/52
What Makes an "Agent"
🧠
LLM
"the brain"
+
🔧
Tools
"the hands"
+
🔄
Reasoning Loop
"the process"
=
🤖
Autonomous Agent
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 43/52
Common Agent Tools
Tool Type Examples
📁 File system Read, write, search files
🌐 Web Fetch pages, search
⚙️ Code execution Run scripts, tests
🔌 APIs External services
🎭 Browser Playwright for web interaction
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 44/52
Why Agents Matter for Development
Before After
AI suggests code AI READS your code
You run tests AI RUNS your tests
You research libraries AI RESEARCHES for you
You fix issues AI FIXES and verifies
Transforms AI from "assistant" to "autonomous
developer"
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 45/52
Why Agents Matter for Development
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 46/52
Part 4
Lab Time
Put these concepts into practice
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 47/52
Lab Exercises
1
Token Exploration 5 min
Use a tokenizer to explore how text splits
platform.openai.com/tokenizer →
2
Creative Generation 10 min
Rewrite your project description in 3 styles
Or: Technical concept as children's story / rap /
news
3
Agent Thinking 5-10 min
Write out ReAct steps for researching a library
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 48/52
Key Takeaways
1
LLMs = sophisticated autocomplete
Predicting tokens, not "thinking"
2
Tokens ≠ words
Understanding tokens helps efficiency
3
Agents = LLM + tools + loop
What makes AI useful for dev
4
ReAct: Think → Act → Observe → Repeat
The foundational agent pattern
5
Always verify
Hallucinations happen
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 49/52
Before Next Time
☐ Read: "Management as AI Superpower" - oneusefulthing.org
☐ Think: What would you want an AI agent to research for your
project?
Next time: Ideation & Planning with AI — brainstorming, market
research, PRDs
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 50/52
Resources
🔤 OpenAI Tokenizer platform.openai.com/tokenizer
📚 Claude Documentation docs.anthropic.com
📄 ReAct Paper arxiv.org/abs/2210.03629
📖 Management as AI Superpower oneusefulthing.org
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 51/52
See you next time!
Next: Ideation & Planning with AI
Agentic Development Course
Speaker notes
2/23/26, 10:35 PM Generative AI Fundamentals - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic1WebSlides/ 52/52