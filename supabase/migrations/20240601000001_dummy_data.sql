-- Insert sample data for the AI Foundations LMS

-- Sample admin user (must be added manually after registration)
-- UPDATE profiles SET is_admin = true WHERE email = 'admin@example.com';

-- Sample course: AI Foundations
INSERT INTO courses (id, title, description, slug, cover_image_url, is_published) VALUES 
('d290f1ee-6c54-4b01-90e6-d701748f0851', 'Fondations de l''IA', 'Formation complète sur les fondamentaux de l''intelligence artificielle, de la théorie à la pratique.', 'fondations-ia', 'https://images.unsplash.com/photo-1593377201811-4516c1b90bbd?q=80&w=1000', true);

-- Sample modules
INSERT INTO modules (id, course_id, title, description, module_order, is_published) VALUES
('0e0d1e3c-9e2f-4b99-9f3a-1d3e3c9e2f4b', 'd290f1ee-6c54-4b01-90e6-d701748f0851', 'Introduction à l''IA', 'Découvrez les concepts fondamentaux de l''intelligence artificielle.', 1, true),
('1d3e3c9e-2f4b-5c6d-7e8f-9g0h1i2j3k4l', 'd290f1ee-6c54-4b01-90e6-d701748f0851', 'Machine Learning', 'Comprenez les différentes approches du machine learning.', 2, true),
('2f4b5c6d-7e8f-9g0h-1i2j-3k4l5m6n7o8p', 'd290f1ee-6c54-4b01-90e6-d701748f0851', 'Réseaux de neurones', 'Explorez le fonctionnement des réseaux de neurones artificiels.', 3, true);

-- Sample lessons for Introduction module
INSERT INTO lessons (id, module_id, title, content, lesson_order, is_published) VALUES
('a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6', '0e0d1e3c-9e2f-4b99-9f3a-1d3e3c9e2f4b', 'Qu''est-ce que l''IA?', 
'{"type": "text", "content": "<h1>Qu''est-ce que l''intelligence artificielle?</h1><p>L''intelligence artificielle (IA) est un domaine de l''informatique qui vise à créer des systèmes capables d''effectuer des tâches qui nécessitent normalement l''intelligence humaine.</p><p>Ces tâches comprennent l''apprentissage, le raisonnement, la résolution de problèmes, la perception, la compréhension du langage et la prise de décision.</p>"}', 
1, true),

('b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7', '0e0d1e3c-9e2f-4b99-9f3a-1d3e3c9e2f4b', 'Histoire de l''IA', 
'{"type": "text", "content": "<h1>Histoire de l''intelligence artificielle</h1><p>L''IA a débuté dans les années 1950 avec des pionniers comme Alan Turing et John McCarthy. Le terme "intelligence artificielle" a été inventé par McCarthy en 1956 lors de la conférence de Dartmouth.</p><p>Depuis, l''IA a connu des hauts et des bas, avec des périodes d''enthousiasme suivies de "hivers de l''IA" où les financements et l''intérêt diminuaient.</p>"}', 
2, true),

('c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8', '0e0d1e3c-9e2f-4b99-9f3a-1d3e3c9e2f4b', 'Types d''IA', 
'{"type": "text", "content": "<h1>Les différents types d''intelligence artificielle</h1><p>On distingue généralement deux types d''IA:</p><ul><li><strong>IA faible ou étroite</strong>: Conçue pour une tâche spécifique (comme jouer aux échecs ou reconnaître des visages).</li><li><strong>IA forte ou générale</strong>: Capable de comprendre, apprendre et appliquer des connaissances dans différents domaines, similaire à l''intelligence humaine.</li></ul><p>Actuellement, toutes les IA existantes sont des IA faibles.</p>"}', 
3, true);

