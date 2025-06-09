# Logos Callout Paste Plugin

An Obsidian plugin that automatically detects content from Logos Bible Software and formats it as beautiful callouts when pasting.

## Features

- **Automatic Detection**: Detects when you're pasting content from Logos Bible Software by checking for `https://ref.ly/logosres` URLs
- **Smart Book Name Extraction**: Automatically extracts the book name from your citation
- **Rich Text Support**: Preserves formatting including bold, italic, and hyperlinks
- **Beautiful Callouts**: Creates formatted callouts with the book icon and extracted book name
- **Multiple Access Methods**: Use command palette, ribbon icon, or keyboard shortcut

## Installation

### From Obsidian Community Plugins

1. Open Obsidian Settings
2. Go to **Community Plugins** and ensure Safe Mode is **OFF**
3. Click **Browse** and search for "Logos Callout Paste"
4. Click **Install** and then **Enable**

*This plugin is available in the official Obsidian Community Plugin directory.*

## Usage

**Important**: Make sure citations are enabled in Logos Bible Software when copying content.

1. Copy content from Logos Bible Software that includes a citation with a `https://ref.ly/logosres` URL
2. In Obsidian, use one of these methods:
   - **Command Palette**: Press `Ctrl/Cmd + P` and search for "Paste as Logos Callout"
   - **Ribbon Icon**: Click the book icon in the left sidebar
   - **Keyboard Shortcut**: Assign a custom shortcut in Settings → Hotkeys

### Example
![Logos Plugin Example](./assets/Demo.png)

**From Logos (copied to clipboard):**
```
The fuel of worship is a true vision of the greatness of God; the fire that makes the fuel burn white hot is the quickening of the Holy Spirit; the furnace made alive and warm by the flame of truth is our renewed spirit; and the resulting heat of our affections is powerful worship, pushing its way out in confessions, longings, acclamations, tears, songs, shouts, bowed heads, lifted hands, and obedient lives.

John Piper, [_Desiring God_](https://ref.ly/logosres/desiringgod?ref=Page.p+82&off=1501&ctx=mplete+our+picture.+~The+fuel+of+worship+) (Sisters, OR: Multnomah Publishers, 2003), 82.
```

**Pasted as Logos Callout:**
```markdown
> [!Logos] Desiring God
> The fuel of worship is a true vision of the greatness of God; the fire that makes the fuel burn white hot is the quickening of the Holy Spirit; the furnace made alive and warm by the flame of truth is our renewed spirit; and the resulting heat of our affections is powerful worship, pushing its way out in confessions, longings, acclamations, tears, songs, shouts, bowed heads, lifted hands, and obedient lives.
> 
> John Piper, [_Desiring God_](https://ref.ly/logosres/desiringgod?ref=Page.p+82&off=1501&ctx=mplete+our+picture.+~The+fuel+of+worship+) (Sisters, OR: Multnomah Publishers, 2003), 82.
```

## Requirements

- Obsidian v0.15.0 or higher
- Content copied from Logos Bible Software must include citations (enable in Logos settings)

## Development

### Setup

1. Clone this repository into your vault's plugins folder:
   ```bash
   cd /path/to/your/vault/.obsidian/plugins/
   git clone https://github.com/Marvive/logos-callout-paste.git
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

### Scripts

- `npm run dev`: Start development with file watching
- `npm run build`: Build for production
- `npm run version`: Bump version and update files

## Support

If you encounter any issues or have feature requests, please [create an issue](https://github.com/Marvive/logos-callout-paste/issues) on GitHub.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

**Michael Marvive** - [GitHub Profile](https://github.com/Marvive)

## License

MIT License

---

*This plugin is designed to work with Logos Bible Software and requires content to be copied with citations enabled.* 