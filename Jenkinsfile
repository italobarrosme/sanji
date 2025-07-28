pipeline {
  agent any

  parameters {
    string(name: 'NODE_ENV', defaultValue: 'production', description: 'Ambiente de execução')
    string(name: 'PROJECT', defaultValue: 'coqueirodigital.com')
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
          def projectPath = "/home/skyi/projects/${params.PROJECT_PATH}"

          echo "🚚 Copiando arquivos para ${projectPath}"
          sh "rm -rf ${projectPath}/*"
          sh "cp -r * ${projectPath}/"

          dir(projectPath) {
            echo "🚀 Rodando docker compose no diretório: ${projectPath}"
            sh 'docker compose down || true'
            sh 'docker compose up -d --build'
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
