import * as vscode from 'vscode';

export type TerminalLocation = 'panel' | 'editor' | 'floating';

export interface TerminalConfig {
  name: string;
  command: string;
  location?: TerminalLocation;
  cwd?: string;
  env?: Record<string, string>;
  focus?: boolean;
}

export function getTerminalConfigs(): TerminalConfig[] {
  const config = vscode.workspace.getConfiguration('toggleterm');
  return config.get<TerminalConfig[]>('terminals') ?? [];
}

export function getTerminalConfig(name: string): TerminalConfig | undefined {
  return getTerminalConfigs().find(c => c.name === name);
}
