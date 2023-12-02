FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY placeholder.png /www/uploads/placeholder.png
COPY favicon.ico /www/pages