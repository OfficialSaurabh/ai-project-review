export async function fetchFileContent(
  owner: string,
  repo: string,
  path: string,
  branch: string,
  token: string
): Promise<string> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.raw",
      },
    }
  );

  if (!res.ok) throw new Error("Failed to load file");

  return await res.text();
}
