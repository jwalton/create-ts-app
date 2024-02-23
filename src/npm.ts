import childProcess from 'node:child_process';
import { promisify } from 'node:util';

const execFile = promisify(childProcess.execFile);

export function generatePackageJson(params: {
    name: string;
    description: string;
    keywords?: string[];
    repoOwner: string;
    repoName: string;
    author: {
        name: string;
        email: string;
        url?: string;
    };
}): unknown {
    const packageJson: any = {
        name: params.name,
        description: params.description,
        keywords: params.keywords,
        version: '1.0.0',
        author: params.author,
        license: 'MIT',
        sideEffects: false,
        main: './dist/index.js',
        type: 'module',
        files: ['dist/**/*'],
        scripts: {
            start: 'npm run build && node dist/index.js',
            test: 'npm run build && npm run lint && npm run test:unittest',
            build: "swc ./src -d dist --ignore '**/*'",
            clean: 'rm -rf dist types coverage',
            'test:unittest': "nyc mocha 'src/**/*.spec.@(ts|tsx|js|jsx)'",
            lint: 'npm run lint:source && npm run lint:types',
            'lint:source': 'eslint --ext .ts --ext .tsx src',
            'lint:types': 'tsc --noEmit && tsc -p tsconfig.test.json --noEmit',
            prepare: 'husky || true && npm run build',
            prepublishOnly: 'npm run build && npm test',
            'semantic-release': 'semantic-release',
        },
        'lint-staged': {
            '**/*.@(ts|tsx)}': ['prettier --write', 'eslint --ext ts --ext tsx'],
            '**/*.@(js|cjs|mjs|jsx)}': ['prettier --write'],
        },
    };

    if (params.repoOwner && params.repoName) {
        const repo = `${params.repoOwner}/${params.repoName}`;
        packageJson.repository = {
            type: 'git',
            url: `git+https://github.com/${repo}.git`,
        };
        packageJson.bugs = {
            url: `https://github.com/exegesis-js/${repo}/issues`,
        };
        packageJson.homepage = `https://github.com/${repo}#readme`;
    }

    return packageJson;
}

export async function installDeps(dependencies: string[], options: { dev?: boolean } = {}) {
    const args = ['install'];
    if (options.dev) {
        args.push('--save-dev');
    }

    await execFile('npm', [...args, ...dependencies]);
}
