FROM registry.cn-beijing.aliyuncs.com/sysbases/python3-slim-buster:3.8
LABEL org.opencontainers.image.authors="seth"

WORKDIR /usr/src/apps

COPY . .
RUN pip install --no-cache-dir -r requirements && touch /tmp/app.log

EXPOSE 8000
ENTRYPOINT ["/bin/bash", "/usr/src/app/uwsgi_service.sh" ]

