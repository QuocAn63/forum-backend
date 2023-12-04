import slugify from 'slugify';

export class SlugifyUtil {
  public static generateSlug(input: string): string {
    return slugify(input, {
      trim: true,
      replacement: '_',
    });
  }

  public static generatePostSlug(id: string, title: string): string {
    return this.generateSlug(`${title} ${id}`);
  }
}
