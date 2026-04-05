export type ChatMessage = {
  id: string;
  isUser: boolean;
  text?: string;

  type?: 'text' | 'estimate';

  estimate?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };

  confirmed?: boolean;
};