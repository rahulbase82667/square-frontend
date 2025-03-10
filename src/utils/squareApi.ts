/**
 * Square API utilities for inventory synchronization
 */

// Square API configuration
const SQUARE_API_URL = 'https://connect.squareup.com/v2';
const SQUARE_LOCATION_ID = 'L8M3QFES7YACD';
const SQUARE_API_SECRET = 'EAAAl7wuu6ayAloKJ0uxnDTt6QX2-Sa8W7tmGSuMcADB09D4CNQgyrgBa19QG5hC';

// Headers for Square API requests with proper configuration
const headers = {
  'Square-Version': '2024-02-22',
  'Authorization': `Bearer ${SQUARE_API_SECRET}`,
  'Content-Type': 'application/json'
};

/**
 * Check if the Square integration is working
 */
export const checkSquareConnection = async (): Promise<boolean> => {
  try {
    console.log("Checking Square connection...");
    const response = await fetch(`${SQUARE_API_URL}/locations`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Square API Error:', errorData);
      return false;
    }

    const data = await response.json();
    console.log("Square connection successful:", data);
    return data.locations && data.locations.length > 0;
  } catch (error) {
    console.error('Failed to connect to Square API:', error);
    return false;
  }
};

/**
 * Get inventory counts for all items
 */
export const getInventory = async () => {
  try {
    const response = await fetch(`${SQUARE_API_URL}/inventory/counts/batch`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        location_ids: [SQUARE_LOCATION_ID],
        updated_after: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Square API error: ${JSON.stringify(errorData)}`);
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
    console.log("Fetching catalog items from Square...");
    const response = await fetch(`${SQUARE_API_URL}/catalog/list?types=ITEM`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Square API Error:', errorData);
      throw new Error(`Square API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("Catalog items fetched successfully:", data);
    return data;
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
 * Sync a product to Square
 */
export const syncProductToSquare = async (product: any): Promise<any> => {
  try {
    // First, check if product exists by SKU
    const searchResponse = await fetch(`${SQUARE_API_URL}/catalog/search-catalog-items`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        text_filter: product.sku,
        location_ids: [SQUARE_LOCATION_ID]
      })
    });

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json();
      throw new Error(`Square API search error: ${JSON.stringify(errorData)}`);
    }

    const searchData = await searchResponse.json();
    
    if (searchData.items && searchData.items.length > 0) {
      // Product exists, update it
      const itemId = searchData.items[0].id;
      const updateResponse = await fetch(`${SQUARE_API_URL}/catalog/object/${itemId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          idempotency_key: `update_${Date.now()}`,
          object: {
            type: 'ITEM',
            id: itemId,
            item_data: {
              name: product.name,
              description: product.description,
              variations: [
                {
                  type: 'ITEM_VARIATION',
                  id: `#${itemId}_variation`,
                  item_variation_data: {
                    item_id: itemId,
                    name: 'Regular',
                    sku: product.sku,
                    pricing_type: 'FIXED_PRICING',
                    price_money: {
                      amount: Math.round(product.price * 100),
                      currency: 'GBP'
                    }
                  }
                }
              ]
            }
          }
        })
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(`Square API update error: ${JSON.stringify(errorData)}`);
      }

      return await updateResponse.json();
    } else {
      // Product doesn't exist, create it
      const createResponse = await fetch(`${SQUARE_API_URL}/catalog/object`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          idempotency_key: `create_${Date.now()}`,
          object: {
            type: 'ITEM',
            id: `#${Date.now()}`,
            item_data: {
              name: product.name,
              description: product.description,
              variations: [
                {
                  type: 'ITEM_VARIATION',
                  id: `#var_${Date.now()}`,
                  item_variation_data: {
                    name: 'Regular',
                    sku: product.sku,
                    pricing_type: 'FIXED_PRICING',
                    price_money: {
                      amount: Math.round(product.price * 100),
                      currency: 'GBP'
                    }
                  }
                }
              ]
            }
          }
        })
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(`Square API create error: ${JSON.stringify(errorData)}`);
      }

      return await createResponse.json();
    }
  } catch (error) {
    console.error('Failed to sync product to Square:', error);
    throw error;
  }
};
