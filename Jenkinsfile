pipeline {
  agent any

  environment {
    NODE_ENV     = "${NODE_ENV}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Gerar .env') {
      steps {
        script {
          echo "📝 Gerando .env"
          sh """
            echo NODE_ENV=${NODE_ENV} > .env
          """
        }
      }
    }

    stage('Deploy com Docker Compose') {
      steps {
        echo "🚀 Rodando docker compose no diretório: ${pwd()}"
        sh 'docker compose down || true'
        sh 'docker compose up -d --build'
      }
    }

    stage('Ver containers') {
      steps {
        sh 'docker ps -a'
      }
    }
  }
}
