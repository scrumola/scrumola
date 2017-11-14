FROM registry.centos.org/kbsingh/openshift-nginx:1.10.2

ENV LANG=en_US.utf8

USER root

RUN yum install -y httpd-tools

#ADD nginx-ip/.htpasswd /etc/nginx/

ADD nginx-ip/nginx.conf /etc/nginx/

ADD dist /usr/share/nginx/html/

RUN chmod -R 777 etc/nginx

USER 997