-- Sample lessons for Machine Learning module
INSERT INTO lessons (id, module_id, title, content, lesson_order, is_published) VALUES
('d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9', '1d3e3c9e-2f4b-5c6d-7e8f-9g0h1i2j3k4l', 'Qu''est-ce que le Machine Learning?', 
'{"type": "text", "content": "<h1>Introduction au Machine Learning</h1><p>Le Machine Learning (apprentissage automatique) est une branche de l''IA qui permet aux systèmes d''apprendre et de s''améliorer à partir de l''expérience sans être explicitement programmés.</p><p>Les algorithmes de ML utilisent des données pour identifier des modèles et prendre des décisions avec un minimum d''intervention humaine.</p>"}', 
1, true),

('e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0', '1d3e3c9e-2f4b-5c6d-7e8f-9g0h1i2j3k4l', 'Apprentissage supervisé', 
'{"type": "video", "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "description": "<h1>L''apprentissage supervisé</h1><p>Dans l''apprentissage supervisé, l''algorithme est entraîné sur un ensemble de données étiquetées, ce qui signifie que chaque exemple dans les données d''entraînement est associé à la réponse correcte.</p><p>L''objectif est d''apprendre une fonction qui, étant donné de nouvelles données, peut prédire correctement les étiquettes correspondantes.</p>"}', 
2, true),

('f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1', '1d3e3c9e-2f4b-5c6d-7e8f-9g0h1i2j3k4l', 'Apprentissage non supervisé', 
'{"type": "text", "content": "<h1>L''apprentissage non supervisé</h1><p>Dans l''apprentissage non supervisé, l''algorithme est entraîné sur des données non étiquetées et doit trouver par lui-même la structure ou les modèles cachés dans ces données.</p><p>Les techniques courantes incluent le clustering, la réduction de dimensionnalité et la détection d''anomalies.</p>"}', 
3, true);

-- Sample lessons for Neural Networks module
INSERT INTO lessons (id, module_id, title, content, lesson_order, is_published) VALUES
('g7h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2', '2f4b5c6d-7e8f-9g0h-1i2j-3k4l5m6n7o8p', 'Le perceptron', 
'{"type": "text", "content": "<h1>Le perceptron: le neurone artificiel</h1><p>Le perceptron est le composant de base des réseaux de neurones. C''est un modèle mathématique inspiré du neurone biologique.</p><p>Il prend plusieurs entrées, leur applique des poids, additionne le tout, puis applique une fonction d''activation pour produire une sortie.</p>"}', 
1, true),

('h8i9j0k1-l2m3-n4o5-p6q7-r8s9t0u1v2w3', '2f4b5c6d-7e8f-9g0h-1i2j-3k4l5m6n7o8p', 'Réseaux de neurones profonds', 
'{"type": "text", "content": "<h1>Les réseaux de neurones profonds</h1><p>Un réseau de neurones profond (Deep Neural Network) est composé de plusieurs couches de neurones artificiels.</p><p>Ces réseaux peuvent modéliser des relations complexes et non linéaires entre les entrées et les sorties, ce qui les rend particulièrement efficaces pour des tâches comme la reconnaissance d''images ou la traduction automatique.</p>"}', 
2, true),

('i9j0k1l2-m3n4-o5p6-q7r8-s9t0u1v2w3x4', '2f4b5c6d-7e8f-9g0h-1i2j-3k4l5m6n7o8p', 'Réseaux de neurones convolutifs (CNN)', 
'{"type": "video", "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "description": "<h1>Les réseaux de neurones convolutifs (CNN)</h1><p>Les CNN sont spécialement conçus pour traiter des données ayant une topologie en grille, comme les images.</p><p>Ils utilisent des opérations de convolution qui permettent au réseau de capturer les caractéristiques spatiales des données d''entrée, ce qui les rend très efficaces pour la reconnaissance d''images et la vision par ordinateur.</p>"}', 
3, true);

-- Sample coupon
INSERT INTO coupons (code, discount_percent, valid_from, valid_to, is_active, max_uses) VALUES
('WELCOME20', 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '3 months', true, 100);
