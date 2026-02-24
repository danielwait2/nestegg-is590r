Dev Unit 3.5: Implementation Lab
From plans to working code
Agentic Development Course
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 1/34
What We'll Cover Today
1
Implementing Roadmaps with AI
Turning plans into code
2
Verifying Roadmap Implementation
Did AI build what we planned?
3
Creating CLI Testing Scripts
The full loop
4
Testing with CLI Tools
Run and validate
5
The Fix Loop
Autonomous bug fixing
Format: ~15 min instruction + handson lab time
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 2/34
What You Should Be Able to DO by End of
Today
1. Have AI implement at least one phase of your project from your
roadmaps
2. Verify that the implementation matches the roadmap requirements
3. Create CLI scripts that let AI test your application
4. Run and test your application using CLI tools
5. Fix bugs found during testing using the test-fix loop
If you accomplish all five, you're ahead
of most professional developers using
AI.
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 3/34
Part 1
Implementing Roadmaps with AI
Turning plans into code
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 4/34
Quick Recap: Where We Are
PRD --> Plans --> Roadmaps --> ???
(what) (how) (checklist) (CODE)
You have the planning docs. Now we turn them into
working software.
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 5/34
The Implementation Prompt Pattern
Review @context.md. Implement the roadmap
at ai/roadmaps/[your-roadmap].md.
That's it. context.md points to architecture, coding style, and
everything else AI needs.
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 6/34
What Happens Next
AI will:
Read the roadmap and understand the scope
Read architecture.md for system design
Read coding-style.md for conventions
Implement the code
May ask clarifying questions — answer them
What you do:
Watch the implementation unfold
Answer questions when asked
Don't micromanage — let it work
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 7/34
In Practice
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 8/34
Part 2
Verifying Roadmap Implementation
Did AI build what we planned?
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 9/34
Did AI Build What We Planned?
Verification implements the Law of Witnesses — a
second perspective to ensure truth and correctness.
After implementation, verify against the roadmap.
Review the roadmap at ai/roadmaps/[your-roadmap].md.
Check off what was completed from phase 1.
Flag anything that was missed or implemented
differently than planned.
Don't make any code changes — just report.
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 10/34
What Verification Looks Like
AI will:
Cross-reference roadmap tasks against actual code
Mark completed items
Flag anything missed or changed
Note any deviations from the plan
You review:
Are the deviations reasonable?
Was anything critical missed?
Does the code match your expectations?
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 11/34
Update Your Roadmap
After verification, update the roadmap:
Update the roadmap to reflect what was completed.
Add notes on any changes from the original plan.
Mark phase 1 as complete if everything checks out.
This keeps your roadmap a living document — not just a planning
artifact.
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 12/34
The Complete Recipe
The prompt sequence you'll use every time you
implement from a roadmap:
Step 1 — Review Context
Review @context.md and the roadmap at
ai/roadmaps/[your-roadmap].md.
Step 2 — Implement
Implement phase [N] of the roadmap.
Follow the architecture in aiDocs/architecture.md
and coding style in aiDocs/coding-style.md.
Check off tasks in the roadmap as you complete them.
Step 3 — Verify with a Sub-Agent
Deploy a sub-agent to verify all implementation from
phase [N].
Compare what was built against the roadmap
requirements.
Flag anything missed or implemented differently than
planned.
Don't make code changes — just report.
Step 4 — Archive When Complete
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 13/34
Once all phases are done and verified:
Move both the plan and roadmap to
ai/roadmaps/completed/
Review, implement, verify, repeat. Archive when done.
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 14/34
Part 3
Creating CLI Testing Scripts
The full loop
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 15/34
The Key Insight
"When AI can test itself, you have the
full loop."
AI implements --> AI tests --> AI reads output --> AI
fixes
^
|
└──────────────────────────────────────────────────┘
Without CLI scripts, YOU are the bottleneck.
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 16/34
The Prompt
Create CLI scripts in scripts/ that exercise
the features we just built.
Each script should:
- Accept inputs as command-line arguments
- Run the feature
- Output JSON results to stdout
- Use proper exit codes (0 = success, non-zero =
failure)
- Send errors to stderr
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 17/34
The scripts/ Folder Pattern
scripts/
├── build.sh # Compile/build the project
├── test.sh # Run all tests
├── run.sh # Run the application
└── dev.sh # Start dev server (optional)
Minimum viable set: build.sh and test.sh
AI can run your entire workflow from the command line
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 18/34
Example: test.sh
!/bin/bash
echo "Building project ."
./scripts/build.sh | { echo
'{"status":"fail","step":"build"}' >&2; exit 1; }
echo "Running tests ."
if npm test 2>&1; then
echo '{"status": "pass", "message": "All tests
passed"}'
exit 0
else
echo '{"status": "fail", "message": "Tests
failed"}' >&2
exit 1
fi
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 19/34
Cross-Platform Note
Shell scripts don't work on all machines.
For Windows/Mac compatibility, consider Node.js
scripts:
/ scripts/test.js
const { execSync } = require('child_process');
try {
execSync('npm test', { stdio: 'inherit' });
console.log(JSON.stringify({ status: 'pass' }));
process.exit(0);
} catch (err) {
console.error(JSON.stringify({ status: 'fail', error:
err.message }));
process.exit(1);
}
Run with: node scripts/test.js
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 20/34
In Practice
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 21/34
Part 4
Testing with CLI Tools
Run and validate
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 22/34
Run the Scripts
# Build first
./scripts/build.sh
# Then test
./scripts/test.sh
AI reads the output and knows:
Did it work? (exit code 0)
What failed? (JSON error output)
What to fix? (error details in stderr)
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 23/34
The Autonomous Loop
1. AI runs: ./scripts/test.sh
2. AI reads output
3. If exit code 0: Done! Tests pass.
4. If exit code = 0: AI reads error output
5. AI diagnoses the issue
6. AI fixes the code
7. Go to step 1
This can run without you touching anything.
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 24/34
What Success Looks Like
$ ./scripts/test.sh
{"status": "pass", "tests": 12, "failures": 0}
$ echo $?
0
Exit code 0 + JSON output = AI knows everything worked.
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 25/34
Part 5
The Fix Loop
Autonomous bug fixing
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 26/34
When Tests Fail
Run ./scripts/test.sh.
If any tests fail, analyze the output,
fix the issues, and run again.
Continue until all tests pass.
Then step back and let AI work.
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 27/34
When to Intervene
Let AI work. Step back. Only intervene if:
Same error repeating 3+ times
AI trying increasingly complex "solutions"
Fix is making things worse
AI is clearly confused about the root cause
Intervention prompt:
Stop. Let's step back.
What have we tried so far?
What's the actual root cause?
Is there a different approach entirely?
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 28/34
The Full Picture
PLAN --> IMPLEMENT --> TEST --> FIX
--> VERIFY
(roadmap) (AI codes) (CLI) (loop)
(check roadmap)
^ |
└────────────┘
You planned well. Now let AI execute.
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 29/34
Key Takeaways
1
Roadmaps become code
AI implements what you planned
2
Verify implementation against the roadmap
Trust but verify
3
CLI scripts are how AI tests itself
The full loop
4
The test-fix cycle can run autonomously
Step back and let it work
5
Your job: plan well, verify results, intervene when stuck
The human role in agentic development
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 30/34
Lab Time
Now it's your turn. Work through these steps on
YOUR project:
1. Have AI implement phase 1 from your roadmap
2. Verify the implementation against the roadmap
3. Create scripts/build.sh and scripts/test.sh
4. Run the test-fix loop until tests pass
5. Commit your working code and updated roadmap
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 31/34
Before Next Time
1. Implement at least one full phase of your project from your
roadmaps
2. Verify the implementation matches the roadmap
3. Create at least 2 CLI scripts (build.sh and test.sh minimum)
4. Run the test-fix loop until tests pass
5. Commit your working code and updated roadmaps
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 32/34
Resources
💻 Commander.js (CLI framework) github.com/tj/commander.js
🔌 Bash Exit Codes tldp.org/LDP/abs/html/exitcodes.html
🖥 Node.js child_process nodejs.org/api/child_process.html
📚 JSON Output Best Practices jsonapi.org
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 33/34
See you next time!
Next: Advanced Testing & Deployment
Agentic Development Course
Speaker notes
2/23/26, 10:34 PM Dev Unit 3.5: Implementation Lab - Agentic Development Course
https://d1dtpagvh0qhqn.cloudfront.net/agentic35WebSlides/ 34/34