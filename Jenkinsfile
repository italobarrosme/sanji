pipeline {
  agent any

  parameters {
    string(name: 'NODE_ENV', defaultValue: 'production', description: 'Ambiente de execução')
    // Você pode adicionar mais parâmetros aqui conforme seu .env
  }

  environment {
    NODE_ENV = "${params.NODE_ENV}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Gerar .env') {
      steps {
        echo '📝 Gerando .env'
        writeFile file: '.env', text: """
NODE_ENV=${NODE_ENV}
""".stripIndent().trim()
      }
    }

    stage('Deploy com Docker Compose') {
      steps {
        script {
          def dir = pwd()
          echo "🚀 Rodando docker compose no diretório: ${dir}"

          // Safe shutdown se containers estiverem rodando
          sh 'docker compose down || true'

          // Build e subida dos containers
          sh 'docker compose up -d --build'
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
