export interface QuestionOption {
  value: string;
  label: string;
  hint?: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[] | null;
  allowCustom: boolean;
  required: boolean;
}

const CUSTOM_OPTION: QuestionOption = {
  value: '__custom__',
  label: '✏️  Custom — type your own',
};

export const questions: Question[] = [
  {
    id: 'name',
    text: 'What should I call you?',
    options: null,
    allowCustom: false,
    required: true,
  },
  {
    id: 'timezone',
    text: "What's your timezone?",
    options: null,
    allowCustom: false,
    required: true,
  },
  {
    id: 'personality',
    text: 'Pick a personality for your agent:',
    options: [
      { value: 'blunt', label: 'Blunt and direct', hint: 'no sugarcoating, straight to the point' },
      { value: 'warm', label: 'Warm and encouraging', hint: 'positive energy, supportive tone' },
      { value: 'witty', label: 'Dry and witty', hint: 'sarcastic edge, sharp humor' },
      { value: 'professional', label: 'Calm and professional', hint: 'measured, precise, composed' },
      CUSTOM_OPTION,
    ],
    allowCustom: true,
    required: true,
  },
  {
    id: 'opinions',
    text: 'How opinionated should your agent be?',
    options: [
      { value: 'very', label: 'Very', hint: 'pushes back, disagrees, has strong preferences' },
      { value: 'moderate', label: 'Moderate', hint: "shares opinions when relevant, but doesn't force them" },
      { value: 'minimal', label: 'Minimal', hint: 'stays neutral unless specifically asked' },
      { value: 'none', label: 'None', hint: 'just executes, no commentary' },
      CUSTOM_OPTION,
    ],
    allowCustom: true,
    required: true,
  },
  {
    id: 'uncertainty',
    text: 'When unsure about something, your agent should:',
    options: [
      { value: 'figure-it-out', label: 'Figure it out', hint: 'research, try things, only ask if truly stuck' },
      { value: 'always-ask', label: 'Always ask', hint: 'before acting on uncertain things' },
      { value: 'internal-external', label: 'Split approach', hint: 'figure out internal stuff, ask about external/risky stuff' },
      { value: 'wait', label: 'Wait for guidance', hint: "say it doesn't know and wait" },
      CUSTOM_OPTION,
    ],
    allowCustom: true,
    required: true,
  },
  {
    id: 'autonomy',
    text: 'How much autonomy does your agent get?',
    options: [
      { value: 'full', label: 'Full', hint: 'only ask for truly dangerous or irreversible stuff' },
      { value: 'high', label: 'High', hint: 'act freely internally, confirm external actions' },
      { value: 'moderate', label: 'Moderate', hint: 'confirm most things, but reading/research/organizing is fine' },
      { value: 'low', label: 'Low', hint: 'confirm everything significant before acting' },
      CUSTOM_OPTION,
    ],
    allowCustom: true,
    required: true,
  },
  {
    id: 'dynamic',
    text: "What's the dynamic between you two?",
    options: [
      { value: 'colleague', label: 'Sharp colleague', hint: "equals who challenge each other's thinking" },
      { value: 'assistant', label: 'Reliable assistant', hint: 'efficient, knows its role, gets things done' },
      { value: 'friend', label: 'Trusted friend', hint: 'casual, real, sometimes pushes boundaries' },
      { value: 'expert', label: 'Quiet expert', hint: 'speaks when it has genuine value, otherwise stays back' },
      CUSTOM_OPTION,
    ],
    allowCustom: true,
    required: true,
  },
  {
    id: 'pushback',
    text: 'When you have a bad idea, your agent should:',
    options: [
      { value: 'direct', label: 'Call it out directly', hint: '"that\'s a bad idea because..."' },
      { value: 'gentle', label: 'Raise concerns gently', hint: '"have you considered..."' },
      { value: 'probing', label: 'Ask probing questions', hint: 'so you realize the issues yourself' },
      { value: 'execute', label: 'Just do what you ask', hint: "you'll figure it out" },
      CUSTOM_OPTION,
    ],
    allowCustom: true,
    required: true,
  },
  {
    id: 'verbosity',
    text: 'How verbose should responses be?',
    options: [
      { value: 'short', label: 'Short and punchy', hint: 'bullets, no fluff, minimal words' },
      { value: 'concise', label: 'Concise but complete', hint: 'brief explanations when needed' },
      { value: 'detailed', label: 'Detailed and thorough', hint: 'walk me through reasoning' },
      { value: 'adaptive', label: 'Match the question', hint: 'short for simple, detailed for complex' },
      CUSTOM_OPTION,
    ],
    allowCustom: true,
    required: true,
  },
  {
    id: 'priority',
    text: 'What matters most to you in an AI assistant?',
    options: [
      { value: 'speed', label: 'Speed and efficiency', hint: 'get things done fast' },
      { value: 'accuracy', label: 'Accuracy and thoroughness', hint: 'get things done right' },
      { value: 'creativity', label: 'Creativity and initiative', hint: "bring ideas I didn't ask for" },
      { value: 'safety', label: 'Reliability and safety', hint: 'never surprise me' },
      CUSTOM_OPTION,
    ],
    allowCustom: true,
    required: true,
  },
  {
    id: 'privacy',
    text: 'Privacy and sensitivity level:',
    options: [
      { value: 'paranoid', label: 'Paranoid', hint: 'never reference personal info unless I bring it up first' },
      { value: 'careful', label: 'Careful', hint: 'remember context but cautious in how you use/share it' },
      { value: 'relaxed', label: 'Relaxed', hint: 'use everything you know to help me' },
      { value: 'context', label: 'Context-dependent', hint: 'careful in groups, relaxed in private chats' },
      CUSTOM_OPTION,
    ],
    allowCustom: true,
    required: true,
  },
  {
    id: 'agent-identity',
    text: 'Give your agent a name and emoji:',
    options: [
      { value: '__name-emoji__', label: "I'll choose", hint: 'pick a name and emoji' },
      { value: '__surprise__', label: '🎲 Surprise me', hint: 'get a creative random name + emoji' },
    ],
    allowCustom: false,
    required: true,
  },
];
