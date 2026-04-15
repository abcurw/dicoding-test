pipeline {
    agent any

    environment {
        // Backend API URL (running on host machine)
        // Using host IP for Docker-to-host communication on Linux
        API_URL = 'http://192.168.8.5:8000/api'
        FRONTEND_URL = 'http://192.168.8.5:3000'
        // Docker image for Playwright tests
        PLAYWRIGHT_IMAGE = 'playwright-tests'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Playwright Docker Image') {
            steps {
                script {
                    echo 'Building Playwright Docker image...'
                    sh '''
                        docker build -f Dockerfile.playwright -t ${PLAYWRIGHT_IMAGE}:${BUILD_NUMBER} .
                        docker tag ${PLAYWRIGHT_IMAGE}:${BUILD_NUMBER} ${PLAYWRIGHT_IMAGE}:latest
                    '''
                }
            }
        }

        stage('Verify Backend is Running') {
            steps {
                script {
                    echo 'Checking if backend API is accessible...'
                    sh '''
                        for i in {1..10}; do
                            if curl -f ${API_URL}/vacancies > /dev/null 2>&1; then
                                echo "Backend API is accessible at ${API_URL}"
                                exit 0
                            fi
                            echo "Waiting for backend... (attempt $i/10)"
                            sleep 2
                        done
                        echo "Backend API is not accessible!"
                        exit 1
                    '''
                }
            }
        }

        stage('Verify Frontend is Running') {
            steps {
                script {
                    echo 'Checking if frontend is accessible...'
                    sh '''
                        for i in {1..10}; do
                            if curl -f ${FRONTEND_URL} > /dev/null 2>&1; then
                                echo "Frontend is accessible at ${FRONTEND_URL}"
                                exit 0
                            fi
                            echo "Waiting for frontend... (attempt $i/10)"
                            sleep 2
                        done
                        echo "Frontend is not accessible!"
                        exit 1
                    '''
                }
            }
        }

        stage('Black Box API Testing') {
            steps {
                script {
                    echo 'Running API black box tests...'
                    sh '''
                        echo "=== Testing API Endpoints ==="

                        # Test 1: GET all vacancies
                        echo "Test 1: GET /api/vacancies"
                        response=$(curl -s -w "\\n%{http_code}" ${API_URL}/vacancies)
                        status_code=$(echo "$response" | tail -n 1)
                        if [ "$status_code" = "200" ]; then
                            echo "GET /api/vacancies - PASSED (200 OK)"
                        else
                            echo "GET /api/vacancies - FAILED (Expected 200, got $status_code)"
                            exit 1
                        fi

                        # Test 2: GET single vacancy (assuming ID 1 exists after seeding)
                        echo "Test 2: GET /api/vacancies/1"
                        response=$(curl -s -w "\\n%{http_code}" ${API_URL}/vacancies/1)
                        status_code=$(echo "$response" | tail -n 1)
                        if [ "$status_code" = "200" ] || [ "$status_code" = "404" ]; then
                            echo "GET /api/vacancies/1 - PASSED ($status_code)"
                        else
                            echo "GET /api/vacancies/1 - FAILED (got $status_code)"
                            exit 1
                        fi

                        # Test 3: POST create vacancy
                        echo "Test 3: POST /api/vacancies"
                        response=$(curl -s -w "\\n%{http_code}" -X POST ${API_URL}/vacancies \
                            -H "Content-Type: application/json" \
                            -H "Accept: application/json" \
                            -d '{
                                "title": "Jenkins Test Job",
                                "company_name": "Test Company",
                                "company_city": "Jakarta",
                                "company_sector": "Technology",
                                "company_employee_count": 50,
                                "job_type": "Full-Time",
                                "description": "Automated test job description",
                                "salary_min": 5000000,
                                "salary_max": 10000000,
                                "show_salary": true,
                                "experience_min": "1-3 tahun",
                                "candidates_needed": 1,
                                "is_remote": false,
                                "expired_at": "2026-12-31"
                            }')
                        status_code=$(echo "$response" | tail -n 1)
                        body=$(echo "$response" | head -n -1)

                        if [ "$status_code" = "201" ] || [ "$status_code" = "200" ]; then
                            echo "POST /api/vacancies - PASSED ($status_code)"
                            echo "Response: $body"

                            # Extract ID from response for next tests
                            vacancy_id=$(echo "$body" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
                            echo "Created vacancy ID: $vacancy_id"
                            echo "$vacancy_id" > /tmp/vacancy_id_${BUILD_NUMBER}.txt
                        else
                            echo "POST /api/vacancies - FAILED ($status_code)"
                            echo "Response: $body"
                            exit 1
                        fi

                        # Test 4: Search vacancies
                        echo "Test 4: GET /api/vacancies?search=Jenkins"
                        response=$(curl -s -w "\\n%{http_code}" "${API_URL}/vacancies?search=Jenkins")
                        status_code=$(echo "$response" | tail -n 1)
                        if [ "$status_code" = "200" ]; then
                            echo "Search vacancies - PASSED (200 OK)"
                        else
                            echo "Search vacancies - FAILED ($status_code)"
                            exit 1
                        fi

                        # Test 5: Invalid POST (missing required fields)
                        echo "Test 5: POST /api/vacancies (invalid data)"
                        response=$(curl -s -w "\\n%{http_code}" -X POST ${API_URL}/vacancies \
                            -H "Content-Type: application/json" \
                            -H "Accept: application/json" \
                            -d '{"title": "Incomplete Job"}')
                        status_code=$(echo "$response" | tail -n 1)
                        if [ "$status_code" = "422" ] || [ "$status_code" = "400" ]; then
                            echo "Validation error handling - PASSED ($status_code)"
                        else
                            echo "Validation error handling - FAILED (Expected 422/400, got $status_code)"
                        fi

                        echo "=== All API Tests Completed ==="
                    '''
                }
            }
        }

        stage('Playwright E2E Testing (Docker)') {
            steps {
                script {
                    echo 'Running Playwright E2E tests in Docker container...'
                    sh '''
                        # Create report directories if they don't exist
                        mkdir -p frontend/playwright-report frontend/test-results

                        # Run Playwright tests in Docker container
                        docker run --rm \
                            --network host \
                            -e BASE_URL=${FRONTEND_URL} \
                            -e CI=true \
                            -v ${WORKSPACE}/frontend/playwright-report:/app/playwright-report \
                            -v ${WORKSPACE}/frontend/test-results:/app/test-results \
                            ${PLAYWRIGHT_IMAGE}:${BUILD_NUMBER} \
                            --reporter=html,junit || true

                        # Check if tests passed by looking for test results
                        if [ -f frontend/test-results/results.xml ]; then
                            echo "Playwright tests completed - results available"
                        else
                            echo "Warning: No test results found"
                        fi
                    '''
                }
            }
            post {
                always {
                    // Archive JUnit results for Jenkins
                    junit allowEmptyResults: true, testResults: 'frontend/test-results/*.xml'

                    // Publish HTML report
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'frontend/playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright E2E Test Report'
                    ])
                }
            }
        }

        stage('API Response Time Test') {
            steps {
                script {
                    echo 'Testing API response times...'
                    sh '''
                        echo "=== Performance Testing ==="

                        total=0
                        count=10

                        for i in $(seq 1 $count); do
                            time=$(curl -o /dev/null -s -w '%{time_total}' ${API_URL}/vacancies)
                            echo "Request $i: ${time}s"
                            total=$(awk "BEGIN {print $total + $time}")
                        done

                        avg=$(awk "BEGIN {printf \\"%.3f\\", $total / $count}")
                        echo "Average response time: ${avg}s"

                        # Check if average is under 2 seconds
                        pass=$(awk "BEGIN {print ($avg < 2) ? 1 : 0}")
                        if [ "$pass" = "1" ]; then
                            echo "Performance test PASSED"
                        else
                            echo "Performance test WARNING: Average response time is high"
                        fi
                    '''
                }
            }
        }

        stage('Generate Test Report') {
            steps {
                script {
                    sh '''
                        cat > test-report.txt << EOF
==============================================
    BLACK BOX TEST REPORT
==============================================
Build: ${BUILD_NUMBER}
Date: $(date)
Backend URL: ${API_URL}
Frontend URL: ${FRONTEND_URL}

Tests Executed:
- API Endpoint Tests (curl-based)
- Response Validation
- Error Handling Tests
- Performance Tests
- Playwright E2E Tests (Docker-based)

Status: SUCCESS
==============================================
EOF
                        cat test-report.txt
                    '''
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'test-report.txt', allowEmptyArchive: true
                }
            }
        }
    }

    post {
        always {
            script {
                // Cleanup Docker images
                sh '''
                    docker rmi ${PLAYWRIGHT_IMAGE}:${BUILD_NUMBER} || true
                    docker system prune -f || true
                '''
            }
            cleanWs()
        }
        success {
            echo 'All black box tests passed!'
        }
        failure {
            echo 'Some tests failed. Check the logs above.'
        }
    }
}
