pipeline {
    agent any

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'main', url: 'https://github.com/sweta-motar/Netflix-clone-main.git'
            }
        }

        stage('Clean Old Images') {
            steps {
                 sh '''
                 docker rm -f netflix-container || true
                 docker rmi -f netflix-clone || true
                 '''
            }
        }

        stage('Build Docker Image') {
            steps {
                withCredentials([string(credentialsId: 'TMDB_API_KEY', variable: 'API_KEY')]) {
                    sh '''
                    docker build --no-cache -t netflix-clone:latest \
                    --build-arg TMDB_V3_API_KEY=$API_KEY .
                    '''
                }
            }
        }

        stage('Stop Old Container') {
            steps {
                sh 'docker rm -f netflix-container || true'
            }
        }

        stage('Run New Container') {
            steps {
                sh 'docker run -d -p 8091:80 --name netflix-container netflix-clone:latest'
            }
        }
    }

    post {
        success {
            mail to: 'swetamotar@gmail.com',
                 subject: 'Build Success ✅',
                 body: """
Build Status: SUCCESS

Application URL:
http://localhost:8091/?v=${env.BUILD_NUMBER}

Jenkins:
${env.BUILD_URL}
"""
        }
    }
}
