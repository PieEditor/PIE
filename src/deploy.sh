# ./deploy.sh [host]
# eg.
# To deploy to the default server
# $ ./deploy.sh
# To deploy to another server:
# $ ./deploy.fr another.server.com

host=${1:-yimgo.fr}
ssh pie@$host "cd devel/Communities; git pull; make -C src/md2pdf; cd src/front; killall node; npm install ; bower install ; grunt build ; cd ../back ; node init-db.js ; node update-db.js ; (nohup node server.js > server.js.out 2> server.js.err &) ; cd ../md2pdf ; (nohup node convert.js > convert.js.out 2> convert.js.out &)"
