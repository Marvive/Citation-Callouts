import { Plugin, Editor, MarkdownView, Notice, htmlToMarkdown } from 'obsidian';

export default class CitationCalloutPastePlugin extends Plugin {
	async onload() {

		// Add command for special Citation paste
		this.addCommand({
			id: 'paste-citation-callout',
			name: 'Paste as Citation Callout',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.pasteAsCitationCallout(editor);
			},
		});

		// Add ribbon icon
		this.addRibbonIcon('book', 'Paste as Citation Callout', (evt: MouseEvent) => {
			const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (activeView) {
				this.pasteAsCitationCallout(activeView.editor);
			}
		});
	}

	async pasteAsCitationCallout(editor: Editor) {
		try {
			// Try to get rich text first, fallback to plain text
			let clipboardContent = '';
			let hasRichText = false;
			
			try {
				// Try to access HTML content from clipboard
				const clipboardItems = await navigator.clipboard.read();
				for (const clipboardItem of clipboardItems) {
					if (clipboardItem.types.includes('text/html')) {
						const htmlBlob = await clipboardItem.getType('text/html');
						const htmlText = await htmlBlob.text();
						clipboardContent = htmlToMarkdown(htmlText);
						hasRichText = true;
						break;
					}
				}
			} catch (e) {
				// Rich text access failed, will use plain text
			}
			
			// Fallback to plain text if no rich text
			if (!hasRichText) {
				clipboardContent = await navigator.clipboard.readText();
			}
			
			// Check if clipboard has content
			if (!clipboardContent || clipboardContent.trim() === '') {
				new Notice('Clipboard is empty');
				return;
			}

			// Extract book name and format as callout
			const bookName = this.extractBookName(clipboardContent);
			const formattedContent = this.formatAsCitationCallout(clipboardContent, bookName);
			
			// Insert formatted content
			editor.replaceSelection(formattedContent);
			new Notice(`Content pasted as Citation callout: ${bookName}`);
			
		} catch (error) {
			console.error('Error pasting Citation content:', error);
			new Notice('Error accessing clipboard or formatting content');
		}
	}

	extractBookName(text: string): string {
		// FIRST: Look for book titles in markdown links [BookName](url) - highest priority
		const linkMatch = text.match(/\[([^\]]+)\]\([^)]*ref\.ly[^)]*\)/);
		if (linkMatch) {
			// Remove underscores and clean up
			return linkMatch[1].replace(/_/g, '').trim();
		}

		// Look for text in square brackets or italics that appears to be a book title
		// Pattern: [_BookName_] or *BookName*
		const italicMatch = text.match(/\[_([^_]+)_\]/);
		if (italicMatch) {
			return italicMatch[1];
		}

		// Pattern for author citations: "Author Name, Book Title (Publication info)"
		// More specific: look for the last line that contains author and book info
		const lines = text.split('\n');
		for (let i = lines.length - 1; i >= 0; i--) {
			const line = lines[i].trim();
			// Look for pattern: "Author, Book Title (Location: Publisher, Year)"
			const authorBookMatch = line.match(/^([^,]+),\s+([^(]+)\s+\(/);
			if (authorBookMatch) {
				return authorBookMatch[2].trim();
			}
		}

		// Alternative citation pattern: look for italicized book titles
		const italicBookMatch = text.match(/,\s+([^,]+?)\s+\(/);
		if (italicBookMatch) {
			const bookTitle = italicBookMatch[1].trim();
			// Make sure it's not just a person's name (should be longer than 2 words usually)
			if (bookTitle.split(' ').length > 1) {
				return bookTitle;
			}
		}

		// Fallback: try to extract from URL or use generic name
		const urlMatch = text.match(/https:\/\/ref\.ly\/logosres\/[^?]+/);
		if (urlMatch) {
			// Extract any readable text near the URL
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

	formatAsCitationCallout(content: string, bookName: string): string {
		// Split content into lines and process
		const lines = content.split('\n');
		const calloutLines = [`> [!Citation] ${bookName}`];
		
		// Add each line of original content with proper callout formatting
		for (const line of lines) {
			if (line.trim() === '') {
				calloutLines.push('>');
			} else {
				calloutLines.push(`> ${line}`);
			}
		}
		
		// Ensure there's a blank line after the title
		if (calloutLines.length > 1 && calloutLines[1] !== '>') {
			calloutLines.splice(1, 0, '>');
		}
		
		return calloutLines.join('\n');
	}

	onunload() {
		// Plugin cleanup
	}
} 