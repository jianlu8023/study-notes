# datax build
FROM maven:3.8.6-jdk-8 AS datax-builder

#ARG DATAX_BRANCH=datax_v202309
ARG DATAX_BRANCH=master

WORKDIR /opt/build

# proxy https://ghproxy.jianlu.us.kg/
# proxy https://ghfast.top/

RUN cd /opt/build && \
    git clone https://ghproxy.jianlu.us.kg/https://github.com/alibaba/DataX.git datax && \
    cd datax && \
    git checkout ${DATAX_BRANCH} && \
    mvn -U clean package assembly:assembly -Dmaven.test.skip=true -Dmaven.compiler.source=1.8 -Dmaven.compiler.target=1.8 -Dfile.encoding=UTF-8

# datax web build
FROM maven:3.8.6-jdk-8 AS datax-web-builder

#ARG WEB_BRANCH=v-2.1.2
#ARG WEB_BRANCH=2.1.2-release
ARG WEB_BRANCH=2.1.3-alpha-release

WORKDIR /opt/build

ADD ./settings.xml /usr/share/maven/conf/settings.xml

RUN cd /opt/build && \
    git clone https://ghproxy.jianlu.us.kg/https://github.com/WeiYe-Jing/datax-web.git datax-web && \
    cd datax-web && \
    git checkout ${WEB_BRANCH} && \
    mvn -U clean package install -Dmaven.compiler.source=1.8 -Dmaven.compiler.target=1.8 -Dfile.encoding=UTF-8 -Dmaven.test.skip=true

#RUN ls /opt/build/web/build && sleep 10000

FROM debian:stable-slim AS tools-builder

WORKDIR /opt/build

RUN sed -i s@deb.debian.org@mirrors.aliyun.com@g /etc/apt/sources.list.d/debian.sources && \
    apt update && \
    apt install -y wget curl vim net-tools iputils-ping tzdata ca-certificates && \
    ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone


RUN wget https://repo.huaweicloud.com/java/jdk/8u201-b09/jdk-8u201-linux-x64.tar.gz && \
    mv jdk-8u201-linux-x64.tar.gz jdk.tar.gz


FROM python:3.10 AS runner

LABEL maintainer=ght
LABEL datax.version=datax_v202309
LABEL datax.web.version=2.1.2-release
LABEL datax.web.repo.url=https://github.com/WeiYe-Jing/datax-web.git
LABEL datax.repo.url=https://github.com/alibaba/DataX.git

WORKDIR /opt/datax

# time
COPY --from=tools-builder /etc/localtime /etc/localtime
COPY --from=tools-builder /etc/timezone /etc/timezone

# jdk
RUN mkdir -p /opt/jdk
COPY --from=tools-builder /opt/build/jdk.tar.gz /opt/jdk/jdk.tar.gz
RUN tar xzvf /opt/jdk/jdk.tar.gz -C /opt/jdk && \
    rm /opt/jdk/jdk.tar.gz && \
    mv /opt/jdk/jdk1.8.0_201 /opt/jdk/jdk8
ENV JAVA_HOME=/opt/jdk/jdk8
ENV PATH=$JAVA_HOME/bin:$PATH
ENV JRE_HOME=$JAVA_HOME/jre
ENV CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar

# datax
RUN mkdir -p /opt/datax/datax
COPY --from=datax-builder /opt/build/datax/target/datax.tar.gz /opt/datax/datax.tar.gz
RUN tar xzvf /opt/datax/datax.tar.gz -C /opt/datax/ && \
    rm /opt/datax/datax.tar.gz
#COPY --from=datax-builder /opt/build/datax/target/datax/datax /opt/datax/datax

# 解决 在有总bps限速条件下，单个channel的bps值不能为空，也不能为非正数
RUN sed -i 's/"byte": -1/"byte:" 2097152/g' /opt/datax/datax/conf/core.json

# datax-web
COPY --from=datax-web-builder /opt/build/datax-web/build/datax-web-2.1.2.tar.gz /opt/datax/datax-web.tar.gz
COPY --from=datax-web-builder /opt/build/datax-web/doc/datax-web/datax-python3 /opt/datax/datax-python3
COPY --from=datax-web-builder /opt/build/datax-web/bin/db/datax_web.sql /opt/datax/db/datax-web.sql
RUN tar xzvf /opt/datax/datax-web.tar.gz -C /opt/datax/ && \
    rm /opt/datax/datax-web.tar.gz && \
    mv /opt/datax/datax-web-2.1.2 datax-web

# 运行环境是python3 将datax.py升级到python3版本
RUN mv /opt/datax/datax-python3/* /opt/datax/datax/bin/

EXPOSE 9527/tcp

VOLUME /opt/datax/datax/log
VOLUME /opt/datax/datax/tmp
VOLUME /opt/datax/datax/log_perf

VOLUME /opt/datax/datax-web/modules/datax-admin/bin/env.properties
VOLUME /opt/datax/datax-web/modules/datax-admin/conf
VOLUME /opt/datax/datax-web/modules/datax-admin/logs
VOLUME /opt/datax/datax-web/modules/datax-admin/data

VOLUME /opt/datax/datax-web/modules/datax-executor/bin/env.properties
VOLUME /opt/datax/datax-web/modules/datax-executor/logs
VOLUME /opt/datax/datax-web/modules/datax-executor/data
VOLUME /opt/datax/datax-web/modules/datax-executor/conf
VOLUME /opt/datax/datax-web/modules/datax-executor/json

VOLUME /opt/datax/datax-web/logs

RUN echo "starting install.sh ..."

RUN sh -c "/opt/datax/datax-web/bin/install.sh --force"

RUN echo "rm datax-web/packages ..."

RUN rm -rf /opt/datax/datax-web/packages

RUN echo "starting start-all.sh ..."

#RUN tail -f /opt/datax/datax-web/modules/datax-admin/bin/console.out | tee -a /opt/datax/datax-web/logs/combined.log & tail -f /opt/datax/datax-web/modules/datax-executor/bin/console.out | tee -a /opt/datax/datax-web/logs/combined.log && \
#    ln -sf /opt/datax/datax-web/logs/combined.log /dev/stdout


#ENTRYPOINT ["sh","-c","/opt/datax/datax-web/bin/start-all.sh"]
CMD ["sh","-c","/opt/datax/datax-web/bin/start-all.sh && while true; do sleep 1;done"]
#CMD ["/bin/sh", "-c", "while true; do sleep 1; done"]

#RUN tail -f /opt/datax/datax-web/modules/datax-admin/bin/console.out /opt/datax/datax-web/modules/datax-executor/bin/console.out
