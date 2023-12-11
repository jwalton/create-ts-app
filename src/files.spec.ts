import chai from 'chai';
import 'mocha';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { recurseDir } from './files.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { expect } = chai;

describe('File Utils', function () {
    it('should recurse a directory', async function () {
        const files = await recurseDir(path.join(__dirname, '../.github'));
        expect(files).to.include(path.join(__dirname, '../.github', 'workflows/github-ci.yaml'));
    });

    it('should include .gitignore', async function () {
        const files = await recurseDir(path.join(__dirname, '../template'));
        expect(files).to.include(path.join(__dirname, '../template', '.gitignore'));
    });
});
