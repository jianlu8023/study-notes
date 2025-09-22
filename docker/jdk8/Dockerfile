FROM debian:stable-slim AS builder

RUN sed -i s@deb.debian.org@mirrors.aliyun.com@g /etc/apt/sources.list.d/debian.sources && \
     apt-get update && \
     apt-get install -y tzdata ca-certificates wget && \
	mkdir -p /usr/local/dev/ && \
	cd /usr/local/dev/ && \
	wget https://mirrors.huaweicloud.com/java/jdk/8u202-b08/jdk-8u202-linux-x64.tar.gz

#FROM busybox:stable-glibc

FROM debian:stable-slim

RUN mkdir -p /usr/local/dev/ 
# debian 注释
#RUN mkdir -p /usr/lib/x86_64-linux-gnu/

COPY --from=builder /etc/ssl/certs/ /etc/ssl/certs/
COPY --from=builder /usr/lib/x86_64-linux-gnu/libdl.so.2 /usr/lib/x86_64-linux-gnu/libdl.so.2
COPY --from=builder /usr/share/zoneinfo/Asia/Shanghai /etc/loaltime
COPY --from=builder /usr/local/dev/jdk-8u202-linux-x64.tar.gz /usr/local/dev/jdk-8u202-linux-x64.tar.gz
RUN echo "Asia/Shanghai" > /etc/timezone

# debian 注释
# busbox 不注释
#ENV LD_LIBRARY_PATH=""
#ENV LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu/:$LD_LIBRARY_PATH

RUN cd /usr/local/dev/ && \
	ls /usr/local/dev && \
	tar xzvf jdk-8u202-linux-x64.tar.gz && \
	mv jdk1.8.0_202 jdk8 && \
	rm jdk-8u202-linux-x64.tar.gz

ENV JAVA_HOME=/usr/local/dev/jdk8
ENV JRE_HOME=$JAVA_HOME/jre
ENV CLASSPATH=.:$JRE_HOME/lib:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
ENV PATH=$PATH:$JAVA_HOME/bin:$JRE_HOME/bin

ENTRYPOINT ["java"]
CMD ["-version"]
