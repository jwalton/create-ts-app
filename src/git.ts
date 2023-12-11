import childProcess from 'node:child_process';
import { promisify } from 'node:util';

const execFile = promisify(childProcess.execFile);

export async function init(): Promise<void> {
    await execFile('git', ['init']);
}

export async function addRemote(githubOwner: string, githubName: string) {
    await execFile('git', [
        'remote',
        'add',
        'origin',
        `git@github.com:${githubOwner}/${githubName}.git`,
    ]);
}

export async function getUserName(): Promise<string | undefined> {
    try {
        const { stdout } = await execFile('git', ['config', 'user.name']);
        return stdout.trim();
    } catch {
        return undefined;
    }
}

export async function getUserEmail(): Promise<string | undefined> {
    try {
        const { stdout } = await execFile('git', ['config', 'user.email']);
        return stdout.trim();
    } catch {
        return undefined;
    }
}
