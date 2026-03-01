export function mergeFiles(
  generated: Record<string, string>,
  existing: Record<string, string>,
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [filename, content] of Object.entries(generated)) {
    const existingContent = existing[filename];
    if (!existingContent) {
      result[filename] = content;
      continue;
    }

    switch (filename) {
      case 'IDENTITY.md':
        // Generated wins — it's small and specific
        result[filename] = content;
        break;

      case 'USER.md':
        result[filename] = mergeUser(content, existingContent);
        break;

      case 'SOUL.md':
        result[filename] = mergeSoul(content, existingContent);
        break;

      case 'AGENTS.md':
        result[filename] = mergeAgents(content, existingContent);
        break;

      default:
        result[filename] = content;
    }
  }

  return result;
}

function mergeUser(generated: string, existing: string): string {
  // Extract custom sections from existing (anything after the standard fields)
  const existingLines = existing.split('\n');
  const customLines: string[] = [];
  let pastStandardFields = false;
  const standardFields = ['name:', 'what to call', 'timezone:', 'notes:'];

  for (const line of existingLines) {
    const lower = line.toLowerCase();
    if (standardFields.some((f) => lower.includes(f))) {
      pastStandardFields = true;
      continue;
    }
    if (pastStandardFields && line.trim() && !line.startsWith('#')) {
      customLines.push(line);
    }
  }

  if (customLines.length > 0) {
    return generated + '\n\n' + customLines.join('\n');
  }
  return generated;
}

function mergeSoul(generated: string, existing: string): string {
  // Find custom sections in existing that aren't in generated
  const generatedSections = extractSections(generated);
  const existingSections = extractSections(existing);

  const customSections: string[] = [];
  for (const [heading, content] of Object.entries(existingSections)) {
    const normalizedHeading = heading.toLowerCase().trim();
    const isStandard = Object.keys(generatedSections).some(
      (gh) => gh.toLowerCase().trim() === normalizedHeading,
    );
    if (!isStandard) {
      customSections.push(`## ${heading}\n\n${content}`);
    }
  }

  if (customSections.length > 0) {
    return generated + '\n\n' + customSections.join('\n\n');
  }
  return generated;
}

function mergeAgents(generated: string, existing: string): string {
  // Keep existing custom sections not in the standard template
  const generatedSections = extractSections(generated);
  const existingSections = extractSections(existing);

  const customSections: string[] = [];
  for (const [heading, content] of Object.entries(existingSections)) {
    const normalizedHeading = heading.toLowerCase().trim();
    const isStandard = Object.keys(generatedSections).some(
      (gh) => gh.toLowerCase().trim() === normalizedHeading,
    );
    if (!isStandard) {
      customSections.push(`## ${heading}\n\n${content}`);
    }
  }

  if (customSections.length > 0) {
    return generated + '\n\n' + customSections.join('\n\n');
  }
  return generated;
}

function extractSections(content: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const lines = content.split('\n');
  let currentHeading = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    const match = line.match(/^##\s+(.+)/);
    if (match) {
      if (currentHeading) {
        sections[currentHeading] = currentContent.join('\n').trim();
      }
      currentHeading = match[1]!;
      currentContent = [];
    } else if (currentHeading) {
      currentContent.push(line);
    }
  }

  if (currentHeading) {
    sections[currentHeading] = currentContent.join('\n').trim();
  }

  return sections;
}
