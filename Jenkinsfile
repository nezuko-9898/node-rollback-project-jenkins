pipeline {

    agent any

    environment {
        SERVER   = "ubuntu@13.201.223.177"
        BASE_DIR = "/var/www/node-rollback-app"
        RELEASE  = "release-${BUILD_NUMBER}"
        APP_NAME = "node-rollback-project"
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
                rsync -av --exclude=build --exclude=.git ./ build/
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh """
                ssh ${SERVER} "mkdir -p ${BASE_DIR}/releases/${RELEASE}"
                rsync -avz build/ ${SERVER}:${BASE_DIR}/releases/${RELEASE}
                """
            }
        }

        stage('Start New Release') {
            steps {
                sh """
                ssh ${SERVER} "
                    ln -sfn ${BASE_DIR}/releases/${RELEASE} ${BASE_DIR}/current
                    cd ${BASE_DIR}/current

                    npm install --production

                    pm2 delete ${APP_NAME} || true
                    pm2 start ecosystem.config.js
                "
                """
            }
        }

        stage('Health Check') {
            steps {
                sh """
                sleep 5
                ssh ${SERVER} "
                    curl -f http://13.201.223.177:3000 || exit 1
                "
                """
            }
        }
    }

    post {

        success {

            echo "Deployment successful — deleting old releases"

            sh """
            ssh ${SERVER} "

                cd ${BASE_DIR}/releases || exit 0

                # Get current active release
                CURRENT=\\\$(basename \\\$(readlink ${BASE_DIR}/current))

                echo Current active release: \\\$CURRENT

                # Delete all releases except current
                for DIR in *; do
                    if [ \\"\\\$DIR\\" != \\"\\\$CURRENT\\" ]; then
                        rm -rf \\\$DIR
                    fi
                done
            "
            """
        }

        failure {

            echo "Deployment failed — rolling back"

            sh """
            ssh ${SERVER} "
                cd ${BASE_DIR}/releases || exit 0

                PREVIOUS=\\\$(ls -t | sed -n 2p)

                if [ ! -z \\"\\\$PREVIOUS\\" ]; then
                    ln -sfn ${BASE_DIR}/releases/\\\$PREVIOUS ${BASE_DIR}/current
                    cd ${BASE_DIR}/current

                    pm2 delete ${APP_NAME} || true
                    pm2 start ecosystem.config.js
                fi

                # delete failed release
                rm -rf ${BASE_DIR}/releases/${RELEASE}
            "
            """
        }
    }
}