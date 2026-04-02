/**
 * Estimates Big-O time complexity based on structural heuristics.
 * 
 * Heuristic Rules:
 * - No loops → O(1)
 * - Single loop → O(n)
 * - Nested loops (2 levels) → O(n^2)
 * - Nested loops (3 levels) → O(n^3)
 * - Loop + recursion → O(n log n) (approximation)
 * - Pure recursion → O(2^n) (basic assumption)
 * 
 * @param hasLoop - True if any loop keywords detected.
 * @param maxNestingDepth - Maximum level of bracket nesting.
 * @param hasRecursion - True if recursion logic is detected.
 * @returns Big-O Notation string.
 */
export function detectBigO(
  hasLoop: boolean, 
  maxNestingDepth: number, 
  hasRecursion: boolean
): "O(1)" | "O(n)" | "O(n^2)" | "O(n^3)" | "O(n log n)" | "O(2^n)" {
  
  // Rule 1: Loop + Recursion prioritized as O(n log n)
  if (hasRecursion && hasLoop) return "O(n log n)";
  
  // Rule 2: Pure Recursion assumed as O(2^n) (e.g., Fibonacci)
  if (hasRecursion) return "O(2^n)";
  
  // Rule 3: No loops
  if (!hasLoop) return "O(1)";
  
  // Rule 4: Check nesting depth for loops
  // Assuming a depth of 2 or 3 is a direct indicator of nested loop complexity
  if (maxNestingDepth >= 3) return "O(n^3)";
  if (maxNestingDepth === 2) return "O(n^2)";
  
  // DEFAULT: Single level of looping
  return "O(n)";
}
