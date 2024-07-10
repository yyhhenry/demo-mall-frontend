import { type Result, anyhow, safelyAsync } from '@yyhhenry/rust-result';
export const post = async (url: string | URL, bodyJson?: unknown): Promise<Result<unknown, Error>> =>
    await safelyAsync(async () => {
        const body = bodyJson === undefined ? '{}' : JSON.stringify(bodyJson);
        const response = await fetch(url, {
            method: 'POST',
            body,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status !== 200) {
            return anyhow(`HTTP ${response.status} ${response.statusText} `);
        }
        const json = await response.json() as unknown;
        return json;
    }
    );


export const get = async (url: string | URL): Promise<Result<unknown, Error>> =>
    await safelyAsync(async () => {
        const response = await fetch(url);
        if (response.status !== 200) {
            return anyhow(`HTTP ${response.status} ${response.statusText}`);
        }
        const json = await response.json() as unknown;
        return json;
    }
    );
