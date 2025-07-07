pipeline {
  agent any
  environment {
    PATH = "/opt/homebrew/bin:/usr/local/bin:${env.PATH}"
    DOCKERHUB_REPO = "magicarpe1/examen-app"
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Build') {
      steps {
        sh 'docker build -t ${DOCKERHUB_REPO}:${BRANCH_NAME} .'
      }
    }
    stage('Push') {
      steps {
        withCredentials([string(credentialsId: 'DOCKERHUB_PASS', variable: 'DOCKER_PASS')]) {
          sh 'echo $DOCKER_PASS | docker login -u magicarpe1 --password-stdin'
          sh 'docker push ${DOCKERHUB_REPO}:${BRANCH_NAME}'
        }
      }
    }
    stage('Deploy') {
      steps {
        sh 'kubectl config use-context minikube'
        sh 'helm upgrade --install examen-app ./charts/examen --namespace main --create-namespace --set image.tag=${BRANCH_NAME}'
      }
    }
  }
}

