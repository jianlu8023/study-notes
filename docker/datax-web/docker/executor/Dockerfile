# datax build
FROM maven:3.8.6-jdk-8 AS datax-builder

#ARG DATAX_BRANCH=datax_v202309
ARG DATAX_BRANCH=master

WORKDIR /opt/build

# proxy https://ghproxy.jianlu.us.kg/
# proxy https://ghfast.top/

RUN cd /opt/build && \
    git clone https://ghfast.top/https://github.com/alibaba/DataX.git datax && \
    cd datax && \
    git checkout ${DATAX_BRANCH} && \
    mvn -U clean package assembly:assembly -Dmaven.test.skip=true -Dmaven.compiler.source=1.8 -Dmaven.compiler.target=1.8 -Dfile.encoding=UTF-8

# datax web build
FROM maven:3.8.6-jdk-8 AS datax-web-builder

#ARG WEB_BRANCH=v-2.1.2
#ARG WEB_BRANCH=2.1.2-release
ARG WEB_BRANCH=2.1.3-alpha-release

WORKDIR /opt/build

#ADD ./settings.xml /usr/share/maven/conf/settings.xml
RUN echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\
<settings xmlns=\"http://maven.apache.org/SETTINGS/1.2.0\"\
          xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\
          xsi:schemaLocation=\"http://maven.apache.org/SETTINGS/1.2.0\
          https://maven.apache.org/xsd/settings-1.2.0.xsd\">\
    <mirrors>\
        <mirror>\
            <id>aliyun-mirror</id>\
            <url>https://maven.aliyun.com/repository/public</url>\
            <name>aliyun-cloud-maven-mirror</name>\
            <mirrorOf>central,!jitpack-repo</mirrorOf>\
        </mirror>\
        <mirror>\
            <id>jitpack.io</id>\
            <mirrorOf>jitpack-repo</mirrorOf>\
            <name>jitpack</name>\
            <url>https://www.jitpack.io</url>\
        </mirror>\
    </mirrors>\
    <profiles>\
        <profile>\
            <id>mirror</id>\
            <repositories>\
                <repository>\
                    <id>central</id>\
                    <url>https://maven.aliyun.com/repository/public</url>\
                    <snapshots>\
                        <enabled>false</enabled>\
                    </snapshots>\
                    <releases>\
                        <enabled>true</enabled>\
                    </releases>\
                </repository>\
                <repository>\
                    <id>jitpack-repo</id>\
                    <url>https://www.jitpack.io</url>\
                    <snapshots>\
                        <enabled>false</enabled>\
                    </snapshots>\
                    <releases>\
                        <enabled>true</enabled>\
                    </releases>\
                </repository>\
            </repositories>\
            <pluginRepositories>\
                <pluginRepository>\
                    <id>aliyun-plugin</id>\
                    <name>aliyun-plugin</name>\
                    <url>https://maven.aliyun.com/repository/public</url>\
                </pluginRepository>\
            </pluginRepositories>\
        </profile>\
    </profiles>\
    <activeProfiles>\
        <activeProfile>mirror</activeProfile>\
    </activeProfiles>\
</settings>" > /usr/share/maven/conf/settings.xml


RUN cd /opt/build && \
    git clone https://ghfast.top/https://github.com/WeiYe-Jing/datax-web.git datax-web && \
    cd datax-web && \
    git checkout ${WEB_BRANCH} && \
    mvn -U clean package install -Dmaven.compiler.source=1.8 -Dmaven.compiler.target=1.8 -Dfile.encoding=UTF-8 -Dmaven.test.skip=true  && \
    cd /opt/build/datax-web/build/ && \
    tar xzvf datax-web-2.1.2.tar.gz && \
    mv datax-web-2.1.2 datax-web


FROM alpine:3.10.3 AS runner


#MAINTAINER shizeying
## 设置默认语言环境
ENV LANG=C.UTF-8
ENV DATA_WEB=2.1.2
ENV DATAX_VERSION=2.1.2_1
ENV DATAX_NAME=datax-executor
LABEL datax-executor-versiom="${DATAX_VERSION}"
LABEL datax-executor-versiom="${DATAX_VERSION}"
LABEL org.label-schema.version="${version}"
LABEL org.label-schema.vcs-url="https://github.com/WeiYe-Jing/datax-web"
LABEL org.opencontainers.image.documentation="https://github.com/WeiYe-Jing/datax-web/blob/master/doc/datax-web/datax-web-deploy.md"

