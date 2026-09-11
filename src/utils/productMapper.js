const mapProduct = (product) => {
    if (!product) {
      return null;
    }
  
    return {
      id: Number(product.id),
      name: product.name,
      description: product.description,
      category: product.category,
      price: Number(product.price),
      stock: product.stock,
      imageUrl: product.image_url,
      isActive: product.is_active,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };
  };
  
  export default mapProduct;