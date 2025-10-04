// AirSense Delhi - Air Quality Monitoring Platform JavaScript

// Application data (simulating API responses)
const appData = {
  realtime_data: {
    current_aqi: 156,
    current_pm25: 89,
    current_pm10: 134,
    status: "Unhealthy for Sensitive Groups",
    last_updated: "2025-09-29T17:06:00Z",
    dominant_pollutant: "PM2.5"
  },
  stations: [
    {name: "Anand Vihar", aqi: 187, pm25: 112, pm10: 156, lat: 28.6469, lng: 77.3151},
    {name: "Punjabi Bagh", aqi: 134, pm25: 76, pm10: 118, lat: 28.6747, lng: 77.1355},
    {name: "R.K. Puram", aqi: 142, pm25: 82, pm10: 125, lat: 28.5641, lng: 77.1857},
    {name: "IGI Airport", aqi: 98, pm25: 54, pm10: 89, lat: 28.5562, lng: 77.1000},
    {name: "Mandir Marg", aqi: 171, pm25: 98, pm10: 148, lat: 28.6358, lng: 77.2012}
  ],
  forecast_24h: [
    {hour: "18:00", aqi: 156}, {hour: "19:00", aqi: 168}, {hour: "20:00", aqi: 175},
    {hour: "21:00", aqi: 182}, {hour: "22:00", aqi: 189}, {hour: "23:00", aqi: 195},
    {hour: "00:00", aqi: 203}, {hour: "01:00", aqi: 198}, {hour: "02:00", aqi: 192},
    {hour: "03:00", aqi: 186}, {hour: "04:00", aqi: 181}, {hour: "05:00", aqi: 176},
    {hour: "06:00", aqi: 184}, {hour: "07:00", aqi: 198}, {hour: "08:00", aqi: 212},
    {hour: "09:00", aqi: 201}, {hour: "10:00", aqi: 189}, {hour: "11:00", aqi: 176},
    {hour: "12:00", aqi: 164}, {hour: "13:00", aqi: 152}, {hour: "14:00", aqi: 145},
    {hour: "15:00", aqi: 138}, {hour: "16:00", aqi: 142}, {hour: "17:00", aqi: 149}
  ],
  pollution_sources: [
    {source: "Vehicles", percentage: 45, color: "#FF6B6B"},
    {source: "Industry", percentage: 25, color: "#4ECDC4"},
    {source: "Dust", percentage: 30, color: "#45B7D1"},
    {source: "Stubble Burning", percentage: 20, color: "#96CEB4", seasonal: true}
  ],
  policy_interventions: [
    {name: "GRAP Stage II", status: "Active", effectiveness: "65%", description: "Construction ban on roads"},
    {name: "Dust Control", status: "Monitoring", effectiveness: "78%", description: "Water sprinkling on roads"},
    {name: "Industrial Monitoring", status: "Active", effectiveness: "82%", description: "Emission limit enforcement"}
  ],
  health_recommendations: {
    general: ["Limit outdoor activities during peak hours", "Use N95 masks when outdoors", "Keep windows closed"],
    sensitive: ["Avoid all outdoor exercise", "Stay indoors as much as possible", "Consider air purifiers"],
    children: ["No outdoor play during high pollution", "School commute should be in covered vehicles"],
    elderly: ["Postpone morning walks", "Take prescribed medications regularly"],
    asthma: ["Keep inhalers readily available", "Avoid outdoor activities completely", "Monitor symptoms closely"]
  },
  clean_routes: [
    {from: "Connaught Place", to: "India Gate", route: "Via Rajpath (Tree-lined, Lower traffic)", aqi_reduction: "15%"},
    {from: "Gurgaon", to: "New Delhi", route: "Via NH48 early morning", aqi_reduction: "22%"},
    {from: "Dwarka", to: "Central Delhi", route: "Via Metro + short walk", aqi_reduction: "35%"}
  ],
  weather_data: {
    temperature: 28,
    humidity: 72,
    wind_speed: 6,
    wind_direction: "NW",
    pressure: 1013
  }
};

