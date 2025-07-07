pipeline {
  agent any

  environment {
    DOCKERHUB_REPO = 'magicarpe1/examen-app'
    KUBE_CONTEXT   = 'minikube'
    PATH           = '/usr/local/bin:/usr/bin:/bin'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build Docker Image') {
      steps {
        sh "docker build -t ${DOCKERHUB_REPO}:${BRANCH_NAME} ."
      }
    }

    stage('Push to DockerHub') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'DOCKERHUB_USER',
          passwordVariable: 'DOCKERHUB_PASS'
        )]) {
          sh '''
            echo "🔑 Login sur DockerHub…"
            echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin
            docker push "${DOCKERHUB_REPO}:${BRANCH_NAME}"
          '''
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        script {
          def ns = (BRANCH_NAME == 'master') ? 'prod' : BRANCH_NAME
          sh "kubectl config use-context ${KUBE_CONTEXT} && helm upgrade --install examen-app 
charts/examen --namespace ${ns} --set image.tag=${BRANCH_NAME}"
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

