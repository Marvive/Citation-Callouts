import { Plugin, Editor, MarkdownView, Notice } from 'obsidian';

export default class LogosCalloutPastePlugin extends Plugin {
	async onload() {

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
						clipboardContent = this.convertHtmlToMarkdown(htmlText);
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
			const formattedContent = this.formatAsLogosCallout(clipboardContent, bookName);
			
			// Insert formatted content
			editor.replaceSelection(formattedContent);
			new Notice(`Content pasted as Logos callout: ${bookName}`);
			
		} catch (error) {
			console.error('Error pasting Logos content:', error);
			new Notice('Error accessing clipboard or formatting content');
		}
	}

	convertHtmlToMarkdown(html: string): string {
		// Simple HTML to Markdown conversion for common elements
		let markdown = html;
		
		// Convert line breaks and paragraphs first to preserve structure
		markdown = markdown.replace(/<br\s*\/?>/gi, '\n');
		markdown = markdown.replace(/<\/p>/gi, '\n\n');
		markdown = markdown.replace(/<p[^>]*>/gi, '');
		
		// Convert links: <a href="url">text</a> to [text](url)
		// Handle nested tags inside links (like <i> tags inside <a> tags)
		markdown = markdown.replace(/<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, (match, url, content) => {
			// Clean up any nested HTML tags in the link content
			const cleanContent = content.replace(/<[^>]+>/g, '');
			return `[${cleanContent}](${url})`;
		});
		
		// Handle nested bold/italic combinations first
		// Pattern: <strong><em>text</em></strong> or <b><i>text</i></b> -> ***text***
		markdown = markdown.replace(/<(?:strong|b)[^>]*><(?:em|i)[^>]*>([^<]*)<\/(?:em|i)><\/(?:strong|b)>/gi, '***$1***');
		markdown = markdown.replace(/<(?:em|i)[^>]*><(?:strong|b)[^>]*>([^<]*)<\/(?:strong|b)><\/(?:em|i)>/gi, '***$1***');
		
		// Convert remaining emphasis: <em> or <i> to *text*
		markdown = markdown.replace(/<(?:em|i)[^>]*>([^<]*)<\/(?:em|i)>/gi, '*$1*');
		
		// Convert remaining strong: <strong> or <b> to **text**
		markdown = markdown.replace(/<(?:strong|b)[^>]*>([^<]*)<\/(?:strong|b)>/gi, '**$1**');
		
		// Convert divs to line breaks
		markdown = markdown.replace(/<div[^>]*>/gi, '\n');
		markdown = markdown.replace(/<\/div>/gi, '');
		
		// Remove other HTML tags
		markdown = markdown.replace(/<[^>]+>/g, '');
		
		// Decode common HTML entities
		markdown = markdown.replace(/&amp;/g, '&');
		markdown = markdown.replace(/&lt;/g, '<');
		markdown = markdown.replace(/&gt;/g, '>');
		markdown = markdown.replace(/&quot;/g, '"');
		markdown = markdown.replace(/&#39;/g, "'");
		markdown = markdown.replace(/&nbsp;/g, ' ');
		
		// Clean up multiple line breaks
		markdown = markdown.replace(/\n{3,}/g, '\n\n');
		
		// Clean up excessive asterisks (more than 3 in a row)
		markdown = markdown.replace(/\*{4,}/g, '***');
		
		return markdown.trim();
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