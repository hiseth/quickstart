#!/bin/bash

downloadURL="https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-5.0.3.tgz"
downloadFile="/tmp/MongoDB.tgz"
mdbDir="/usr/local/mongodb"


[[ `id -u` -ne '0' ]] && echo "请用root用户执行此程序!"

if [ ! -f $downloadFile ];then
  wget -q -O $downloadFile $downloadURL  2>&1 >/dev/null && echo -e "文件已下载完成开始解压安装!"
fi

if [ ! -d $mdbDir ];then
  tar xf $downloadFile -C /usr/local
  ln -s /usr/local/mongodb-linux-x86_64-ubuntu2004-5.0.3/ /usr/local/mongodb
  mkdir /usr/local/mongodb/{data,log} && chown `whoami` /usr/local/mongodb/{data,log}

  echo "export PATH=/usr/local/mongodb/bin:\$PATH" >> /etc/profile
fi

source /etc/profile
mongod --dbpath /usr/local/mongodb/data --logpath /usr/local/mongodb/log/mongo.log --fork
