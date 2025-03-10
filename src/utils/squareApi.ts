
/**
 * Square API utilities for inventory synchronization
 */

// Square API credentials
const SQUARE_APP_ID = 'sq0idp-k179M9PgyycfIe79od8WTQ';
const SQUARE_API_SECRET = 'EAAAl7wuu6ayAloKJ0uxnDTt6QX2-Sa8W7tmGSuMcADB09D4CNQgyrgBa19QG5hC';
const SQUARE_API_URL = 'https://connect.squareup.com/v2';
const SQUARE_LOCATION_ID = 'L8M3QFES7YACD'; // Default location ID - this would typically be configurable

// Headers for Square API requests
const headers = {
  'Square-Version': '2023-09-25',
  'Authorization': `Bearer ${SQUARE_API_SECRET}`,
  'Content-Type': 'application/json'
};

/**
 * Get inventory counts for all items
 */
export const getInventory = async (): Promise<any> => {
  try {
    const response = await fetch(`${SQUARE_API_URL}/inventory/counts`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error(`Square API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch inventory from Square:', error);
    throw error;
  }
};

/**
 * Get a specific catalog item
 */
export const getCatalogItem = async (itemId: string): Promise<any> => {
  try {
    const response = await fetch(`${SQUARE_API_URL}/catalog/object/${itemId}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error(`Square API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch catalog item ${itemId} from Square:`, error);
    throw error;
  }
};

/**
 * Update inventory count for an item
 */
export const updateInventory = async (catalogObjectId: string, quantity: number): Promise<any> => {
  try {
    const body = JSON.stringify({
      idempotency_key: `inv_update_${Date.now()}`,
      changes: [
        {
          type: 'PHYSICAL_COUNT',
          physical_count: {
            catalog_object_id: catalogObjectId,
            location_id: SQUARE_LOCATION_ID,
            quantity: quantity.toString(),
            state: 'IN_STOCK'
          }
        }
      ]
    });

    const response = await fetch(`${SQUARE_API_URL}/inventory/changes/batch-create`, {
      method: 'POST',
      headers,
      body
    });

    if (!response.ok) {
      throw new Error(`Square API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to update inventory in Square:', error);
    throw error;
  }
};

/**
 * Fetch all catalog items (products)
 */
export const getCatalogItems = async (): Promise<any> => {
  try {
    const response = await fetch(`${SQUARE_API_URL}/catalog/list?types=ITEM`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error(`Square API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch catalog items from Square:', error);
    throw error;
  }
};

/**
 * Create a new catalog item
 */
export const createCatalogItem = async (
  name: string, 
  description: string, 
  price: number, 
  sku: string
): Promise<any> => {
  try {
    const itemId = `item_${Date.now()}`;
    const variationId = `var_${Date.now()}`;
    
    const body = JSON.stringify({
      idempotency_key: `create_${Date.now()}`,
      object: {
        type: 'ITEM',
        id: `#${itemId}`,
        item_data: {
          name,
          description,
          variations: [
            {
              type: 'ITEM_VARIATION',
              id: `#${variationId}`,
              item_variation_data: {
                item_id: `#${itemId}`,
                name: 'Regular',
                sku,
                pricing_type: 'FIXED_PRICING',
                price_money: {
                  amount: Math.round(price * 100),
                  currency: 'GBP'
                }
              }
            }
          ]
        }
      }
    });

    const response = await fetch(`${SQUARE_API_URL}/catalog/object`, {
      method: 'POST',
      headers,
      body
    });

    if (!response.ok) {
      throw new Error(`Square API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to create catalog item in Square:', error);
    throw error;
  }
};

/**
 * Check if the Square integration is working
 */
export const checkSquareConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${SQUARE_API_URL}/locations`, {
      method: 'GET',
      headers
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to connect to Square API:', error);
    return false;
  }
};

/**
 * Sync a product to Square
 */
export const syncProductToSquare = async (product: any): Promise<any> => {
  try {
    // Check if product already exists in Square by SKU
    const catalogResponse = await fetch(`${SQUARE_API_URL}/catalog/search`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: {
          exact_query: {
            attribute_name: 'sku',
            attribute_value: product.sku
          }
        }
      })
    });
    
    const catalogData = await catalogResponse.json();
    
    if (catalogData.objects && catalogData.objects.length > 0) {
      // Product exists, update it
      const squareItem = catalogData.objects[0];
      const variationId = squareItem.item_data.variations[0].id;
      
      // Update inventory for the existing product
      return await updateInventory(variationId, product.inventory);
    } else {
      // Product doesn't exist, create it
      const newItem = await createCatalogItem(
        product.name,
        product.description,
        product.price,
        product.sku
      );
      
      // Set initial inventory after creation
      const variationId = newItem.catalog_object.item_data.variations[0].id;
      return await updateInventory(variationId, product.inventory);
    }
  } catch (error) {
    console.error('Failed to sync product to Square:', error);
    throw error;
  }
};
