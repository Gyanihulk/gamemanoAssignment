### Install packages

```shell
npm i
```

### Setup .env file


```js
DATABASE_URL=
DIRECT_URL=

AUTH_SECRET=

RESEND_API_KEY=

NEXT_PUBLIC_APP_URL=
```

### Setup Prisma
```shell
npx prisma generate
npx prisma db push
```

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command         | description                              |
| :-------------- | :--------------------------------------- |
| `dev`           | Starts a development instance of the app |




https://www.omdbapi.com/?apikey=7498ae20
npx ts-node .\prisma\movieSeed.ts


# API Endpoints

## Add Movie to Cart

**POST** `/api/cart/addMovie/`

Adds a movie to the user's cart. If the movie is already in the cart, it increments the quantity.

### Request Body Example

```json
{
  "movieId": "movie_123"
}
```


## Update Cart Item Quantity

**PATCH** `/api/cart/{cartItemId}`

Updates the quantity of a specific cart item in the user's cart.

### URL Path Example
`/api/cart/cartItem_123`

### Request Body Example
```json
{
  "quantity": 2
}
```

## Get User Cart

**GET** `/api/cart`

Retrieves the current user's cart, including all cart items and their details, ordered by the time they were last updated (latest first).

*Note: No request body required for GET requests.*



## Update Cart Item

**PUT** `/api/cart/{cartItemId}`

Updates the details of a specific cart item in the user's cart, such as quantity or other properties.

### URL Path Example
`/api/cart/cartItem_123`

### Request Body Example
```json
{
  "quantity": 3
}
```
