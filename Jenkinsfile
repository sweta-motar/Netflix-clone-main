pipeline {
    agent any

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'main', url: 'https://github.com/sweta-motar/Netflix-clone-main.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                withCredentials([string(credentialsId: 'TMDB_API_KEY', variable: 'API_KEY')]) {
                    sh '''
                    docker build -t netflix-clone \
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
                sh 'docker run -d -p 8091:80 --name netflix-container netflix-clone'
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
http://localhost:8091

Jenkins Build Details:
${env.BUILD_URL}
"""
        }

        failure {
            mail to: 'swetamotar@gmail.com',
                 subject: 'Build Failed ❌',
                 body: """
Build Status: FAILED

Check Jenkins Logs:
${env.BUILD_URL}
"""
        }
    }
}
