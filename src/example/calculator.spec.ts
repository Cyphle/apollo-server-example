import { describe, expect, it } from '@jest/globals';
import { calculator } from './calculator';

describe('calculator',() => {
  it('should calculate', () => {
    const result = calculator(2, 3);

    expect(result).toEqual(5);
  });
});