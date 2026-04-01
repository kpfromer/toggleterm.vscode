import * as vscode from 'vscode';
import { TerminalConfig } from './config';
import { UIState, captureState, restoreState } from './stateManager';
import { resolveVariables } from './variables';

interface ManagedTerminal {
  terminal: vscode.Terminal;
  config: TerminalConfig;
  savedState: UIState;
  isOpen: boolean;
}

function resolveLocation(location: TerminalConfig['location']): vscode.TerminalEditorLocationOptions | vscode.TerminalSplitLocationOptions | { viewColumn: vscode.ViewColumn } | undefined {
  switch (location ?? 'floating') {
    case 'panel':
      return undefined;
    case 'editor':
      return { viewColumn: vscode.ViewColumn.Active };
    case 'floating':
      return { viewColumn: vscode.ViewColumn.Beside };
  }
}

export class TerminalManager {
  private terminals = new Map<string, ManagedTerminal>();
  private disposables: vscode.Disposable[] = [];

  constructor() {
    this.disposables.push(
      vscode.window.onDidCloseTerminal(terminal => this.onTerminalClosed(terminal))
    );
  }

  async toggle(name: string, config: TerminalConfig): Promise<void> {
    const managed = this.terminals.get(name);

    if (!managed) {
      await this.openTerminal(config);
    } else if (managed.isOpen) {
      await this.closeTerminal(managed);
    } else {
      // panel terminals can be re-shown; editor/floating were disposed
      this.showTerminal(managed);
    }
  }

  private async openTerminal(config: TerminalConfig): Promise<void> {
    const savedState = captureState();
    const location = config.location ?? 'floating';
    const resolvedCwd = config.cwd ? resolveVariables(config.cwd) : undefined;

    const terminalOptions: vscode.TerminalOptions = {
      name: config.name,
      shellPath: vscode.env.shell,
      shellArgs: ['-c', config.command],
      cwd: resolvedCwd,
      env: config.env,
      location: resolveLocation(location),
    };

    const terminal = vscode.window.createTerminal(terminalOptions);

    const managed: ManagedTerminal = {
      terminal,
      config,
      savedState,
      isOpen: true,
    };

    this.terminals.set(config.name, managed);
    terminal.show(!(config.focus ?? true));
  }

  private async closeTerminal(managed: ManagedTerminal): Promise<void> {
    const location = managed.config.location ?? 'floating';

    if (location === 'panel') {
      managed.terminal.hide();
      managed.isOpen = false;
      await restoreState(managed.savedState);
    } else {
      // editor / floating: dispose kills the process and closes the tab
      managed.terminal.dispose();
      // removal from Map happens in onTerminalClosed
      await restoreState(managed.savedState);
    }
  }

  private showTerminal(managed: ManagedTerminal): void {
    // Only panel terminals stay in Map with isOpen=false
    managed.terminal.show(false);
    managed.isOpen = true;
  }

  private async onTerminalClosed(terminal: vscode.Terminal): Promise<void> {
    for (const [name, managed] of this.terminals) {
      if (managed.terminal === terminal) {
        await restoreState(managed.savedState);
        this.terminals.delete(name);
        break;
      }
    }
  }

  killAll(): void {
    for (const managed of this.terminals.values()) {
      managed.terminal.dispose();
    }
    this.terminals.clear();
  }

  dispose(): void {
    this.killAll();
    for (const d of this.disposables) {
      d.dispose();
    }
    this.disposables = [];
  }
}
