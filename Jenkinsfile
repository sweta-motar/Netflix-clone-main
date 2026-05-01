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

        stage('Build Docker Image') {
            steps {
                withCredentials([string(credentialsId: 'TMDB_API_KEY', variable: 'API_KEY')]) {
                    sh '''
                    docker build --no-cache -t $IMAGE_NAME \
                    --build-arg TMDB_V3_API_KEY=$API_KEY \
                    --build-arg VITE_API_URL=http://localhost:8000 \
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

        stage('Deploy Container') {
            steps {
                sh '''
                docker rm -f $CONTAINER_NAME || true
                docker rm -f vigorous_mclean || true
                docker run -d -p 8091:80 \
                --name $CONTAINER_NAME \
                $IMAGE_NAME
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

Frontend:
http://localhost:8091

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