COPY --from=datax-web-builder /opt/build/datax-web/build/datax-web/packages/${DATAX_NAME}_${DATAX_VERSION}.tar.gz /opt/${DATAX_NAME}.tar.gz
RUN cd /opt/ && \
        tar xzvf ${DATAX_NAME}.tar.gz -C /opt/ && \
        rm /opt/${DATAX_NAME}.tar.gz
#ADD ${DATAX_NAME}_${DATAX_VERSION}.tar.gz /opt/

ADD wait-for-it.sh /etc/init.d/

# 安装 GNU libc (aka glibc)和C.UTF-8 locale的依赖 以及设置时区
# 下面这么长一串，主要是通过apk安装glibc的依赖，他的作用主要是本地化支持，和字符集的切换。
RUN sed -i 's|http://dl-cdn.alpinelinux.org|https://mirrors.aliyun.com|g' /etc/apk/repositories && \
    ALPINE_GLIBC_BASE_URL="https://ghfast.top/https://github.com/sgerrand/alpine-pkg-glibc/releases/download" && \
    ALPINE_GLIBC_PACKAGE_VERSION="2.27-r0" && \
    ALPINE_GLIBC_BASE_PACKAGE_FILENAME="glibc-$ALPINE_GLIBC_PACKAGE_VERSION.apk" && \
    ALPINE_GLIBC_BIN_PACKAGE_FILENAME="glibc-bin-$ALPINE_GLIBC_PACKAGE_VERSION.apk" && \
    ALPINE_GLIBC_I18N_PACKAGE_FILENAME="glibc-i18n-$ALPINE_GLIBC_PACKAGE_VERSION.apk" && \
    apk add --no-cache bash && \
    apk add --no-cache --virtual=.build-dependencies wget ca-certificates && \
    echo \
    "-----BEGIN PUBLIC KEY-----\
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApZ2u1KJKUu/fW4A25y9m\
    y70AGEa/J3Wi5ibNVGNn1gT1r0VfgeWd0pUybS4UmcHdiNzxJPgoWQhV2SSW1JYu\
    tOqKZF5QSN6X937PTUpNBjUvLtTQ1ve1fp39uf/lEXPpFpOPL88LKnDBgbh7wkCp\
    m2KzLVGChf83MS0ShL6G9EQIAUxLm99VpgRjwqTQ/KfzGtpke1wqws4au0Ab4qPY\
    KXvMLSPLUp7cfulWvhmZSegr5AdhNw5KNizPqCJT8ZrGvgHypXyiFvvAH5YRtSsc\
    Zvo9GI2e2MaZyo9/lvb+LbLEJZKEQckqRj4P26gmASrZEPStwc+yqy1ShHLA0j6m\
    1QIDAQAB\
    -----END PUBLIC KEY-----" | sed 's/   */\n/g' > "/etc/apk/keys/sgerrand.rsa.pub" && \
    wget \
    "$ALPINE_GLIBC_BASE_URL/$ALPINE_GLIBC_PACKAGE_VERSION/$ALPINE_GLIBC_BASE_PACKAGE_FILENAME" \
    "$ALPINE_GLIBC_BASE_URL/$ALPINE_GLIBC_PACKAGE_VERSION/$ALPINE_GLIBC_BIN_PACKAGE_FILENAME" \
    "$ALPINE_GLIBC_BASE_URL/$ALPINE_GLIBC_PACKAGE_VERSION/$ALPINE_GLIBC_I18N_PACKAGE_FILENAME" && \
    apk add --no-cache \
    "$ALPINE_GLIBC_BASE_PACKAGE_FILENAME" \
    "$ALPINE_GLIBC_BIN_PACKAGE_FILENAME" \
    "$ALPINE_GLIBC_I18N_PACKAGE_FILENAME" && \
    \
    rm "/etc/apk/keys/sgerrand.rsa.pub" && \
    /usr/glibc-compat/bin/localedef --force --inputfile POSIX --charmap UTF-8 "$LANG" || true && \
    echo "export LANG=$LANG" > /etc/profile.d/locale.sh && \
    \
    apk del glibc-i18n && \
    rm "/root/.wget-hsts" && \
    apk del .build-dependencies && \
    rm \
    "$ALPINE_GLIBC_BASE_PACKAGE_FILENAME" \
    "$ALPINE_GLIBC_BIN_PACKAGE_FILENAME" \
    "$ALPINE_GLIBC_I18N_PACKAGE_FILENAME" && \
    apk update && apk add --no-cache tzdata && \
    ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone && \
    echo -e '#!/bin/bash\nls --color=auto -lah "$@"' > /usr/bin/ll && \
    chmod +x /usr/bin/ll   /etc/init.d/wait-for-it.sh && \
    apk add  -U   bash  python2   rsync libselinux  openjdk8   && \
