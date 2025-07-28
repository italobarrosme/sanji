pipeline {
  agent any

  environment {
    DOCKER_BUILDKIT = '1'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Deploy com Docker Compose') {
      steps {
        sh '''
          echo "📦 Parando containers antigos (se houver)"
          docker compose down || true

          echo "🚀 Subindo containers"
          docker compose up -d --build
        '''
      }
    }

    stage('Ver containers') {
      steps {
        sh 'docker ps -a'
      }
    }
  }
}
