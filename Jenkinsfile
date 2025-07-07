pipeline {
  agent any

  environment {
    // Votre repo DockerHub
    DOCKERHUB_REPO = 'magicarpe1/examen-app'
    // Contexte Kubernetes
    KUBE_CONTEXT   = 'minikube'
  }

  stages {
    // 1. Récupération du code Git
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    // 2. Construction de l'image Docker
    stage('Build Docker Image') {
      steps {
        sh "docker build -t ${DOCKERHUB_REPO}:${env.BRANCH_NAME} ."
      }
    }

    // 3. Publication de l'image sur DockerHub
    stage('Push to DockerHub') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'USER',
          passwordVariable: 'PWD'
        )]) {
          sh "echo \$PWD | docker login -u \$USER --password-stdin"
          sh "docker push ${DOCKERHUB_REPO}:${env.BRANCH_NAME}"
        }
      }
    }

    // 4. Déploiement sur Kubernetes via Helm
    stage('Deploy to Kubernetes') {
      steps {
        script {
          // namespace = branch sauf si master → prod
          def ns = (env.BRANCH_NAME == 'master') ? 'prod' : env.BRANCH_NAME
          sh "kubectl config use-context ${KUBE_CONTEXT} && " +
             "helm upgrade --install examen-app charts/examen --namespace ${ns} --set 
image.tag=${env.BRANCH_NAME}"
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

