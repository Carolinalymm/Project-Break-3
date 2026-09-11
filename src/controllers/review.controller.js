import {
    findReviewsByProduct,
    insertReview,
    replaceReview,
    removeReview,
  } from "../services/review.service.js";
  import {
    sendSuccess,
  } from "../utils/apiResponse.js";

  export const getProductReviews = async (
    req,
    res,
  ) => {
    const result =
      await findReviewsByProduct(
        req.params.id,
      );
  
    return sendSuccess(res, {
      statusCode: 200,
      message: "Reviews obtenidas correctamente",
      data: result,
    });
  };

  export const createProductReview = async (
    req,
    res,
  ) => {
    const review = await insertReview({
      productId: req.params.id,
      user: req.user,
      reviewData: req.body,
    });
  
    return sendSuccess(res, {
      statusCode: 201,
      message: "Review creada correctamente",
      data: {
        review,
      },
    });
  };
  
  export const updateReview = async (
    req,
    res,
  ) => {
    const review = await replaceReview({
      reviewId: req.params.reviewId,
      user: req.user,
      reviewData: req.body,
    });
  
    return sendSuccess(res, {
      statusCode: 200,
      message: "Review actualizada correctamente",
      data: {
        review,
      },
    });
  };
  
  export const deleteReview = async (
    req,
    res,
  ) => {
    const review = await removeReview({
      reviewId: req.params.reviewId,
      user: req.user,
    });
  
    return sendSuccess(res, {
      statusCode: 200,
      message: "Review eliminada correctamente",
      data: {
        review,
      },
    });
  };