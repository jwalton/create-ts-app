import path from 'node:path';
import fs from 'node:fs/promises';

export async function recurseDir(dir: string): Promise<string[]> {
    const files = await fs.readdir(dir);
    const result = [];
    for (const file of files) {
        const resolved = path.join(dir, file);
        const stat = await fs.stat(resolved);
        if (stat.isFile()) {
            result.push(resolved);
        } else if (stat.isDirectory()) {
            result.push(...(await recurseDir(resolved)));
        }
    }
    return result;
}
