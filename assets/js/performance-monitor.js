// Performance monitoring script
const performanceMonitor = {
    init: function() {
        // Monitor page load performance
        this.monitorPageLoad();
        
        // Monitor runtime performance
        this.monitorRuntime();
        
        // Monitor resource loading
        this.monitorResources();
        
        // Monitor user interactions
        this.monitorInteractions();
    },

    monitorPageLoad: function() {
        window.addEventListener('load', () => {
            // Use Performance API
            if (performance) {
                // Navigation Timing metrics
                let pageNav = performance.getEntriesByType('navigation')[0];
                let metrics = {
                    'dns_time': pageNav.domainLookupEnd - pageNav.domainLookupStart,
                    'connection_time': pageNav.connectEnd - pageNav.connectStart,
                    'ttfb': pageNav.responseStart - pageNav.requestStart,
                    'dom_load_time': pageNav.domContentLoadedEventEnd - pageNav.domContentLoadedEventStart,
                    'full_page_load': pageNav.loadEventEnd - pageNav.loadEventStart
                };

                // Report to Analytics
                Object.keys(metrics).forEach(metric => {
                    if (typeof gtag === 'function') {
                        gtag('event', 'performance_metric', {
                            'metric_name': metric,
                            'metric_value': metrics[metric],
                            'metric_category': 'page_load'
                        });
                    }
                });
            }
        });
    },

    monitorRuntime: function() {
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (typeof gtag === 'function') {
                        gtag('event', 'long_task', {
                            'duration': entry.duration,
                            'start_time': entry.startTime,
                            'metric_category': 'runtime'
                        });
                    }
                }
            });

            observer.observe({ entryTypes: ['longtask'] });
        }
    },

    monitorResources: function() {
        // Monitor resource loading
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (entry.initiatorType && entry.duration > 1000) { // Log slow resources (>1s)
                        if (typeof gtag === 'function') {
                            gtag('event', 'slow_resource', {
                                'resource_type': entry.initiatorType,
                                'resource_name': entry.name,
                                'duration': entry.duration,
                                'metric_category': 'resources'
                            });
                        }
                    }
                });
            });

            observer.observe({ entryTypes: ['resource'] });
        }
    },

    monitorInteractions: function() {
        // Monitor First Input Delay
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (typeof gtag === 'function') {
                        gtag('event', 'first_input_delay', {
                            'value': entry.processingStart - entry.startTime,
                            'metric_category': 'interaction'
                        });
                    }
                }
            });

            observer.observe({ entryTypes: ['first-input'] });
        }
    }
};

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', () => {
    performanceMonitor.init();
});