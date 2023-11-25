# 1. local path http://localhost:3000/api/users/

# 2. vercel path https://l2assignment2-sigma.vercel.app/api/users

# 3. Model and Schema define in SRC>Models folder

# 4. user, product, quantity query control given in SRC>controllers folder

# 5. routes setup in SRC>routes folder

# 6. eslint and prettier used in this code

# 7. config file in app\config\ folder

## 8. Instructions on how to run the application locally.

    # a. Create a new user

POST http://localhost:3000/api/users/

# b. Retrieve a list of all users

GET http://localhost:3000/api/users/

# c. Retrieve a specific user by ID (example userId 4)

GET http://localhost:3000/api/users/4

# d. Update user information(example userId 4)

PUT http://localhost:3000/api/users/4

# e. Delete a user (example userId 2)

DELETE http://localhost:3000/api/users/2

# f. Add New Product in Order (example userId 4)

PUT http://localhost:3000/api/users/4/orders

# g. Retrieve all orders for a specific user (example userId 4)

GET http://localhost:3000/api/users/4/orders

# h. Calculate Total Price of Orders for a Specific User (example userId 4)

GET http://localhost:3000/api/users/4/orders/total-price
