// Global error handling
window.onerror = function(msg, url, lineNo, columnNo, error) {
    // Log to analytics
    if (typeof gtag === 'function') {
        gtag('event', 'javascript_error', {
            'error_message': msg,
            'url': url,
            'line': lineNo,
            'column': columnNo,
            'error_object': JSON.stringify(error)
        });
    }
    
    // Log to console in development
    console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo + '\nColumn: ' + columnNo + '\nError object: ' + JSON.stringify(error));
    
    return false;
};

// Promise error handling
window.addEventListener('unhandledrejection', function(event) {
    // Log to analytics
    if (typeof gtag === 'function') {
        gtag('event', 'unhandled_promise_rejection', {
            'error_message': event.reason
        });
    }
    
    console.error('Unhandled promise rejection:', event.reason);
});

// Network error handling
window.addEventListener('offline', function(e) {
    console.log('Lost network connection');
    // Show offline notification to user
    if (document.getElementById('offline-notification')) {
        document.getElementById('offline-notification').style.display = 'block';
    }
});

window.addEventListener('online', function(e) {
    console.log('Network connection restored');
    // Hide offline notification
    if (document.getElementById('offline-notification')) {
        document.getElementById('offline-notification').style.display = 'none';
    }
});