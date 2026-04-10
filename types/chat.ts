export type ChatMessage = {
  id: string;
  isUser: boolean;
  text?: string;

  type?: 'text' | 'estimate' | 'recipe'; // Added 'recipe'

  estimate?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };

  recipe?: {
    name: string;
    ingredients: string[];
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };

  confirmed?: boolean;
};