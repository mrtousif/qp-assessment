-- migrate:up

CREATE TABLE users (
  id uuid DEFAULT gen_random_uuid(),
  name varchar NOT NULL,
  role varchar NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  CONSTRAINT users_id_pk PRIMARY KEY (id)
);

CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid(),
  name varchar NOT NULL,
  stock_qty int DEFAULT 1 constraint stock_qty_nonnegative check (stock_qty >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  CONSTRAINT products_id_pk PRIMARY KEY (id)
);

CREATE TABLE carts (
  id uuid DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  CONSTRAINT carts_id_pk PRIMARY KEY (id),
  CONSTRAINT products_id_fk FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE
);

CREATE TABLE orders (
  id uuid DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  cart_id uuid NOT NULL,
  transaction_id uuid NOT NULL,
  price int NOT NULL constraint price_nonnegative check (price >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  CONSTRAINT orders_id_pk PRIMARY KEY (id),
  CONSTRAINT carts_id_fk FOREIGN KEY (cart_id) REFERENCES carts(id) ON UPDATE CASCADE,
  CONSTRAINT users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE,
  CONSTRAINT unique_user_cart UNIQUE (user_id, cart_id)
);


-- migrate:down

DROP TABLE orders;
DROP TABLE carts;
DROP TABLE products;
DROP TABLE users;