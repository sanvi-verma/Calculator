pipeline {
    agent any

    environment {
        SONAR_SCANNER_HOME = tool 'SonarQubeScanner'
        SONAR_PROJECT_KEY = 'calculator-api'
        WEBHOOK_URL = 'https://bd02-2409-40c0-3d-ff36-a984-8651-bb45-a047.ngrok-free.app'
        RENDER_DEPLOY_HOOK_URL = credentials('render-deploy-url')
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/sanvi-verma/Calculator.git', branch: 'main'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('backend') {
                    sh 'npm test'  // Runs Jest tests via package.json script
                }
            }
        }

        stage('Generate Backend Coverage') {
            steps {
                dir('backend') {
                    sh 'npm test -- --coverage'  // Generates coverage report
                }
            }
        }

        stage('SonarQube Analysis') {
           environment {
              SONAR_TOKEN = credentials('sonar-token')
       }
       steps {
          dir('backend') {
               withSonarQubeEnv('My SonarQube Server') {
                   sh """
                   npx sonar-scanner \
                   -Dsonar.projectKey=calculator-api \
                   -Dsonar.sources=. \
                   -Dsonar.exclusions=node_modules/**,coverage/lcov-report/**,test/** \
                   -Dsonar.tests=test \
                   -Dsonar.test.inclusions=test/**/*.js \
                   -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                   -Dsonar.host.url=http://host.docker.internal:9000 \
                   -Dsonar.token=$SONAR_TOKEN
                   """
              }
          }
      }
  }

        stage('Deploy') {
            steps {
                script {
                    sh """
                    curl -X POST -H 'Accept: application/json' -H 'Content-Type: application/json' '${env.RENDER_DEPLOY_HOOK_URL}'
                    """
                }
            }
        }
    }

   post {
    always {
        script {
            withCredentials([
                string(credentialsId: 'jenkins-username', variable: 'JENKINS_USERNAME'),
                string(credentialsId: 'api-token', variable: 'API_TOKEN'),
                string(credentialsId: 'secret-key', variable: 'SECRET_KEY'),
                string(credentialsId: 'iv-key', variable: 'IV_KEY'),
                string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')
            ]) {
                
                def WEBHOOK_URL = "${env.WEBHOOK_URL}"
                def getRawJson = { url ->
                    sh(script: "curl -s -u '$JENKINS_USERNAME:$API_TOKEN' '${url}'", returnStdout: true).trim()
                }

                def buildData = getRawJson("${env.JENKINS_URL}/job/${env.JOB_NAME}/${env.BUILD_NUMBER}/api/json")
                def stageDescribe = getRawJson("${env.JENKINS_URL}/job/${env.JOB_NAME}/${env.BUILD_NUMBER}/wfapi/describe")
                def testResult = getRawJson("${env.JENKINS_URL}/job/${env.JOB_NAME}/${env.BUILD_NUMBER}/testReport/api/json")
                
                def sonarqubeResult = sh(
                    script: "curl -s -u \"$SONAR_TOKEN:\" \"<SONARQUBE_SERVER>/api/measures/component?component=<PROJECT_KEY>&metricKeys=coverage\"",
                    returnStdout: true
                ).trim()
                
                // ✅ Parse JSON with readJSON
                writeFile file: 'stageDescribe.json', text: stageDescribe
                def parsedDescribe = readJSON file: 'stageDescribe.json'

                def nodeStageDataStr = parsedDescribe.stages.collect { stage ->
                    def nodeId = stage.id
                    def nodeData = getRawJson("${env.JENKINS_URL}/job/${env.JOB_NAME}/${env.BUILD_NUMBER}/execution/node/${nodeId}/wfapi/describe")
                    return """{"nodeId":${groovy.json.JsonOutput.toJson(nodeId)},"data":${nodeData}}"""
                }.join(',')

                def payloadStr = """{"build_data": ${buildData}, "node_stage_data": [${nodeStageDataStr}], "test_data": ${testResult}, "sonar_data": ${sonarqubeResult}}"""
                writeFile file: 'payload.json', text: payloadStr

                def checksum = sh(script: "sha256sum payload.json | awk '{print \$1}'", returnStdout: true).trim()

                def timestamp = System.currentTimeMillis().toString()
                def encryptedTimestamp = sh(script: """
                    echo -n '${timestamp}' | openssl enc -aes-256-cbc -base64 \\
                    -K \$(echo -n '${SECRET_KEY}' | xxd -p | tr -d '\\n') \\
                    -iv \$(echo -n '${IV_KEY}' | xxd -p | tr -d '\\n')
                """, returnStdout: true).trim()
            
                sh """
                    curl -X POST '${WEBHOOK_URL}' \\
                    -H "Content-Type: application/json" \\
                    -H "X-Encrypted-Timestamp: ${encryptedTimestamp}" \\
                    -H "X-Checksum: ${checksum}" \\
                    --data-binary @payload.json
                """
            }
        }
    }
}
}
