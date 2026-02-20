pipeline {

    agent any

    environment {
        SERVER = "ubuntu@3.109.122.40"
        BASE_DIR = "/var/www/node-rollback-app"
        RELEASE = "release-${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Create Release') {
            steps {
                sh '''
                mkdir -p build
                cp -r * build/
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh """
                rsync -avz build/ ${SERVER}:${BASE_DIR}/releases/${RELEASE}
                """
            }
        }

        stage('Update Current Symlink') {
            steps {
                sh """
                ssh ${SERVER} "
                    ln -sfn ${BASE_DIR}/releases/${RELEASE} ${BASE_DIR}/current
                    cd ${BASE_DIR}/current
                    pm2 startOrRestart ecosystem.config.js
                "
                """
            }
        }

    }

    post {

        failure {

            echo "Deployment failed — rolling back"

            sh """
            ssh ${SERVER} "
                cd ${BASE_DIR}/releases
                PREVIOUS=\\\$(ls -t | sed -n 2p)

                if [ ! -z '\\\$PREVIOUS' ]; then
                    ln -sfn ${BASE_DIR}/releases/\\\$PREVIOUS ${BASE_DIR}/current
                    cd ${BASE_DIR}/current
                    pm2 restart ecosystem.config.js
                fi
            "
            """

        }
    }
}