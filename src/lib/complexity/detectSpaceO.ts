/**
 * Estimates Space Complexity (Memory overhead) based on heuristics.
 * 
 * Heuristic Rules:
 * - O(1): Constant space (default)
 * - O(n): One level of collection allocation (e.g., [], new Array)
 * - O(n): Recursive call stack (if pure recursion)
 * - O(n^2): Matrix or nested collection allocation
 * 
 * @param code - Raw source code
 * @param hasRecursion - True if recursion detected
 * @param maxNestingDepth - Depth of nested structures
 * @returns Space complexity string (e.g., O(1))
 */
export function detectSpaceO(
  code: string,
  hasRecursion: boolean,
  maxNestingDepth: number
): "O(1)" | "O(n)" | "O(n^2)" {
  
  // 1. Check for nested collection allocations (e.g., [[]] or nested array pushing)
  const nestedAllocation = (code.match(/\[\s*\[/g) || []).length > 0 || 
                           (code.match(/\.push\(\s*\[/g) || []).length > 0;
  
  if (nestedAllocation || maxNestingDepth >= 3) {
      // High nesting usually implies high memory overhead in many algorithms
      return "O(n^2)";
  }

  // 2. Check for single-level collection allocations
  // Matches common array/map/list patterns
  const collectionRegex = /\b(new\s+(Array|Map|Set|List|ArrayList|Collection)|\[|(?:\w+)\.push\(|(?:\w+)\[\w+\]\s*=)/gi;
  const hasCollection = collectionRegex.test(code);

  if (hasCollection || hasRecursion) {
    // Recursion involves call stack memory: O(n)
    // Collections involve heap memory: O(n)
    return "O(n)";
  }

  return "O(1)";
}
