import { Snippet } from '@/types';

/**
 * Extracts relevant code snippets that contribute to complexity scoring.
 * Points of interest include loops, nested loops, and recursion.
 * 
 * @param code - Raw source code as a string.
 * @param functionNames - Names of potential recursive functions.
 * @returns Array of snippets with line numbers and types.
 */
export function extractSnippets(code: string, functionNames: string[]): Snippet[] {
  const snippets: Snippet[] = [];
  const lines = code.split('\n');
  let currentDepth = 0;
  let maxLoopDepth = 0;

  // First pass: detect depth and find snippets
  const rawSnippets: (Snippet & { depth: number })[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Keyword detection
    const hasLoop = /\b(for|while)\s*\(/.test(trimmed);
    
    // Check for recursion calls (function names being reused on this specific line)
    const hasRecursion = functionNames.some(name => {
      const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const callRegex = new RegExp(`\\b${escapedName}\\s*\\(`, 'g');
      
      const matches = (trimmed.match(callRegex) || []).length;
      const isDef = /(?:function|const|let|var)\s+/.test(trimmed);
      
      return matches > 0 && !isDef;
    });

    if (hasLoop) {
      if (currentDepth > maxLoopDepth) maxLoopDepth = currentDepth;
      rawSnippets.push({
        line: index + 1,
        code: trimmed.length > 60 ? trimmed.substring(0, 57) + '...' : trimmed,
        type: currentDepth > 0 ? "nested-loop" : "loop",
        depth: currentDepth
      });
    } else if (hasRecursion) {
      rawSnippets.push({
        line: index + 1,
        code: trimmed.length > 60 ? trimmed.substring(0, 57) + '...' : trimmed,
        type: "recursion",
        depth: currentDepth
      });
    }

    // Update depth tracker for next lines
    const opens = (trimmed.match(/\{/g) || []).length;
    const closes = (trimmed.match(/\}/g) || []).length;
    currentDepth += (opens - closes);
  });

  // Second pass: Finalize and potentially mark 'deepest' if needed
  return rawSnippets.map(s => ({
      line: s.line,
      code: s.code,
      type: s.type
  }));
}
