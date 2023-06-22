pipeline {
    agent any
	
	tools {nodejs "node"}

// Hago la pipeline reutilizable parametrizando el nombre y el tag de la imagen de Docker

    parameters {

      string(
        name: "nodejs-holamundo",
        defaultValue: "" ,
        description: "Docker image name",
      )

      string(
        name: "v1",
        defaultValue: "" ,
        description: "Docker image TAG",
      )
    }

// Como se usa un repositorio público no hay que añadir credenciales de git
    stages {
        stage('Checkout') {
            steps {
		sh('rm -rf mercadona')
                sh('git clone https://github.com/m1c4lv/mercadona.git')
            }
        }
		
	stage('Instalación de dependencias') {
            steps {
		dir("mercadona") {
                	sh('npm install')
                	sh('yes | npm install eslint --save-dev')  // Instalación linter
			sh('yes | npm install --save-dev eslint-plugin-jest')
		}
            }
	}

// Documentación de linter en node: https://mojitocoder.medium.com/how-to-add-code-linting-for-a-node-js-project-b210d8759cd5

        stage('Inicializar linter') {                // Configuración del linter de node
            steps {
		dir("mercadona") {
                	sh('./node_modules/.bin/eslint --init')
                	sh('rm -rf .eslintrc.js')
                	sh('cp my-eslintrc.js .eslintrc.js')
		}
            }
	}
		
	stage('Linteo') {
            steps {
		dir("mercadona") {    
			sh('npm run lint')
			sh('npm run lint-fix')
		}
            }
	}
		
	stage('Test') {
            steps {
		dir("mercadona") {
                	sh 'npm test'
		}
            }
	}
		
	stage('Build de la imagen Docker') {
            steps {
		dir("mercadona") {
                	script {
				def dockerImage = docker.build("m1c4lv/${IMAGE_NAME}:${TAG}", '.')
			}
		}
            }
	}
		
	stage('Subida al registry') {
            steps {
		dir("mercadona") {
                	script {
				docker.withRegistry('https://hub.docker.com', 'dockerhubcredentials') {
				dockerImage.push()
					}
				}
		}
		}
	}
// Supongo que el namespace está ya creado, si no hay que añadir el paso de crearlo primero
// Es necesario crear el secreto kubeconfig con el contenido del fichero .kube/config
		
		stage('Despliegue en kubernetes en un namespace') {
            steps {
		    echo 'Simulando despliegue en kubernetes'
                //withCredentials([file(credentialsId: 'kubeconfig', variable: 'kubeconfig')]) {  // Secreto de tipo file con el kubeconfig
					//sh '''            
						//# Crear despliegue en el Namespace
						//kubectl --kubeconfig=$kubeconfig --namespace mercadona-namespace create deployment mercadona-holamundo --image=m1c4lv/${IMAGE_NAME}:${TAG}
					//'''
				//}
            }
		}
		
		stage('Elimina la imagen Docker') {
                steps{
                  sh "docker rmi --force m1c4lv/${IMAGE_NAME}:${TAG}"
                }

        
		}
	}
}
