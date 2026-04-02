import { analyzeComplexity } from './complexity/analyzeComplexity';

/**
 * Legacy wrapper for the original complexity logic.
 * Redirects to the enhanced, modular analysis engine.
 */
export const calculateComplexity = analyzeComplexity;

export { analyzeComplexity } from './complexity/analyzeComplexity';
export { detectBigO } from './complexity/detectBigO';
export { extractSnippets } from './complexity/extractSnippets';
export { generateGraphData } from './complexity/generateGraphData';
