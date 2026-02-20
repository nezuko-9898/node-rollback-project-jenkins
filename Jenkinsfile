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
                rm -rf build
                mkdir build
                 rsync -av --exclude=build --exclude=node_modules --exclude=.git ./ build/
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

        // ✅ NEW HEALTH CHECK STAGE
        stage('Health Check') {
            steps {
                sh """
                sleep 5
                ssh ${SERVER} "
                    curl -f http://3.109.122.40:3000 || exit 1
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
                cd ${BASE_DIR}/releases || exit 0
                PREVIOUS=\\\$(ls -t | sed -n 2p)

                if [ ! -z \\"\\\$PREVIOUS\\" ]; then
                    ln -sfn ${BASE_DIR}/releases/\\\$PREVIOUS ${BASE_DIR}/current
                    cd ${BASE_DIR}/current
                    pm2 startOrRestart ecosystem.config.js
                fi
            "
            """
        }
    }
}