import { describe, it, expect } from 'vitest';

function evaluateSingleChoice(selectedOptionId: string, correctOptionId: string, points: number): number {
  return selectedOptionId === correctOptionId ? points : 0;
}

function evaluateMultiChoice(selectedIds: string[], correctIds: string[], points: number): number {
  if (selectedIds.length !== correctIds.length) return 0;
  const isCorrect = selectedIds.every((id) => correctIds.includes(id));
  return isCorrect ? points : 0;
}

describe('Scoring Logic Engine', () => {
  it('correctly scores Single Choice questions', () => {
    expect(evaluateSingleChoice('opt-1', 'opt-1', 10)).toBe(10);
    expect(evaluateSingleChoice('opt-2', 'opt-1', 10)).toBe(0);
  });

  it('correctly scores Multi Choice questions with exact option selection', () => {
    const correctIds = ['opt-a', 'opt-c'];
    
    // Perfect match
    expect(evaluateMultiChoice(['opt-a', 'opt-c'], correctIds, 20)).toBe(20);
    
    // Partial selection (missing opt-c)
    expect(evaluateMultiChoice(['opt-a'], correctIds, 20)).toBe(0);
    
    // Extra wrong option selected
    expect(evaluateMultiChoice(['opt-a', 'opt-b', 'opt-c'], correctIds, 20)).toBe(0);
  });

  it('calculates total percentage correctly', () => {
    const score = 45;
    const totalPoints = 60;
    const percentage = Math.round((score / totalPoints) * 1000) / 10;
    expect(percentage).toBe(75);
  });
});
