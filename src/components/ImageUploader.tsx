import React, { useState } from 'react';

interface ImageUploaderProps {
  objectId: string | null;
  name: string;
  description: string;
  onFileSelect: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  objectId,
  name,
  description,
  onFileSelect
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !objectId) return;

    setLoading(true);
    onFileSelect(file);

    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={loading || !objectId}
        className="border border-gray-300 rounded-lg p-2 w-full"
      />
      {loading && <p>Uploading...</p>}
      {image && (
        <div>
          <img
            src={image}
            alt="Uploaded"
            className="w-32 h-32 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;








// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Upload, X, Image as ImageIcon } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// interface UploadedImage {
//   id: string;
//   file: File;
//   preview: string;
// }

// const ImageUploader = () => {
//   const { toast } = useToast();
//   const [images, setImages] = useState<UploadedImage[]>([]);
//   const [isDragging, setIsDragging] = useState(false);

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const processFiles = (files: FileList | null) => {
//     if (!files) return;
    
//     const newImages: UploadedImage[] = [];
    
//     Array.from(files).forEach(file => {
//       // Check if it's an image
//       if (!file.type.startsWith('image/')) {
//         toast({
//           title: "Invalid file type",
//           description: `${file.name} is not an image file`,
//           variant: "destructive",
//         });
//         return;
//       }
      
//       // Check file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         toast({
//           title: "File too large",
//           description: `${file.name} exceeds the 5MB limit`,
//           variant: "destructive",
//         });
//         return;
//       }
      
//       // Add to new images array
//       newImages.push({
//         id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
//         file,
//         preview: URL.createObjectURL(file)
//       });
//     });
    
//     setImages(prev => [...prev, ...newImages]);
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(false);
//     processFiles(e.dataTransfer.files);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     processFiles(e.target.files);
//   };

//   const removeImage = (id: string) => {
//     setImages(prev => {
//       const filtered = prev.filter(img => img.id !== id);
//       const imgToRemove = prev.find(img => img.id === id);
//       if (imgToRemove) {
//         URL.revokeObjectURL(imgToRemove.preview);
//       }
//       return filtered;
//     });
//   };

//   return (
//     <div className="space-y-4">
//       <div
//         className={`border-2 border-dashed rounded-lg p-8 text-center ${
//           isDragging ? "border-brand-blue bg-blue-50" : "border-gray-300"
//         }`}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//       >
//         <div className="flex flex-col items-center justify-center space-y-4">
//           <div className="bg-gray-100 p-3 rounded-full">
//             <Upload className="h-6 w-6 text-gray-500" />
//           </div>
//           <div>
//             <h3 className="text-lg font-medium">Drag & drop your images here</h3>
//             <p className="text-sm text-muted-foreground">
//               Or click to browse (maximum 10 images, 5MB each)
//             </p>
//           </div>
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             className="hidden"
//             id="image-upload"
//             onChange={handleFileChange}
//           />
//           <Button
//             variant="outline"
//             onClick={() => document.getElementById("image-upload")?.click()}
//             disabled={images.length >= 10}
//           >
//             Select Files
//           </Button>
//         </div>
//       </div>

//       {images.length > 0 && (
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//           {images.map((image) => (
//             <div key={image.id} className="relative group">
//               <div className="aspect-square rounded-md overflow-hidden border">
//                 <img
//                   src={image.preview}
//                   alt={image.file.name}
//                   className="h-full w-full object-cover"
//                 />
//               </div>
//               <button
//                 type="button"
//                 onClick={() => removeImage(image.id)}
//                 className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//               <p className="text-xs truncate mt-1">{image.file.name}</p>
//             </div>
//           ))}
          
//           {images.length < 10 && (
//             <div 
//               className="aspect-square rounded-md border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-gray-50"
//               onClick={() => document.getElementById("image-upload")?.click()}
//             >
//               <div className="flex flex-col items-center text-muted-foreground">
//                 <ImageIcon className="h-6 w-6 mb-1" />
//                 <span className="text-xs">Add More</span>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {images.length > 0 && (
//         <div className="text-sm text-muted-foreground">
//           <p>
//             <span className="font-medium">{images.length}</span> of{" "}
//             <span className="font-medium">10</span> images uploaded
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageUploader;


// import React, { useState } from 'react';

// interface ImageUploaderProps {
//   onUpload: (url: string) => void;
// }

// const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
//   const [image, setImage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

  

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
  
//     setLoading(true);
  
//     const formData = new FormData();
//     formData.append('image', file); // ✅ Use 'image' instead of 'file'
//     formData.append('objectId', 'your-object-id'); // ✅ Replace with dynamic object ID
//     formData.append('name', 'your-product-name'); // ✅ Replace with dynamic product name
//     formData.append('caption', 'your-product-caption'); // ✅ Replace with dynamic product caption
  
//     try {
//       const res = await fetch('http://localhost:3001/api/upload-image', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer EAAAlzgK0JQUthQ993_EIKGXOeI9EJv-fgKcsbF4prmpZ4MB1gTOChj9TGbevhdl`, // ✅ Include Bearer token
//         },
//         body: formData, // ✅ Send form data directly
//       });
  
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || 'Failed to upload image');
//       }
  
//       const data = await res.json();
//       setImage(data.secure_url || data.image_url); // ✅ Handle possible response keys
//       onUpload(data.secure_url || data.image_url); // ✅ Pass URL to parent component
  
//       console.log('Image upload successful:', data);
//     } catch (error) {
//       console.error('Error uploading image:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   return (
//     <div className="space-y-4">
//       <input 
//         type="file" 
//         accept="image/*" 
//         onChange={handleImageUpload} 
//         disabled={loading}
//         className="border border-gray-300 rounded-lg p-2 w-full"
//       />
//       {loading && <p>Uploading...</p>}
//       {image && (
//         <div>
//           <img src={image} alt="Uploaded" className="w-32 h-32 object-cover rounded-lg" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageUploader;
