pipeline {
    agent any
    environment {
        PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin"
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build') {
            steps {
                sh 'docker build -t magicarpe1/examen-app:${BRANCH_NAME} .'
            }
        }
        stage('Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    sh 'echo $PASSWORD | docker login -u $USERNAME --password-stdin'
                    sh 'docker push magicarpe1/examen-app:${BRANCH_NAME}'
                }
            }
        }
        stage('Deploy') {
            steps {
                sh '''
                kubectl config use-context minikube
                helm upgrade --install examen-app ./charts/examen --namespace main --create-namespace --set image.tag=${BRANCH_NAME}
                '''
            }
        }
    }
    post {
        failure {
            echo "❌ Pipeline échoué pour ${env.BRANCH_NAME}"
        }
        success {
            echo "✅ Pipeline réussi pour ${env.BRANCH_NAME}"
        }
    }
}

