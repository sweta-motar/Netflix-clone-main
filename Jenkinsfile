pipeline {
    agent any

    environment {
        IMAGE_NAME = "netflix-clone"
        CONTAINER_NAME = "netflix-container"
    }

    triggers {
        githubPush()
    }

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/sweta-motar/Netflix-clone-main.git'
            }
        }

        stage('Clean Old') {
            steps {
                sh '''
                docker rm -f $CONTAINER_NAME || true
                docker rmi -f $IMAGE_NAME || true
                '''
            }
        }

        stage('Build Docker Image (Minikube)') {
            steps {
                withCredentials([string(credentialsId: 'TMDB_API_KEY', variable: 'API_KEY')]) {
                    sh '''
                    eval $(minikube docker-env)

                    docker build --no-cache -t $IMAGE_NAME \
                    --build-arg TMDB_V3_API_KEY=$API_KEY \
                    --build-arg VITE_API_URL=http://192.168.49.2:30008/api \
                    .
                    '''
                }
            }
        }

        stage('Trivy Scan') {
            steps {
                sh '''
                docker run --rm \
                -v /var/run/docker.sock:/var/run/docker.sock \
                aquasec/trivy image $IMAGE_NAME
                '''
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('sonar') {
                    script {
                        def scannerHome = tool 'sonar-scanner'
                        sh """
                        ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=netflix \
                        -Dsonar.sources=.
                        """
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl apply -f k8s/
                kubectl rollout restart deployment frontend
                kubectl rollout restart deployment backend
                '''
            }
        }
    }

    post {
        success {
            mail to: 'swetamotar@gmail.com',
                 subject: 'Build Success ✅',
                 body: """
Application is LIVE 🚀

Run:
minikube service frontend

Build Number: ${env.BUILD_NUMBER}
Jenkins: ${env.BUILD_URL}
"""
        }

        failure {
            mail to: 'swetamotar@gmail.com',
                 subject: 'Build Failed ❌',
                 body: "Check logs: ${env.BUILD_URL}"
        }
    }
}