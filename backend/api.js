// API Helper Functions for Appwrite

/**
 * Fetch all products from Appwrite database
 */
async function fetchProducts() {
    try {
        if (!databases || !appwriteInitialized) {
            console.warn('Appwrite not initialized, attempting to initialize...');
            const initialized = initializeAppwrite();
            if (!initialized || !databases) {
                console.warn('Could not initialize Appwrite, using fallback data');
                return [];
            }
        }
        
        const response = await databases.listDocuments(
            APPWRITE_DATABASE_ID,
            APPWRITE_PRODUCTS_COLLECTION
        );
        console.log('✓ Products fetched:', response.documents?.length || 0);
        return response.documents || [];
    } catch (error) {
        console.error('Error fetching products:', error.message);
        return [];
    }
}

/**
 * Fetch a single product by ID
 */
async function fetchProductById(productId) {
    try {
        const product = await databases.getDocument(
            APPWRITE_DATABASE_ID,
            APPWRITE_PRODUCTS_COLLECTION,
            productId
        );
        return product;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

/**
 * Search products by name or description
 */
async function searchProducts(query) {
    try {
        const products = await fetchProducts();
        return products.filter(product =>
            product.name?.toLowerCase().includes(query.toLowerCase()) ||
            product.description?.toLowerCase().includes(query.toLowerCase())
        );
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
}

/**
 * Get product image URL from storage
 */
function getProductImageUrl(bucketId, fileId) {
    return `${APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${fileId}/view?project=${APPWRITE_PROJECT_ID}`;
}

/**
 * Format price for display
 */
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

/**
 * Create a new product (used by admin panel)
 */
async function createProduct(productData) {
    try {
        if (!databases || !appwriteInitialized) {
            const initialized = initializeAppwrite();
            if (!initialized || !databases) {
                throw new Error('Appwrite not initialized');
            }
        }

        const productId = 'product_' + Date.now();
        
        // Validate and process image URL/path
        const imageUrl = productData.image ? productData.image.trim() : '';
        
        const newProduct = await databases.createDocument(
            APPWRITE_DATABASE_ID,
            APPWRITE_PRODUCTS_COLLECTION,
            productId,
            {
                name: productData.name,
                price: parseFloat(productData.price),
                description: productData.description || '',
                image: imageUrl, // Supports both URLs and local paths
                category: productData.category || '',
                stock: parseInt(productData.stock) || 0,
                availability: productData.availability || 'In Stock',
                sizes: productData.sizes || []
            }
        );

        console.log('✓ Product created:', newProduct.$id);
        return newProduct;
    } catch (error) {
        console.error('Error creating product:', error.message);
        throw error;
    }
}

/**
 * Update an existing product
 */
async function updateProduct(productId, productData) {
    try {
        if (!databases || !appwriteInitialized) {
            const initialized = initializeAppwrite();
            if (!initialized || !databases) {
                throw new Error('Appwrite not initialized');
            }
        }

        const updated = await databases.updateDocument(
            APPWRITE_DATABASE_ID,
            APPWRITE_PRODUCTS_COLLECTION,
            productId,
            productData
        );

        console.log('✓ Product updated:', productId);
        return updated;
    } catch (error) {
        console.error('Error updating product:', error.message);
        throw error;
    }
}

/**
 * Delete a product
 */
async function deleteProduct(productId) {
    try {
        if (!databases || !appwriteInitialized) {
            const initialized = initializeAppwrite();
            if (!initialized || !databases) {
                throw new Error('Appwrite not initialized');
            }
        }

        await databases.deleteDocument(
            APPWRITE_DATABASE_ID,
            APPWRITE_PRODUCTS_COLLECTION,
            productId
        );

        console.log('✓ Product deleted:', productId);
    } catch (error) {
        console.error('Error deleting product:', error.message);
        throw error;
    }
}
