export interface ComplexityResult {
  score: number;
  level: "Low" | "Medium" | "High";
  bigO: string;
  spaceO: string;
  reasons: string[];
  snippets: Snippet[];
  graphData: GraphPoint[];
}

export interface Snippet {
  line: number;
  code: string;
  type: "loop" | "nested-loop" | "recursion" | "space-allocation";
}

export interface GraphPoint {
  n: number;
  value: number;
}

export interface User {
  uid: string;
  name: string | null;
}

export interface HistoryItem {
  id: number;
  uid: string;
  code: string;
  result: string; // JSON stringify of ComplexityResult
  createdAt: string;
}

export interface HistoryItemParsed {
    id: number;
    uid: string;
    code: string;
    result: ComplexityResult;
    createdAt: string;
}
