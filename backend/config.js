// Appwrite Configuration
const APPWRITE_ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const APPWRITE_API_KEY = 'standard_d6ef52384f4c567f907124e81f385f86d5a1b84f45ef54293e355b1f8ac4aa0849cc3d93b66a57b3dd38fcbb0854436af00166631bb5a32c50f4f12f03628414ff4ac9c0dac446d36effaca051a9dcdce6f0bcfdf8397c0caf56bf9150dcf2cdc839618e3a762d3a1d2453e583751ad900ad7bb6c8df745f98e013d6afe5b158';
const APPWRITE_PROJECT_ID = '69a666200016df0f9213';
const APPWRITE_DATABASE_ID = '69a66b8d0032b073a18c';
const APPWRITE_PRODUCTS_COLLECTION = 'products';

// Initialize Appwrite Client and Services
let client;
let databases;
let appwriteInitialized = false;

function initializeAppwrite() {
    if (appwriteInitialized) {
        console.log('Appwrite already initialized');
        return true;
    }
    
    if (typeof Appwrite === 'undefined') {
        console.warn('Appwrite SDK not yet loaded, will retry...');
        return false;
    }
    
    try {
        client = new Appwrite.Client()
            .setEndpoint(APPWRITE_ENDPOINT)
            .setProject(APPWRITE_PROJECT_ID);
        
        databases = new Appwrite.Databases(client);
        appwriteInitialized = true;
        console.log('✓ Appwrite initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing Appwrite:', error);
        return false;
    }
}

// Try to initialize immediately if SDK is loaded
if (typeof Appwrite !== 'undefined') {
    initializeAppwrite();
} else {
    // Retry when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initializeAppwrite, 100);
        });
    } else {
        setTimeout(initializeAppwrite, 100);
    }
}
