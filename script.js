document.addEventListener('DOMContentLoaded', function(){
  // Compte à rebours
  function initCountdown() {
    const targetDate = new Date('2026-02-28T06:00:00').getTime();
    
    function updateCountdown() {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance < 0) {
        // L'événement est passé
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      document.getElementById('days').textContent = days.toString().padStart(2, '0');
      document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
      document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
      document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    // Mettre à jour immédiatement
    updateCountdown();
    
    // Mettre à jour toutes les secondes
    setInterval(updateCountdown, 1000);
  }
  
  // Initialiser le compte à rebours
  initCountdown();
  
  // Scroll reveal animation
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    // Fallback : si IntersectionObserver n'est pas supporté, révéler tous les éléments
    if (!window.IntersectionObserver) {
      revealElements.forEach(element => {
        element.classList.add('revealed');
      });
      return;
    }
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Arrêter d'observer cet élément une fois révélé
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    revealElements.forEach(element => {
      observer.observe(element);
    });
  }
  
  // Initialiser les animations de scroll
  initScrollReveal();
  const GPX_FILE = 'XtR41l_100k_MTL_On_Traverse_v3.gpx';
  const map = L.map('map', {
    zoomControl: true,
    scrollWheelZoom: false,  // Désactiver le zoom avec la roulette
    doubleClickZoom: false,  // Désactiver le double-clic pour zoomer
    boxZoom: false,          // Désactiver le zoom par sélection
    keyboard: false,         // Désactiver le zoom au clavier
    dragging: true,          // Garder le déplacement de la carte
    touchZoom: true,         // Garder le zoom tactile pour mobile
    zoomSnap: 0.5,           // Pas de zoom plus fin
    zoomDelta: 0.5           // Incrément de zoom
  }).setView([45.5, -73.6], 10);
  // Différents fonds de carte disponibles
  const mapLayers = {
    // Fond par défaut - OpenStreetMap
    osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }),
    
    // Fond sombre - Dark Mode
    dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '© CARTO, © OpenStreetMap'
    }),
    
    // Fond satellite
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: '© Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
    }),
    
    // Fond terrain
    terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: '© OpenTopoMap (CC-BY-SA)'
    }),
    
    // Fond minimaliste
    minimal: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '© CARTO, © OpenStreetMap'
    })
  };
  
  // Choisir le fond de carte (changez 'osm' par 'dark', 'satellite', 'terrain', ou 'minimal')
  const selectedLayer = 'minimal'; // Fond sombre pour le style hivernal urbain
  mapLayers[selectedLayer].addTo(map);
  
  // Gestionnaire personnalisé pour le zoom avec Ctrl + clic
  let isCtrlPressed = false;
  
  // Détecter la pression de Ctrl
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && !isCtrlPressed) {
      isCtrlPressed = true;
      map.getContainer().style.cursor = 'zoom-in';
      map.getContainer().style.setProperty('cursor', 'zoom-in', 'important');
    }
  });
  
  document.addEventListener('keyup', function(e) {
    if (!e.ctrlKey && isCtrlPressed) {
      isCtrlPressed = false;
      map.getContainer().style.cursor = '';
      map.getContainer().style.removeProperty('cursor');
    }
  });
  
  // Gestionnaire de clic pour le zoom avec Ctrl
  map.on('click', function(e) {
    if (isCtrlPressed) {
      const currentZoom = map.getZoom();
      const newZoom = Math.min(currentZoom + 1, map.getMaxZoom());
      map.setView(e.latlng, newZoom);
    }
  });
  
  // Gestionnaire pour Ctrl + clic droit pour dézoomer
  map.on('contextmenu', function(e) {
    if (isCtrlPressed) {
      e.preventDefault();
      e.stopPropagation();
      const currentZoom = map.getZoom();
      const newZoom = Math.max(currentZoom - 1, map.getMinZoom());
      map.setView(e.latlng, newZoom);
      return false;
    }
  });
  
  // Alternative avec gestionnaire d'événement direct
  map.getContainer().addEventListener('contextmenu', function(e) {
    if (isCtrlPressed) {
      e.preventDefault();
      e.stopPropagation();
      const currentZoom = map.getZoom();
      const newZoom = Math.max(currentZoom - 1, map.getMinZoom());
      const rect = map.getContainer().getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const latlng = map.containerPointToLatLng([x, y]);
      map.setView(latlng, newZoom);
      return false;
    }
  });

  let elevChart = null;

  // Utils
  const haversine = (a, b) => {
    const R = 6371000;
    const dLat = (b[1] - a[1]) * Math.PI / 180;
    const dLon = (b[0] - a[0]) * Math.PI / 180;
    const lat1 = a[1] * Math.PI / 180;
    const lat2 = b[1] * Math.PI / 180;
    const s = Math.sin(dLat/2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2)**2;
    return 2 * R * Math.atan2(Math.sqrt(s), Math.sqrt(1-s));
  };

  function movingAverage(arr, window = 5) {
    const out = [];
    for (let i = 0; i < arr.length; i++) {
      const half = Math.floor(window / 2);
      const start = Math.max(0, i - half);
      const end = Math.min(arr.length, i + half + 1);
      const slice = arr.slice(start, end);
      out.push(slice.reduce((a, b) => a + b, 0) / slice.length);
    }
    return out;
  }

  function extractCoordsFromGeo(geo) {
    const coords = [];
    const waypoints = [];
    if (!geo || !geo.features) return { coords, waypoints };
    
    for (const f of geo.features) {
      if (!f.geometry) continue;
      const g = f.geometry;
      
      // Extraire les coordonnées de la trace
      if (g.type === 'LineString' && Array.isArray(g.coordinates)) {
        for (const c of g.coordinates) coords.push([c[0], c[1], c[2] || 0]);
      }
      if (g.type === 'MultiLineString' && Array.isArray(g.coordinates)) {
        for (const part of g.coordinates) {
          for (const c of part) coords.push([c[0], c[1], c[2] || 0]);
        }
      }
      
      // Extraire les waypoints (points de ravitaillement)
      if (g.type === 'Point' && f.properties && f.properties.name) {
        const name = f.properties.name;
        if (name.startsWith('R') && name.length <= 3) {
          waypoints.push({
            name: name,
            lat: g.coordinates[1],
            lon: g.coordinates[0],
            ele: g.coordinates[2] || 0
          });
        }
      }
    }
    return { coords, waypoints };
  }

  async function loadGPX() {
    try {
      const res = await fetch(GPX_FILE);
      if (!res.ok) throw new Error('GPX missing');
      const txt = await res.text();
      const xml = new DOMParser().parseFromString(txt, 'application/xml');
      let geo = null;
      if (window.toGeoJSON && typeof window.toGeoJSON.gpx === 'function') {
        geo = window.toGeoJSON.gpx(xml);
      } else if (window.togeojson && typeof window.togeojson.gpx === 'function') {
        geo = window.togeojson.gpx(xml);
      } else if (window.toGeojson && typeof window.toGeojson.gpx === 'function') {
        geo = window.toGeojson.gpx(xml);
      } else {
        throw new Error('toGeoJSON missing');
      }
      const { coords, waypoints } = extractCoordsFromGeo(geo);
      if (!coords.length) throw new Error('no coords');
      return { coords, waypoints };
    } catch (e) {
      console.warn('GPX load failed', e);
      return { coords: [], waypoints: [] };
    }
  }

  function detectRuns(smoothElev) {
    const runs = [];
    let currentSum = 0;
    let sign = 0;
    let startIdx = 0;
    for (let i = 1; i < smoothElev.length; i++) {
      const dz = smoothElev[i] - smoothElev[i-1];
      if (Math.abs(dz) < 0.25) continue; // ignore micro-oscillations
      const dir = Math.sign(dz);
      if (dir === sign) {
        currentSum += dz;
      } else {
        if (Math.abs(currentSum) >= 1) {
          runs.push({ start: startIdx, end: i-1, gain: currentSum, dir: sign });
        }
        startIdx = i-1;
        currentSum = dz;
        sign = dir;
      }
    }
    if (Math.abs(currentSum) >= 1) {
      runs.push({ start: startIdx, end: smoothElev.length-1, gain: currentSum, dir: sign });
    }
    return runs;
  }

  function computeStats(coords) {
    if (!coords || coords.length < 2) return null;
    const elevs = coords.map(c => c[2] || 0);
    const smooth = movingAverage(elevs, 5);
    let dist = 0;
    let totalUp = 0;
    let totalDown = 0;
    let currentSum = 0;
    let sign = 0;
    for (let i = 1; i < coords.length; i++) {
      dist += haversine(coords[i-1], coords[i]);
      const dz = smooth[i] - smooth[i-1];
      if (Math.abs(dz) < 0.25) continue; // ignore micro-oscillations
      const dir = Math.sign(dz);
      if (dir === sign) {
        currentSum += dz;
      } else {
        if (Math.abs(currentSum) >= 1) {
          if (sign > 0) totalUp += currentSum; else totalDown += -currentSum;
        }
        currentSum = dz;
        sign = dir;
      }
    }
    if (Math.abs(currentSum) >= 1) {
      if (sign > 0) totalUp += currentSum; else totalDown += -currentSum;
    }
    const runs = detectRuns(smooth);
    return {
      distance_km: dist/1000,
      elevGain: Math.round(totalUp),
      elevLoss: Math.round(totalDown),
      minA: Math.round(Math.min(...smooth)),
      maxA: Math.round(Math.max(...smooth)),
      elevations: smooth,
      runs
    };
  }

  (async function() {
    console.log('Loading GPX...');
    const { coords, waypoints } = await loadGPX();
    console.log('GPX loaded, coords length:', coords.length);
    console.log('Waypoints found:', waypoints.length);
    if (!coords.length) {
      const distanceEl = document.getElementById('distance');
      const elevgainEl = document.getElementById('elevgain');
      const elevlossEl = document.getElementById('elevloss');
      const minmaxEl = document.getElementById('minmax');
      
      if (distanceEl) distanceEl.innerText = '— km';
      if (elevgainEl) elevgainEl.innerText = '— m';
      if (elevlossEl) elevlossEl.innerText = '— m';
      if (minmaxEl) minmaxEl.innerText = '— / — m';
      return;
    }

    const latlngs = coords.map(c => [c[1], c[0]]);
    const line = L.polyline(latlngs, { color: '#BF360C', weight: 4 }).addTo(map);
    map.fitBounds(line.getBounds(), { padding: [20, 20] });
    
    // Calculer les distances cumulées pour chaque point
    const distances = [0];
    let cumDist = 0;
    for (let i = 1; i < coords.length; i++) {
      cumDist += haversine(coords[i-1], coords[i]) / 1000;
      distances.push(cumDist);
    }
    
    // Fonction pour trouver la distance la plus proche d'un waypoint
    function findClosestDistance(waypointLat, waypointLon) {
      let minDistance = Infinity;
      let closestIndex = 0;
      
      for (let i = 0; i < latlngs.length; i++) {
        const distance = map.distance([waypointLat, waypointLon], latlngs[i]);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }
      
      return distances[closestIndex];
    }
    
    // Ajouter le marqueur de départ
    const startIcon = L.divIcon({
      className: 'supply-station-marker',
      html: `<div class="station-marker start-marker">DÉPART</div>`,
      iconSize: [60, 30],
      iconAnchor: [30, 15]
    });
    
    L.marker(latlngs[0], { icon: startIcon })
      .addTo(map)
      .bindPopup(`<div class="station-popup"><strong>DÉPART</strong><br/>Le Tour de l'Île en Hiver<br/>0 km - 6h00</div>`);
    
    // Ajouter les points de ravitaillement depuis le GPX
    waypoints.forEach(waypoint => {
      const distanceFromStart = findClosestDistance(waypoint.lat, waypoint.lon);
      const stationIcon = L.divIcon({
        className: 'supply-station-marker',
        html: `<div class="station-marker">${waypoint.name}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      
      L.marker([waypoint.lat, waypoint.lon], { icon: stationIcon })
        .addTo(map)
        .bindPopup(`<div class="station-popup"><strong>${waypoint.name}</strong><br/>Ravitaillement<br/>${Math.round(distanceFromStart)} km</div>`);
    });
    
    // Ajouter le marqueur d'arrivée
    const finishIcon = L.divIcon({
      className: 'supply-station-marker',
      html: `<div class="station-marker finish-marker">ARRIVÉE</div>`,
      iconSize: [70, 30],
      iconAnchor: [35, 15]
    });
    
    const totalDistance = distances[distances.length - 1];
    L.marker(latlngs[latlngs.length - 1], { icon: finishIcon })
      .addTo(map)
      .bindPopup(`<div class="station-popup"><strong>ARRIVÉE</strong><br/>Le Tour de l'Île en Hiver<br/>${Math.round(totalDistance)} km - Fin de parcours</div>`);
    
    // S'assurer qu'aucun marqueur n'est affiché au départ
    window.currentMarker = null;

    const stats = computeStats(coords);
    if (stats) {
      const distanceEl = document.getElementById('distance');
      const elevgainEl = document.getElementById('elevgain');
      const elevlossEl = document.getElementById('elevloss');
      const minmaxEl = document.getElementById('minmax');
      const elevationEl = document.getElementById('elevation');
      const departureEl = document.getElementById('departure');
      
      if (distanceEl) distanceEl.innerText = stats.distance_km.toFixed(1) + ' km';
      if (elevgainEl) elevgainEl.innerText = stats.elevGain + ' m';
      if (elevlossEl) elevlossEl.innerText = stats.elevLoss + ' m';
      if (minmaxEl) minmaxEl.innerText = stats.minA + ' / ' + stats.maxA + ' m';
      if (elevationEl) elevationEl.innerText = '+' + stats.elevGain + 'm / -' + stats.elevLoss + 'm';
      if (departureEl) departureEl.innerText = '6h00';
    }

    // profile chart
    const dist = [0];
    let cum = 0;
    for (let i = 1; i < coords.length; i++) {
      cum += haversine(coords[i-1], coords[i]) / 1000;
      dist.push(cum);
    }
    
    // Calculer les positions des ravitaillements sur le profil
    const supplyStations = [];
    waypoints.forEach(waypoint => {
      const distanceFromStart = findClosestDistance(waypoint.lat, waypoint.lon);
      
      // Trouver l'altitude réelle sur la trace à cette position
      let realElevation = waypoint.ele;
      
      // Trouver l'index le plus proche sur la trace pour cette distance
      let closestIndex = 0;
      let minDistanceDiff = Infinity;
      for (let i = 0; i < distances.length; i++) {
        const diff = Math.abs(distances[i] - distanceFromStart);
        if (diff < minDistanceDiff) {
          minDistanceDiff = diff;
          closestIndex = i;
        }
      }
      
      // Utiliser l'altitude de la trace à cette position
      if (closestIndex < stats.elevations.length) {
        realElevation = stats.elevations[closestIndex];
      }
      
      supplyStations.push({
        name: waypoint.name,
        distance: distanceFromStart,
        elevation: realElevation
      });
    });
    
    // Ajouter le départ et l'arrivée
    const totalDist = dist[dist.length - 1];
    supplyStations.push({
      name: 'DÉPART',
      distance: 0,
      elevation: stats.elevations[0]
    });
    supplyStations.push({
      name: 'ARRIVÉE',
      distance: totalDist,
      elevation: stats.elevations[stats.elevations.length - 1]
    });
    
    // Trier par distance
    supplyStations.sort((a, b) => a.distance - b.distance);

    const canvas = document.getElementById('profile');
    console.log('Canvas found:', canvas);
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const maxDistance = Math.max(...dist);
      console.log('Max distance:', maxDistance);
      console.log('Stats elevations length:', stats.elevations.length);
      
      const chartConfig = {
        type: 'line',
        data: {
          labels: dist.map(d => d.toFixed(1)),
          datasets: [{
            label: 'Altitude (m)',
            data: stats.elevations,
            fill: true,
             tension: 0.2,
             pointRadius: 0,
             borderColor: '#BF360C',
             backgroundColor: 'rgba(191, 54, 12, 0.2)',
             borderWidth: 3,
             pointBackgroundColor: '#BF360C',
             pointBorderColor: '#FFFFFF',
             pointBorderWidth: 2,
             pointHoverRadius: 6,
             pointHoverBackgroundColor: '#BF360C',
             pointHoverBorderColor: '#FFFFFF',
             pointHoverBorderWidth: 3,
             showLine: true
          }]
        },
         options: {
           responsive: true,
           maintainAspectRatio: false,
           interaction: {
             intersect: false,
             mode: 'index'
           },
           onHover: function(event, elements) {
             if (elements.length > 0) {
               const index = elements[0].index;
               console.log('Chart hover - index:', index);
               // Synchroniser avec la carte
               syncChartToMap(index);
             } else {
               console.log('Chart hover - no elements (NOT resetting)');
               // Ne pas réinitialiser automatiquement
             }
           },
          scales: {
            x: {
              type: 'linear',
              title: {
                display: true,
                text: 'Distance (km)',
                color: '#718096',
                font: {
                  size: window.innerWidth < 768 ? 12 : 14
                }
              },
              grid: {
                color: '#e2e8f0',
                drawBorder: false
              },
              ticks: {
                color: '#718096',
                font: {
                  size: window.innerWidth < 768 ? 10 : 12
                },
                stepSize: 5,
                callback: function(value) {
                  // Afficher seulement les marqueurs réguliers jusqu'à 100
                  if (value % 5 === 0 && value <= 100) {
                    return value;
                  }
                  // Afficher aussi le marqueur 100 même si la distance réelle est légèrement supérieure
                  if (Math.abs(value - 100) < 1) {
                    return 100;
                  }
                  return '';
                }
              },
              min: 0,
              max: maxDistance
            },
            y: {
              title: {
                display: true,
                text: 'Altitude (m)',
                color: '#718096',
                font: {
                  size: window.innerWidth < 768 ? 12 : 14
                }
              },
              grid: {
                color: '#e2e8f0',
                drawBorder: false
              },
              ticks: {
                color: '#718096',
                font: {
                  size: window.innerWidth < 768 ? 10 : 12
                }
              }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
               titleColor: '#FFFFFF',
               bodyColor: '#FFFFFF',
             borderColor: '#BF360C',
               borderWidth: 2,
               cornerRadius: 8,
              displayColors: false,
              callbacks: {
                title: function(context) {
                  return 'Distance: ' + context[0].label + ' km';
                },
                label: function(ctx) {
                  return 'Altitude: ' + Math.round(ctx.parsed.y) + ' m';
                }
              },
              // Événements de tooltip pour la synchronisation
              external: function(context) {
                const { chart, tooltip } = context;
                if (tooltip.opacity === 0) {
                  console.log('Tooltip hidden - NOT resetting (keep marker)');
                  // Ne pas réinitialiser pour garder le marqueur sur la carte
                  return;
                }
                
                if (tooltip.dataPoints && tooltip.dataPoints.length > 0) {
                  const index = tooltip.dataPoints[0].dataIndex;
                  console.log('Tooltip shown for index:', index);
                  syncChartToMap(index);
                }
              }
            },
            // Plugin personnalisé pour les ravitaillements
            supplyStations: {
              stations: supplyStations,
              maxDistance: maxDistance
            }
          }
        }
      };

       // Plugin personnalisé pour afficher les ravitaillements
       const supplyStationsPlugin = {
         id: 'supplyStations',
         afterDraw: function(chart) {
           const { ctx, chartArea, scales } = chart;
           const plugin = chart.options.plugins.supplyStations;
           
           if (!plugin || !plugin.stations) return;
           
           const xScale = scales.x;
           const yScale = scales.y;
           
           plugin.stations.forEach(station => {
             const x = xScale.getPixelForValue(station.distance);
             const y = yScale.getPixelForValue(station.elevation);
             
             // Dessiner la ligne verticale
             ctx.save();
             ctx.strokeStyle = station.name === 'DÉPART' ? '#BF360C' : 
                               station.name === 'ARRIVÉE' ? '#2C3E50' : '#2C3E50';
             ctx.lineWidth = 2;
             ctx.setLineDash([5, 5]);
             ctx.beginPath();
             ctx.moveTo(x, chartArea.top);
             ctx.lineTo(x, chartArea.bottom);
             ctx.stroke();
             
             // Dessiner le point
             ctx.fillStyle = station.name === 'DÉPART' ? '#BF360C' : 
                             station.name === 'ARRIVÉE' ? '#2C3E50' : '#2C3E50';
             ctx.beginPath();
             ctx.arc(x, y, 6, 0, 2 * Math.PI);
             ctx.fill();
             
             // Dessiner le label avec positionnement conditionnel
             ctx.fillStyle = '#2C3E50';
             ctx.font = 'bold 11px Montserrat, sans-serif';
             ctx.textBaseline = 'bottom';
             
             // Positionner le label au-dessus ou en dessous selon l'altitude
             const labelY = y < chartArea.top + 30 ? y + 20 : y - 10;
             
             // Positionnement intelligent selon la position sur le profil
             const chartCenter = chartArea.left + (chartArea.right - chartArea.left) / 2;
             const isLeftSide = x < chartCenter;
             
             if (station.name === 'DÉPART') {
               // Départ : toujours à droite du point
               ctx.textAlign = 'left';
               const labelX = x + 10;
               ctx.fillText(station.name, labelX, labelY);
             } else if (station.name === 'ARRIVÉE') {
               // Arrivée : toujours à gauche du point
               ctx.textAlign = 'right';
               const labelX = x - 10;
               
               // Afficher la distance d'abord
               ctx.font = '10px Lato, sans-serif';
               ctx.fillStyle = '#7F8C8D';
               const distanceY = labelY + (y < chartArea.top + 30 ? 15 : -5);
               ctx.fillText(Math.round(station.distance) + 'km', labelX, distanceY);
               
               // Puis le nom
               ctx.font = 'bold 11px Montserrat, sans-serif';
               ctx.fillStyle = '#2C3E50';
               const nameY = distanceY + (y < chartArea.top + 30 ? 15 : -15);
               ctx.fillText(station.name, labelX, nameY);
             } else {
               // Ravitaillements : positionnement intelligent selon le côté
               if (isLeftSide) {
                 // Côté gauche : alignement à droite du point
                 ctx.textAlign = 'left';
                 const labelX = x + 10;
                 
                 // Afficher la distance d'abord
                 ctx.font = '10px Lato, sans-serif';
                 ctx.fillStyle = '#7F8C8D';
                 const distanceY = labelY + (y < chartArea.top + 30 ? 15 : -5);
                 ctx.fillText(Math.round(station.distance) + 'km', labelX, distanceY);
                 
                 // Puis le nom
                 ctx.font = 'bold 11px Montserrat, sans-serif';
                 ctx.fillStyle = '#2C3E50';
                 const nameY = distanceY + (y < chartArea.top + 30 ? 15 : -15);
                 ctx.fillText(station.name, labelX, nameY);
               } else {
                 // Côté droit : alignement à gauche du point
                 ctx.textAlign = 'right';
                 const labelX = x - 10;
                 
                 // Afficher la distance d'abord
                 ctx.font = '10px Lato, sans-serif';
                 ctx.fillStyle = '#7F8C8D';
                 const distanceY = labelY + (y < chartArea.top + 30 ? 15 : -5);
                 ctx.fillText(Math.round(station.distance) + 'km', labelX, distanceY);
                 
                 // Puis le nom
                 ctx.font = 'bold 11px Montserrat, sans-serif';
                 ctx.fillStyle = '#2C3E50';
                 const nameY = distanceY + (y < chartArea.top + 30 ? 15 : -15);
                 ctx.fillText(station.name, labelX, nameY);
               }
             }
             
             ctx.restore();
           });
         }
       };
       
       // Enregistrer le plugin
       Chart.register(supplyStationsPlugin);

       try {
         if (elevChart && typeof elevChart.destroy === 'function') {
           elevChart.destroy();
         }
         console.log('Creating chart...');
         elevChart = new Chart(ctx, chartConfig);
         console.log('Chart created:', elevChart);
         
         // Ajouter des événements de souris directement sur le canvas
         canvas.addEventListener('mousemove', function(event) {
           // Trouver le point le plus proche
           const points = elevChart.getElementsAtEventForMode(event, 'nearest', { intersect: false }, true);
           if (points.length > 0) {
             const index = points[0].index;
             console.log('Canvas mousemove - index:', index);
             syncChartToMap(index);
           }
         });
         
         canvas.addEventListener('mouseleave', function(event) {
           console.log('Canvas mouseleave - resetting');
           // Réinitialiser seulement quand on quitte vraiment le canvas
           setTimeout(() => {
             if (!canvas.matches(':hover')) {
               resetSync();
             }
           }, 100);
         });
         
         // Redimensionner le graphique lors du redimensionnement de la fenêtre
         window.addEventListener('resize', function() {
           if (elevChart) {
             elevChart.resize();
           }
         });
       } catch (err) {
         console.error('Chart init failed', err);
       }
     }

     // Fonction pour synchroniser carte -> profil
     function syncMapToChart(index) {
       if (elevChart && stats && stats.elevations[index] !== undefined) {
         isSyncingFromMap = true;
         
         elevChart.setActiveElements([{ datasetIndex: 0, index: index }]);
         elevChart.update('none');
         
         // Forcer l'affichage du tooltip
         elevChart.tooltip.setActiveElements([{ datasetIndex: 0, index: index }], { x: 0, y: 0 });
         elevChart.tooltip.opacity = 1;
         elevChart.update('none');
         
         // Réinitialiser le flag après un court délai
         setTimeout(() => {
           isSyncingFromMap = false;
         }, 50);
       }
     }
     
     // Fonction pour synchroniser profil -> carte
     function syncChartToMap(index) {
       if (coords[index]) {
         const latlng = [coords[index][1], coords[index][0]];
         if (window.currentMarker) {
           map.removeLayer(window.currentMarker);
         }
           window.currentMarker = L.circleMarker(latlng, {
             radius: 8,
             fillColor: '#2C3E50',
             color: '#FFFFFF',
             weight: 3,
             opacity: 1,
             fillOpacity: 1
           }).addTo(map);
       }
     }
     
     // Fonction pour réinitialiser les deux
     function resetSync() {
       // Ne pas réinitialiser si on est en train de synchroniser depuis la carte
       if (isSyncingFromMap) {
         return;
       }
       
       // Réinitialiser les variables de suivi
       lastMapIndex = -1;
       if (mapHoverTimeout) {
         clearTimeout(mapHoverTimeout);
         mapHoverTimeout = null;
       }
       
       if (window.currentMarker) {
         map.removeLayer(window.currentMarker);
         window.currentMarker = null;
       }
       if (elevChart) {
         elevChart.setActiveElements([]);
         elevChart.tooltip.setActiveElements([], { x: 0, y: 0 });
         elevChart.tooltip.opacity = 0;
         elevChart.update('none');
       }
     }
     
     // Variable pour éviter les conflits de réinitialisation
     let isSyncingFromMap = false;
     let lastMapIndex = -1;
     let mapHoverTimeout = null;
     
     // Ajouter l'effet de survol sur la ligne de la carte
     line.on('mouseover', function(e) {
       const latlng = e.latlng;
       let closestIndex = 0;
       let minDistance = Infinity;
       
       // Trouver le point le plus proche
       for (let i = 0; i < latlngs.length; i++) {
         const distance = map.distance(latlng, latlngs[i]);
         if (distance < minDistance) {
           minDistance = distance;
           closestIndex = i;
         }
       }
       
       // Éviter les mises à jour répétitives du même index
       if (closestIndex === lastMapIndex) {
         return;
       }
       lastMapIndex = closestIndex;
       
       // Afficher le marqueur sur la carte
       if (window.currentMarker) {
         map.removeLayer(window.currentMarker);
       }
         window.currentMarker = L.circleMarker(latlngs[closestIndex], {
           radius: 8,
           fillColor: '#2C3E50',
           color: '#FFFFFF',
           weight: 3,
           opacity: 1,
           fillOpacity: 1
         }).addTo(map);
       
       // Debounce pour améliorer la fluidité
       if (mapHoverTimeout) {
         clearTimeout(mapHoverTimeout);
       }
       mapHoverTimeout = setTimeout(() => {
         syncMapToChart(closestIndex);
       }, 10);
     });
     
     // Supprimer le marqueur quand on quitte la ligne
     line.on('mouseout', function(e) {
       resetSync();
     });

    // Ajouter l'interactivité à la ligne de la carte
    line.on('click', function(e) {
      const clickedLatLng = e.latlng;
      let closestIndex = 0;
      let minDistance = Infinity;
      
      // Trouver le point le plus proche
      for (let i = 0; i < latlngs.length; i++) {
        const distance = map.distance(clickedLatLng, latlngs[i]);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }
      
      // Afficher le marqueur et synchroniser
      syncChartToMap(closestIndex);
      syncMapToChart(closestIndex);
    });
    
    // Supprimer le marqueur quand on clique ailleurs sur la carte
    map.on('click', function(e) {
      // Vérifier si le clic est sur la ligne (dans un rayon de 50m)
      const clickedLatLng = e.latlng;
      let minDistance = Infinity;
      
      for (let i = 0; i < latlngs.length; i++) {
        const distance = map.distance(clickedLatLng, latlngs[i]);
        if (distance < minDistance) {
          minDistance = distance;
        }
      }
      
      // Si le clic n'est pas proche de la ligne (plus de 50m), réinitialiser
      if (minDistance > 50) {
        resetSync();
      }
    });

    // Download link
    const downloadLink = document.getElementById('downloadLink');
    if (downloadLink) {
      downloadLink.href = GPX_FILE;
    }
  })();
});
