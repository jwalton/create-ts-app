import fs from 'node:fs/promises';
import path from 'node:path';
import { recurseDir } from './files.js';

export async function copyTemplateFiles(source: string, dest: string): Promise<void> {
    const resolvedSource = path.resolve(source);
    const templateFileNames = await recurseDir(resolvedSource);

    for (const file of templateFileNames) {
        const contents = await fs.readFile(file, { encoding: 'utf8' });
        const destFile = path.join(dest, file.replace(`${resolvedSource}/`, ''));
        await fs.mkdir(path.dirname(destFile), { recursive: true });
        await fs.writeFile(destFile, contents);
    }
}
