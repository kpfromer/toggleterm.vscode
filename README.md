# ToggleTerm for VS Code

A VS Code extension inspired by [toggleterm.nvim](https://github.com/akinsho/toggleterm.nvim). Define named terminals in your settings, then toggle them open and closed with a keybinding. When a terminal is closed or the process exits, your previous editor focus and cursor position are restored.

## Features

- Named terminals configured in `settings.json`
- Three layout options: panel, editor tab, or floating column beside
- Automatically restores the active editor, view column, and cursor position on close
- Supports variable substitution in working directory paths
- Quick pick menu to select any configured terminal

## Installation

### From VSIX

1. Download the `.vsix` file from the releases page.
2. Open VS Code and go to the Extensions view (`Ctrl+Shift+X`).
3. Click the `...` menu in the top-right corner of the Extensions panel and select **Install from VSIX...**, then pick the file.

Alternatively, drag and drop the `.vsix` file directly onto the Extensions panel.

### From the command line

```
code --install-extension toggleterm-vscode-0.0.1.vsix
```

## Development

### Prerequisites

- Node.js 18+
- VS Code

### Setup

```
git clone https://github.com/kylepfromer/toggleterm-vscode
cd toggleterm-vscode
npm install
```

### Running the extension

Open the project in VS Code and press `F5`. This compiles the extension and opens an **Extension Development Host** window with the extension loaded.

### Building a VSIX

```
npm run package
```

This compiles the TypeScript and produces a `.vsix` file in the project root.

## Configuration

Add terminals to your `settings.json`:

```json
"toggleterm.terminals": [
  {
    "name": "lazygit",
    "command": "lazygit",
    "location": "floating",
    "cwd": "${workspaceFolder}"
  },
  {
    "name": "htop",
    "command": "htop",
    "location": "panel"
  }
]
```

### Terminal options

| Option | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | required | Unique identifier for the terminal |
| `command` | `string` | required | Shell command to run |
| `location` | `"panel" \| "editor" \| "floating"` | `"floating"` | Where to open the terminal |
| `cwd` | `string` | — | Working directory (supports variables) |
| `env` | `object` | — | Additional environment variables |
| `focus` | `boolean` | `true` | Focus the terminal when opened |

### Location modes

- **`panel`** — opens in the bottom terminal panel. The process stays alive between toggles; hiding just collapses the panel.
- **`editor`** — opens as an editor tab in the current column. The process is killed when toggled off.
- **`floating`** — opens as an editor tab in a new column beside the current one. The process is killed when toggled off.

### Supported variables in `cwd`

`${workspaceFolder}`, `${workspaceFolderBasename}`, `${fileDirname}`, `${file}`, `${fileBasename}`, `${userHome}`

## Keybindings

The default keybinding `Ctrl+Shift+\`` opens the quick pick menu to select any configured terminal.

To bind a specific terminal directly, add an entry to your `keybindings.json`:

```json
[
  {
    "key": "ctrl+g",
    "command": "toggleterm.toggle",
    "args": { "name": "lazygit" }
  }
]
```

## Commands

| Command | Description |
|---|---|
| `ToggleTerm: Toggle Terminal` | Toggle a specific terminal (requires `args: { "name": "..." }`) |
| `ToggleTerm: Select Terminal to Toggle` | Open a quick pick to choose a terminal |
| `ToggleTerm: Kill All Terminals` | Dispose all managed terminals |

## License

MIT
