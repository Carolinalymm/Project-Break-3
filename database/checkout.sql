BEGIN;

CREATE OR REPLACE FUNCTION public.checkout_cart(
  p_user_id BIGINT
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cart_id BIGINT;

  v_order_id BIGINT;

  v_total NUMERIC(10, 2) := 0;

  v_item RECORD;
BEGIN

  SELECT carts.id
  INTO v_cart_id
  FROM public.carts
  WHERE carts.user_id = p_user_id
    AND carts.status = 'ACTIVE'
  FOR UPDATE;

  IF v_cart_id IS NULL THEN
    RAISE EXCEPTION
      'No tienes un carrito activo';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.cart_items
    WHERE cart_items.cart_id = v_cart_id
  ) THEN
    RAISE EXCEPTION
      'El carrito está vacío';
  END IF;

  FOR v_item IN
    SELECT
      cart_items.product_id,
      cart_items.quantity,
      products.name,
      products.price,
      products.stock,
      products.is_active
    FROM public.cart_items
    INNER JOIN public.products
      ON products.id =
        cart_items.product_id
    WHERE cart_items.cart_id =
      v_cart_id
    ORDER BY products.id
    FOR UPDATE OF products
  LOOP
    IF v_item.is_active = FALSE THEN
      RAISE EXCEPTION
        'El producto "%" ya no está disponible',
        v_item.name;
    END IF;

    IF v_item.stock < v_item.quantity THEN
      RAISE EXCEPTION
        'Stock insuficiente para "%". Disponibles: %, solicitadas: %',
        v_item.name,
        v_item.stock,
        v_item.quantity;
    END IF;

    v_total :=
      v_total +
      (
        v_item.price *
        v_item.quantity
      );
  END LOOP;

  INSERT INTO public.orders (
    user_id,
    cart_id,
    total,
    status
  )
  VALUES (
    p_user_id,
    v_cart_id,
    v_total,
    'PENDING'
  )
  RETURNING id
  INTO v_order_id;

  INSERT INTO public.order_items (
    order_id,
    product_id,
    product_name,
    quantity,
    unit_price,
    subtotal
  )
  SELECT
    v_order_id,
    products.id,
    products.name,
    cart_items.quantity,
    products.price,
    ROUND(
      products.price *
      cart_items.quantity,
      2
    )
  FROM public.cart_items
  INNER JOIN public.products
    ON products.id =
      cart_items.product_id
  WHERE cart_items.cart_id =
    v_cart_id;

  UPDATE public.products
  SET stock =
    products.stock -
    cart_items.quantity
  FROM public.cart_items
  WHERE cart_items.cart_id =
    v_cart_id
    AND cart_items.product_id =
      products.id;

  UPDATE public.carts
  SET
    status = 'CHECKED_OUT',
    checked_out_at = NOW()
  WHERE id = v_cart_id;

  RETURN v_order_id;
END;
$$;

REVOKE ALL
ON FUNCTION public.checkout_cart(BIGINT)
FROM PUBLIC;

REVOKE ALL
ON FUNCTION public.checkout_cart(BIGINT)
FROM anon, authenticated;

GRANT EXECUTE
ON FUNCTION public.checkout_cart(BIGINT)
TO service_role;

COMMIT;