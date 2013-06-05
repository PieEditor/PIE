#include <stdio.h>
#include "odt_content.h"

char c2s[2] = {0, 0};
char buffer[65536];
char * text_buffer = buffer;
struct {
	int italic;
	int bold;
	int mono;
	int sub;
	int sup;
	int title_level;
	int double_quote;
	int single_quote;
	int paragraph;
	int code;
	int list;
	int ignore_next;
	int hypertext;
	int buffering;
} state = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

inline int is_special(char c) {
	if ((c == '!') || (c == '?') || (c == ':') || (c == ';'))
		return 1;
	return 0;
}

inline char * xmlify(char c) {
	switch(c) {
		case '&' :
			return "&amp;";
		case '<' :
			return "&lt;";
		case '>' :
			return "&gt;";
		case '\t' :
			return "<text:tab/>";
		default :
			c2s[0] = c;
			return c2s;
	}
}

inline void open_paragraph(FILE * output) {
	if (state.italic)
		fputs(ITALIC_START_TAG, output);
	if (state.bold)
		fputs(BOLD_START_TAG, output);
	if (state.mono)
		fputs(MONO_START_TAG, output);
}

void process(FILE * input, FILE * output) {
	char current, next, last;
	int i;
	// Copy XML header
	fputs(HEADER, output);
	// Remove UTF-8 garbage
	while ((current = (char)fgetc(input)) != '#');
	// Processing loop
	while ((next = (char)fgetc(input)) != EOF) {
		// Ignore next character after some commands
		if (state.ignore_next) {
			state.ignore_next = 0;
			last = current;
			current = next;
			continue;
		}
		// Copy code blocks verbatim instead of interpreting Markdown
		if (state.code) {
			fputs(xmlify(current), output);
			if (next == '\n') {
				fputs(PARAGRAPH_END_TAG, output);
				state.code = 0;
			}
			last = current;
			current = next;
			continue;
		}
		// Write link content to buffer
		if (state.buffering) {
			if (current == ']') {
				state.buffering = 0;
				*text_buffer = '\0';
				text_buffer = buffer;
			} else {
				*text_buffer = current;
				text_buffer++;
			}
			last = current;
			current = next;
			continue;
		}
		// Markdown processor
		switch (current) {
		case '*' :	// Italic, bold, lists
			if (last == '\n') {
				if (next == ' ') {	// List
					if (!state.list) {
						state.list = 1;
						fputs(LIST_START_TAG, output);
						open_paragraph(output);
						state.ignore_next = 1;
					}
					fputs(ITEM_START_TAG, output);
				} else {
					state.paragraph = 1;
					fputs(PARAGRAPH_START_TAG, output);
					open_paragraph(output);
				}
			} else {
				if (next == '*') {	// Bold
					fputs(state.bold ? SPAN_END_TAG : BOLD_START_TAG, output);
					state.bold = state.bold ? 0 : 1;
					state.ignore_next = 1;
				} else {	// Italic
					fputs(state.italic ? SPAN_END_TAG : ITALIC_START_TAG, output);
					state.italic = state.italic ? 0 : 1;
				}
			}
			break;
		case '`' :	// Monotype
			fputs(state.mono ? SPAN_END_TAG : MONO_START_TAG, output);
			state.mono = state.mono ? 0 : 1;
			break;
		case '<' :	// Start of superscript or end of subscript
			fputs(state.sub ? SPAN_END_TAG : SUP_START_TAG, output);
			if (state.sub)
				state.sub = 0;
			else state.sup = 1;
			break;
		case '>' :	// Start of subscript or end of superscript
			fputs(state.sup ? SPAN_END_TAG : SUB_START_TAG, output);
			if (state.sup)
				state.sup = 0;
			else state.sub = 1;
			break;
		case '#' :	// Title
			if (state.title_level < MAX_TITLE_LEVEL)
				state.title_level += 1;
			if (next != '#') {
				fputs(TITLE_START_TAG[state.title_level - 1], output);
				//state.paragraph = 1;
			}
			break;
		case '\n' :	// Line break : new paragraph
			for (i = 0 ; i < state.mono + state.bold + state.italic + state.sub + state.sup ; i++)
				fputs(SPAN_END_TAG, output);
			if (state.title_level != 0) {
				state.title_level = 0;
				fputs(TITLE_END_TAG, output);
			} else if (state.paragraph) {
				state.paragraph = 0;
				fputs(PARAGRAPH_END_TAG, output);
			} else if (state.list) {
				fputs(ITEM_END_TAG, output);
				if (next != '*') {	// End of list
					fputs(LIST_END_TAG, output);
					state.list = 0;
				}
			}
			if ((next != '#') && (next != '\t') && (next != '*')) {
				state.paragraph = 1;
				fputs(PARAGRAPH_START_TAG, output);
				open_paragraph(output);
			}
			break;
		case ' ' :	// Space
			if (is_special(next))
				fputs(NON_BREAKING_SPACE, output);
			else fputc(' ', output);
			break;
		case '\'' :	// Single quote
			fputs(state.single_quote ? SINGLE_QUOTE_END : SINGLE_QUOTE_START, output);
			state.single_quote = state.single_quote ? 0 : 1;
			break;
		case '\"' :	// Double quote
			fputs(state.double_quote ? DOUBLE_QUOTE_END : DOUBLE_QUOTE_START, output);
			state.double_quote = state.double_quote ? 0 : 1;
			break;
		case '&' :	// Just for XML compliance
			fputs("&amp;", output);
			break;
		case '-' :	// Smart dashes
			if ((last == ' ') || (last == '\n'))
				fputs(LONG_DASH, output);
			else fputc('-', output);
			break;
		case '\\' :	// After backslash, copy next character verbatim
			fputs(xmlify(next), output);
			state.ignore_next = 1;
			break;
		case '[' :	// Hypertext
			state.buffering = 1;
			state.hypertext = 1;
			break;
		case '(' :	// End of hypertext, start of URL
			if (state.hypertext) {
				fputs(LINK_START_TAG_BEGIN, output);
			}
			else fputc('(', output);
			break;
		case ')' :	// End of URL
			if (state.hypertext) {
				fputs(LINK_START_TAG_END, output);
				fputs(text_buffer, output);
				fputs(LINK_END_TAG, output);
				state.hypertext = 0;
			}
			else fputc(')', output);
			break;
		case '\t' :
			if ((!state.paragraph) && (!state.code)) {
				fputs(CODE_START_TAG, output);
				state.code = 1;
			} else {
				fputs("<text:tab/>", output);
			}
			break;
		default:
			fputc(current, output);
			break;
		}
		if ((next == '\'') && (!((last == '\n') || (last == ' '))))
			state.single_quote = 1;
		last = current;
		current = next;
	}
	fputc(current, output);
	// Close everything
	for (i = 0 ; i < state.mono + state.bold + state.italic + state.sub + state.sup ; i++)
		fputs(SPAN_END_TAG, output);
	if (state.code || state.paragraph)
		fputs(PARAGRAPH_END_TAG, output);
	if (state.title_level > 0)
		fputs(TITLE_END_TAG, output);
	if (state.list) {
		fputs(ITEM_END_TAG, output);
		fputs(LIST_END_TAG, output);
	}
	fputs(FOOTER, output);
}

int main(int argc, char ** argv) {
	if (argc != 3) {
		puts("Usage : md2odt <input> <output>");
		return 1;
	}
	FILE * input = fopen(argv[1], "r");
	if (!input) {
		puts("Unable to open input file");
		return 2;
	}
	FILE * output = fopen(argv[2], "w");
	if (!output) {
		puts("Unable to create output file");
		fclose(input);
		return 3;
	}
	process(input, output);
	fclose(output);
	fclose(input);
	puts("Done processing");
	return 0;
}

