#!/usr/bin/env node

import * as p from '@clack/prompts';
import pc from 'picocolors';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { questions } from './questions.js';
import { getSurpriseName } from './surprise.js';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const outputDirFlag = args.indexOf('--output-dir');
const outputDirArg = outputDirFlag !== -1 ? args[outputDirFlag + 1] : undefined;

function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}

function findWorkspaceDir(): string {
  if (outputDirArg) return resolve(outputDirArg);
  const openclawWorkspace = join(
    process.env.HOME || process.env.USERPROFILE || '~',
    '.openclaw',
    'workspace',
  );
  if (existsSync(openclawWorkspace)) return openclawWorkspace;
  return process.cwd();
}

function isCancel(value: unknown): value is symbol {
  return p.isCancel(value);
}

function formatAnswerSummary(answers: Record<string, string>): string {
  const labelMap: Record<string, string> = {
    name: 'Name',
    timezone: 'Timezone',
    personality: 'Personality',
    opinions: 'Opinions',
    uncertainty: 'Uncertainty handling',
    autonomy: 'Autonomy',
    dynamic: 'Dynamic',
    pushback: 'Pushback style',
    verbosity: 'Verbosity',
    priority: 'Priority',
    privacy: 'Privacy',
    'agent-name': 'Agent name',
    'agent-emoji': 'Agent emoji',
  };

  const lines: string[] = [];
  for (const [key, value] of Object.entries(answers)) {
    const label = labelMap[key] || key;
    lines.push(`- **${label}:** ${value}`);
  }
  return lines.join('\n');
}

function generateUserPrompt(answers: Record<string, string>): string {
  const summary = formatAnswerSummary(answers);

  return `Please update my workspace files (SOUL.md, USER.md, IDENTITY.md) based on these personality quiz answers. Do NOT modify AGENTS.md — it contains critical operational instructions that should stay intact.

${summary}

Use these answers to craft personalized files. The combination of answers matters — synthesize them into a cohesive personality, don't just template each answer individually. For existing files, keep any custom sections I've added and layer in the personality calibration.`;
}

function generateAgentPrompt(): string {
  const questionList = questions.map((q, i) => {
    let text = `${i + 1}. ${q.text}`;
    if (q.options) {
      const presets = q.options
        .filter(o => o.value !== '__custom__' && o.value !== '__name-emoji__' && o.value !== '__surprise__')
        .map((o, j) => `   ${String.fromCharCode(97 + j)}) ${o.label}${o.hint ? ` — ${o.hint}` : ''}`)
        .join('\n');
      if (presets) text += '\n' + presets;
      text += '\n   Or they can type their own answer.';
    }
    return text;
  }).join('\n\n');

  const files = ['SOUL.md', 'USER.md', 'IDENTITY.md'];

  return `Run a personality quiz with the user to craft their workspace files. Do NOT modify AGENTS.md — it contains critical operational instructions that should stay intact. Ask these 12 questions ONE AT A TIME conversationally (not robotic). Present preset options as a/b/c/d but always mention they can type a custom answer.

QUESTIONS:

${questionList}

AFTER COLLECTING ALL ANSWERS:

Check if these files exist: ${files.join(', ')}
- If they exist, ask: Fresh start (replace) or Enhance (keep custom sections, layer in personality)?
- If not, generate from scratch.

Use the COMBINATION of all answers to craft cohesive files. Don't just template each answer — synthesize them. "Blunt + very opinionated + colleague dynamic" should produce a fundamentally different SOUL.md than "warm + minimal opinions + assistant dynamic."

Generate these files (do NOT touch AGENTS.md):
- SOUL.md — personality, tone, boundaries, pushback style, vibe, continuity
- USER.md — name, timezone, communication preferences
- IDENTITY.md — agent name, creature type (from dynamic), vibe, emoji

Write all 4 files to the workspace when done.`;
}

