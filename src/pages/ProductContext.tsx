// import React, { createContext, useContext } from 'react';
// import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
// import axios from 'axios';

// type Product = {
//     id: string;
//     name: string;
//     sku: string;
//     price: number;
//     quantity: number;
// };

// type ProductContextType = {
//     products: Product[];
//     isLoading: boolean;
//     isError: boolean;
//     addProduct: (productData: any) => void;
// };

// const ProductContext = createContext<ProductContextType | undefined>(undefined);

// export const useProducts = () => {
//     const context = useContext(ProductContext);
//     if (!context) {
//         throw new Error('useProducts must be used within a ProductProvider');
//     }
//     return context;
// };

// export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
//     const queryClient = useQueryClient();

//     const { data: products = [], isLoading, isError } = useQuery({
//         queryKey: ['products'],
//         queryFn: async () => {
//             const response = await axios.get('http://localhost:3001/api/products');
//             return response.data;
//         },
//     });

//     const { mutate: addProduct } = useMutation({
//         mutationFn: async (productData: any) => {
//             const response = await axios.post(
//                 'http://localhost:3001/api/catalog/object',
//                 productData
//             );
//             return response.data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['products'] });
//         },
//     });

//     return (
//         <ProductContext.Provider value={{ products, isLoading, isError, addProduct }}>
//             {children}
//         </ProductContext.Provider>
//     );
// };



import React, { createContext, useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
};

type ProductContextType = {
    addProduct: (params: { productData: any; imageFile?: File }) => void;
  };
  

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  // ✅ Upload image first
  const uploadImage = async (productId: string, imageFile: File) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append(
      'request',
      JSON.stringify({
        idempotency_key: `${Date.now()}-${productId}`,
        object_id: productId,
      })
    );

    const response = await axios.post(
      'https://connect.squareup.com/v2/catalog/images',
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.image.id;
  };

  // ✅ Create product after uploading image
  const createProduct = async (productData: any, imageId?: string) => {
    const payload = {
      idempotency_key: `${Date.now()}-${productData.name}`,
      object: {
        type: 'ITEM',
        id: `#${productData.id}`,
        item_data: {
          name: productData.name,
          variations: [
            {
              type: 'ITEM_VARIATION',
              id: `#${productData.id}-variation`,
              item_variation_data: {
                name: productData.name,
                pricing_type: 'FIXED_PRICING',
                price_money: {
                  amount: productData.price * 100, // Square uses cents
                  currency: 'USD',
                },
                sku: productData.sku,
              },
            },
          ],
          image_ids: imageId ? [imageId] : [], // ✅ Link the image here
        },
      },
    };

    const response = await axios.post(
      'https://connect.squareup.com/v2/catalog/object',
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  };

  // ✅ Handle full flow (upload + create)
  const { mutate: addProduct } = useMutation({
    mutationFn: async ({ productData, imageFile }: { productData: any; imageFile?: File }) => {
      let imageId;

      if (imageFile) {
        imageId = await uploadImage(productData.id, imageFile);
      }

      return createProduct(productData, imageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] }); // ✅ Refresh product list
    },
  });

  return (
    <ProductContext.Provider value={{ addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

