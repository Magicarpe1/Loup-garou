pipeline {
  agent any

  environment {
    DOCKERHUB_REPO = 'magicarpe1/examen-app'
    KUBE_CONTEXT   = 'minikube'
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
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'USER',
          passwordVariable: 'PWD'
        )]) {
          sh "echo $PWD | docker login -u $USER --password-stdin"
          sh "docker push ${DOCKERHUB_REPO}:${env.BRANCH_NAME}"
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        script {
          def ns = (env.BRANCH_NAME == 'master') ? 'prod' : env.BRANCH_NAME
          sh "kubectl config use-context ${KUBE_CONTEXT} && helm upgrade --install examen-app 
charts/examen --namespace ${ns} --set image.tag=${env.BRANCH_NAME}"
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

