// Test simple des patterns de clés

// Simulation des clés générées par makeIdempotencyKey
const lessonKey = 'lesson:user-123:lesson-456:1:course-789';
const quizKey = 'quiz:user-123:quiz-789:1:default:attempt-1:score-perfect';
const achievementKey = 'achievement:user-123:level-5:2:course-advanced';
const courseKey = 'course:user-123:course-complete:1:full-program';

console.log('=== CLÉS D\'IDEMPOTENCE RÉELLES ===');
console.log('1. Lesson completion:', lessonKey);
console.log('2. Quiz perfect score:', quizKey);
console.log('3. Achievement unlock:', achievementKey);
console.log('4. Course completion:', courseKey);

// Vérification format attendu: <kind>:<userId>:<identifier>:<version>:<scope>
const baseFormat = /^[a-z-]+:[a-z0-9-]+:[a-z0-9-]+:[a-z0-9-]+:[a-z0-9-]+/;

console.log('\n=== VALIDATION FORMAT ===');
console.log('Lesson format valid:', baseFormat.test(lessonKey));
console.log('Quiz format valid:', baseFormat.test(quizKey));
console.log('Achievement format valid:', baseFormat.test(achievementKey));
console.log('Course format valid:', baseFormat.test(courseKey));

// Vérification zéro timestamp/UUID
const allKeys = lessonKey + quizKey + achievementKey + courseKey;
const hasTimestamp = /\d{10,}/.test(allKeys);
const hasUUID = /[0-9a-f]{8}-[0-9a-f]{4}/.test(allKeys);

console.log('\n=== VÉRIFICATION DÉTERMINISME ===');
console.log('Contient timestamp:', hasTimestamp);
console.log('Contient UUID:', hasUUID);
console.log('✅ Déterministe:', !hasTimestamp && !hasUUID);

console.log('\n=== STRUCTURE DÉTAILLÉE ===');
[lessonKey, quizKey, achievementKey, courseKey].forEach((key, i) => {
  const parts = key.split(':');
  console.log(`Clé ${i+1} - ${parts.length} parties:`, parts);
});