export async function fetchLinkPreviewImage(
  url: string
): Promise<string | null> {
  const res = await fetch(url);
  const body = await res.text();
  const regex = /"og:image"[^\\/]*content="((\S*))"/;
  const result = body.match(regex);
  if (!result) {
    return null;
  }
  return result[2] ?? null;
}
