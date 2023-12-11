#!/usr/bin/env node

import inquirer from 'inquirer';
import askNpmName from 'inquirer-npm-name';
import _ from 'lodash';
import fs from 'node:fs/promises';
import path from 'node:path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { fileURLToPath } from 'node:url';

import * as git from './git.js';
import { generatePackageJson, installDeps } from './npm.js';
import { copyTemplateFiles } from './templateFiles.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEPENDENCIES = ['@swc/helpers'];

const DEV_DEPENDENCIES = [
    '@swc/cli',
    '@swc/core',
    '@types/chai',
    '@types/express',
    '@types/mocha',
    '@types/node',
    '@types/sinon',
    '@typescript-eslint/eslint-plugin',
    'chai',
    'eslint-config-prettier',
    'eslint-plugin-import',
    'husky',
    'lint-staged',
    'mocha',
    'nyc',
    'prettier',
    'sinon',
    'ts-node',
    'typescript',
    'typescript-eslint',
];

async function parseOptions() {
    const options = await yargs(hideBin(process.argv))
        .strict()
        .usage(
            `
            Usage: $0 [project]

            Initialize a new typescript project.
          `
        )
        .demand(0)
        .help('h')
        .alias('h', 'help')
        .parseAsync();

    const project = options._.map(String);
    if (project.length > 1) {
        throw new Error('Only one project name can be specified');
    }
    return { project: project[0] || undefined };
}

async function main() {
    const options = await parseOptions();

    const defaultProjectName = path.basename(process.cwd());

    const { npmName } = await askNpmName(
        {
            name: 'npmName',
            message: 'Your project npm name',
            default: options.project ?? _.kebabCase(defaultProjectName),
        },
        inquirer
    );

    const { repoOwner, repoName, description, keywords, authorName, authorEmail, authorUrl } =
        await inquirer.prompt([
            {
                type: 'input',
                name: 'repoOwner',
                message: 'Github user name/org name',
            },
            {
                type: 'input',
                name: 'repoName',
                message: 'Github project name',
                default: npmName,
            },
            {
                name: 'description',
                message: 'Project description',
            },
            {
                name: 'keywords',
                message: 'Package keywords (comma to split)',
                filter(words: string) {
                    return words ? words.split(/\s*,\s*/g) : undefined;
                },
            },
            {
                type: 'input',
                name: 'authorName',
                message: "Author's name",
                default: await git.getUserName(),
            },
            {
                type: 'input',
                name: 'authorEmail',
                message: "Author's email address",
                default: await git.getUserEmail(),
            },
            {
                name: 'authorUrl',
                message: "Author's Homepage",
            },
        ]);

    let cwd = process.cwd();
    if (defaultProjectName !== npmName) {
        cwd = path.join(process.cwd(), npmName);
        await fs.mkdir(cwd, { recursive: true });
    }
    process.chdir(cwd);

    console.log('Initializing git...');
    await git.init(cwd);
    if (repoOwner && repoName) {
        await git.addRemote(cwd, repoOwner, repoName);
    }

    // Write package.json
    console.log('Writing package.json...');
    const packageJson = generatePackageJson({
        name: npmName,
        description,
        keywords,
        repoOwner,
        repoName,
        author: {
            name: authorName,
            email: authorEmail,
            url: authorUrl,
        },
    });
    await fs.writeFile('package.json', JSON.stringify(packageJson, null, 4));

    // Copy template files
    console.log('Copying template files...');
    const templates = await copyTemplateFiles(
        path.join(__dirname, '..', 'template'),
        process.cwd(),
        {
            rename: { gitignore: '.gitignore' },
        }
    );
    console.log(`Wrote template files:\n${templates.map((t) => `  ${t}`).join('\n')}`);

    // Install dependencies.
    console.log(`Installing ${DEPENDENCIES.join(', ')}`);
    await installDeps(DEPENDENCIES);
    console.log(`Installing dev dependencies ${DEV_DEPENDENCIES.join(', ')}`);
    await installDeps(DEV_DEPENDENCIES, { dev: true });
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
