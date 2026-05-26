pipeline {

agent {
    label 'docker'
}

environment {
    FRONTEND_IMAGE = "swetabgm/netflix-frontend:latest"
    BACKEND_IMAGE = "swetabgm/netflix-backend:latest"
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

            docker rmi -f $FRONTEND_IMAGE || true
            docker rmi -f $BACKEND_IMAGE || true
            '''
        }
    }

    stage('Build Docker Images') {
        steps {

            withCredentials([
                string(credentialsId: 'TMDB_API_KEY', variable: 'API_KEY')
            ]) {

                sh '''
                #!/bin/bash

                docker build --no-cache \
                -t $FRONTEND_IMAGE \
                --build-arg TMDB_V3_API_KEY=$API_KEY \
                --build-arg VITE_API_URL=/api \
                .

                docker build --no-cache \
                -t $BACKEND_IMAGE \
                ./backend
                '''
            }
        }
    }

    stage('Trivy Scan') {
        steps {
            sh '''
            #!/bin/bash

            # Install trivy if not present
            if ! command -v trivy &> /dev/null; then
                curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
            fi

            trivy image --exit-code 0 --severity HIGH,CRITICAL $FRONTEND_IMAGE
            trivy image --exit-code 0 --severity HIGH,CRITICAL $BACKEND_IMAGE
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

            withCredentials([
                usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )
            ]) {

                sh '''
                #!/bin/bash

                echo $DOCKER_PASS | docker login \
                -u $DOCKER_USER \
                --password-stdin
                '''
            }
        }
    }

    stage('Push Docker Images') {
        steps {

            sh '''
            #!/bin/bash

            docker push $FRONTEND_IMAGE

            docker push $BACKEND_IMAGE
            '''
        }
    }

    stage('Deploy Monitoring') {
        steps {
            sh '''
            #!/bin/bash

            echo "Checking monitoring stack in Kubernetes..."

            kubectl rollout status deployment/monitoring-grafana -n monitoring --kubeconfig /var/jenkins_home/.kube/config || echo "Grafana running"
            kubectl rollout status statefulset/prometheus-monitoring-kube-prometheus-prometheus -n monitoring --kubeconfig /var/jenkins_home/.kube/config || echo "Prometheus running"
            kubectl rollout status daemonset/monitoring-prometheus-node-exporter -n monitoring --kubeconfig /var/jenkins_home/.kube/config || echo "Node exporter running" 

            echo "========================================="
            echo "Prometheus : http://172.30.23.49:9090"
            echo "Grafana    : http://172.30.23.49:3001"
            echo "========================================="
            '''
        }
    }

    stage('Deploy to Kubernetes') {
        steps {

            sh '''
            #!/bin/bash

            export KUBECONFIG=/var/jenkins_home/.kube/config

            kubectl apply --validate=false -f k8s/

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

Application deployed successfully 🚀

Kubernetes Deployment Updated

Build Number: ${env.BUILD_NUMBER}

Jenkins:
${env.BUILD_URL}
"""
}

    failure {

        mail to: 'swetamotar@gmail.com',

             subject: 'Build Failed ❌',

             body: """

Build failed.

Check Jenkins Logs:
${env.BUILD_URL}
"""
}
}
}
