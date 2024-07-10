import { type Result, anyhow, safelyAsync } from '@yyhhenry/rust-result';

type UrlLike = string | URL;

export async function post(url: UrlLike, bodyJson: unknown): Promise<Result<unknown, Error>> {
  return await safelyAsync(async () => {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(bodyJson),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status !== 200) {
      return anyhow(`HTTP ${response.status} ${response.statusText} `);
    }
    const json = (await response.json()) as unknown;
    return json;
  });
}

export async function get(url: UrlLike): Promise<Result<unknown, Error>> {
  return await safelyAsync(async () => {
    const response = await fetch(url);
    if (response.status !== 200) {
      return anyhow(`HTTP ${response.status} ${response.statusText}`);
    }
    const json = (await response.json()) as unknown;
    return json;
  });
}
