import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';

export function resolveVariables(value: string): string {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  const workspaceFolder = workspaceFolders?.[0]?.uri.fsPath ?? '';
  const workspaceFolderBasename = workspaceFolder ? path.basename(workspaceFolder) : '';
  const activeEditor = vscode.window.activeTextEditor;
  const file = activeEditor?.document.uri.fsPath ?? '';
  const fileDirname = file ? path.dirname(file) : workspaceFolder;
  const fileBasename = file ? path.basename(file) : '';
  const userHome = os.homedir();

  return value
    .replace(/\$\{workspaceFolder\}/g, workspaceFolder)
    .replace(/\$\{workspaceFolderBasename\}/g, workspaceFolderBasename)
    .replace(/\$\{fileDirname\}/g, fileDirname)
    .replace(/\$\{file\}/g, file)
    .replace(/\$\{fileBasename\}/g, fileBasename)
    .replace(/\$\{userHome\}/g, userHome);
}
