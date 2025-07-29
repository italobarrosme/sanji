import groovy.json.JsonSlurper

pipeline {
  agent any

  options {
    ansiColor('xterm')
  }

  parameters {
    string(name: 'DOMAIN', defaultValue: '', description: 'Domínio do projeto')
    string(name: 'PORT', defaultValue: '3000', description: 'Porta interna do container')
    string(name: 'ENV_VARS_JSON', defaultValue: '{ "NODE_ENV": "production" }', description: 'Variáveis de ambiente como JSON')
    string(name: 'SSL_CONFIG_JSON', defaultValue: '{ "enable_tls": true, "email": "italo.barros@skyi.com.br" }', description: 'Configurações de SSL como JSON')
  }

  environment {
    DOCKER_CONTAINER_NAME = "${params.DOMAIN.replaceAll('\\.', '_')}"
  }

  stages {
    stage('Validação de Parâmetros') {
      steps {
        script {
          if (!params.DOMAIN?.trim()) {
            error "❌ Parâmetro DOMAIN é obrigatório!"
          }
          if (!params.PORT?.trim().isInteger()) {
            error "❌ Parâmetro PORT inválido!"
          }
        }
      }
    }

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Gerar .env (via JSON)') {
      steps {
        script {
          def json = new JsonSlurper().parseText(params.ENV_VARS_JSON)
          def envFile = json.collect { k, v -> "${k}=${v}" }.join("\n")
          writeFile file: '.env', text: envFile
        }
      }
    }

    stage('Deploy com Docker e Nginx') {
      steps {
        script {
          def sslConfig = new JsonSlurper().parseText(params.SSL_CONFIG_JSON)
          def enableTLS = sslConfig.enable_tls
          def email = sslConfig.email

          def domain = params.DOMAIN
          def port = params.PORT
          def projectPath = "/home/skyi/projects/${domain}"
          def nginxConfPath = "/etc/nginx/sites-available/${domain}"

          echo "📁 Criando/Atualizando pasta do projeto em: ${projectPath}"
          sh "sudo mkdir -p ${projectPath}"
          sh "sudo rsync -av --delete --exclude='.git' ./ ${projectPath}/"

          echo "📦 Gerando docker-compose.yml"
          sh """
cat > ${projectPath}/docker-compose.yml <<EOF
version: '3.8'
services:
  app:
    container_name: ${env.DOCKER_CONTAINER_NAME}
    build: ./app
    ports:
      - "${port}:3000"
    restart: always
    env_file:
      - .env
EOF
          """

          echo "🌐 Gerando configuração do Nginx"
          sh """
cat > ${nginxConfPath} <<EOF
server {
    listen 80;
    server_name ${domain} www.${domain};

    location / {
        proxy_pass http://localhost:${port};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location ~ /.well-known/acme-challenge/ {
        root /var/www/html;
        allow all;
    }
}
EOF
          """

          echo "🔗 Ativando site no NGINX"
          sh "sudo ln -sf ${nginxConfPath} /etc/nginx/sites-enabled/${domain}"
          sh "sudo nginx -t"
          sh "sudo systemctl reload nginx"

          if (enableTLS == true) {
            echo "🔐 Gerando certificado SSL com Certbot"
            sh "sudo certbot --nginx -n --agree-tos --redirect --email ${email} -d ${domain} -d www.${domain}"
          } else {
            echo "⚠️ SSL desativado pelo JSON de configuração"
          }

          echo "🐳 Subindo containers com Docker Compose"
          dir(projectPath) {
            sh "docker compose down --remove-orphans || true"
            sh "docker compose up -d --build"
          }
        }
      }
    }

    stage('Ver containers') {
      steps {
        echo '📦 Containers ativos:'
        sh 'docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'
      }
    }
  }

  post {
    success {
      echo '✅ Deploy finalizado com sucesso!'
    }
    failure {
      echo '❌ Falha no pipeline. Verifique os logs abaixo:'
      script {
        sh 'sudo journalctl -u nginx | tail -n 50 || true'
        sh "docker logs \$(docker ps -q --filter name=${env.DOCKER_CONTAINER_NAME}) || true"
      }
    }
  }
}
