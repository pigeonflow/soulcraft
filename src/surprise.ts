const names = [
  'Ziggy', 'Cosmo', 'Nyx', 'Helix', 'Patch', 'Birch', 'Scout', 'Drift',
  'Ember', 'Flux', 'Sage', 'Pixel', 'Wren', 'Atlas', 'Onyx', 'Clover',
  'Spark', 'Rune', 'Echo', 'Fern', 'Nova', 'Crux', 'Pip', 'Orbit',
  'Moss', 'Byte', 'Lark', 'Vex', 'Coda', 'Haze',
];

const emojis = [
  '🦊', '🌀', '⚡', '🔮', '🌿', '🦉', '✨', '🐙',
  '🎯', '🌊', '🦋', '🔥', '🌙', '💎', '🐺', '🎭',
  '🧊', '🌸', '🦝', '⭐',
];

export function getSurpriseName(): { name: string; emoji: string } {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const nameIdx = seed % names.length;
  const emojiIdx = (seed * 7 + 3) % emojis.length;
  return { name: names[nameIdx]!, emoji: emojis[emojiIdx]! };
}