// Global variables
let airQualityMap, hotspotMap;
let charts = {};
let updateInterval;
let mapMarkers = []; // Store map markers for updates

// AQI Classification Functions
function getAQICategory(aqi) {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy-sensitive';
  if (aqi <= 200) return 'unhealthy';
  if (aqi <= 300) return 'very-unhealthy';
  return 'hazardous';
}

function getAQIStatus(aqi) {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

function getAQIColor(aqi) {
  if (aqi <= 50) return '#00e400';
  if (aqi <= 100) return '#ffff00';
  if (aqi <= 150) return '#ff7e00';
  if (aqi <= 200) return '#ff0000';
  if (aqi <= 300) return '#8f3f97';
  return '#7e0023';
}

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializeTabs();
  updateCurrentTime();
  updateAQIDisplay();
  initializeCharts();
  initializeMaps();
  populateHealthRecommendations();
  populateCleanRoutes();
  populatePolicyInterventions();
  setupEventListeners();
  startRealTimeUpdates();
});

// Tab Management
function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;
      
      // Update active states
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      button.classList.add('active');
      document.getElementById(`${tabName}-tab`).classList.add('active');
      
      // Initialize specific tab content
      if (tabName === 'policy' && !hotspotMap) {
        setTimeout(initializeHotspotMap, 100);
      }
    });
  });
}

// Time Display
function updateCurrentTime() {
  const now = new Date();
  const timeString = now.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  document.getElementById('currentTime').textContent = timeString;
}

// AQI Display Updates
function updateAQIDisplay() {
  const currentAQI = appData.realtime_data.current_aqi;
  const aqiElement = document.getElementById('currentAQI');
  const statusElement = document.getElementById('aqiStatus');
  const pm25Element = document.getElementById('pm25Value');
  const pm10Element = document.getElementById('pm10Value');
  
  aqiElement.textContent = currentAQI;
  aqiElement.className = `aqi-number ${getAQICategory(currentAQI)}`;
  statusElement.textContent = getAQIStatus(currentAQI);
  pm25Element.textContent = `${appData.realtime_data.current_pm25} μg/m³`;
  pm10Element.textContent = `${appData.realtime_data.current_pm10} μg/m³`;
}

// Chart Initialization
function initializeCharts() {
  initializeForecastChart();
  initializeSourceChart();
  initializeEffectivenessChart();
  initializeTrendChart();
  initializeStationChart();
  initializeSeasonalChart();
  initializeHealthChart();
}

function initializeForecastChart() {
  const ctx = document.getElementById('forecastChart').getContext('2d');
  charts.forecast = new Chart(ctx, {
    type: 'line',
    data: {
      labels: appData.forecast_24h.map(item => item.hour),
      datasets: [{
        label: 'AQI Forecast',
        data: appData.forecast_24h.map(item => item.aqi),
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: appData.forecast_24h.map(item => getAQIColor(item.aqi)),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 250,
          ticks: {
            callback: function(value) {
              return value + ' AQI';
            }
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

function initializeSourceChart() {
  const ctx = document.getElementById('sourceChart').getContext('2d');
  charts.source = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: appData.pollution_sources.map(item => item.source),
      datasets: [{
        data: appData.pollution_sources.map(item => item.percentage),
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
        borderWidth: 0,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        }
      }
    }
  });
}

function initializeEffectivenessChart() {
  const ctx = document.getElementById('effectivenessChart').getContext('2d');
  charts.effectiveness = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: appData.policy_interventions.map(item => item.name),
      datasets: [{
        label: 'Effectiveness',
        data: appData.policy_interventions.map(item => parseInt(item.effectiveness)),
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  });
}

function initializeTrendChart() {
  const ctx = document.getElementById('trendChart').getContext('2d');
  // Generate sample historical data
  const dates = [];
  const aqiValues = [];
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString());
    aqiValues.push(Math.floor(Math.random() * 100) + 100); // Random AQI between 100-200
  }
  
  charts.trend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Daily Average AQI',
        data: aqiValues,
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 300
        },
        x: {
          display: false
        }
      }
    }
  });
}

