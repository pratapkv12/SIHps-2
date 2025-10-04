// KSEB Hybrid ML-SCADA System JavaScript
class KSEBSystem {
    constructor() {
        this.feeders = [
            {"id": "FDR001", "name": "Trivandrum North", "voltage": 11000, "current": 250, "power": 2.8, "temperature": 35, "status": "normal"},
            {"id": "FDR002", "name": "Kochi Industrial", "voltage": 10950, "current": 380, "power": 3.2, "temperature": 42, "status": "normal"},
            {"id": "FDR003", "name": "Kozhikode City", "voltage": 11100, "current": 190, "power": 2.1, "temperature": 38, "status": "normal"},
            {"id": "FDR004", "name": "Thrissur Central", "voltage": 10800, "current": 420, "power": 3.8, "temperature": 45, "status": "warning"},
            {"id": "FDR005", "name": "Kollam Coastal", "voltage": 8500, "current": 0, "power": 0, "temperature": 65, "status": "fault"},
            {"id": "FDR006", "name": "Palakkad Rural", "voltage": 11000, "current": 165, "power": 1.9, "temperature": 36, "status": "normal"},
            {"id": "FDR007", "name": "Malappuram Town", "voltage": 10980, "current": 290, "power": 2.6, "temperature": 40, "status": "normal"},
            {"id": "FDR008", "name": "Kannur Port", "voltage": 11050, "current": 210, "power": 2.3, "temperature": 39, "status": "normal"},
            {"id": "FDR009", "name": "Idukki Hills", "voltage": 11200, "current": 145, "power": 1.6, "temperature": 28, "status": "normal"},
            {"id": "FDR010", "name": "Wayanad Valley", "voltage": 10900, "current": 175, "power": 1.8, "temperature": 32, "status": "normal"}
        ];

        this.faultTypes = [
            {"code": "AG", "name": "Phase A to Ground", "severity": "major"},
            {"code": "BG", "name": "Phase B to Ground", "severity": "major"},
            {"code": "CG", "name": "Phase C to Ground", "severity": "major"},
            {"code": "AB", "name": "Phase A to Phase B", "severity": "critical"},
            {"code": "AC", "name": "Phase A to Phase C", "severity": "critical"},
            {"code": "BC", "name": "Phase B to Phase C", "severity": "critical"},
            {"code": "ABG", "name": "Phase AB to Ground", "severity": "critical"},
            {"code": "ACG", "name": "Phase AC to Ground", "severity": "critical"},
            {"code": "BCG", "name": "Phase BC to Ground", "severity": "critical"},
            {"code": "ABC", "name": "Three Phase Fault", "severity": "critical"}
        ];

        this.alarms = [
            {"id": "ALM001", "feeder": "FDR005", "type": "Line Break Detected", "severity": "critical", "time": "2025-09-28T22:05:15Z", "ml_confidence": 95.2},
            {"id": "ALM002", "feeder": "FDR004", "type": "High Temperature Warning", "severity": "major", "time": "2025-09-28T22:03:42Z", "ml_confidence": 78.5},
            {"id": "ALM003", "feeder": "FDR002", "type": "Overcurrent Detected", "severity": "minor", "time": "2025-09-28T21:58:30Z", "ml_confidence": 85.1}
        ];

        this.mlMetrics = {
            "accuracy": 99.87,
            "precision": 98.4,
            "recall": 97.2,
            "f1_score": 97.8,
            "total_predictions": 15420,
            "correct_predictions": 15403
        };

        this.systemHealth = {
            "scada_status": "online",
            "ml_engine_status": "active",
            "communication_health": 98.5,
            "uptime": "45 days 12 hours",
            "last_backup": "2025-09-28T20:00:00Z"
        };

        this.coordinates = [
            {"feeder": "FDR001", "lat": 8.5241, "lon": 76.9366},
            {"feeder": "FDR002", "lat": 9.9312, "lon": 76.2673},
            {"feeder": "FDR003", "lat": 11.2588, "lon": 75.7804},
            {"feeder": "FDR004", "lat": 10.5276, "lon": 76.2144},
            {"feeder": "FDR005", "lat": 8.8932, "lon": 76.6141},
            {"feeder": "FDR006", "lat": 10.7867, "lon": 76.6548},
            {"feeder": "FDR007", "lat": 11.0510, "lon": 76.0711},
            {"feeder": "FDR008", "lat": 11.8745, "lon": 75.3704},
            {"feeder": "FDR009", "lat": 9.8312, "lon": 76.9366},
            {"feeder": "FDR010", "lat": 11.6854, "lon": 76.1320}
        ];

        this.trendChart = null;
        this.historicalChart = null;
        this.trendData = {
            voltage: Array(20).fill(0).map(() => 11000 + (Math.random() - 0.5) * 400),
            current: Array(20).fill(0).map(() => 200 + Math.random() * 200),
            temperature: Array(20).fill(0).map(() => 30 + Math.random() * 20)
        };

        this.selectedFeeder = null;
        this.selectedAction = null;
        this.currentTab = 'dashboard';
        this.clockInterval = null;
        this.dataInterval = null;

        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupSystem();
            });
        } else {
            this.setupSystem();
        }
    }

    setupSystem() {
        this.setupEventListeners();
        this.updateClock();
        this.renderDashboard();
        this.initializeCharts();
        this.renderNetworkTopology();
        this.renderAnalytics();
        this.renderAlerts();
        this.startRealTimeUpdates();
        
        // Start clock updates immediately and every second
        this.startClockUpdates();
        // Start data simulation every 5 seconds
        this.startDataSimulation();
    }

    startClockUpdates() {
        // Clear any existing interval
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
        }
        
        // Update immediately
        this.updateClock();
        
        // Set up interval to update every second
        this.clockInterval = setInterval(() => {
            this.updateClock();
        }, 1000);
    }

    startDataSimulation() {
        // Clear any existing interval
        if (this.dataInterval) {
            clearInterval(this.dataInterval);
        }
        
        // Set up interval to simulate data every 5 seconds
        this.dataInterval = setInterval(() => {
            this.simulateRealTimeData();
        }, 5000);
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Control buttons - using event delegation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('control-btn')) {
                e.preventDefault();
                const action = e.target.classList.contains('isolate') ? 'isolate' : 'restore';
                const feederId = e.target.getAttribute('data-feeder-id');
                if (feederId) {
                    this.showControlModal(feederId, action);
                }
            }
        });

        // Refresh button
        const refreshBtn = document.getElementById('refreshData');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.renderDashboard();
            });
        }

        // Modal controls
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.closeModal();
            });
        }

        const cancelControl = document.getElementById('cancelControl');
        if (cancelControl) {
            cancelControl.addEventListener('click', () => {
                this.closeModal();
            });
        }

        const confirmControl = document.getElementById('confirmControl');
        if (confirmControl) {
            confirmControl.addEventListener('click', () => {
                this.executeControl();
            });
        }

        // Historical data loading
        const loadHistorical = document.getElementById('loadHistorical');
        if (loadHistorical) {
            loadHistorical.addEventListener('click', () => {
                this.loadHistoricalData();
            });
        }

        // Alarm management
        const acknowledgeAll = document.getElementById('acknowledgeAll');
        if (acknowledgeAll) {
            acknowledgeAll.addEventListener('click', () => {
                this.acknowledgeAllAlarms();
            });
        }

        const clearAlarms = document.getElementById('clearAlarms');
        if (clearAlarms) {
            clearAlarms.addEventListener('click', () => {
                this.clearResolvedAlarms();
            });
        }

        // Topology controls
        const zoomIn = document.getElementById('zoomIn');
        if (zoomIn) {
            zoomIn.addEventListener('click', () => {
                this.zoomTopology(1.2);
            });
        }

        const zoomOut = document.getElementById('zoomOut');
        if (zoomOut) {
            zoomOut.addEventListener('click', () => {
                this.zoomTopology(0.8);
            });
        }

        const resetView = document.getElementById('resetView');
        if (resetView) {
            resetView.addEventListener('click', () => {
                this.resetTopologyView();
            });
        }
    }

    updateClock() {
        const clockElement = document.getElementById('systemClock');
        if (clockElement) {
            const now = new Date();
            const timeString = now.toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
            clockElement.textContent = timeString;
        }
    }

    switchTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeContent = document.getElementById(tabName);
        if (activeContent) {
            activeContent.classList.add('active');
        }

        this.currentTab = tabName;

        // Refresh specific tab content
        switch(tabName) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'analytics':
                this.renderAnalytics();
                break;
            case 'alerts':
                this.renderDetailedAlarms();
                break;
            case 'topology':
                this.renderNetworkTopology();
                break;
            case 'historical':
                setTimeout(() => {
                    if (this.historicalChart) {
                        this.historicalChart.resize();
                    }
                }, 100);
                break;
        }
    }

    renderDashboard() {
        this.renderFeederTable();
        this.updateKPIs();
        this.renderAlarms();
        this.updateTrendChart();
    }

    updateKPIs() {
        const elements = {
            'systemUptime': this.systemHealth.uptime,
            'totalFeeders': this.feeders.length.toString(),
            'activeAlarms': this.alarms.length.toString(),
            'mlAccuracy': `${this.mlMetrics.accuracy}%`
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    renderFeederTable() {
        const tbody = document.getElementById('feederTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        this.feeders.forEach(feeder => {
            const row = document.createElement('tr');
            
            const statusClass = feeder.status === 'normal' ? 'status-normal' :
                              feeder.status === 'warning' ? 'status-warning' : 
                              feeder.status === 'isolated' ? 'status-warning' : 'status-fault';
            
            row.innerHTML = `
                <td>${feeder.id}</td>
                <td>${feeder.name}</td>
                <td>${feeder.voltage.toLocaleString()}</td>
                <td>${feeder.current}</td>
                <td>${feeder.power}</td>
                <td>${feeder.temperature}</td>
                <td><span class="status-indicator ${statusClass}">${feeder.status.toUpperCase()}</span></td>
                <td>
                    <button class="control-btn isolate" data-feeder-id="${feeder.id}">Isolate</button>
                    <button class="control-btn restore" data-feeder-id="${feeder.id}">Restore</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    initializeCharts() {
        // Trend Chart
        const trendCanvas = document.getElementById('trendChart');
        if (trendCanvas) {
            const trendCtx = trendCanvas.getContext('2d');
            this.trendChart = new Chart(trendCtx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 20}, (_, i) => {
                        const time = new Date();
                        time.setMinutes(time.getMinutes() - (19 - i));
                        return time.toLocaleTimeString('en-IN', {timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit'});
                    }),
                    datasets: [
                        {
                            label: 'Voltage (V)',
                            data: this.trendData.voltage,
                            borderColor: '#1FB8CD',
                            backgroundColor: 'rgba(31, 184, 205, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Current (A×25)',
                            data: this.trendData.current.map(v => v * 25),
                            borderColor: '#FFC185',
                            backgroundColor: 'rgba(255, 193, 133, 0.1)',
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: '#626c7c'
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            ticks: {
                                color: '#626c7c'
                            },
                            grid: {
                                color: 'rgba(94, 82, 64, 0.2)'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#626c7c'
                            },
                            grid: {
                                color: 'rgba(94, 82, 64, 0.2)'
                            }
                        }
                    }
                }
            });
        }

        // Historical Chart
        const historicalCanvas = document.getElementById('historicalChart');
        if (historicalCanvas) {
            const historicalCtx = historicalCanvas.getContext('2d');
            this.historicalChart = new Chart(historicalCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: []
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: '#626c7c'
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            ticks: {
                                color: '#626c7c'
                            },
                            grid: {
                                color: 'rgba(94, 82, 64, 0.2)'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#626c7c'
                            },
                            grid: {
                                color: 'rgba(94, 82, 64, 0.2)'
                            }
                        }
                    }
                }
            });
        }
    }

    updateTrendChart() {
        if (!this.trendChart) return;

        // Add new data point and remove oldest
        const newVoltage = 11000 + (Math.random() - 0.5) * 400;
        const newCurrent = 200 + Math.random() * 200;
        
        this.trendData.voltage.shift();
        this.trendData.voltage.push(newVoltage);
        
        this.trendData.current.shift();
        this.trendData.current.push(newCurrent);

        // Update time labels
        const newTime = new Date().toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        this.trendChart.data.labels.shift();
        this.trendChart.data.labels.push(newTime);
        
        this.trendChart.data.datasets[0].data = [...this.trendData.voltage];
        this.trendChart.data.datasets[1].data = this.trendData.current.map(v => v * 25);
        
        this.trendChart.update('none');
    }

    renderAlarms() {
        const container = document.getElementById('alarmsContainer');
        if (!container) return;
        
        container.innerHTML = '';

        this.alarms.forEach(alarm => {
            const alarmDiv = document.createElement('div');
            alarmDiv.className = `alarm-item alarm-${alarm.severity}`;
            
            const timeString = new Date(alarm.time).toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata'
            });

            alarmDiv.innerHTML = `
                <div class="alarm-content">
                    <div class="alarm-title">${alarm.type} - ${alarm.feeder}</div>
                    <div class="alarm-details">
                        <span>Time: ${timeString}</span>
                        <span>Severity: ${alarm.severity.toUpperCase()}</span>
                    </div>
                </div>
                <div class="alarm-confidence">
                    ML Confidence: ${alarm.ml_confidence}%
                </div>
            `;
            
            alarmDiv.addEventListener('click', () => {
                this.viewDetails(alarm.feeder);
            });
            
            container.appendChild(alarmDiv);
        });
    }

    renderDetailedAlarms() {
        const container = document.getElementById('detailedAlarms');
        if (!container) return;
        
        container.innerHTML = '';

        this.alarms.forEach((alarm, index) => {
            const alarmDiv = document.createElement('div');
            alarmDiv.className = `alarm-item alarm-${alarm.severity}`;
            
            const timeString = new Date(alarm.time).toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata'
            });

            const feederData = this.feeders.find(f => f.id === alarm.feeder);

            alarmDiv.innerHTML = `
                <div class="alarm-content">
                    <div class="alarm-title">${alarm.type}</div>
                    <div class="alarm-details">
                        <span>Feeder: ${feederData ? feederData.name : alarm.feeder}</span>
                        <span>Time: ${timeString}</span>
                        <span>Severity: ${alarm.severity.toUpperCase()}</span>
                        <span>ML Confidence: ${alarm.ml_confidence}%</span>
                    </div>
                </div>
                <div class="alarm-actions">
                    <button class="btn btn--sm btn--outline" onclick="ksebSystem.acknowledgeAlarm(${index})">Acknowledge</button>
                    <button class="btn btn--sm btn--secondary" onclick="ksebSystem.viewDetails('${alarm.feeder}')">View Details</button>
                </div>
            `;
            
            container.appendChild(alarmDiv);
        });
    }

    renderNetworkTopology() {
        const container = document.getElementById('topologyContainer');
        if (!container) return;
        
        container.innerHTML = '';

        // Create simplified network topology
        this.feeders.forEach((feeder, index) => {
            const node = document.createElement('div');
            node.className = `topology-node ${feeder.status}`;
            node.textContent = feeder.id;
            node.title = `${feeder.name} - ${feeder.status.toUpperCase()} - Click for details`;
            
            // Position nodes in a grid
            const col = index % 5;
            const row = Math.floor(index / 5);
            
            node.style.left = `${50 + col * 80}px`;
            node.style.top = `${50 + row * 100}px`;
            
            // Add click event for detailed analysis
            node.addEventListener('click', (e) => {
                e.preventDefault();
                this.showDetailedFeederAnalysis(feeder);
            });
            
            container.appendChild(node);

            // Add connection lines to next node (simplified)
            if (index < this.feeders.length - 1 && col < 4) {
                const line = document.createElement('div');
                line.className = 'topology-line';
                if (feeder.status === 'fault') line.classList.add('fault');
                
                line.style.left = `${110 + col * 80}px`;
                line.style.top = `${75 + row * 100}px`;
                line.style.width = '40px';
                line.style.height = '2px';
                
                container.appendChild(line);
            }
        });
    }

    showDetailedFeederAnalysis(feeder) {
        const prediction = this.runMLPrediction(feeder);
        const coords = this.coordinates.find(c => c.feeder === feeder.id);
        
        // Get historical fault pattern (simulated)
        const recentFaults = Math.floor(Math.random() * 5);
        const avgDowntime = (Math.random() * 30 + 10).toFixed(1);
        
        const analysisDetails = `
🔍 DETAILED FEEDER ANALYSIS REPORT
====================================

📊 BASIC INFORMATION
• Feeder ID: ${feeder.id}
• Name: ${feeder.name}
• Status: ${feeder.status.toUpperCase()}
• Location: ${coords ? `${coords.lat}°N, ${coords.lon}°E` : 'Coordinates unavailable'}

⚡ ELECTRICAL PARAMETERS
• Voltage: ${feeder.voltage}V (Nom: 11,000V)
• Current: ${feeder.current}A
• Power: ${feeder.power}MW
• Power Factor: ${(0.85 + Math.random() * 0.15).toFixed(2)}
• Temperature: ${feeder.temperature}°C

🤖 ML ANALYSIS RESULTS
• Prediction: ${prediction.status}
• Confidence Level: ${prediction.confidence}%
• Risk Assessment: ${prediction.confidence > 90 ? 'HIGH ACCURACY' : prediction.confidence > 80 ? 'MEDIUM ACCURACY' : 'LOW ACCURACY'}

📈 PERFORMANCE METRICS
• Recent Faults (7 days): ${recentFaults}
• Average Downtime: ${avgDowntime} minutes
• Reliability Index: ${(99.9 - Math.random() * 0.5).toFixed(2)}%
• Last Maintenance: ${Math.floor(Math.random() * 30 + 1)} days ago

🔧 OPERATIONAL STATUS
• Communication: ${Math.random() > 0.1 ? 'ONLINE' : 'DEGRADED'}
• Protection System: ${Math.random() > 0.05 ? 'ACTIVE' : 'MAINTENANCE REQUIRED'}
• Load Factor: ${(0.6 + Math.random() * 0.35).toFixed(2)}

⚠️ RECOMMENDATIONS
${feeder.status === 'fault' ? '• IMMEDIATE RESTORATION REQUIRED\n• Dispatch maintenance crew\n• Isolate affected section' : 
  feeder.status === 'warning' ? '• Monitor temperature closely\n• Schedule preventive maintenance\n• Check load distribution' : 
  '• Continue normal monitoring\n• No immediate action required'}

🕐 Report Generated: ${new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'})}
📞 Emergency Contact: KSEB Control Room: 0471-2514320
        `;
        
        alert(analysisDetails);
    }

    renderAnalytics() {
        // Render ML predictions
        this.renderPredictions();
        
        // Render fault types
        this.renderFaultTypes();
    }

    renderPredictions() {
        const container = document.getElementById('predictionResults');
        if (!container) return;
        
        container.innerHTML = '';

        this.feeders.forEach(feeder => {
            const prediction = this.runMLPrediction(feeder);
            
            const predictionDiv = document.createElement('div');
            predictionDiv.className = 'prediction-item';
            
            predictionDiv.innerHTML = `
                <div>
                    <div class="prediction-feeder">${feeder.name}</div>
                    <div class="prediction-status">Status: ${prediction.status}</div>
                </div>
                <div>
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${prediction.confidence}%"></div>
                    </div>
                    <div style="font-size: 12px; text-align: center; margin-top: 4px;">
                        ${prediction.confidence}%
                    </div>
                </div>
            `;
            
            container.appendChild(predictionDiv);
        });
    }

    renderFaultTypes() {
        const container = document.getElementById('faultTypesGrid');
        if (!container) return;
        
        container.innerHTML = '';

        this.faultTypes.forEach(faultType => {
            const faultDiv = document.createElement('div');
            faultDiv.className = `fault-type-item severity-${faultType.severity}`;
            
            faultDiv.innerHTML = `
                <div class="fault-code">${faultType.code}</div>
                <div class="fault-name">${faultType.name}</div>
            `;
            
            container.appendChild(faultDiv);
        });
    }

    runMLPrediction(feeder) {
        // Simplified ML algorithm using thresholds
        let confidence = 90 + Math.random() * 10;
        let status = 'Normal Operation';

        // Voltage analysis
        if (feeder.voltage < 10500 || feeder.voltage > 11500) {
            confidence *= 0.9;
            status = 'Voltage Anomaly Detected';
        }

        // Temperature analysis
        if (feeder.temperature > 50) {
            confidence *= 0.8;
            status = 'Thermal Overload Risk';
        }

        // Current analysis
        if (feeder.current === 0) {
            confidence = 95;
            status = 'Circuit Break Detected';
        } else if (feeder.current > 400) {
            confidence *= 0.85;
            status = 'Overcurrent Condition';
        }

        // Status-based predictions
        if (feeder.status === 'fault') {
            confidence = 95;
            status = 'Fault Confirmed';
        } else if (feeder.status === 'warning') {
            confidence = 85;
            status = 'Warning Condition';
        }

        return {
            status: status,
            confidence: Math.round(confidence * 10) / 10
        };
    }

    showControlModal(feederId, action) {
        const feeder = this.feeders.find(f => f.id === feederId);
        if (!feeder) return;
        
        const modal = document.getElementById('controlModal');
        const message = document.getElementById('controlMessage');
        
        if (modal && message) {
            message.textContent = `Are you sure you want to ${action} feeder ${feeder.name} (${feederId})?`;
            
            modal.classList.remove('hidden');
            this.selectedFeeder = feederId;
            this.selectedAction = action;
        }
    }

    closeModal() {
        const modal = document.getElementById('controlModal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.selectedFeeder = null;
        this.selectedAction = null;
    }

    executeControl() {
        if (!this.selectedFeeder || !this.selectedAction) return;

        const feeder = this.feeders.find(f => f.id === this.selectedFeeder);
        if (!feeder) return;
        
        if (this.selectedAction === 'isolate') {
            feeder.status = 'isolated';
            feeder.current = 0;
            feeder.power = 0;
        } else if (this.selectedAction === 'restore') {
            if (feeder.status !== 'fault') {
                feeder.status = 'normal';
                feeder.current = 150 + Math.random() * 200;
                feeder.power = Math.round(((feeder.voltage * feeder.current * 1.732 * 0.9) / 1000000) * 10) / 10;
            }
        }

        this.renderDashboard();
        this.closeModal();

        // Add system log
        console.log(`Control action executed: ${this.selectedAction} on ${this.selectedFeeder}`);
    }

    loadHistoricalData() {
        const startDateElement = document.getElementById('startDate');
        const endDateElement = document.getElementById('endDate');
        
        if (!startDateElement || !endDateElement || !this.historicalChart) return;
        
        const startDate = startDateElement.value;
        const endDate = endDateElement.value;
        
        // Generate mock historical data
        const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
        const labels = [];
        const voltageData = [];
        const currentData = [];
        const faultData = [];

        for (let i = 0; i <= days; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            labels.push(date.toLocaleDateString('en-IN'));
            
            voltageData.push(10800 + Math.random() * 600);
            currentData.push(200 + Math.random() * 300);
            faultData.push(Math.floor(Math.random() * 5));
        }

        this.historicalChart.data.labels = labels;
        this.historicalChart.data.datasets = [
            {
                label: 'Average Voltage (V)',
                data: voltageData,
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                tension: 0.4
            },
            {
                label: 'Average Current (A)',
                data: currentData,
                borderColor: '#FFC185',
                backgroundColor: 'rgba(255, 193, 133, 0.1)',
                tension: 0.4
            },
            {
                label: 'Daily Faults',
                data: faultData,
                borderColor: '#B4413C',
                backgroundColor: 'rgba(180, 65, 60, 0.1)',
                tension: 0.4
            }
        ];
        
        this.historicalChart.update();
    }

    acknowledgeAlarm(index) {
        this.alarms.splice(index, 1);
        this.renderDetailedAlarms();
        this.renderAlarms();
        this.updateKPIs();
    }

    acknowledgeAllAlarms() {
        this.alarms = [];
        this.renderDetailedAlarms();
        this.renderAlarms();
        this.updateKPIs();
    }

    clearResolvedAlarms() {
        this.alarms = this.alarms.filter(alarm => alarm.severity === 'critical');
        this.renderDetailedAlarms();
        this.renderAlarms();
        this.updateKPIs();
    }

    zoomTopology(factor) {
        const container = document.getElementById('topologyContainer');
        if (!container) return;
        
        const currentTransform = container.style.transform || 'scale(1)';
        const currentScale = parseFloat(currentTransform.match(/scale\(([^)]+)\)/)?.[1] || 1);
        const newScale = Math.max(0.5, Math.min(2, currentScale * factor));
        container.style.transform = `scale(${newScale})`;
    }

    resetTopologyView() {
        const container = document.getElementById('topologyContainer');
        if (container) {
            container.style.transform = 'scale(1)';
        }
    }

    showFeederDetails(feeder) {
        const prediction = this.runMLPrediction(feeder);
        const details = `
FEEDER ANALYSIS REPORT
======================

Basic Information:
• Name: ${feeder.name}
• ID: ${feeder.id}
• Status: ${feeder.status.toUpperCase()}

Electrical Parameters:
• Voltage: ${feeder.voltage}V
• Current: ${feeder.current}A  
• Power: ${feeder.power}MW
• Temperature: ${feeder.temperature}°C

ML Analysis:
• Prediction: ${prediction.status}
• Confidence: ${prediction.confidence}%

Operational Status:
• Communication: ONLINE
• Last Update: ${new Date().toLocaleTimeString('en-IN', {timeZone: 'Asia/Kolkata'})}

${feeder.status === 'fault' ? '\n⚠️ IMMEDIATE ACTION REQUIRED' : 
  feeder.status === 'warning' ? '\n⚠️ MONITORING REQUIRED' : 
  '\n✅ OPERATING NORMALLY'}
        `;
        
        alert(details);
    }

    viewDetails(feederId) {
        const feeder = this.feeders.find(f => f.id === feederId);
        if (feeder) {
            this.showDetailedFeederAnalysis(feeder);
        }
    }

    simulateRealTimeData() {
        // Simulate real-time data changes
        this.feeders.forEach(feeder => {
            if (feeder.status !== 'fault' && feeder.status !== 'isolated') {
                // Small random variations in electrical parameters
                feeder.voltage += (Math.random() - 0.5) * 50;
                feeder.current += (Math.random() - 0.5) * 20;
                feeder.temperature += (Math.random() - 0.5) * 2;
                
                // Keep within realistic bounds
                feeder.voltage = Math.max(9500, Math.min(12000, feeder.voltage));
                feeder.current = Math.max(0, Math.min(500, feeder.current));
                feeder.temperature = Math.max(20, Math.min(70, feeder.temperature));
                
                // Update power based on voltage and current
                feeder.power = (feeder.voltage * feeder.current * 1.732 * 0.9) / 1000000;
                feeder.power = Math.round(feeder.power * 10) / 10;

                // Occasional status changes for demonstration
                if (Math.random() < 0.02) { // 2% chance
                    if (feeder.temperature > 45) {
                        feeder.status = 'warning';
                    } else {
                        feeder.status = 'normal';
                    }
                }
            }
        });

        // Update dashboard if currently visible
        if (this.currentTab === 'dashboard') {
            this.renderFeederTable();
        }
    }

    startRealTimeUpdates() {
        // Update trend chart every 30 seconds
        setInterval(() => {
            if (this.currentTab === 'dashboard') {
                this.updateTrendChart();
            }
        }, 30000);

        // Update predictions every minute
        setInterval(() => {
            if (this.currentTab === 'analytics') {
                this.renderPredictions();
            }
        }, 60000);
    }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ksebSystem = new KSEBSystem();
});