#    apk add  -U   bash  python2 supervisor  rsync libselinux  openjdk8 maven  && \
    apk add --no-cache tzdata \
        && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
        && echo "Asia/Shanghai" > /etc/timezone && \
        rm -rf /var/cache/apk/* && \
        rm -rf /tmp/* /var/cache/apk/* /tmp/* /var/tmp/* $HOME/.cache


ARG SERVER_PORT=8081
ARG DATAX_ADMIN_HOST=127.0.0.1
ARG DATAX_ADMIN_PORT=9527
ARG EXECUTOR_PORT=9999
ARG PYTHON_PATH=/opt/${DATAX_NAME}/python
#ARG DATA_PATH=/opt/${DATAX_NAME}/data
ARG SERVICE_LOG_PATH=/opt/${DATAX_NAME}/logs
ARG JSON_PATH=/opt/${DATAX_NAME}/json


RUN mkdir /opt/${DATAX_NAME}/json /opt/${DATAX_NAME}/python /opt/${DATAX_NAME}/logs

COPY --from=datax-builder /opt/build/datax/target/datax.tar.gz /opt/datax.tar.gz
RUN cd /opt && \
    tar xzvf /opt/datax.tar.gz -C ${PYTHON_PATH}/ && \
    rm -rf /opt/datax.tar.gz

COPY --from=datax-web-builder /opt/build/datax-web/doc/datax-web/datax-python3 ${PYTHON_PATH}/datax/datax-python3
RUN cd ${PYTHON_PATH}/datax && \
    mv ${PYTHON_PATH}/datax/bin ${PYTHON_PATH}/datax/datax-python2 && \
    cp ${PYTHON_PATH}/datax/datax-python3 ${PYTHON_PATH}/datax/bin -r

# 解决 在有总bps限速条件下，单个channel的bps值不能为空，也不能为非正数
RUN sed -i 's/"byte": -1/"byte:" 2097152/g' ${PYTHON_PATH}/datax/conf/core.json

ENV SERVER_PORT=${SERVER_PORT}
ENV DATAX_ADMIN_HOST=${DATAX_ADMIN_HOST}
ENV DATAX_ADMIN_PORT=${DATAX_ADMIN_PORT}
ENV EXECUTOR_PORT=${EXECUTOR_PORT}
ENV CLASSPATH=/opt/${DATAX_NAME}/lib/*:/opt/${DATAX_NAME}/conf:.
ENV JSON_PATH=${JSON_PATH}
ENV PYTHON_PATH=${PYTHON_PATH}/datax/bin/datax.py
#ENV DATA_PATH=${DATA_PATH}
ENV SERVICE_LOG_PATH=${SERVICE_LOG_PATH}

RUN sed -i 's/DATA_PATH/SERVICE_LOG_PATH/g' /opt/${DATAX_NAME}/conf/application.yml && \
    sed -i 's/log.path/SERVICE_LOG_PATH/g' /opt/${DATAX_NAME}/conf/logback.xml

EXPOSE ${SERVER_PORT}

WORKDIR /opt
ENTRYPOINT exec java com.wugui.datax.executor.DataXExecutorApplication
