// Test des clés d'idempotence réelles
import { makeIdempotencyKey, IdempotencyKeys } from './src/shared/services/idempotency.js';

// 1. Lesson completion
const lessonKey = makeIdempotencyKey({
  kind: 'lesson',
  userId: 'user-123',
  identifier: 'lesson-456',
  version: 1,
  scope: 'course-789'
});

// 2. Quiz perfect score
const quizKey = makeIdempotencyKey({
  kind: 'quiz',
  userId: 'user-123', 
  identifier: 'quiz-789',
  version: 1,
  metadata: { score: 'perfect', attempt: 1 }
});

// 3. Achievement unlock
const achievementKey = IdempotencyKeys.unlockAchievement('user-123', 'level-5', 2, 'course-advanced');

// 4. Course completion  
const courseKey = makeIdempotencyKey({
  kind: 'course',
  userId: 'user-123',
  identifier: 'course-complete',
  version: 1,
  scope: 'full-program'
});

console.log('=== CLÉS D\'IDEMPOTENCE RÉELLES ===');
console.log('1. Lesson completion:', lessonKey);
console.log('2. Quiz perfect score:', quizKey);
console.log('3. Achievement unlock:', achievementKey);
console.log('4. Course completion:', courseKey);

// Vérification format attendu: <kind>:<userId>:<identifier>:<version>:<scope>
const expectedFormat = /^[a-z-]+:[a-z0-9-]+:[a-z0-9-]+:[a-z0-9-]+:[a-z0-9-]+$/;

console.log('\n=== VALIDATION FORMAT ===');
console.log('Lesson format valid:', expectedFormat.test(lessonKey));
console.log('Quiz format valid:', expectedFormat.test(quizKey));
console.log('Achievement format valid:', expectedFormat.test(achievementKey));
console.log('Course format valid:', expectedFormat.test(courseKey));

// Vérification zéro timestamp/UUID
const hasTimestamp = /\d{10,}/.test(lessonKey + quizKey + achievementKey + courseKey);
const hasUUID = /[0-9a-f]{8}-[0-9a-f]{4}/.test(lessonKey + quizKey + achievementKey + courseKey);

console.log('\n=== VÉRIFICATION DÉTERMINISME ===');
console.log('Contient timestamp:', hasTimestamp);
console.log('Contient UUID:', hasUUID);
console.log('✅ Déterministe:', !hasTimestamp && !hasUUID);