post {
    success {
        mail to: 'swetamotar@gmail.com',
             subject: 'Build Success ✅',
             body: """
Build Status: SUCCESS

Application URL:
http://192.168.1.5:8091

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
