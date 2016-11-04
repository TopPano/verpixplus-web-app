FROM toppano/laputa-base:latest

MAINTAINER uniray7 uniray7@gmail.com

# install nodejs
ENV NODE_VERSION 6.3.0
ENV NVM_DIR /home/.nvm

RUN . $NVM_DIR/nvm.sh && nvm install v$NODE_VERSION && nvm alias default v$NODE_VERSION
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

#install pm2
RUN npm install -g pm2

RUN apt-get update
RUN apt-get install -y libfontconfig

# setup project
ADD . /home/verpix/verpixplus-web-app
RUN chown -R verpix:verpix /home/verpix/verpixplus-web-app

USER verpix
WORKDIR /home/verpix/verpixplus-web-app

RUN npm install
RUN npm run build

EXPOSE 8000

CMD npm run docker-start
