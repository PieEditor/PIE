#include <stdio.h>
#include "odt_content.h"

int fputc_unlocked(int c, FILE *stream);
int fputs_unlocked(const char *s, FILE *stream);
int fgetc_unlocked(FILE *stream);

char c2s[2] = {0, 0};
char buffer[65536];
char * text_buffer = buffer;

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

void process(FILE * input, FILE * output) {
	struct {
		int italic;
		int bold;
		int mono;
		int smallcaps;
		int sub;
		int sup;
		int title_level;
		int double_quote;
		int single_quote;
		int paragraph;
		int code;
		int ignore_next;
		int hypertext;
		int buffering;
	} state = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
	char current, next, last;
	int i;
	// Copy XML header
	fputs_unlocked(HEADER, output);
	// Remove UTF-8 garbage
	while ((current = (char)fgetc_unlocked(input)) != '#');
	// Processing loop
	while ((next = (char)fgetc_unlocked(input)) != EOF) {
	// Ignore next character after some commands
		if (state.ignore_next) {
			state.ignore_next = 0;
			last = current;
			current = next;
			continue;
		}
		// Copy code blocks verbatim instead of interpreting Markdown
		if (state.code) {
			if (current == '~')
				state.code = 0;
			else if (current == '\n') {
				fputs_unlocked(PARAGRAPH_END_TAG, output);
				fputs_unlocked(CODE_START_TAG, output);
			}
			else
				fputs_unlocked(xmlify(current), output);
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
		case '*' :	// Italic & bold
			if (next == '*') {
				fputs_unlocked(state.bold ? SPAN_END_TAG : BOLD_START_TAG, output);
				state.bold = state.bold ? 0 : 1;
				state.ignore_next = 1;
			} else {
				fputs_unlocked(state.italic ? SPAN_END_TAG : ITALIC_START_TAG, output);
				state.italic = state.italic ? 0 : 1;
			}
			break;
		case '|' :	// Monotype
			fputs_unlocked(state.mono ? SPAN_END_TAG : MONO_START_TAG, output);
			state.mono = state.mono ? 0 : 1;
			break;
		case '+' :	// Small caps
			fputs_unlocked(state.smallcaps ? SPAN_END_TAG : SCAPS_START_TAG, output);
			state.smallcaps = state.smallcaps ? 0 : 1;
			break;
		case '<' :	// Start of superscript or end of subscript
			fputs_unlocked(state.sub ? SPAN_END_TAG : SUP_START_TAG, output);
			if (state.sub)
				state.sub = 0;
			else state.sup = 1;
			break;
		case '>' :	// Start of subscript or end of superscript
			fputs_unlocked(state.sup ? SPAN_END_TAG : SUB_START_TAG, output);
			if (state.sup)
				state.sup = 0;
			else state.sub = 1;
			break;
		case '#' :	// Title
			if (state.title_level < MAX_TITLE_LEVEL)
				state.title_level += 1;
			if (next != '#') {
				fputs_unlocked(TITLE_START_TAG[state.title_level - 1], output);
				state.paragraph = 1;
			}
			break;
		case '~' :	// Code block
			if (!state.paragraph) {
				fputs_unlocked(CODE_START_TAG, output);
				state.paragraph = 1;
				state.code = 1;
			}
			break;
		case '\n' :	// Line break : new paragraph
			for (i = 0 ; i < state.mono + state.bold + state.italic + state.smallcaps ; i++)
				fputs_unlocked(SPAN_END_TAG, output);
			if (state.title_level == 0)
				fputs_unlocked(PARAGRAPH_END_TAG, output);
			else fputs_unlocked(TITLE_END_TAG, output);
			state.paragraph = 0;
			state.title_level = 0;
			if ((next != '#') && (next != '~')) {
				fputs_unlocked(state.code ? CODE_START_TAG : PARAGRAPH_START_TAG, output);
				state.paragraph = 1;
				if (state.italic)
					fputs_unlocked(ITALIC_START_TAG, output);
				if (state.bold)
					fputs_unlocked(BOLD_START_TAG, output);
				if (state.mono)
					fputs_unlocked(MONO_START_TAG, output);
				if (state.smallcaps)
					fputs_unlocked(SCAPS_START_TAG, output);
			}
			break;
		case ' ' :	// Space
			if (is_special(next))
				fputs_unlocked(NON_BREAKING_SPACE, output);
			else fputc_unlocked(' ', output);
			break;
		case '\'' :	// Single quote
			fputs_unlocked(state.single_quote ? SINGLE_QUOTE_END : SINGLE_QUOTE_START, output);
			state.single_quote = state.single_quote ? 0 : 1;
			break;
		case '\"' :	// Double quote
			fputs_unlocked(state.double_quote ? DOUBLE_QUOTE_END : DOUBLE_QUOTE_START, output);
			state.double_quote = state.double_quote ? 0 : 1;
			break;
		case '&' :	// Just for XML compliance
			fputs_unlocked("&amp;", output);
			break;
		case '-' :	// Smart dashes
			if (last == ' ')
				fputs_unlocked(LONG_DASH, output);
			else if (last == '\n') {
				fputs_unlocked(LONG_DASH, output);
				fputs_unlocked(EN_SPACE, output);
				state.ignore_next = 1;
			}
			else fputc_unlocked('-', output);
			break;
		case '\\' :	// After backslash, copy next character verbatim
			fputs_unlocked(xmlify(next), output);
			state.ignore_next = 1;
			break;
		case '[' :	// Hypertext
			state.buffering = 1;
			state.hypertext = 1;
			break;
		case '(' :	// End of hypertext, start of URL
			if (state.hypertext) {
				fputs_unlocked(LINK_START_TAG_BEGIN, output);
			}
			else fputc_unlocked('(', output);
			break;
		case ')' :	// End of URL
			if (state.hypertext) {
				fputs_unlocked(LINK_START_TAG_END, output);
				fputs_unlocked(text_buffer, output);
				fputs_unlocked(LINK_END_TAG, output);
				state.hypertext = 0;
			}
			else fputc_unlocked(')', output);
			break;
		default:
			fputc_unlocked(current, output);
			break;
		}
		if ((next == '\'') && (!((last == '\n') || (last == ' '))))
			state.single_quote = 1;
		last = current;
		current = next;
	}
	fputc_unlocked(current, output);
	if (state.paragraph)
		fputs_unlocked(PARAGRAPH_END_TAG, output);
	fputs_unlocked(FOOTER, output);
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