function initializeStationChart() {
  const ctx = document.getElementById('stationChart').getContext('2d');
  charts.station = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: appData.stations.map(station => station.name),
      datasets: [{
        label: 'Current AQI',
        data: appData.stations.map(station => station.aqi),
        backgroundColor: appData.stations.map(station => getAQIColor(station.aqi)),
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 250
        }
      }
    }
  });
}

function initializeSeasonalChart() {
  const ctx = document.getElementById('seasonalChart').getContext('2d');
  charts.seasonal = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: '2024',
        data: [220, 180, 140, 120, 110, 130, 140, 150, 160, 180, 200, 230],
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4
      }, {
        label: '2023',
        data: [200, 160, 130, 110, 100, 120, 130, 140, 150, 170, 190, 210],
        borderColor: '#FFC185',
        backgroundColor: 'rgba(255, 193, 133, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 300
        }
      }
    }
  });
}

function initializeHealthChart() {
  const ctx = document.getElementById('healthChart').getContext('2d');
  charts.health = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Respiratory Risk', 'Cardiovascular Risk', 'Eye Irritation', 'General Discomfort', 'Long-term Effects'],
      datasets: [{
        label: 'Health Risk Level',
        data: [75, 65, 80, 70, 60],
        borderColor: '#B4413C',
        backgroundColor: 'rgba(180, 65, 60, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: '#B4413C',
        pointBorderColor: '#fff',
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20
          }
        }
      }
    }
  });
}

// Map Initialization - Fixed marker interactivity
function initializeMaps() {
  initializeAirQualityMap();
}

function initializeAirQualityMap() {
  if (airQualityMap) {
    airQualityMap.remove();
  }
  
  airQualityMap = L.map('airQualityMap').setView([28.6139, 77.2090], 10);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(airQualityMap);
  
  // Clear existing markers array
  mapMarkers = [];
  
  // Add station markers with improved interactivity
  appData.stations.forEach((station, index) => {
    const marker = L.circleMarker([station.lat, station.lng], {
      color: '#fff',
      fillColor: getAQIColor(station.aqi),
      fillOpacity: 0.8,
      radius: 15,
      weight: 2
    });
    
    const popupContent = `
      <div class="station-popup">
        <h4>${station.name}</h4>
        <div class="station-aqi" style="color: ${getAQIColor(station.aqi)}">${station.aqi}</div>
        <div class="station-details">
          PM2.5: ${station.pm25} μg/m³<br>
          PM10: ${station.pm10} μg/m³<br>
          Status: ${getAQIStatus(station.aqi)}
        </div>
      </div>
    `;
    
    marker.bindPopup(popupContent, {
      closeButton: true,
      autoClose: false,
      closeOnClick: false
    });
    
    // Ensure marker is clickable
    marker.on('click', function(e) {
      this.openPopup();
    });
    
    marker.addTo(airQualityMap);
    mapMarkers.push(marker);
  });
}

function initializeHotspotMap() {
  if (hotspotMap) {
    hotspotMap.remove();
  }
  
  hotspotMap = L.map('hotspotMap').setView([28.6139, 77.2090], 10);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(hotspotMap);
  
  // Add hotspot areas
  const hotspots = [
    {name: "Industrial Area Mayapuri", lat: 28.6414, lng: 77.1300, severity: "high"},
    {name: "Ring Road Junction", lat: 28.6304, lng: 77.2177, severity: "medium"},
    {name: "Airport Road", lat: 28.5675, lng: 77.1031, severity: "low"}
  ];
  
  hotspots.forEach(hotspot => {
    const colors = {
      high: '#ff0000',
      medium: '#ff7e00',
      low: '#ffff00'
    };
    
    L.circle([hotspot.lat, hotspot.lng], {
      color: colors[hotspot.severity],
      fillColor: colors[hotspot.severity],
      fillOpacity: 0.3,
      radius: 2000
    }).addTo(hotspotMap).bindPopup(`<strong>${hotspot.name}</strong><br>Severity: ${hotspot.severity}`);
  });
}

