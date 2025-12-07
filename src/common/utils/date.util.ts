import { format, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Utilitaires pour manipulation des dates
 * Principe SOLID : Single Responsibility - Gère uniquement les dates
 */
export class DateUtil {
  static formatDate(date: Date | string, formatStr = 'dd/MM/yyyy'): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      throw new Error('Date invalide');
    }
    return format(dateObj, formatStr, { locale: fr });
  }

  static formatDateTime(date: Date | string): string {
    return this.formatDate(date, 'dd/MM/yyyy HH:mm');
  }

  static isFuture(date: Date | string): boolean {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) && dateObj > new Date();
  }

  static isPast(date: Date | string): boolean {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) && dateObj < new Date();
  }
}
