pipeline {
  agent any

  environment {
    DOCKERHUB_REPO        = 'magicarpe1/examen-app'
    KUBE_CONTEXT          = 'minikube'
    PATH                  = '/usr/local/bin:/usr/bin:/bin'
    // Injecte utilisateur et mot de passe depuis les credentials Jenkins
    DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        sh "docker build -t ${DOCKERHUB_REPO}:${BRANCH_NAME} ."
      }
    }

    stage('Push to DockerHub') {
      steps {
        sh '''
          echo "🔑 Login sur DockerHub…"
          docker login -u "$DOCKERHUB_CREDENTIALS_USR" -p "$DOCKERHUB_CREDENTIALS_PSW"
          docker push "${DOCKERHUB_REPO}:${BRANCH_NAME}"
        '''
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        script {
          def ns = (BRANCH_NAME == 'master') ? 'prod' : BRANCH_NAME
          sh "kubectl config use-context ${KUBE_CONTEXT} && helm upgrade --install examen-app charts/examen --namespace ${ns} --set image.tag=${BRANCH_NAME}"
        }
      }
    }
  }

  post {
    success {
      echo "✅ Pipeline OK pour la branche ${BRANCH_NAME}"
    }
    failure {
      echo "❌ Pipeline échoué pour la branche ${BRANCH_NAME}"
    }
  }
}
