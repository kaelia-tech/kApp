FROM node:8-buster-slim
LABEL maintainer="contact@kalisio.xyz"

ARG APP
ARG FLAVOR
ARG BUILD_NUMBER

ENV BUILD_NUMBER=$BUILD_NUMBER
ENV NODE_APP_INSTANCE=$FLAVOR

COPY kdk.tgz /opt

WORKDIR /opt/kdk
RUN \
  tar zxf kdk.tgz && \
  rm kdk.tgz && \
  node . ${APP}.js --link

WORKDIR /opt/kdk/${APP}
EXPOSE 8081
CMD [ "yarn", "prod" ]
