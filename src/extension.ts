import * as vscode from 'vscode';
import { TerminalManager } from './terminalManager';
import { getTerminalConfig, getTerminalConfigs } from './config';

let manager: TerminalManager;

export function activate(context: vscode.ExtensionContext): void {
  manager = new TerminalManager();

  context.subscriptions.push(
    vscode.commands.registerCommand('toggleterm.toggle', async (args?: { name?: string }) => {
      const name = args?.name;
      if (!name) {
        vscode.window.showErrorMessage('toggleterm.toggle requires a { "name": "..." } argument.');
        return;
      }
      const config = getTerminalConfig(name);
      if (!config) {
        vscode.window.showErrorMessage(
          `ToggleTerm: No terminal named "${name}" found in toggleterm.terminals settings.`
        );
        return;
      }
      await manager.toggle(name, config);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('toggleterm.select', async () => {
      const configs = getTerminalConfigs();
      if (configs.length === 0) {
        vscode.window.showInformationMessage(
          'No terminals configured. Add entries to "toggleterm.terminals" in settings.'
        );
        return;
      }
      const items = configs.map(c => ({
        label: c.name,
        description: c.command,
        detail: `location: ${c.location ?? 'floating'}`,
      }));
      const picked = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select a terminal to toggle',
      });
      if (picked) {
        const config = getTerminalConfig(picked.label);
        if (config) {
          await manager.toggle(picked.label, config);
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('toggleterm.killAll', () => {
      manager.killAll();
    })
  );

  context.subscriptions.push(manager);
}

export function deactivate(): void {
  manager?.dispose();
}
