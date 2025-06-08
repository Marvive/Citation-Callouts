# Logos Callout Paste Plugin

An Obsidian plugin that detects content from Logos Bible Software and formats it as beautiful callouts when pasting.

## Features

- **Automatic Detection**: Detects when you're pasting content from Logos Bible Software by checking for `https://ref.ly/logosres` URLs
- **Smart Book Name Extraction**: Automatically extracts the book name from your citation
- **Beautiful Callouts**: Creates formatted callouts with the Logos icon and book name
- **Easy Access**: Use the command palette, ribbon icon, or keyboard shortcut

## Usage

1. Copy content from Logos Bible Software that includes a citation with a `https://ref.ly/logosres` URL
2. In Obsidian, use one of these methods:
   - **Command Palette**: Press `Ctrl/Cmd + P` and search for "Paste as Logos Callout"
   - **Ribbon Icon**: Click the book icon in the sidebar
   - **Right-click**: Use the context menu (if available)

### Example

**From Logos (copied to clipboard):**
```
"Harnack defined Christianity as ''a very simple but very sublime thing: To live in time and for eternity _under the eye of God_ and by His help.''

Leonard Ravenhill, [_Why Revival Tarries_](https://ref.ly/logosres/49dc6caf8be0e46ee4357668eca86f96?art=r20&off=43&ctx=l+Tarries%E2%80%94Because++%0a~Harnack+defined+Chri) (Grand Rapids, MI: Bethany House, 2004).
```

**Pasted as Logos Callout:**
```markdown
> [!Logos] Why Revival Tarries
> "Harnack defined Christianity as ''a very simple but very sublime thing: To live in time and for eternity _under the eye of God_ and by His help.''
> 
> Leonard Ravenhill, [_Why Revival Tarries_](https://ref.ly/logosres/49dc6caf8be0e46ee4357668eca86f96?art=r20&off=43&ctx=l+Tarries%E2%80%94Because++%0a~Harnack+defined+Chri) (Grand Rapids, MI: Bethany House, 2004).
```

## Installation

### Manual Installation

1. Download the latest release from the releases page
2. Extract the files to your vault's `.obsidian/plugins/logos-callout-paste/` directory
3. Reload Obsidian or restart the app
4. Enable the plugin in Settings → Community Plugins

### Development

1. Clone this repository into your vault's plugins folder:
   ```bash
   cd /path/to/your/vault/.obsidian/plugins/
   git clone https://github.com/yourusername/logos-callout-paste.git
   ```

2. Install dependencies:
   ```bash
   cd logos-callout-paste
   npm install
   ```

3. Build the plugin:
   ```bash
   npm run build
   ```

4. Enable the plugin in Obsidian

## Development

- `npm run dev`: Start development with file watching
- `npm run build`: Build for production

## Support

If you encounter any issues or have feature requests, please [create an issue](https://github.com/yourusername/logos-callout-paste/issues) on GitHub.

## License

MIT 