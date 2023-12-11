import childProcess from 'node:child_process';
import { promisify } from 'node:util';

const execFile = promisify(childProcess.execFile);

/** Initialize a git folder. */
export async function init(folder: string): Promise<void> {
    await execFile('git', ['init'], { cwd: folder });
}

/** Add a remote to the specified git folder. */
export async function addRemote(folder: string, repoOwner: string, repoName: string) {
    try {
        // If this succeeds, there's already a remote for `origin`.
        await execFile('git', ['config', 'remote.origin.url'], { cwd: folder });
    } catch {
        await execFile(
            'git',
            ['remote', 'add', 'origin', `git@github.com:${repoOwner}/${repoName}.git`],
            { cwd: folder }
        );
    }
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
