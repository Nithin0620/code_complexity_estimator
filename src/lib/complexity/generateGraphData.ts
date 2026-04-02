import { GraphPoint } from '@/types';

/**
 * Generates coordinate data for Recharts visualization based on estimated Big-O complexity.
 * This simulates algorithmic growth for input sizes n = 1 to 10.
 * 
 * @param bigO - The estimated time complexity string.
 * @returns Array of GraphPoint objects.
 */
export function generateGraphData(bigO: string): GraphPoint[] {
  const data: GraphPoint[] = [];
  
  for (let n = 1; n <= 10; n++) {
    let value = 0;
    
    // Growth approximations for visualization only
    switch (bigO) {
      case "O(1)":
        value = 1;
        break;
      case "O(n)":
        value = n;
        break;
      case "O(2^n)":
        value = Math.pow(2, n);
        break;
      case "O(n log n)":
        // Using base 10 for simpler visualization in the 1-10 range
        value = n * Math.log10(n + 1) * 2; 
        break;
      case "O(n^2)":
        value = n * n;
        break;
      case "O(n^3)":
        value = n * n * n;
        break;
      default:
        value = n;
    }
    
    // Round for cleaner display in chart tooltips
    data.push({ n, value: Math.round(value * 100) / 100 });
  }
  
  return data;
}
