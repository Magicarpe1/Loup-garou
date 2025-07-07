pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub-creds'
        DOCKERHUB_REPO = 'magicarpe1/examen-app'
        IMAGE_TAG = "${env.BRANCH_NAME}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'docker build -t ${DOCKERHUB_REPO}:${IMAGE_TAG} .'
            }
        }

        stage('Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    sh 'echo "$PASSWORD" | docker login -u "$USERNAME" --password-stdin'
                    sh 'docker push ${DOCKERHUB_REPO}:${IMAGE_TAG}'
                }
            }
        }

        stage('Deploy') {
            steps {
                sh 'kubectl config use-context minikube'
                sh 'helm upgrade --install examen-app ./charts/examen --namespace main --create-namespace --set image.tag=${IMAGE_TAG}'
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline réussi pour ${env.BRANCH_NAME}"
        }
        failure {
            echo "❌ Pipeline échoué pour ${env.BRANCH_NAME}"
        }
    }
}
