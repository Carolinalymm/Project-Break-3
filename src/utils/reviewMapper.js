const mapReview = (review) => {
    if (!review) {
      return null;
    }
  
    return {

      id: String(review._id),
  
      productId: Number(review.productId),
      userId: Number(review.userId),
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  };
  
  export default mapReview;