// Content Population
function populateHealthRecommendations() {
  const container = document.getElementById('healthRecommendations');
  const recommendations = appData.health_recommendations.general;
  
  container.innerHTML = recommendations.map(rec => `<li>${rec}</li>`).join('');
}

function populateCleanRoutes() {
  const container = document.getElementById('cleanRoutes');
  
  container.innerHTML = appData.clean_routes.map(route => `
    <div class="route-item">
      <div class="route-header">
        <div class="route-path">${route.from} → ${route.to}</div>
        <div class="route-reduction">${route.aqi_reduction} cleaner</div>
      </div>
      <div class="route-description">${route.route}</div>
    </div>
  `).join('');
}

function populatePolicyInterventions() {
  const container = document.getElementById('policyInterventions');
  
  container.innerHTML = appData.policy_interventions.map(intervention => `
    <div class="intervention-item">
      <div class="intervention-header">
        <div class="intervention-name">${intervention.name}</div>
        <div class="intervention-status ${intervention.status.toLowerCase()}">${intervention.status}</div>
      </div>
      <div class="intervention-effectiveness">${intervention.effectiveness} Effective</div>
      <div class="intervention-description">${intervention.description}</div>
    </div>
  `).join('');
}

// Event Listeners
function setupEventListeners() {
  // Health profile selector
  document.getElementById('healthProfile').addEventListener('change', function() {
    updateHealthRecommendations(this.value);
    updateActivityRecommendations(this.value);
  });
  
  // Time range selector
  document.getElementById('timeRange').addEventListener('change', function() {
    updateTrendChart(this.value);
  });
  
  // Export buttons
  document.getElementById('exportCSV').addEventListener('click', exportToCSV);
  document.getElementById('exportPDF').addEventListener('click', exportToPDF);
  document.getElementById('shareData').addEventListener('click', shareData);
}

function updateHealthRecommendations(profile) {
  const container = document.getElementById('healthRecommendations');
  const recommendations = appData.health_recommendations[profile] || appData.health_recommendations.general;
  
  container.innerHTML = recommendations.map(rec => `<li>${rec}</li>`).join('');
  
  // Update health status
  const statusContainer = document.getElementById('healthStatus');
  const riskLevels = {
    general: { level: 'moderate', text: 'Moderate Risk' },
    sensitive: { level: 'high', text: 'High Risk' },
    children: { level: 'high', text: 'High Risk' },
    elderly: { level: 'high', text: 'High Risk' },
    asthma: { level: 'high', text: 'Very High Risk' }
  };
  
  const risk = riskLevels[profile] || riskLevels.general;
  statusContainer.innerHTML = `
    <div class="status-indicator ${risk.level}">${risk.text}</div>
    <p>Based on current AQI levels and your profile</p>
  `;
}

function updateActivityRecommendations(profile) {
  const container = document.getElementById('activityRecommendations');
  const activities = [
    { name: 'Outdoor Exercise', icon: '🏃‍♂️', recommendation: 'Avoid during high pollution', status: 'avoid' },
    { name: 'Indoor Workout', icon: '🏋️‍♀️', recommendation: 'Recommended alternative', status: 'recommended' },
    { name: 'Walking', icon: '🚶‍♀️', recommendation: 'Use covered areas only', status: 'caution' },
    { name: 'Cycling', icon: '🚴‍♀️', recommendation: 'Not recommended', status: 'avoid' },
    { name: 'Yoga/Meditation', icon: '🧘‍♀️', recommendation: 'Indoor practice preferred', status: 'recommended' },
    { name: 'Swimming', icon: '🏊‍♀️', recommendation: 'Indoor pools only', status: 'caution' }
  ];
  
  container.innerHTML = activities.map(activity => `
    <div class="activity-item">
      <div class="activity-icon">${activity.icon}</div>
      <div class="activity-name">${activity.name}</div>
      <div class="activity-recommendation">${activity.recommendation}</div>
      <div class="activity-status ${activity.status}">${activity.status}</div>
    </div>
  `).join('');
}

