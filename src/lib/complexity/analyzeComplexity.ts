import { ComplexityResult } from '@/types';
import { detectBigO } from './detectBigO';
import { detectSpaceO } from './detectSpaceO';
import { extractSnippets } from './extractSnippets';
import { generateGraphData } from './generateGraphData';

/**
 * Enhanced analysis engine with improved recursion and nesting logic.
 * 
 * Heuristics:
 * - baseScore: (loops * 2) + (conditionals * 1) + (recursion * 3).
 * - Multiplier: Uses the *Maximum depth of loop nesting*, not just any bracket depth.
 * - SpaceO: Estimations based on collection allocations and recursion depth.
 */
export function analyzeComplexity(code: string): ComplexityResult {
  const reasons: string[] = [];
  let baseScore = 0;

  // Pre-process: Strip single-line and multi-line comments for better parsing
  const cleanCode = code
    .replace(/\/\/.*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');

  // 1. Loops: Search for loop keywords
  const forMatches = (cleanCode.match(/\bfor\s*\(/g) || []).length;
  const whileMatches = (cleanCode.match(/\bwhile\s*\(/g) || []).length;
  const totalLoops = forMatches + whileMatches;
  if (totalLoops > 0) {
    baseScore += totalLoops * 2;
    reasons.push(`${totalLoops} loop(s) detected (+${totalLoops * 2})`);
  }

  // 2. Conditionals: Search for decision points
  const ifMatches = (cleanCode.match(/\bif\s*\(/g) || []).length;
  const switchMatches = (cleanCode.match(/\bswitch\s*\(/g) || []).length;
  const totalConditionals = ifMatches + switchMatches;
  if (totalConditionals > 0) {
    baseScore += totalConditionals * 1;
    reasons.push(`${totalConditionals} conditional(s) detected (+1 each)`);
  }

  // 3. Recursion Analysis: Detect if a function calls itself in its block
  let recursionDetected = false;
  // Match common function patterns: function name(), const name = () =>, name()
  const funcDefRegex = /(?:function|const|let|var)\s+([a-zA-Z0-9_$]+)\s*[\(|=]/g;
  let match;
  const foundFunctions: { name: string; content: string }[] = [];
  
  // Rudimentary scope parsing: find a function name and check text following its first {
  while ((match = funcDefRegex.exec(cleanCode)) !== null) {
      const name = match[1];
      if (['if', 'for', 'while', 'switch', 'return', 'else'].includes(name)) continue;
      
      const startOfBody = cleanCode.indexOf('{', match.index);
      if (startOfBody !== -1) {
          // Simplistic search for its name in the remaining text (should be its body)
          const remainingText = cleanCode.substring(startOfBody + 1);
          const callRegex = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\(`, 'g');
          if (callRegex.test(remainingText)) {
              recursionDetected = true;
          }
          foundFunctions.push({ name, content: remainingText });
      }
  }

  if (recursionDetected) {
    baseScore += 3;
    reasons.push(`Recursion logic detected (+3)`);
  }

  // 4. Nesting Depth: Tracks maximum nesting specifically for loops/conditionals
  let loopNestingDepth = 0;
  let currentDepth = 0;
  let maxLoopNesting = 0;
  
  const lines = cleanCode.split('\n');
  lines.forEach(line => {
      const isLoop = /\b(for|while|if|switch)\b/.test(line);
      if (line.includes('{')) {
          currentDepth++;
          if (isLoop) loopNestingDepth = currentDepth; // track depth at loop points
          if (loopNestingDepth > maxLoopNesting) maxLoopNesting = loopNestingDepth;
      }
      if (line.includes('}')) {
          currentDepth--;
          if (currentDepth < loopNestingDepth) {
              loopNestingDepth = currentDepth;
          }
      }
  });

  // Calculate nesting factor (min 1, max based on nested loops)
  // Shift by 1 because single level should be 1x multiplier
  const nestingFactor = maxLoopNesting > 1 ? maxLoopNesting : 1;
  const score = Math.round(baseScore * nestingFactor);
  if (nestingFactor > 1) {
    reasons.push(`Maximum logical nesting of ${maxLoopNesting} (Score multiplier)`);
  }

  // 5. Complexity Estimation (Big-O and Space-O)
  const bigO = detectBigO(totalLoops > 0, maxLoopNesting, recursionDetected);
  const spaceO = detectSpaceO(cleanCode, recursionDetected, maxLoopNesting);
  const snippets = extractSnippets(cleanCode, foundFunctions.map(f => f.name));
  const graphData = generateGraphData(bigO);

  // Determine Overall Level
  let level: "Low" | "Medium" | "High" = "Low";
  if (score >= 40) level = "High";
  else if (score >= 15) level = "Medium";

  return {
    score,
    level,
    bigO,
    spaceO,
    reasons,
    snippets,
    graphData
  };
}
