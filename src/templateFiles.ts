import fs from 'node:fs/promises';
import path from 'node:path';
import { recurseDir } from './files.js';

/**
 * Copy all files from a given source folder into the target folder.
 *
 * This will recurse into subfolders.
 *
 * @param source - The source folder.
 * @param dest - The destination folder.
 *
 * @returns an array of relative filenames that were added.
 */
export async function copyTemplateFiles(
    source: string,
    dest: string,
    options: { rename?: { [filename: string]: string } } = {}
): Promise<string[]> {
    const rename = options.rename || {};

    const resolvedSource = path.resolve(source);
    const templateFileNames = await recurseDir(resolvedSource);

    const filesAdded: string[] = [];

    for (const file of templateFileNames) {
        const contents = await fs.readFile(file, { encoding: 'utf8' });

        // Figure out where we're writing this file.
        let baseFile = file.replace(`${resolvedSource}/`, '');
        if (rename[baseFile]) {
            baseFile = rename[baseFile];
        }

        const destFile = path.join(dest, baseFile);
        await fs.mkdir(path.dirname(destFile), { recursive: true });
        await fs.writeFile(destFile, contents);
        filesAdded.push(baseFile);
    }

    return filesAdded.sort();
}
