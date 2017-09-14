# 创狐 Nginx 配置

mac nginx path: `/usr/local/etc/nginx/nginx.conf`

```
worker_processes  1;

events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  logs/access.log  main;

    sendfile        on;
    keepalive_timeout  65;

    gzip on;
    gzip_min_length 1k;
    gzip_buffers 4 16k;
    #gzip_http_version 1.0;
    gzip_comp_level 5;
    gzip_types text/plain application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    gzip_vary off;
    gzip_disable "MSIE [1-6]\.";

    # pgc
    server {
        listen 8093;

        location / {
            #需要修改成你本地项目的build文件夹地址
            root /Users/derek/Work/Hifox/ch-frontend/jc-pgc/build/;
        }

        location /api/ {
            proxy_pass http://106.15.179.107:7126/;
            proxy_set_header X-Forwarded-Host $host:8093;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location /r/ {
            #上传目录
            alias D:\\dir;
        }
    }

}
```
