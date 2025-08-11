FROM node:lts-alpine
WORKDIR /FUA_Generator
COPY package.json /FUA_Generator
RUN npm install
COPY . /FUA_Generator
EXPOSE 3000
CMD ["npm", "start"]
