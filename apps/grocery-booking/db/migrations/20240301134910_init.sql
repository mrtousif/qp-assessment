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
  stock_qty int NOT NULL DEFAULT 1 constraint stock_qty_nonnegative check (stock_qty >= 0),
  price int NOT NULL constraint price_nonzero check (price > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  deleted_at timestamptz,
  CONSTRAINT products_id_pk PRIMARY KEY (id)
);

CREATE TYPE carts_status AS ENUM (
  'created',
  'purchased',
  'expired'
);

CREATE TABLE carts (
  id uuid DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  status carts_status NOT NULL DEFAULT 'created',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  CONSTRAINT carts_id_pk PRIMARY KEY (id),
  CONSTRAINT users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE
);

CREATE TABLE carts_items (
  id uuid DEFAULT gen_random_uuid(),
  cart_id uuid NOT NULL,
  product_id uuid NOT NULL,
  quantity int NOT NULL DEFAULT 1 constraint quantity_nonzero check (quantity >= 1),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  CONSTRAINT carts_items_id_pk PRIMARY KEY (id),
  CONSTRAINT products_id_fk FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE,
  CONSTRAINT carts_id_fk FOREIGN KEY (cart_id) REFERENCES carts(id) ON UPDATE CASCADE,
  CONSTRAINT unique_cart_items UNIQUE (product_id, cart_id)
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
DROP TABLE carts_items;
DROP TABLE carts;
DROP TABLE products;
DROP TABLE users;

DROP TYPE carts_status;