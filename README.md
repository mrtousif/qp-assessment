# QpAssessment

![ER diagram](./ER-diagram.png)

Tech Stack:

- TypeScript
- NestJS
- MikroORM
- Postgres

Tools:

- Dbmate (used for db migration)
- Pnpm
- Docker
- Nx monorepo https://nx.dev

## To test the server do the followings

1. Install dependencies using pnpm

```sh
pnpm i
```

2. Build NestJS server

```sh
npx nx build grocery-booking
```

3. Start up postgres, apply sql migration, and start node server

```sh
docker compose up
```

4. Run the database seeder. It will add few users and products to DB

```sh
    pnpm exec nx run grocery-booking:seeder
```

5. Connect to database using TablePlus. Do import from URL

```
postgresql://postgres:postgres_pass@localhost:5433/grocery_db?statusColor=&env=local&name=Docker%20Postgres&tLSMode=0&usePrivateKey=false&safeModeLevel=0&advancedSafeModeLevel=0&driverVersion=0&showSystemSchemas=0&lazyLoadItems=0
```

## API Test

**Pick up admin user from users table and pass it to authorization header. User registration is not implemented as it is not required**

As a admin:

1. Add new grocery items to the system

Request

```sh
curl  -X POST \
  'http://localhost:6000/api/products' \
  --header 'Accept: */*' \
  --header 'Authorization: 1bf80a20-a634-4b2f-a0dc-377e28e2c577' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "name": "Potato",
  "stockQty": 11,
  "price": 9
}'
```

Response

```json
{
  "id": "318133e8-1851-4269-8193-38b3dc1baf88",
  "name": "Potato",
  "stockQty": 11,
  "price": 9,
  "createdAt": "2024-03-04T10:56:39.985Z"
}
```

2. View existing grocery items.

Request

```sh
curl  -X GET \
  'http://localhost:6000/api/products' \
  --header 'Accept: */*' \
  --header 'Authorization: 1bf80a20-a634-4b2f-a0dc-377e28e2c577'
```

Response

```json
[
  {
    "id": "aa575ee4-4a88-4760-8dc8-bd0c347d94a2",
    "name": "Carrot",
    "stockQty": 5,
    "price": 160,
    "createdAt": "2024-03-04T10:40:11.683Z",
    "updatedAt": null,
    "deletedAt": null
  },
  {
    "id": "318133e8-1851-4269-8193-38b3dc1baf88",
    "name": "Potato",
    "stockQty": 11,
    "price": 9,
    "createdAt": "2024-03-04T10:56:39.985Z",
    "updatedAt": null,
    "deletedAt": null
  }
]
```

3. Remove grocery items from the system.

It soft deletes the item because items cannot removed from db if it is already purchased.

Request

```sh
curl  -X DELETE \
  'http://localhost:6000/api/products/03c2260e-6fa2-4bbc-b3bb-ce0725fe08ef' \
  --header 'Accept: */*' \
  --header 'Authorization: 1bf80a20-a634-4b2f-a0dc-377e28e2c577'
```

Response

```text
Status code 200
```

4. Update details (e.g., name, price) of an existing grocery item.

Request

```sh
curl  -X PATCH \
  'http://localhost:6000/api/products/318133e8-1851-4269-8193-38b3dc1baf88' \
  --header 'Accept: */*' \
  --header 'Authorization: 1bf80a20-a634-4b2f-a0dc-377e28e2c577' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "name": "Potato 2",
  "price": 10
}'
```

Response

```text
Status code 200
```

5. Manage inventory levels of a grocery item.

Request

```sh
curl  -X PATCH \
  'http://localhost:6000/api/products/318133e8-1851-4269-8193-38b3dc1baf88' \
  --header 'Accept: */*' \
  --header 'Authorization: 1bf80a20-a634-4b2f-a0dc-377e28e2c577' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "stockQty": 8
}'
```

Response

```text
Status code 200
```

As a user

1. View the list of available grocery items. (When regular user id as authorization header is passed, server will return the grocery items where stockQty > 0)

Request

```sh
curl  -X GET \
  'http://localhost:6000/api/products' \
  --header 'Accept: */*' \
  --header 'Authorization: 101bfb23-0744-459a-8b06-f6f874a45416'
```

Response

