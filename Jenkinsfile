pipeline {
  agent any

  environment {
    // Déclarez la variable pour votre repo DockerHub
    DOCKERHUB_REPO = 'magicarpe1/examen-app'
    KUBE_CONTEXT   = 'minikube'
  }

  stages {
    // Etape de récupération du code
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    // Etape de build de l'image Docker
    stage('Build Docker Image') {
      steps {
        // Utilise l'interpolation Groovy pour nommer l'image
        sh "docker build -t ${DOCKERHUB_REPO}:${env.BRANCH_NAME} ."
      }
    }

    // Etape de push de l'image sur DockerHub
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

    // Etape de déploiement sur Kubernetes
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
      echo "Pipeline terminé avec succès pour la branche ${env.BRANCH_NAME}"
    }
    failure {
      echo "Échec du pipeline pour la branche ${env.BRANCH_NAME}"
    }
  }
}

