import { Plugin, Editor, MarkdownView, Notice } from 'obsidian';

export default class LogosCalloutPastePlugin extends Plugin {
	async onload() {
		console.log('Loading Logos Callout Paste plugin');

		// Add command for special Logos paste
		this.addCommand({
			id: 'paste-logos-callout',
			name: 'Paste as Logos Callout',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.pasteAsLogosCallout(editor);
			},
		});

		// Add ribbon icon
		this.addRibbonIcon('book', 'Paste as Logos Callout', (evt: MouseEvent) => {
			const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (activeView) {
				this.pasteAsLogosCallout(activeView.editor);
			}
		});
	}

	async pasteAsLogosCallout(editor: Editor) {
		try {
			// Get clipboard content
			const clipboardText = await navigator.clipboard.readText();
			
			// Check if clipboard has content
			if (!clipboardText || clipboardText.trim() === '') {
				new Notice('Clipboard is empty');
				return;
			}

			// Extract book name and format as callout
			const bookName = this.extractBookName(clipboardText);
			const formattedContent = this.formatAsLogosCallout(clipboardText, bookName);
			
			// Insert formatted content
			editor.replaceSelection(formattedContent);
			new Notice('Content pasted as Logos callout');
			
		} catch (error) {
			console.error('Error pasting Logos content:', error);
			new Notice('Error accessing clipboard or formatting content');
		}
	}

	extractBookName(text: string): string {
		// Look for text in square brackets or italics that appears to be a book title
		// Pattern: [_BookName_] or *BookName*
		const italicMatch = text.match(/\[_([^_]+)_\]/);
		if (italicMatch) {
			return italicMatch[1];
		}

		// Alternative pattern: *BookName* 
		const asteriskMatch = text.match(/\*([^*]+)\*/);
		if (asteriskMatch) {
			return asteriskMatch[1];
		}

		// Fallback: try to extract from URL or use generic name
		const urlMatch = text.match(/https:\/\/ref\.ly\/logosres\/[^?]+/);
		if (urlMatch) {
			// Extract any readable text near the URL
			const lines = text.split('\n');
			for (const line of lines) {
				if (line.includes('https://ref.ly/logosres')) {
					// Look for title-like text in the same line
					const titleMatch = line.match(/\[_([^_]+)_\]/);
					if (titleMatch) {
						return titleMatch[1];
					}
				}
			}
		}

		return 'Logos Resource';
	}

	formatAsLogosCallout(content: string, bookName: string): string {
		// Split content into lines and process
		const lines = content.split('\n');
		const calloutLines = [`> [!Logos] ${bookName}`];
		
		// Add each line of original content with proper callout formatting
		for (const line of lines) {
			if (line.trim() === '') {
				calloutLines.push('>');
			} else {
				calloutLines.push(`> ${line}`);
			}
		}
		
		return calloutLines.join('\n');
	}

	onunload() {
		console.log('Unloading Logos Callout Paste plugin');
	}
} 