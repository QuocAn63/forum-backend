import * as bcrypt from 'bcrypt';

export class HashUtil {
  public static hash(plainText: string, salt = 10): Promise<string> {
    return bcrypt.hash(plainText, salt);
  }

  public static compare(
    plainText: string,
    hashedText: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainText, hashedText);
  }
}
