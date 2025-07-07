pipeline {
  agent any

  environment {
    DOCKERHUB_REPO = 'magicarpe1/examen-app'
    KUBE_CONTEXT   = 'minikube'
    PATH           = "/usr/local/bin:/opt/homebrew/bin:${env.PATH}"
    DOCKER_CMD     = 'docker'
    HELM_CMD       = 'helm'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        sh """
          ${DOCKER_CMD} build \\
            -t ${DOCKERHUB_REPO}:${env.BRANCH_NAME} \\
            .
        """
      }
    }

    stage('Push to DockerHub') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'DOCKERHUB_USER',
          passwordVariable: 'DOCKERHUB_PASS'
        )]) {
          sh """
            echo "\$DOCKERHUB_PASS" | ${DOCKER_CMD} login -u "\$DOCKERHUB_USER" --password-stdin
            ${DOCKER_CMD} push ${DOCKERHUB_REPO}:${env.BRANCH_NAME}
          """
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        script {
          def ns = (env.BRANCH_NAME == 'master') ? 'prod' : env.BRANCH_NAME
          sh """
            kubectl config use-context ${KUBE_CONTEXT}
            ${HELM_CMD} upgrade --install examen-app charts/examen \\
              --namespace ${ns} \\
              --set image.tag=${env.BRANCH_NAME}
          """
        }
      }
    }
  }

  post {
    success { echo "✅ Pipeline OK pour ${env.BRANCH_NAME}" }
    failure { echo "❌ Pipeline échoué pour ${env.BRANCH_NAME}" }
  }
}

