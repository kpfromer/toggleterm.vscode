import * as vscode from 'vscode';

export interface UIState {
  activeEditorUri?: vscode.Uri;
  viewColumn?: vscode.ViewColumn;
  selection?: vscode.Selection;
}

export function captureState(): UIState {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return {};
  }
  return {
    activeEditorUri: editor.document.uri,
    viewColumn: editor.viewColumn,
    selection: editor.selection,
  };
}

export async function restoreState(state: UIState): Promise<void> {
  if (state.activeEditorUri) {
    try {
      const doc = await vscode.workspace.openTextDocument(state.activeEditorUri);
      const editor = await vscode.window.showTextDocument(doc, {
        viewColumn: state.viewColumn,
        preserveFocus: false,
      });
      if (state.selection) {
        editor.selection = state.selection;
        editor.revealRange(state.selection, vscode.TextEditorRevealType.InCenterIfOutsideViewport);
      }
    } catch {
      await vscode.commands.executeCommand('workbench.action.focusFirstEditorGroup');
    }
  } else {
    await vscode.commands.executeCommand('workbench.action.focusFirstEditorGroup');
  }
}
