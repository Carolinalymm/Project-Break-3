import mongoose from "mongoose";

import Review from "../models/review.model.js";
import AppError from "../utils/appError.js";
import mapReview from "../utils/reviewMapper.js";
import {
  findProductById,
} from "./product.service.js";

const validateAndNormalizeReview = ({
  rating,
  comment,
} = {}) => {
  const normalizedRating = Number(rating);

  if (
    !Number.isInteger(normalizedRating) ||
    normalizedRating < 1 ||
    normalizedRating > 5
  ) {
    throw new AppError(
      "La puntuación debe ser un número entero entre 1 y 5",
      400,
    );
  }

  if (
    typeof comment !== "string" ||
    comment.trim().length < 5
  ) {
    throw new AppError(
      "El comentario debe tener al menos 5 caracteres",
      400,
    );
  }

  if (comment.trim().length > 1000) {
    throw new AppError(
      "El comentario no puede superar los 1000 caracteres",
      400,
    );
  }

  return {
    rating: normalizedRating,
    comment: comment.trim(),
  };
};

const validateReviewId = (reviewId) => {
  if (!mongoose.isValidObjectId(reviewId)) {
    throw new AppError(
      "El identificador de la review no es válido",
      400,
    );
  }

  return reviewId;
};

const checkReviewOwnership = (
  review,
  currentUser,
) => {
  const isAuthor =
    Number(review.userId) ===
    Number(currentUser.id);

  const isAdmin =
    currentUser.role === "ADMIN";

  if (!isAuthor && !isAdmin) {
    throw new AppError(
      "No tienes permisos para modificar esta review",
      403,
    );
  }
};

export const findReviewsByProduct = async (
  productId,
) => {

  const product = await findProductById(
    productId,
  );

  const reviews = await Review.find({
    productId: product.id,
  })
    .sort({
      createdAt: -1,
    })
    .lean();

  const mappedReviews =
    reviews.map(mapReview);

  const ratingsTotal = mappedReviews.reduce(
    (total, review) => {
      return total + review.rating;
    },
    0,
  );

  const averageRating =
    mappedReviews.length > 0
      ? Number(
          (
            ratingsTotal /
            mappedReviews.length
          ).toFixed(1),
        )
      : 0;

  return {
    reviews: mappedReviews,
    summary: {
      total: mappedReviews.length,
      averageRating,
    },
  };
};

export const insertReview = async ({
  productId,
  user,
  reviewData,
}) => {
  const product = await findProductById(
    productId,
  );

  const normalizedReview =
    validateAndNormalizeReview(reviewData);

  try {
    const review = await Review.create({
      productId: product.id,
      userId: Number(user.id),
      userName: user.name,
      rating: normalizedReview.rating,
      comment: normalizedReview.comment,
    });

    return mapReview(review.toObject());
  } catch (error) {

    if (error.code === 11000) {
      throw new AppError(
        "Ya has publicado una review para este producto",
        409,
      );
    }

    throw new AppError(
      "No se pudo crear la review",
      500,
    );
  }
};

export const replaceReview = async ({
  reviewId,
  user,
  reviewData,
}) => {
  validateReviewId(reviewId);

  const normalizedReview =
    validateAndNormalizeReview(reviewData);

  const review =
    await Review.findById(reviewId);

  if (!review) {
    throw new AppError(
      "Review no encontrada",
      404,
    );
  }

  checkReviewOwnership(review, user);

  review.rating = normalizedReview.rating;
  review.comment = normalizedReview.comment;

  await review.save();

  return mapReview(review.toObject());
};

export const removeReview = async ({
  reviewId,
  user,
}) => {
  validateReviewId(reviewId);

  const review =
    await Review.findById(reviewId);

  if (!review) {
    throw new AppError(
      "Review no encontrada",
      404,
    );
  }

  checkReviewOwnership(review, user);
  const deletedReview =
    mapReview(review.toObject());

  await review.deleteOne();

  return deletedReview;
};