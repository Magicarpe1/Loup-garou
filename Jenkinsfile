pipeline {
  agent any

  environment {
    DOCKERHUB_REPO        = 'magicarpe1/examen-app'
    KUBE_CONTEXT          = 'minikube'
    // Injecte automatiquement deux variables :
    //   DOCKERHUB_CREDENTIALS_USR  = le username
    //   DOCKERHUB_CREDENTIALS_PSW  = le token
    DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
    PATH                  = '/usr/local/bin:/usr/bin:/bin'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        sh "docker build -t ${DOCKERHUB_REPO}:${env.BRANCH_NAME} ."
      }
    }

    stage('Push to DockerHub') {
      steps {
        sh """
          echo '🔑 Login sur DockerHub…'
          docker login -u ${DOCKERHUB_CREDENTIALS_USR} -p ${DOCKERHUB_CREDENTIALS_PSW}
          docker push ${DOCKERHUB_REPO}:${env.BRANCH_NAME}
        """
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        script {
          def ns = env.BRANCH_NAME == 'master' ? 'prod' : env.BRANCH_NAME
          sh "kubectl config use-context ${KUBE_CONTEXT} && helm upgrade --install examen-app charts/examen --namespace ${ns} --set image.tag=${env.BRANCH_NAME}"
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

