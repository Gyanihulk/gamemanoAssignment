### Install packages

```shell
npm i
```

### Setup .env file

```js
DATABASE_URL=
DIRECT_URL=

AUTH_SECRET=

NEXT_PUBLIC_APP_URL=

MAIL_USER=
APP_PASSWORD=

```

### Setup Prisma

```shell
npx prisma migrate dev
npx prisma generate
npx prisma db push
```

#### Create a New Migration

To create a new migration after modifying your Prisma schema, you can use the `prisma migrate dev` command. This will create a new SQL migration file in the `prisma/migrations` directory and apply it to your development database.

```shell
npx prisma migrate dev --name <name_of_your_migration>
```


### Start the app

```shell
npm run dev 
```

## OR

```shell
yarn dev 
```



# Prisma Utility Scripts

This directory contains several utility scripts for managing movie data in the database using Prisma and external APIs.

# filterMovies.ts

This script filters movies in the database and retrieves only those released after the year 2020.

### How to run:

```shell
npx ts-node prisma/filterMovies.ts
```
# Movie Seed Script

## Description
The `movieSeed.ts` script seeds the database with initial movie data. It is typically used to populate the database with a set of movies for development or testing purposes.

## How to Run the Script
To run the movie seeding script, use the following command:

```shell
npx ts-node prisma/movieSeed.ts
```
### `updateMovieData.md`

```markdown
# Update Movie Data Script

## Description
This script uses the OMDb API to fetch and update movie records with additional information such as posters, plot, director, actors, and more.

## Prerequisites
- Obtain an API key from [OMDb API](https://www.omdbapi.com/).
- Update that in the script

## How to Run the Script
To execute the script and update movie prices, run the following command:
```shell
 npx ts-node prisma/updateMovieData.ts
```

### `updateMoviePrice.md`


# Update Movie Price Script

## Description
The `updateMoviePrice.ts` script is used to add a random price to each movie record in the database. The price is set to a random value between 100 and 500, specifically for DVDs.

## How to Run the Script
To execute the script and update movie prices, run the following command:

```shell
npx ts-node prisma/updateMoviePrice.ts
```




# API Endpoints


## Filter Movies

**GET** `/api/movie`

Retrieves a list of movies filtered by various criteria such as actors, director, genre, language, and title. If no parameters are provided, it returns all movies.

### Query Parameters

- `actors`: Filter movies by actors' names. Supports partial, case-insensitive matching.
- `director`: Filter movies by the director's name. Supports partial, case-insensitive matching.
- `genreName`: Filter movies by genre. Supports partial, case-insensitive matching.
- `language`: Filter movies by language. Supports partial, case-insensitive matching.
- `title`: Filter movies by title. Supports partial, case-insensitive matching.

### Request URL Example

```plaintext
http://localhost:3000/api/movie?actors=pra&director=maruth&genreName=horro&language=hindi&title=raj
```

## Get Movie by ID

**GET** `/api/movie/:id`

Retrieves detailed information about a specific movie by its unique identifier (ID).


### URL Parameters

- `id`: The unique identifier of the movie you want to retrieve.


## Add Movie to Cart

**POST** `/api/cart/addMovie/`

Adds a movie to the user's cart. If the movie is already in the cart, it increments the quantity.

### Request Body Example

```json
{
  "movieId": "movie_123"
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

## Checkout

**POST** `/api/cart/checkout`

Create a order and checkouts to payment page 

### URL Path Example
`api/cart/checkout`


## Create Address

**POST** `/api/user/address`

Creates a new address for the current user.


## Get Address

**GET** `/api/user/address`

Gets a new address for the current user.


### Update Address (User)

## Update Address (User)

**PUT** `/api/user/address/{addressId}`

Updates an existing address for the current authenticated user.

### URL Parameters

- `addressId`: The unique identifier of the address to update.

### Request Body

- `street`: The new street of the address.
- `city`: The new city of the address.
- `state`: The new state of the address.
- `zipCode`: The new zip code of the address.
- `country`: The new country of the address.
- `phone`: The new phone number associated with the address.




### Request Body Example
```json
{
  "street": "123 Main St",
  "city": "Anytown",
  "state": "Anystate",
  "zipCode": "12345",
  "country": "Countryname",
  "phone": "123-456-7890"
}
```

## Get My Orders

**GET** `/api/user/myorders`

Retrieves the orders associated with the current authenticated user.

*No request body required for GET requests.*


# Admin Orders API

**GET** `/admin/orders`

Allows administrators to retrieve a list of all orders placed on the platform.

*No request body required for GET requests.*

# Admin Orders API

**GET** `/admin/orders/orderId`

Allows administrators to retrieve a Value of any order by id.

*No request body required for GET requests.*


## Get Order by ID (Admin)

**GET** `/admin/orders/{orderId}`

Retrieves the details of a specific order by its ID. This endpoint is accessible only to administrators.

### URL Parameters

- `orderId`: The unique identifier of the order to retrieve.



### Update Order Status to Delivered (User)

## Update Order Status to Delivered (User)

**POST** `/api/user/myorders/{orderId}/delivered`

Updates the status of a specific order to "DELIVERED". This endpoint is accessible only to the user who owns the order.

### URL Parameters

- `orderId`: The unique identifier of the order to update.

