pipeline {
  agent any

  environment {
    // Votre repo DockerHub
    DOCKERHUB_REPO = 'magicarpe1/examen-app'
    // Contexte Kubernetes
    KUBE_CONTEXT   = 'minikube'
    // On injecte le binaire helm dans le PATH
    PATH           = "/opt/homebrew/bin:${env.PATH}"
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
          docker build \
            -t ${DOCKERHUB_REPO}:${env.BRANCH_NAME} \
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
            echo "\$DOCKERHUB_PASS" | docker login -u "\$DOCKERHUB_USER" --password-stdin
            docker push ${DOCKERHUB_REPO}:${env.BRANCH_NAME}
          """
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        script {
          // namespace = branch sauf si master → prod
          def ns = (env.BRANCH_NAME == 'master') ? 'prod' : env.BRANCH_NAME
          sh """
            kubectl config use-context ${KUBE_CONTEXT}
            helm upgrade --install examen-app charts/examen \
              --namespace ${ns} \
              --set image.tag=${env.BRANCH_NAME}
          """
        }
      }
    }
  }

  post {
    success {
      echo "✅ Pipeline OK pour la branche ${env.BRANCH_NAME}"
    }
    failure {
      echo "❌ Pipeline échoué pour la branche ${env.BRANCH_NAME}"
    }
  }
}

