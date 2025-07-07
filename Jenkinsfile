pipeline {
  agent any

  environment {
    DOCKERHUB_REPO = 'magicarpe1/examen-app'
    KUBE_CONTEXT   = 'minikube'
  }

  stages {
    stage('Checkout') {
      steps {
        // Récupère le code depuis GitHub
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        // Construit l’image Docker avec le tag de la branche
        sh 'docker build -t $DOCKERHUB_REPO:${env.BRANCH_NAME} .'
      }
    }

    stage('Push to DockerHub') {
      steps {
        // Utilise les credentials Jenkins pour se connecter à DockerHub
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'USER',
          passwordVariable: 'PWD'
        )]) {
          sh 'echo $PWD | docker login -u $USER --password-stdin'
          sh 'docker push $DOCKERHUB_REPO:${env.BRANCH_NAME}'
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        script {
          // Choisit le namespace selon la branche
          def ns = (env.BRANCH_NAME == 'master') ? 'prod' : env.BRANCH_NAME
          // Exécute en plusieurs lignes grâce aux triple guillemets
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
      echo "Pipeline terminé avec succès pour la branche ${env.BRANCH_NAME}"
    }
    failure {
      echo "Échec du pipeline pour la branche ${env.BRANCH_NAME}"
    }
  }
}