```json
[
  {
    "id": "aa575ee4-4a88-4760-8dc8-bd0c347d94a2",
    "name": "Carrot",
    "stockQty": 5,
    "price": 160,
    "createdAt": "2024-03-04T10:40:11.683Z",
    "updatedAt": null,
    "deletedAt": null
  },
  {
    "id": "e596de1e-c5b9-40c3-858f-5d06839a4c4d",
    "name": "Potato",
    "stockQty": 11,
    "price": 9,
    "createdAt": "2024-03-04T10:55:35.114Z",
    "updatedAt": null,
    "deletedAt": null
  },
  {
    "id": "318133e8-1851-4269-8193-38b3dc1baf88",
    "name": "Potato 2",
    "stockQty": 8,
    "price": 10,
    "createdAt": "2024-03-04T10:56:39.985Z",
    "updatedAt": null,
    "deletedAt": null
  }
]
```

2. Ability to book multiple grocery items in a single order.

   1. Add products to a cart. Make requests for each items you want to add to the cart. If you add same item multiple times it will increment the quantity as long as stock is available.

   Request

   ```sh
    curl  -X POST \
      'http://localhost:6000/api/carts' \
      --header 'Accept: */*' \
      --header 'User-Agent: Thunder Client (https://www.thunderclient.com)' \
      --header 'Authorization: 101bfb23-0744-459a-8b06-f6f874a45416' \
      --header 'Content-Type: application/json' \
      --data-raw '{
      "productId": "e596de1e-c5b9-40c3-858f-5d06839a4c4d",
      "quantity": 2
    }'
   ```

   Response

   ```json
   {
     "cartId": "cc203704-bc6d-4ff1-8747-f6bc96d759ed",
     "productId": "e596de1e-c5b9-40c3-858f-5d06839a4c4d",
     "quantity": 2
   }
   ```

   2. View the list of items in the cart.

   Request

   ```sh
    curl  -X GET \
   'http://localhost:6000/api/carts' \
   --header 'Accept: */*' \
   --header 'Authorization: 101bfb23-0744-459a-8b06-f6f874a45416'
   ```

   Response

   ```json
   [
     {
       "id": "0e6c266c-6940-4584-ad6a-54f38b971969",
       "cart": "cc203704-bc6d-4ff1-8747-f6bc96d759ed",
       "product": {
         "id": "e596de1e-c5b9-40c3-858f-5d06839a4c4d",
         "name": "Potato",
         "stockQty": 11,
         "price": 9,
         "createdAt": "2024-03-04T10:55:35.114Z",
         "updatedAt": null,
         "deletedAt": null
       },
       "quantity": 2,
       "createdAt": "2024-03-04T12:03:40.277Z",
       "updatedAt": null
     },
     {
       "id": "6fe3c0f9-2f3d-4dc3-ba50-a9453e17aeda",
       "cart": "cc203704-bc6d-4ff1-8747-f6bc96d759ed",
       "product": {
         "id": "aa575ee4-4a88-4760-8dc8-bd0c347d94a2",
         "name": "Carrot",
         "stockQty": 5,
         "price": 160,
         "createdAt": "2024-03-04T10:40:11.683Z",
         "updatedAt": null,
         "deletedAt": null
       },
       "quantity": 1,
       "createdAt": "2024-03-04T12:01:45.806Z",
       "updatedAt": null
     }
   ]
   ```

   3. Create order

      Request

   ```sh
    curl  -X POST \
      'http://localhost:6000/api/orders' \
      --header 'Accept: */*' \
      --header 'Authorization: 101bfb23-0744-459a-8b06-f6f874a45416' \
      --header 'Content-Type: application/json' \
      --data-raw '{
      "cartId": "cc203704-bc6d-4ff1-8747-f6bc96d759ed"
    }'
   ```

   Response

   ```json
   {
     "id": "832a522a-9dac-46af-b396-736369ec2618",
     "price": 178,
     "createdAt": "2024-03-04T12:12:04.256Z"
   }
   ```

## Start the application

Run `npx nx serve grocery-booking` to start the development server. Happy coding!

## Build for production

Run `npx nx build grocery-booking` to build the application. The build artifacts are stored in the output directory (e.g. `dist/` or `build/`), ready to be deployed.

## Running tasks

To execute tasks with Nx use the following syntax:

```
npx nx <target> <project> <...options>
```

You can also run multiple targets:

```
npx nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
npx nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/features/run-tasks).
