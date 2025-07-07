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
        sh 'docker build -t ${DOCKERHUB_REPO}:${env.BRANCH_NAME} .'
      }
    }

    stage('Push to DockerHub') {
      steps {
        withCredentials([string(credentialsId: 'dockerhub-token', variable: 'PASSWORD')]) {
          sh '''
            echo "$PASSWORD" | docker login -u magicarpe1 --password-stdin
            docker push ${DOCKERHUB_REPO}:${env.BRANCH_NAME}
          '''
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        script {
          def ns = (env.BRANCH_NAME == 'master') ? 'prod' : env.BRANCH_NAME
          sh '''
            export PATH=/opt/homebrew/bin:/usr/local/bin:$PATH
            kubectl config use-context ${KUBE_CONTEXT}
            helm upgrade --install examen-app ./charts/examen --namespace ${ns} --create-namespace --set image.tag=${env.BRANCH_NAME}
          '''
        }
      }
    }
  }
}

