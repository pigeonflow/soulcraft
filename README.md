# ✨ soulcraft

Your AI agent is generic because you never onboarded it.

```bash
npx soulcraft
```

12 questions. 2 minutes. Personalized agent.

## How it works

First question: **are you the human or the agent?**

### 🧑 Human path
Answer 12 questions about how you want your AI to behave. Soulcraft generates a ready-to-paste prompt with your answers — send it to your agent and it crafts personalized workspace files using the full context of your answers.

### 🤖 Agent path
Soulcraft outputs detailed instructions for the agent: all 12 questions, the file structure, and how to synthesize answers into cohesive personality files. The agent then quizzes you interactively in chat.

Both paths end with the AI generating these files:

| File | Purpose |
|------|---------|
| `SOUL.md` | Personality, tone, boundaries |
| `USER.md` | Your profile and preferences |
| `IDENTITY.md` | Agent name, vibe, emoji |

AGENTS.md is intentionally left untouched — it contains critical operational instructions.

## Why AI-generated, not templates?

The *combination* of your answers matters. "Blunt + very opinionated + colleague dynamic" produces a fundamentally different personality than "warm + minimal opinions + assistant dynamic." An AI synthesizing all 12 answers together writes better files than any template could.

## Options

```bash
npx soulcraft --dry-run          # preview without writing
npx soulcraft --output-dir ./out # write somewhere specific
```

## Works with

- [OpenClaw](https://github.com/openclaw/openclaw)
- Claude Desktop
- Cursor
- Any agent that reads markdown config

Output is plain `.md`. No lock-in.

## License

MIT
