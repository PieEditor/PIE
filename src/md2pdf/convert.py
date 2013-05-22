#!/usr/bin/python

from sys import argv, exit
from os import system
from zipfile import ZipFile
from json2styles import process

if (not(len(argv) == 3)):
	exit(1)

path = argv[1]
mdfile = path + "d.md"
jsonfile = path + "s.json"
process(jsonfile, path + "styles.xml")
odtfile = mdfile.replace(".md", ".odt")
pdffile = mdfile.replace(".md", ".pdf")
fmt = "pdf"
if (argv[2] == "odt"):
	fmt = "odt"

system("./md2odt " + mdfile + " " + path + "content.xml")
odt = ZipFile(odtfile, "w")
odt.write(path + "content.xml", "content.xml")
odt.write(path + "styles.xml", "styles.xml")
odt.write("mimetype")
odt.write("META-INF/manifest.xml")
odt.close()
system("rm " + path + "content.xml " + path + "styles.xml " + mdfile + " " + jsonfile)
if (fmt == "odt"):
	exit(0)
system("echo \"convert " + odtfile + " " + pdffile + " pdf\" | abiword --plugin AbiCommand")
system("rm " + odtfile)

