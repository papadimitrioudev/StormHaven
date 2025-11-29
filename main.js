// iOS 26 Weather App - Main JavaScript (Dark Theme)
class WeatherApp {
    constructor() {
        this.currentLocation = {
            name: "San Francisco",
            temperature: 72,
            condition: "Partly Cloudy",
            humidity: 65,
            windSpeed: 12,
            uvIndex: 6,
            airQuality: "Good",
            feelsLike: 75,
            highTemp: 78,
            lowTemp: 65
        };
        
        this.hourlyData = [];
        this.locations = [];
        this.particleSystem = null;
        
        this.init();
    }

    init() {
        this.generateHourlyData();
        this.updateCurrentTime();
        this.setupEventListeners();
        this.initializeAnimations();
        this.startParticleSystem();
        
        // Update time every minute
        setInterval(() => this.updateCurrentTime(), 60000);
    }

    generateHourlyData() {
        const now = new Date();
        const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"];
        const temperatures = [68, 70, 72, 74, 76, 78, 75, 73, 71, 69, 67, 66, 65, 66, 67, 69, 71, 73, 75, 77, 76, 74, 72, 70];
        
        this.hourlyData = Array.from({ length: 24 }, (_, i) => {
            const time = new Date(now);
            time.setHours(now.getHours() + i);
            
            return {
                time: time.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    hour12: true 
                }),
                temperature: temperatures[i] || 72,
                condition: conditions[Math.floor(Math.random() * conditions.length)],
                precipitation: Math.floor(Math.random() * 30)
            };
        });
        
        this.renderHourlyForecast();
    }

    renderHourlyForecast() {
        const container = document.getElementById('hourlyForecast');
        if (!container) return;

        container.innerHTML = this.hourlyData.slice(0, 12).map((hour, index) => `
            <div class="hour-item" style="animation-delay: ${index * 0.05}s">
                <div class="hour-time">${hour.time}</div>
                <div class="weather-icon mx-auto my-2" style="width: 32px; height: 32px; opacity: 0.8;"></div>
                <div class="hour-temp">${hour.temperature}°</div>
            </div>
        `).join('');

        // Add entrance animations
        anime({
            targets: '.hour-item',
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(50),
            duration: 600,
            easing: 'easeOutQuart'
        });
    }

    updateCurrentTime() {
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            const now = new Date();
            timeElement.textContent = now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchLocation(e.target.value);
                }
            });
        }

        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const href = item.getAttribute('href');
                this.navigateToPage(href);
            });
        });

        // Pull to refresh
        let startY = 0;
        let pullDistance = 0;
        
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (window.scrollY === 0) {
                pullDistance = e.touches[0].clientY - startY;
                if (pullDistance > 0) {
                    e.preventDefault();
                    // Visual feedback for pull to refresh
                    document.body.style.transform = `translateY(${Math.min(pullDistance * 0.5, 100)}px)`;
                }
            }
        });
        
        document.addEventListener('touchend', () => {
            if (pullDistance > 100) {
                this.refreshWeather();
            }
            document.body.style.transform = '';
            pullDistance = 0;
        });
    }

    handleSearch(query) {
        if (query.length < 2) return;
        
        // Simulate autocomplete suggestions
        const suggestions = [
            'New York, NY',
            'Los Angeles, CA', 
            'Chicago, IL',
            'Houston, TX',
            'Phoenix, AZ'
        ].filter(location => location.toLowerCase().includes(query.toLowerCase()));
        
        // In a real app, this would show a dropdown with suggestions
        console.log('Search suggestions:', suggestions);
    }

    searchLocation(location) {
        // Simulate location search
        this.showLoadingState();
        
        setTimeout(() => {
            this.currentLocation.name = location || "New Location";
            this.updateWeatherDisplay();
            this.hideLoadingState();
            
            // Clear search input
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = '';
        }, 1000);
    }

    updateWeatherDisplay() {
        const elements = {
            locationName: document.getElementById('locationName'),
            temperature: document.getElementById('temperature'),
            condition: document.getElementById('condition'),
            feelsLike: document.getElementById('feelsLike'),
            highTemp: document.getElementById('highTemp'),
            lowTemp: document.getElementById('lowTemp'),
            humidity: document.getElementById('humidity'),
            windSpeed: document.getElementById('windSpeed'),
            uvIndex: document.getElementById('uvIndex'),
            airQuality: document.getElementById('airQuality')
        };

        // Update text content with staggered animations
        Object.entries(elements).forEach(([key, element], index) => {
            if (element) {
                anime({
                    targets: element,
                    opacity: [1, 0],
                    duration: 200,
                    complete: () => {
                        switch(key) {
                            case 'locationName':
                                element.textContent = this.currentLocation.name;
                                break;
                            case 'temperature':
                                element.textContent = `${this.currentLocation.temperature}°`;
                                break;
                            case 'condition':
                                element.textContent = this.currentLocation.condition;
                                break;
                            case 'feelsLike':
                                element.textContent = `${this.currentLocation.feelsLike}°`;
                                break;
                            case 'highTemp':
                                element.textContent = `${this.currentLocation.highTemp}°`;
                                break;
                            case 'lowTemp':
                                element.textContent = `${this.currentLocation.lowTemp}°`;
                                break;
                            case 'humidity':
                                element.textContent = `${this.currentLocation.humidity}%`;
                                break;
                            case 'windSpeed':
                                element.textContent = `${this.currentLocation.windSpeed} mph`;
                                break;
                            case 'uvIndex':
                                element.textContent = this.currentLocation.uvIndex;
                                break;
                            case 'airQuality':
                                element.textContent = this.currentLocation.airQuality;
                                break;
                        }
                        
                        anime({
                            targets: element,
                            opacity: [0, 1],
                            duration: 300,
                            delay: index * 50
                        });
                    }
                });
            }
        });

        // Update weather icon based on condition
        this.updateWeatherIcon();
    }

    updateWeatherIcon() {
        const iconElement = document.getElementById('weatherIcon');
        if (!iconElement) return;

        // Add rotation animation
        anime({
            targets: iconElement,
            rotate: [0, 360],
            duration: 800,
            easing: 'easeOutQuart'
        });
    }

    initializeAnimations() {
        // Staggered fade-in animations for cards
        anime({
            targets: '.fade-in',
            opacity: [0, 1],
            translateY: [30, 0],
            delay: anime.stagger(100),
            duration: 800,
            easing: 'easeOutQuart'
        });

        // Liquid button hover effects
        document.querySelectorAll('.liquid-button').forEach(button => {
            button.addEventListener('mouseenter', () => {
                anime({
                    targets: button,
                    scale: [1, 1.05],
                    duration: 200,
                    easing: 'easeOutQuart'
                });
            });

            button.addEventListener('mouseleave', () => {
                anime({
                    targets: button,
                    scale: [1.05, 1],
                    duration: 200,
                    easing: 'easeOutQuart'
                });
            });
        });

        // Metric cards hover animations
        document.querySelectorAll('.metric-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                anime({
                    targets: card,
                    scale: [1, 1.05],
                    duration: 200,
                    easing: 'easeOutQuart'
                });
            });

            card.addEventListener('mouseleave', () => {
                anime({
                    targets: card,
                    scale: [1.05, 1],
                    duration: 200,
                    easing: 'easeOutQuart'
                });
            });
        });

        // Navigation item animations
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                anime({
                    targets: item,
                    scale: [1, 0.95, 1],
                    duration: 200,
                    easing: 'easeOutQuart'
                });
            });
        });
    }

    startParticleSystem() {
        // Initialize p5.js particle system for weather effects
        const sketch = (p) => {
            let particles = [];
            const numParticles = 50;

            p.setup = () => {
                const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                canvas.parent('particleCanvas');
                
                // Create particles based on current weather
                for (let i = 0; i < numParticles; i++) {
                    particles.push(new Particle(p));
                }
            };

            p.draw = () => {
                p.clear();
                
                // Update and display particles
                particles.forEach(particle => {
                    particle.update();
                    particle.display();
                });
            };

            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            };

            class Particle {
                constructor(p) {
                    this.p = p;
                    this.x = p.random(p.width);
                    this.y = p.random(p.height);
                    this.vx = p.random(-0.5, 0.5);
                    this.vy = p.random(-0.5, 0.5);
                    this.alpha = p.random(0.1, 0.3);
                    this.size = p.random(2, 6);
                }

                update() {
                    this.x += this.vx;
                    this.y += this.vy;

                    // Wrap around screen
                    if (this.x < 0) this.x = this.p.width;
                    if (this.x > this.p.width) this.x = 0;
                    if (this.y < 0) this.y = this.p.height;
                    if (this.y > this.p.height) this.y = 0;
                }

                display() {
                    this.p.noStroke();
                    this.p.fill(255, 255, 255, this.alpha * 255);
                    this.p.ellipse(this.x, this.y, this.size);
                }
            }
        };

        new p5(sketch);
    }

    showLoadingState() {
        const elements = document.querySelectorAll('.temperature-display, .condition-text, .metric-value');
        elements.forEach(element => {
            element.classList.add('loading-shimmer');
        });
    }

    hideLoadingState() {
        const elements = document.querySelectorAll('.loading-shimmer');
        elements.forEach(element => {
            element.classList.remove('loading-shimmer');
        });
    }

    navigateToPage(href) {
        // Update active navigation state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Find and activate clicked item
        const clickedItem = document.querySelector(`[href="${href}"]`);
        if (clickedItem) {
            clickedItem.classList.add('active');
        }

        // Page transition animation
        anime({
            targets: '.content-wrapper',
            opacity: [1, 0],
            translateX: [-20, 0],
            duration: 300,
            easing: 'easeOutQuart',
            complete: () => {
                window.location.href = href;
            }
        });
    }

    refreshWeather() {
        this.showLoadingState();
        
        // Simulate API call
        setTimeout(() => {
            // Update with new random data
            this.currentLocation.temperature = Math.floor(Math.random() * 30) + 60;
            this.currentLocation.humidity = Math.floor(Math.random() * 40) + 40;
            this.currentLocation.windSpeed = Math.floor(Math.random() * 20) + 5;
            this.currentLocation.uvIndex = Math.floor(Math.random() * 10) + 1;
            
            this.updateWeatherDisplay();
            this.generateHourlyData();
            this.hideLoadingState();
            
            // Show success feedback
            this.showToast('Weather updated successfully!');
        }, 1500);
    }

    addCurrentLocation() {
        const location = {
            id: Date.now().toString(),
            name: this.currentLocation.name,
            weather: { ...this.currentLocation }
        };
        
        this.locations.push(location);
        this.showToast(`Added ${location.name} to your locations!`);
        
        // Animate button feedback
        const button = event.target;
        anime({
            targets: button,
            scale: [1, 0.95, 1],
            duration: 200,
            easing: 'easeOutQuart'
        });
    }

    shareWeather() {
        const weatherText = `Current weather in ${this.currentLocation.name}: ${this.currentLocation.temperature}°F, ${this.currentLocation.condition}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Weather Update',
                text: weatherText
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(weatherText).then(() => {
                this.showToast('Weather information copied to clipboard!');
            });
        }
    }

    showToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg z-50';
        toast.textContent = message;
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-20px)';
        
        document.body.appendChild(toast);
        
        // Animate in
        anime({
            targets: toast,
            opacity: [0, 1],
            translateY: [-20, 0],
            duration: 300,
            easing: 'easeOutQuart',
            complete: () => {
                // Animate out after delay
                setTimeout(() => {
                    anime({
                        targets: toast,
                        opacity: [1, 0],
                        translateY: [0, -20],
                        duration: 300,
                        easing: 'easeOutQuart',
                        complete: () => {
                            document.body.removeChild(toast);
                        }
                    });
                }, 3000);
            }
        });
    }
}

// Global functions for HTML onclick handlers
function refreshWeather() {
    window.weatherApp.refreshWeather();
}

function addCurrentLocation() {
    window.weatherApp.addCurrentLocation();
}

function shareWeather() {
    window.weatherApp.shareWeather();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.weatherApp = new WeatherApp();
    
    // Update initial weather display
    window.weatherApp.updateWeatherDisplay();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        console.log('Page hidden - pausing animations');
    } else {
        // Resume animations when page is visible
        console.log('Page visible - resuming animations');
        if (window.weatherApp) {
            window.weatherApp.initializeAnimations();
        }
    }
});

// Handle orientation changes
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (window.weatherApp && window.weatherApp.particleSystem) {
            // Recreate particle system for new orientation
            window.weatherApp.startParticleSystem();
        }
    }, 100);
});

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}