// Data Export Functions
function exportToCSV() {
  showLoading();
  setTimeout(() => {
    const csvContent = generateCSV();
    downloadFile('delhi_air_quality_data.csv', csvContent, 'text/csv');
    hideLoading();
  }, 1000);
}

function exportToPDF() {
  showLoading();
  setTimeout(() => {
    alert('PDF report generation would be implemented with a PDF library like jsPDF');
    hideLoading();
  }, 1000);
}

function shareData() {
  const shareData = {
    title: 'Delhi Air Quality Report',
    text: `Current AQI: ${appData.realtime_data.current_aqi} (${getAQIStatus(appData.realtime_data.current_aqi)})`,
    url: window.location.href
  };
  
  if (navigator.share) {
    navigator.share(shareData);
  } else {
    navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
    alert('Data copied to clipboard!');
  }
}

function generateCSV() {
  const headers = ['Station', 'AQI', 'PM2.5', 'PM10', 'Status'];
  const rows = appData.stations.map(station => [
    station.name,
    station.aqi,
    station.pm25,
    station.pm10,
    getAQIStatus(station.aqi)
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Loading States
function showLoading() {
  document.getElementById('loadingOverlay').classList.add('show');
}

function hideLoading() {
  document.getElementById('loadingOverlay').classList.remove('show');
}

// Real-time Updates - Improved map update functionality
function startRealTimeUpdates() {
  updateInterval = setInterval(() => {
    simulateDataUpdate();
    updateAQIDisplay();
    updateCharts();
    updateCurrentTime();
  }, 30000); // Update every 30 seconds
}

function simulateDataUpdate() {
  // Simulate slight changes in AQI values
  appData.realtime_data.current_aqi += Math.floor(Math.random() * 10) - 5;
  appData.realtime_data.current_aqi = Math.max(50, Math.min(300, appData.realtime_data.current_aqi));
  
  appData.stations.forEach(station => {
    station.aqi += Math.floor(Math.random() * 8) - 4;
    station.aqi = Math.max(50, Math.min(300, station.aqi));
  });
  
  // Update timestamp
  appData.realtime_data.last_updated = new Date().toISOString();
}

function updateCharts() {
  // Update station chart with new data
  if (charts.station) {
    charts.station.data.datasets[0].data = appData.stations.map(station => station.aqi);
    charts.station.data.datasets[0].backgroundColor = appData.stations.map(station => getAQIColor(station.aqi));
    charts.station.update('none');
  }
  
  // Update map markers with improved functionality
  if (airQualityMap && mapMarkers.length > 0) {
    mapMarkers.forEach((marker, index) => {
      const station = appData.stations[index];
      if (station) {
        // Update marker style
        marker.setStyle({
          fillColor: getAQIColor(station.aqi),
          color: '#fff',
          fillOpacity: 0.8,
          radius: 15,
          weight: 2
        });
        
        // Update popup content
        const popupContent = `
          <div class="station-popup">
            <h4>${station.name}</h4>
            <div class="station-aqi" style="color: ${getAQIColor(station.aqi)}">${station.aqi}</div>
            <div class="station-details">
              PM2.5: ${station.pm25} μg/m³<br>
              PM10: ${station.pm10} μg/m³<br>
              Status: ${getAQIStatus(station.aqi)}
            </div>
          </div>
        `;
        
        marker.setPopupContent(popupContent);
      }
    });
  }
}

function updateTrendChart(timeRange) {
  // This would normally fetch data based on the time range
  // For demo purposes, we'll just update with sample data
  showLoading();
  setTimeout(() => {
    if (charts.trend) {
      // Generate sample data based on time range
      const dataPoints = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const dates = [];
      const values = [];
      
      for (let i = dataPoints; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString());
        values.push(Math.floor(Math.random() * 100) + 100);
      }
      
      charts.trend.data.labels = dates;
      charts.trend.data.datasets[0].data = values;
      charts.trend.update();
    }
    hideLoading();
  }, 800);
}

// Initialize activity recommendations on page load
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    updateActivityRecommendations('general');
  }, 100);
});