import { test, expect } from 'vitest';

console.log('Début du test...');

test('1 + 1 should equal 2', () => {
  console.log('Exécution du test...');
  expect(1 + 1).toBe(2);
  console.log('Test terminé avec succès!');
});
