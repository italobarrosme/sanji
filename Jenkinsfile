pipeline {
  agent any

  environment {
    PROJECT_NAME = "sanji"
    CONTAINER_NAME = "sanji-app"
  }

  stages {
    stage('Deploy com Docker Compose') {
      steps {
        sh '''
          echo "🚀 Rodando docker compose no diretório: $PWD"
          docker compose down || true
          docker compose up -d --build
        '''
      }
    }

    stage('Ver containers') {
      steps {
        sh 'docker ps --filter "name=${CONTAINER_NAME}"'
      }
    }
  }
}
