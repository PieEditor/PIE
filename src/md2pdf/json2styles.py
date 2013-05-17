from sys import argv, exit
from json import loads

xml_header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
office_header = "<office:document-styles \
xmlns:office=\"urn:oasis:names:tc:opendocument:xmlns:office:1.0\" \
xmlns:style=\"urn:oasis:names:tc:opendocument:xmlns:style:1.0\" \
xmlns:text=\"urn:oasis:names:tc:opendocument:xmlns:text:1.0\" \
xmlns:fo=\"urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0\" \
xmlns:svg=\"urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0\" office:version=\"1.2\" \
office:mimetype=\"application/vnd.oasis.opendocument.text\">"
fonts = "<office:font-face-decls>\
<style:font-face style:name=\"Main\" svg:font-family=\"&apos;{0}&apos;\"/>\
<style:font-face style:name=\"Mono\" svg:font-family=\"&apos;{1}&apos;\"/>\
</office:font-face-decls>" # main font, code font
title = "<style:style style:name=\"title{0}\" style:family=\"paragraph\" style:display-name=\"Title {0}\">\
<style:paragraph-properties fo:text-align=\"left\"/>\
<style:text-properties style:font-name=\"Main\" fo:font-size=\"{1}\" fo:language=\"fr\" {2}/>\
</style:style>" # i, font size, font-decoration(fo:font-weight="bold" | fo:text-style="italic")
text = "<style:style style:name=\"text\" style:display-name=\"Text\" style:family=\"paragraph\">\
<style:paragraph-properties fo:text-align=\"justify\" fo:text-indent=\"0.2in\" fo:orphans=\"2\" fo:widows=\"2\"/>\
<style:text-properties style:font-name=\"Main\" fo:font-size=\"{0}\" fo:language=\"fr\"/>\
</style:style>\
<style:style style:name=\"code\" style:display-name=\"Code\" style:family=\"paragraph\">\
<style:paragraph-properties fo:text-align=\"left\" fo:text-indent=\"0in\" fo:orphans=\"2\" fo:widows=\"2\"/>\
<style:text-properties style:font-name=\"Mono\" fo:font-size=\"{1}\" fo:language=\"fr\"/>\
</style:style>\
<style:style style:name=\"Footer\" style:family=\"paragraph\" style:class=\"extra\">\
<style:paragraph-properties fo:text-align=\"center\"/>\
<style:text-properties style:font-name=\"Main\" fo:font-size=\"{0}\"/>\
</style:style>" # main font size, code font size
default = "<style:style style:name=\"italic\" style:family=\"text\">\
<style:text-properties fo:font-style=\"italic\"/>\
</style:style>\
<style:style style:name=\"bold\" style:family=\"text\">\
<style:text-properties fo:font-weight=\"bold\"/>\
</style:style>\
<style:style style:name=\"mono\" style:family=\"text\">\
<style:text-properties style:font-name=\"Mono\"/>\
</style:style>\
<style:style style:name=\"smallcaps\" style:family=\"text\">\
<style:text-properties fo:font-variant=\"small-caps\"/>\
</style:style>\
<style:style style:name=\"sup\" style:family=\"text\">\
<style:text-properties style:text-position=\"super 58%\"/>\
</style:style>\
<style:style style:name=\"sub\" style:family=\"text\">\
<style:text-properties style:text-position=\"sub 58%\"/>\
</style:style>"
auto = "<office:automatic-styles>\
<style:page-layout style:name=\"page\">\
<style:page-layout-properties fo:page-width=\"{0}\" fo:page-height=\"{1}\" style:num-format=\"1\" style:print-orientation=\"portrait\" fo:margin-top=\"{2}\" fo:margin-bottom=\"{3}\" fo:margin-left=\"{4}\" fo:margin-right=\"{5}\" style:writing-mode=\"lr-tb\" style:footnote-max-height=\"0cm\"/>\
<style:footer-style>\
<style:header-footer-properties fo:min-height=\"0.15in\" fo:margin-left=\"0in\" fo:margin-right=\"0in\" fo:margin-top=\"0.1in\" style:dynamic-spacing=\"false\"/>\
</style:footer-style>\
</style:page-layout>\
</office:automatic-styles>" # width, height, top, bottom, left, right
master = "<office:master-styles>\
<style:master-page style:name=\"Standard\" style:page-layout-name=\"page\">\
<style:footer>\
<text:p text:style-name=\"Footer\">- <text:span text:style-name=\"text\"><text:page-number text:select-page=\"current\"/></text:span> -</text:p>\
</style:footer>\
</style:master-page>\
</office:master-styles>\
</office:document-styles>\n"

def textDecoration(dic):
	res = ""
	if (dic["bold"]):
		res += "fo:font-weight=\"bold\" "
	if (dic["italic"]):
		res += "fo:font-style=\"italic\""
	return res

def process(jsonfile, xmlfile):
	f = open(jsonfile, "r")
	settings = loads(f.read())
	f.close()
	f = open(xmlfile, "w")
	f.write(xml_header)
	f.write(office_header)
	f.write(fonts.format(
		settings["mainFont"]["fontFamily"],
		settings["codeFont"]["fontFamily"]))
	f.write("<office:styles>")
	for i in range(6):
		f.write(title.format(
			i + 1,
			settings["titles"][i]["size"],
			textDecoration(settings["titles"][i])))
	f.write(text.format(
		settings["mainFont"]["fontSize"],
		settings["codeFont"]["fontSize"]))
	f.write(default)
	f.write("</office:styles>")
	f.write(auto.format(
		settings["pageSize"]["width"],
		settings["pageSize"]["height"],
		settings["margins"]["top"],
		settings["margins"]["bottom"],
		settings["margins"]["left"],
		settings["margins"]["right"]))
	f.write(master)
	f.close()

