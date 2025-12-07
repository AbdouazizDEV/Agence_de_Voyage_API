/**
 * Utilitaires pour génération de slugs
 * Principe SOLID : Single Responsibility - Gère uniquement les slugs
 */
export class SlugUtil {
  static generate(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
      .replace(/[^a-z0-9]+/g, '-') // Remplace les caractères spéciaux par des tirets
      .replace(/(^-|-$)/g, ''); // Supprime les tirets en début/fin
  }

  static generateUnique(text: string, suffix?: string): string {
    const baseSlug = this.generate(text);
    return suffix ? `${baseSlug}-${suffix}` : baseSlug;
  }
}
