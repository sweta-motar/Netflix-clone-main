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
                    docker build -t $IMAGE_NAME \
                    --build-arg TMDB_V3_API_KEY=$API_KEY .
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
                 body: "App deployed at http://localhost:8091"
        }
        failure {
            mail to: 'swetamotar@gmail.com',
                 subject: 'Build Failed ❌',
                 body: "Check Jenkins logs"
        }
    }
}
