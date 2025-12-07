import * as bcrypt from 'bcrypt';

/**
 * Utilitaires pour cryptage et hash
 * Principe SOLID : Single Responsibility - Gère uniquement le cryptage
 */
export class EncryptionUtil {
  private static readonly SALT_ROUNDS = 10;

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
