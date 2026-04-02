import { Snippet } from '@/types';

/**
 * Extracts hotspots from source code with support for Space Complexity analysis.
 * Identifies lines of interests: loops, recursion, and memory allocations.
 * 
 * @param code - Raw source code (post cleaning)
 * @param functionNames - Known function names to check for recursion
 * @returns Array of snippets for UI highlighting
 */
export function extractSnippets(code: string, functionNames: string[]): Snippet[] {
  const snippets: Snippet[] = [];
  const lines = code.split('\n');
  let currentDepth = 0;

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('/') || trimmed.startsWith('*')) return;

    // Detection rules
    const hasLoop = /\b(for|while)\s*\(/.test(trimmed);
    
    const hasRecursion = functionNames.some(name => {
      const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const callRegex = new RegExp(`\\b${escapedName}\\s*\\(`, 'g');
      // If it exists and isn't a definition line, mark as call
      const isDef = /(?:function|const|let|var)\s+/.test(trimmed);
      return callRegex.test(trimmed) && !isDef;
    });

    const isAllocation = /\b(new\s+(Array|Map|Set|List|ArrayList)|\[|(?:\w+)\.push\(|(?:\w+)\[\w+\]\s*=)/gi.test(trimmed);

    // Context determination
    if (hasLoop) {
      snippets.push({
        line: index + 1,
        code: trimmed.length > 60 ? trimmed.substring(0, 57) + '...' : trimmed,
        type: currentDepth > 0 ? "nested-loop" : "loop"
      });
    } else if (hasRecursion) {
      snippets.push({
        line: index + 1,
        code: trimmed.substring(0, 60),
        type: "recursion"
      });
    } else if (isAllocation) {
      snippets.push({
        line: index + 1,
        code: trimmed.substring(0, 60),
        type: "space-allocation"
      });
    }

    // Tracks nesting logic for determining "nested-loop" vs "loop"
    const opens = (trimmed.match(/\{/g) || []).length;
    const closes = (trimmed.match(/\}/g) || []).length;
    currentDepth += (opens - closes);
  });

  // Pick the most relevant snippets to show in the results
  return snippets.slice(0, 15);
}
