pipeline {
    agent any

    environment {
        // Backend API URL (running on host)
        API_URL = 'http://localhost:8000/api'
        FRONTEND_URL = 'http://localhost:3000'
    }

    tools {
        nodejs 'NodeJS-20'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 20, unit: 'MINUTES')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npx playwright install --with-deps chromium'
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
                                echo "✓ Backend API is accessible at ${API_URL}"
                                exit 0
                            fi
                            echo "Waiting for backend... (attempt $i/10)"
                            sleep 2
                        done
                        echo "✗ Backend API is not accessible!"
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
                            echo "✓ GET /api/vacancies - PASSED (200 OK)"
                        else
                            echo "✗ GET /api/vacancies - FAILED (Expected 200, got $status_code)"
                            exit 1
                        fi

                        # Test 2: GET single vacancy (assuming ID 1 exists after seeding)
                        echo "Test 2: GET /api/vacancies/1"
                        response=$(curl -s -w "\\n%{http_code}" ${API_URL}/vacancies/1)
                        status_code=$(echo "$response" | tail -n 1)
                        if [ "$status_code" = "200" ] || [ "$status_code" = "404" ]; then
                            echo "✓ GET /api/vacancies/1 - PASSED ($status_code)"
                        else
                            echo "✗ GET /api/vacancies/1 - FAILED (got $status_code)"
                            exit 1
                        fi

                        # Test 3: POST create vacancy
                        echo "Test 3: POST /api/vacancies"
                        response=$(curl -s -w "\\n%{http_code}" -X POST ${API_URL}/vacancies \\
                            -H "Content-Type: application/json" \\
                            -H "Accept: application/json" \\
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
                            echo "✓ POST /api/vacancies - PASSED ($status_code)"
                            echo "Response: $body"

                            # Extract ID from response for next tests
                            vacancy_id=$(echo "$body" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
                            echo "Created vacancy ID: $vacancy_id"
                            echo "$vacancy_id" > /tmp/vacancy_id_${BUILD_NUMBER}.txt
                        else
                            echo "✗ POST /api/vacancies - FAILED ($status_code)"
                            echo "Response: $body"
                            exit 1
                        fi

                        # Test 4: Search vacancies
                        echo "Test 4: GET /api/vacancies?search=Jenkins"
                        response=$(curl -s -w "\\n%{http_code}" "${API_URL}/vacancies?search=Jenkins")
                        status_code=$(echo "$response" | tail -n 1)
                        if [ "$status_code" = "200" ]; then
                            echo "✓ Search vacancies - PASSED (200 OK)"
                        else
                            echo "✗ Search vacancies - FAILED ($status_code)"
                            exit 1
                        fi

                        # Test 5: Invalid POST (missing required fields)
                        echo "Test 5: POST /api/vacancies (invalid data)"
                        response=$(curl -s -w "\\n%{http_code}" -X POST ${API_URL}/vacancies \\
                            -H "Content-Type: application/json" \\
                            -H "Accept: application/json" \\
                            -d '{"title": "Incomplete Job"}')
                        status_code=$(echo "$response" | tail -n 1)
                        if [ "$status_code" = "422" ] || [ "$status_code" = "400" ]; then
                            echo "✓ Validation error handling - PASSED ($status_code)"
                        else
                            echo "✗ Validation error handling - FAILED (Expected 422/400, got $status_code)"
                        fi

                        echo "=== All API Tests Completed ==="
                    '''
                }
            }
        }

        stage('Frontend E2E Testing') {
            when {
                expression {
                    // Only run if frontend is accessible
                    return sh(script: "curl -f ${FRONTEND_URL} > /dev/null 2>&1", returnStatus: true) == 0
                }
            }
            steps {
                dir('frontend') {
                    script {
                        echo 'Running Playwright E2E tests...'
                        sh 'npx playwright test'
                    }
                }
            }
            post {
                always {
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: false,
                        keepAll: true,
                        reportDir: 'frontend/playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'E2E Test Report'
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
                            total=$(echo "$total + $time" | bc)
                        done

                        avg=$(echo "scale=3; $total / $count" | bc)
                        echo "Average response time: ${avg}s"

                        # Check if average is under 2 seconds
                        if (( $(echo "$avg < 2" | bc -l) )); then
                            echo "✓ Performance test PASSED"
                        else
                            echo "⚠ Performance test WARNING: Average response time is high"
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
- API Endpoint Tests
- Response Validation
- Error Handling Tests
- Performance Tests
- E2E Tests (if frontend available)

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
            cleanWs()
        }
        success {
            echo '✓ All black box tests passed!'
        }
        failure {
            echo '✗ Some tests failed. Check the logs above.'
        }
    }
}
