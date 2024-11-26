export const defaultImageUrl = "/no-photo.png";

const maybeImageUrlPath =
  "https://alfxflqvzegvbpsvtzih.supabase.co/storage/v1/object/public/photos/";

const slugCreator = (name: string, color: string) => {
  const key = `${name}_${color}`;
  const slug = key
    .replace(/[$*+~.()'"!/\-:@]/g, "")
    .replace(/\s+/g, "_")
    .toLowerCase();
  return slug;
};

export const getMaybeImageUrl = (name?: string, color?: string) => {
  if (!name || !color) {
    return defaultImageUrl;
  }

  const slug = slugCreator(name, color);

  return `${maybeImageUrlPath}${slug}.png`;
};
