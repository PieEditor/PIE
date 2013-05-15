#!/usr/bin/python

from sys import argv, exit
from os import system
from zipfile import ZipFile
from json2styles import process

if (not(len(argv) in [2, 3])):
	print("Usage : convert.py <md file> [json file]")
	exit(1)

mdfile = argv[1]
jsonfile = "default.json"
if (len(argv) == 3):
	jsonfile = argv[2]
process(jsonfile)
if (mdfile.count(".md") == 0):
	mdfile += ".md"
odtfile = mdfile.replace(".md", ".odt")
pdffile = mdfile.replace(".md", ".pdf")

system("./md2odt " + mdfile + " content.xml")
odt = ZipFile(odtfile, "w")
odt.write("content.xml")
odt.write("styles.xml")
odt.write("mimetype")
odt.write("META-INF/manifest.xml")
odt.close()
print("ODT file generated")
system("echo \"convert " + odtfile + " " + pdffile + " pdf\" | abiword --plugin AbiCommand")

