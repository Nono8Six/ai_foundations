/**
 * Utilitaires pour le formatage et la validation des numéros de téléphone français
 */

export interface PhoneValidationResult {
  isValid: boolean;
  formatted: string;
  error?: string;
}

/**
 * Formate un numéro de téléphone français au format XX XX XX XX XX
 * @param input - Le numéro saisi par l'utilisateur
 * @returns Le numéro formaté
 */
export function formatFrenchPhoneNumber(input: string): string {
  // Supprimer tous les caractères non numériques
  const numbers = input.replace(/\D/g, '');
  
  // Limiter à 10 chiffres maximum
  const truncated = numbers.slice(0, 10);
  
  // Formater par groupes de 2
  const formatted = truncated.replace(/(\d{2})(?=\d)/g, '$1 ');
  
  return formatted.trim();
}

/**
 * Valide et formate un numéro de téléphone français
 * @param input - Le numéro saisi par l'utilisateur
 * @returns Résultat de la validation avec le numéro formaté
 */
export function validateAndFormatFrenchPhone(input: string): PhoneValidationResult {
  if (!input || input.trim() === '') {
    return {
      isValid: true,
      formatted: '',
    };
  }

  // Supprimer tous les espaces et caractères spéciaux
  const cleaned = input.replace(/\D/g, '');
  
  // Cas spéciaux pour différents formats d'entrée
  let normalizedNumber = cleaned;
  
  // Si le numéro commence par +33, le convertir
  if (input.startsWith('+33')) {
    const withoutCountryCode = cleaned.slice(2);
    if (withoutCountryCode.length >= 9) {
      normalizedNumber = `0${  withoutCountryCode.slice(0, 9)}`;
    }
  }
  // Si le numéro commence par 33 (sans +), le convertir
  else if (cleaned.startsWith('33') && cleaned.length >= 11) {
    normalizedNumber = `0${  cleaned.slice(2, 11)}`;
  }
  
  // Vérifications de base
  if (normalizedNumber.length === 0) {
    return {
      isValid: true,
      formatted: '',
    };
  }
  
  if (normalizedNumber.length < 10) {
    return {
      isValid: false,
      formatted: formatFrenchPhoneNumber(normalizedNumber),
      error: `Numéro trop court (${normalizedNumber.length}/10 chiffres)`,
    };
  }
  
  if (normalizedNumber.length > 10) {
    return {
      isValid: false,
      formatted: formatFrenchPhoneNumber(normalizedNumber.slice(0, 10)),
      error: 'Numéro trop long (maximum 10 chiffres)',
    };
  }
  
  // Vérifier que le numéro commence par un chiffre valide
  const firstDigit = normalizedNumber[0];
  const secondDigit = normalizedNumber[1];
  
  if (firstDigit !== '0') {
    return {
      isValid: false,
      formatted: formatFrenchPhoneNumber(normalizedNumber),
      error: 'Le numéro doit commencer par 0',
    };
  }
  
  // Vérifier les plages valides pour les numéros français
  const validPrefixes = ['01', '02', '03', '04', '05', '06', '07', '08', '09'];
  const prefix = normalizedNumber.slice(0, 2);
  
  if (!validPrefixes.includes(prefix)) {
    return {
      isValid: false,
      formatted: formatFrenchPhoneNumber(normalizedNumber),
      error: 'Préfixe invalide (doit être 01-09)',
    };
  }
  
  // Vérifications spécifiques par type de numéro
  if (prefix === '08') {
    // Numéros spéciaux 08
    if (!['080', '081', '082', '089'].some(p => normalizedNumber.startsWith(p))) {
      return {
        isValid: false,
        formatted: formatFrenchPhoneNumber(normalizedNumber),
        error: 'Numéro 08 invalide',
      };
    }
  }
  
  return {
    isValid: true,
    formatted: formatFrenchPhoneNumber(normalizedNumber),
  };
}

/**
 * Nettoie un numéro de téléphone pour le stockage (supprime les espaces)
 * @param formattedPhone - Le numéro formaté avec espaces
 * @returns Le numéro sans espaces pour le stockage
 */
export function cleanPhoneForStorage(formattedPhone: string): string {
  return formattedPhone.replace(/\s/g, '');
}

/**
 * Détermine le type de numéro de téléphone français
 * @param phone - Le numéro de téléphone nettoyé
 * @returns Le type de numéro
 */
export function getFrenchPhoneType(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length !== 10 || !cleaned.startsWith('0')) {
    return 'invalide';
  }
  
  const prefix = cleaned.slice(0, 2);
  
  switch (prefix) {
    case '01':
    case '02':
    case '03':
    case '04':
    case '05':
      return 'fixe';
    case '06':
    case '07':
      return 'mobile';
    case '08':
      return 'numéro spécial';
    case '09':
      return 'non géographique';
    default:
      return 'invalide';
  }
}

/**
 * Exemple de numéro valide pour l'aide utilisateur
 */
export const FRENCH_PHONE_EXAMPLE = '06 12 34 56 78'; // Numéro mobile fictif