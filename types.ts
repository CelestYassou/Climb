
export interface Hold {
  x: number; // 0 to 100 (percentage of width)
  y: number; // 0 to 100 (percentage of height)
  type: 'start' | 'hand' | 'foot' | 'top' | 'intermediate';
  description?: string;
}

export interface BetaStep {
  step: number;
  action: string;
  description: string;
}

export interface RouteAnalysis {
  grade: string;
  name: string;
  description: string;
  holds: Hold[];
  beta: BetaStep[];
  style: string;
}

export type AppStatus = 'idle' | 'camera' | 'analyzing' | 'results' | 'error';