async function collectAnswers(): Promise<Record<string, string>> {
  const answers: Record<string, string> = {};

  for (const q of questions) {
    if (q.id === 'timezone') {
      const detected = detectTimezone();
      const tz = await p.text({
        message: q.text,
        placeholder: detected,
        defaultValue: detected,
        validate: (v) => { if (!v.trim()) return 'Timezone is required'; },
      });
      if (isCancel(tz)) { p.cancel('Cancelled.'); process.exit(0); }
      answers[q.id] = tz as string;
      continue;
    }

    if (q.id === 'agent-identity') {
      const choice = await p.select({
        message: q.text,
        options: q.options!.map((o) => ({ value: o.value, label: o.label, hint: o.hint })),
      });
      if (isCancel(choice)) { p.cancel('Cancelled.'); process.exit(0); }

      if (choice === '__surprise__') {
        const surprise = getSurpriseName();
        answers['agent-name'] = surprise.name;
        answers['agent-emoji'] = surprise.emoji;
        p.note(`${surprise.emoji} ${surprise.name}`, '🎲 Your agent is...');
      } else {
        const agentName = await p.text({
          message: "What's your agent's name?",
          placeholder: 'e.g. Ziggy, Nova, Scout',
          validate: (v) => { if (!v.trim()) return 'Name is required'; },
        });
        if (isCancel(agentName)) { p.cancel('Cancelled.'); process.exit(0); }
        const agentEmoji = await p.text({
          message: 'Pick an emoji for your agent:',
          placeholder: 'e.g. 🦊, ⚡, 🌀',
          validate: (v) => { if (!v.trim()) return 'Emoji is required'; },
        });
        if (isCancel(agentEmoji)) { p.cancel('Cancelled.'); process.exit(0); }
        answers['agent-name'] = agentName as string;
        answers['agent-emoji'] = agentEmoji as string;
      }
      continue;
    }

    if (!q.options) {
      const value = await p.text({
        message: q.text,
        validate: q.required ? (v) => { if (!v.trim()) return 'This is required'; } : undefined,
      });
      if (isCancel(value)) { p.cancel('Cancelled.'); process.exit(0); }
      answers[q.id] = value as string;
      continue;
    }

    const selected = await p.select({
      message: q.text,
      options: q.options.map((o) => ({ value: o.value, label: o.label, hint: o.hint })),
    });
    if (isCancel(selected)) { p.cancel('Cancelled.'); process.exit(0); }

    if (selected === '__custom__') {
      const custom = await p.text({
        message: 'Describe in your own words:',
        validate: (v) => { if (!v.trim()) return 'Please type something'; },
      });
      if (isCancel(custom)) { p.cancel('Cancelled.'); process.exit(0); }
      answers[q.id] = custom as string;
    } else {
      // Resolve label for readable output
      const opt = q.options.find(o => o.value === selected);
      answers[q.id] = opt ? `${opt.label}${opt.hint ? ` — ${opt.hint}` : ''}` : selected as string;
    }
  }

  return answers;
}

async function main() {
  console.log('');
  console.log(pc.bold(pc.magenta('  ✨ soulcraft')) + pc.dim(' — craft your agent\'s soul'));
  console.log('');

  p.intro(pc.cyan('Personalize your AI agent in 2 minutes.'));

  // First question: who's running this?
  const runner = await p.select({
    message: "Who's running this?",
    options: [
      { value: 'user', label: '🧑 I am (the human)', hint: "I'll answer questions and get a prompt to send my agent" },
      { value: 'agent', label: '🤖 I\'m an AI agent', hint: "I'll get instructions to quiz my human interactively" },
    ],
  });
  if (isCancel(runner)) { p.cancel('Cancelled.'); process.exit(0); }

  // ── Agent path ──
  if (runner === 'agent') {
    const prompt = generateAgentPrompt();

    if (dryRun) {
      console.log('');
      console.log(pc.bold(pc.cyan('── Agent instructions ──')));
      console.log(prompt);
    } else {
      const workspaceDir = findWorkspaceDir();
      const outputPath = join(workspaceDir, 'soulcraft-agent-prompt.md');
      if (!existsSync(workspaceDir)) mkdirSync(workspaceDir, { recursive: true });
      writeFileSync(outputPath, prompt + '\n', 'utf-8');

      console.log('');
      console.log(pc.bold(pc.green('  Instructions generated!')));
      console.log('');
      console.log(pc.dim('  Send this to your agent:'));
      console.log('');
      console.log(`  ${pc.cyan(outputPath)}`);
      console.log('');
      console.log(pc.dim('  Or copy-paste the text below into your agent chat:'));
      console.log('');
      console.log(pc.dim('─'.repeat(60)));
      console.log(prompt);
      console.log(pc.dim('─'.repeat(60)));
    }

    p.outro(pc.green('✅ Done!') + pc.dim(' Your agent will handle the rest.'));
    return;
  }

  // ── User path ──
  const answers = await collectAnswers();

  const prompt = generateUserPrompt(answers);

  if (dryRun) {
    console.log('');
    console.log(pc.bold(pc.cyan('── Send this to your agent ──')));
    console.log(prompt);
  } else {
    const workspaceDir = findWorkspaceDir();
    const outputPath = join(workspaceDir, 'soulcraft-prompt.md');
    if (!existsSync(workspaceDir)) mkdirSync(workspaceDir, { recursive: true });
    writeFileSync(outputPath, prompt + '\n', 'utf-8');

    console.log('');
    console.log(pc.bold(pc.green('  Your prompt is ready!')));
    console.log('');
    console.log(pc.dim('  Send this to your agent to update your workspace files:'));
    console.log('');
    console.log(pc.dim('─'.repeat(60)));
    console.log(prompt);
    console.log(pc.dim('─'.repeat(60)));
    console.log('');
    console.log(pc.dim(`  Also saved to: ${outputPath}`));
  }

  p.outro(pc.green('✅ Done!') + pc.dim(' Copy the text above and send it to your agent.'));
}

main().catch((err) => {
  console.error(pc.red('Error:'), err);
  process.exit(1);
});
