#!/usr/bin/python

from sys import argv, exit
from os import system
from zipfile import ZipFile
from json2styles import process

if (not(len(argv) == 4)):
	exit(1)

mdfile = argv[1]
jsonfile = argv[2]
process(jsonfile)
odtfile = mdfile.replace(".md", ".odt")
pdffile = mdfile.replace(".md", ".pdf")
fmt = "pdf"
if (argv[3] == "odt"):
	fmt = "odt"

system("./md2odt " + mdfile + " content.xml")
odt = ZipFile(odtfile, "w")
odt.write("content.xml")
odt.write("styles.xml")
odt.write("mimetype")
odt.write("META-INF/manifest.xml")
odt.close()
system("rm content.xml styles.xml " + mdfile + " " + jsonfile)
if (fmt == "odt"):
	exit(0)
system("echo \"convert " + odtfile + " " + pdffile + " pdf\" | abiword --plugin AbiCommand")
system("rm " + odtfile)

