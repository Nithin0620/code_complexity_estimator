import { ComplexityResult } from '@/types';
import { detectBigO } from './detectBigO';
import { extractSnippets } from './extractSnippets';
import { generateGraphData } from './generateGraphData';

/**
 * Enhanced analysis engine that calculates score, Big-O, and identifies hotspots.
 * This logic uses purely local heuristics and string parsing.
 * 
 * Score Metrics:
 * - Loops (+2)
 * - Conditionals (+1)
 * - Recursion (+3)
 * - Multiplier: Max Nesting Depth
 */
export function analyzeComplexity(code: string): ComplexityResult {
  const reasons: string[] = [];
  let baseScore = 0;

  // 1. Loops: Search for loop keywords
  const forMatches = (code.match(/\bfor\s*\(/g) || []).length;
  const whileMatches = (code.match(/\bwhile\s*\(/g) || []).length;
  const totalLoops = forMatches + whileMatches;
  if (totalLoops > 0) {
    baseScore += totalLoops * 2;
    reasons.push(`${totalLoops} loop(s) detected (+${totalLoops * 2})`);
  }

  // 2. Conditionals: Search for decision points
  const ifMatches = (code.match(/\bif\s*\(/g) || []).length;
  const switchMatches = (code.match(/\bswitch\s*\(/g) || []).length;
  const totalConditionals = ifMatches + switchMatches;
  if (totalConditionals > 0) {
    baseScore += totalConditionals * 1;
    reasons.push(`${totalConditionals} conditional(s) detected (+1 each)`);
  }

  // 3. Recursion Analysis
  let recursionDetected = false;
  const funcDefRegex = /(?:function|const|let|var)\s+([a-zA-Z0-9_$]+)\s*[\(|=]/g;
  let match;
  const functionNames: string[] = [];
  while ((match = funcDefRegex.exec(code)) !== null) {
    const name = match[1];
    if (!['if', 'for', 'while', 'switch', 'return'].includes(name)) {
      functionNames.push(name);
    }
  }

  for (const name of functionNames) {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const callRegex = new RegExp(`\\b${escapedName}\\s*\\(`, 'g');
    const matches = (code.match(callRegex) || []).length;
    // Definition + 1 call = potential recursion
    if (matches > 1) {
      recursionDetected = true;
      break;
    }
  }

  if (recursionDetected) {
    baseScore += 3;
    reasons.push(`Recursion logic detected (+3)`);
  }

  // 4. Nesting Depth Factor
  let maxDepth = 0;
  let currentDepth = 0;
  for (let i = 0; i < code.length; i++) {
    if (code[i] === '{') {
      currentDepth++;
      if (currentDepth > maxDepth) maxDepth = currentDepth;
    } else if (code[i] === '}') {
      currentDepth--;
    }
  }

  const nestingFactor = maxDepth > 1 ? maxDepth : 1;
  const score = Math.round(baseScore * nestingFactor);
  if (nestingFactor > 1) {
    reasons.push(`Nesting depth of ${maxDepth} (Multiplier)`);
  }

  // Determine Level
  let level: "Low" | "Medium" | "High" = "Low";
  if (score >= 30) level = "High";
  else if (score >= 10) level = "Medium";

  // New features: Big-O, Snippets, Graph
  const bigO = detectBigO(totalLoops > 0, maxDepth, recursionDetected);
  const snippets = extractSnippets(code, functionNames);
  const graphData = generateGraphData(bigO);

  return {
    score,
    level,
    bigO,
    reasons,
    snippets,
    graphData
  };
}
