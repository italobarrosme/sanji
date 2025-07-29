import groovy.json.JsonSlurper

pipeline {
  agent any

  parameters {
    string(name: 'DOMAIN', defaultValue: '', description: 'Domínio do projeto')
    string(name: 'PORT', defaultValue: '3000', description: 'Porta interna do container')
    string(name: 'ENV_VARS_JSON', defaultValue: '{ "NODE_ENV": "production" }', description: 'Variáveis de ambiente como JSON')
    string(name: 'EMAIL_REFERENCE', defaultValue: 'italo.barros@skyi.com.br', description: 'Email de referência para o certbot')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Gerar .env (via JSON)') {
      steps {
        script {
          def json = new JsonSlurper().parseText(params.ENV_VARS_JSON)
          def envFile = json.collect { key, value -> "${key}=${value}" }.join("\n")
          writeFile file: '.env', text: envFile
        }
      }
    }

    stage('Deploy com Docker e Nginx') {
      steps {
        script {
          def projectPath = "/home/skyi/projects/${params.DOMAIN}"
          def nginxConfPath = "/etc/nginx/sites-available/${params.DOMAIN}"

          echo "📁 Criando pasta do projeto: ${projectPath}"
          sh "sudo mkdir -p ${projectPath}"
          sh "sudo rm -rf ${projectPath}/*"
          sh "sudo cp -r * ${projectPath}/"

          echo "📦 Gerando docker-compose.yml"
          sh """
cat > ${projectPath}/docker-compose.yml <<EOF
version: '3.8'
services:
  app:
    container_name: ${params.DOMAIN.replaceAll('\\.', '_')}
    build: ./app
    ports:
      - "${params.PORT}:3000"
    restart: always
EOF
          """

          echo "🌐 Gerando config do Nginx"
          sh """
cat > ${nginxConfPath} <<EOF
server {
    listen 80;
    server_name ${params.DOMAIN} www.${params.DOMAIN};

    location / {
        proxy_pass http://localhost:${params.PORT};
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

          echo "🔗 Ativando site no Nginx"
          sh "sudo ln -sf ${nginxConfPath} /etc/nginx/sites-enabled/${params.DOMAIN}"
          sh "sudo nginx -t"
          sh "sudo systemctl reload nginx"

          echo "🔐 Gerando certificado SSL com Certbot"
          sh "sudo certbot --nginx -n --agree-tos --redirect --email ${params.EMAIL_REFERENCE} -d ${params.DOMAIN} -d www.${params.DOMAIN}"

          echo "🐳 Subindo containers com Docker"
          dir(projectPath) {
            sh "[ -f docker-compose.yml ] && docker compose down || true"
            sh "[ -f docker-compose.yml ] && docker compose up -d --build"
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
      echo '❌ Falha no pipeline. Verifique os logs!'
    }
  }
}
