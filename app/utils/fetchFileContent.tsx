export async function fetchFileContent(
  owner: string,
  repo: string,
  path: string,
  branch: string,
  token: string,
  provider: string
): Promise<string> {
  let url = "";
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (provider === "github") {
    url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    headers.Accept = "application/vnd.github.raw";
  }

  if (provider === "bitbucket") {
    // Raw file endpoint
    url = `https://api.bitbucket.org/2.0/repositories/${owner}/${repo}/src/${branch}/${path}`;
    // Bitbucket returns raw by default, no Accept needed
  }

  const res = await fetch(url, { headers });
  console.log("Fetching:", provider, url);


  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Failed to load file from ${provider}: ${res.status}\n${text}`
    );
  }

  return await res.text();
}
