import { expect } from 'chai';
import 'mocha';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { recurseDir } from './files.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('File Utils', function () {
    it('should recurse a directory', async function () {
        const files = await recurseDir(path.join(__dirname, '../.github'));
        expect(files).to.include(path.join(__dirname, '../.github', 'workflows/github-ci.yaml'));
    });
});
