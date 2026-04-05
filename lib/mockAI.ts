export function generateFakeEstimate(input: string) {
  const text = input.toLowerCase();

  if (text.includes('egg')) {
    return { calories: 300, protein: 20, carbs: 10, fat: 20 };
  }

  if (text.includes('burger')) {
    return { calories: 700, protein: 35, carbs: 40, fat: 45 };
  }

  if (text.includes('shake') || text.includes('protein')) {
    return { calories: 250, protein: 30, carbs: 10, fat: 5 };
  }

  if (text.includes('pizza')) {
    return { calories: 900, protein: 40, carbs: 90, fat: 35 };
  }

  if (text.includes('chicken') || text.includes('rice')) {
    return { calories: 600, protein: 45, carbs: 60, fat: 10 };
  }

  return { calories: 500, protein: 25, carbs: 50, fat: 20 };
}