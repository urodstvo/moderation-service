#!/usr/bin/env bash
# Установка docker и docker-compose
sudo apt-get update && sudo apt-get -y upgrade

sudo apt-get install -y software-properties-common curl git

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install -y docker-ce bash-completion
sudo usermod -aG docker ${USER}

sudo curl -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Запуск nginx
sudo docker network create --driver bridge reverse-proxy
sudo docker run -d -p 80:80 -p 443:443 \
 --name nginx-proxy     --network reverse-proxy \
 --restart=always     -v $HOME/certs:/etc/nginx/certs:ro \
 -v /etc/nginx/vhost.d     -v /usr/share/nginx/html     \
 -v /var/run/docker.sock:/tmp/docker.sock:ro \
     --label com.github.jrcs.letsencrypt_nginx_proxy_companion.nginx_proxy=true jwilder/nginx-proxy

sudo docker run -d     --name nginx-letsencrypt     --restart=always     --volumes-from nginx-proxy     --network reverse-proxy \
-v $HOME/certs:/etc/nginx/certs:rw   -v /var/run/docker.sock:/var/run/docker.sock:ro     jrcs/letsencrypt-nginx-proxy-companion

# Настройка проектов
sudo mkdir /app
sudo groupadd app
sudo chmod g+s /app
sudo chown :app /app
sudo usermod -aG app ${USER}
sudo chmod 775 /app