ssh pie@yimgo.fr "cd devel/Communities; git pull; make -C src/md2pdf; cd src/front; killall node; grunt build --force; node ../back/server.js &"
