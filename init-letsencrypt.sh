#!/bin/bash
die () {
    echo >&2 "$@"
    exit 1
}

clear

tput setaf 128;
tput setaf 7;

printf "\n\n\nInstalación de Certificados SSL 🔒 \n\n\n"

read -p "Presiona enter para continuar... 🔥"
echo
echo

[ "$#" -ge 2 ] || die "usage: init-letsencrypt.sh [staging | production] [email] <domain1 domain2 ...>"

domains=(${@:3})
rsa_key_size=4096
data_path="./nginx/$1/certbot"
email="$2" # Adding a valid address is strongly recommended
staging=0 # Set to 1 if you're testing your setup to avoid hitting request limits

echo

printf "✅ $(tput setaf 128)Iniciando base containers$(tput setaf 7) \n"
sudo docker compose -f docker-compose.$1.yml up --force-recreate -d
echo

if [ -d "$data_path/conf/live/" ]; then
  read -p "⚠️ Se han encontrado datos existentes. ¿Continuar y sustituir los certificados existentes? (y/N) " decision
  echo
  if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
    exit
  fi
fi

if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  printf "✅ $(tput setaf 128)Descarga de los parámetros TLS recomendados$(tput setaf 7) \n"
  sudo mkdir -p "$data_path/conf"
  openssl dhparam -out $data_path/conf/ssl-dhparams.pem 2048
  echo
fi

for domain in "${domains[@]}"; do
  printf "✅ $(tput setaf 128)Eliminando certificado antiguo para $domain $(tput setaf 7) \n"
  sudo docker compose -f ./nginx/docker-compose.$1.yml run --rm --entrypoint "\
    rm -Rf /etc/letsencrypt/live/$domain && \
    rm -Rf /etc/letsencrypt/archive/$domain && \
    rm -Rf /etc/letsencrypt/renewal/$domain.conf" certbot
  echo
done

for domain in "${domains[@]}"; do
  printf "✅ $(tput setaf 128)Creando certificado dummy para $domain $(tput setaf 7) \n"
  path="/etc/letsencrypt/live/$domain"
  mkdir -p "$data_path/conf/live/$domain"
  sudo docker compose -f ./nginx/docker-compose.$1.yml run --rm --entrypoint "\
    openssl req -x509 -nodes -newkey rsa:2048 -days 1\
      -keyout "$path/privkey.pem" \
      -out "$path/fullchain.pem" \
      -subj '/CN=localhost'" certbot
  echo
done

printf "✅ $(tput setaf 128)Iniciando NGINX $(tput setaf 7) \n"
sudo docker compose -f ./nginx/docker-compose.$1.yml up --force-recreate -d
echo

for domain in "${domains[@]}"; do
  printf "✅ $(tput setaf 128)Eliminando certificado dummy para $domain $(tput setaf 7) \n"
  sudo docker compose -f ./nginx/docker-compose.$1.yml run --rm --entrypoint "\
    rm -Rf /etc/letsencrypt/live/$domain" certbot
  echo
done

printf "✅ $(tput setaf 128)Solicitando Certificados Let's Encrypt $(tput setaf 7) \n"
echo

# Select appropriate email arg
case "$email" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="--email $email" ;;
esac

# Enable staging mode if needed
if [ $staging != "0" ]; then staging_arg="--staging"; fi

for domain in "${domains[@]}"; do
  sudo docker compose -f ./nginx/docker-compose.$1.yml run --rm --entrypoint "\
    certbot certonly --webroot -w /var/www/certbot \
      $staging_arg \
      $email_arg \
      -d $domain \
      --rsa-key-size $rsa_key_size \
      --agree-tos \
      --force-renewal" certbot
  echo
done

printf "✅ $(tput setaf 128)Recargando NGINX $(tput setaf 7) \n"
sudo docker compose -f ./nginx/docker-compose.$1.yml exec proxy nginx -s reload
echo