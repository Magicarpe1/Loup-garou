pipeline {
  agent any
  environment {
    DOCKER_REPO   = 'magicarpe1/examen-app'
    KUBE_CONTEXT  = 'minikube'
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Build') {
      steps {
        sh "docker build -t ${DOCKER_REPO}:${env.BRANCH_NAME} ."
      }
    }
    stage('Push') {
      steps {
        withCredentials([string(credentialsId: 'dockerhub-token', variable: 'PASSWORD')]) {
          sh 'echo "$PASSWORD" | docker login -u magicarpe1 --password-stdin'
          sh "docker push ${DOCKER_REPO}:${env.BRANCH_NAME}"
        }
      }
    }
    stage('Deploy') {
      steps {
        script {
          def ns = env.BRANCH_NAME == 'main' ? 'prod' : env.BRANCH_NAME
          sh "export PATH=/opt/homebrew/bin:/usr/local/bin:\$PATH && kubectl config use-context ${KUBE_CONTEXT} && helm upgrade --install examen-app ./charts/examen --namespace ${ns} --create-namespace --set image.tag=${env.BRANCH_NAME}"
        }
      }
    }
  }
}

