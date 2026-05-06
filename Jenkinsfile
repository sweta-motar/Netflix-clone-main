pipeline {

```
agent {
    label 'docker'
}

environment {
    IMAGE_NAME = "swetamotar/netflix-clone:latest"
    DOCKER_HOST = "unix:///var/run/docker.sock"
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

    stage('Check Docker Access') {
        steps {
            sh '''
            #!/bin/bash

            whoami
            docker ps
            '''
        }
    }

    stage('Clean Old Images') {
        steps {
            sh '''
            #!/bin/bash

            docker rmi -f $IMAGE_NAME || true
            '''
        }
    }

    stage('Build Docker Image') {
        steps {
            withCredentials([string(credentialsId: 'TMDB_API_KEY', variable: 'API_KEY')]) {

                sh '''
                #!/bin/bash

                docker build --no-cache \
                -t $IMAGE_NAME \
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
            #!/bin/bash

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

    stage('Docker Login') {

        steps {

            withCredentials([usernamePassword(
                credentialsId: 'dockerhub',
                usernameVariable: 'DOCKER_USER',
                passwordVariable: 'DOCKER_PASS'
            )]) {

                sh '''
                #!/bin/bash

                echo $DOCKER_PASS | docker login \
                -u $DOCKER_USER \
                --password-stdin
                '''
            }
        }
    }

    stage('Push Docker Image') {
        steps {

            sh '''
            #!/bin/bash

            docker push $IMAGE_NAME
            '''
        }
    }

    stage('Deploy to Kubernetes') {

        steps {

            sh '''
            #!/bin/bash

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
```

Application deployed successfully 🚀

Kubernetes Deployment Updated

Build Number: ${env.BUILD_NUMBER}

Jenkins:
${env.BUILD_URL}
"""
}

```
    failure {

        mail to: 'swetamotar@gmail.com',

             subject: 'Build Failed ❌',

             body: """
```

Build failed.

Check Jenkins Logs:
${env.BUILD_URL}
"""
}
}
}
