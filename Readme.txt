About the project

Rent-app based on CRUD functionality was developed as an online catalog and focuses, on the one hand, on the admin, who adds new items and their categories, and, on the other hand, on users, who are able to find a product they are interested in and share their opinion in case they have already rented something. The project supports image uploading, maps, comments and filters.

Built with

Node.js
Express.js
MongoDB
Bootstrap

API

Method: GET Route: "/" Usage: homepage
Method: GET Route: "/instructions" Usage: instructions
Method: GET Route: "/costumes" Usage: index
Method: GET Route: "/costumes/new" Usage: rendering a form to add a new item
Method: POST Route: "/costumes" Usage: adding a new item
Method: GET Route: "/costumes/:id" Usage: showing one item
Method: GET Route: "/costumes/:id/edit" Usage: rendering a form to edit an item
Method: PUT Route: "/costumes/:id" Usage: updating an item
Method: DELETE Route: "/costumes/:id" Usage: deleting an item
Method: POST Route: "/costumes/:id/reviews" Usage: adding a review to an item
Method: DELETE Route: "/costumes/:id/reviews/:reviewID" Usage: deleting a review
Method: GET Route: "/register" Usage: rendering a register form
Method: POST Route: "/register" Usage: register
Method: GET Route: "/login" Usage: rendering a login form
Method: POST Route: "/login" Usage: login
Method: GET Route: "/logout" Usage: logout
Method: GET Route: "/styles" Usage: rendering a form to add a new item category (style)
Method: POST Route: "/styles" Usage: adding a new item category (style)
Method: DELETE Route: "/styles/:id" Usage: deleting an item category (style)
Method: GET Route: "/types" Usage: rendering a form to add a new item category (type)
Method: POST Route: "/types" Usage: adding a new item category (type)
Method: DELETE Route: "/types/:id" Usage: deleting an item category (type)

Contact

https://github.com/AKolomiichenko

Acknowledgments

https://www.udemy.com/course/the-web-developer-bootcamp/
https://getbootstrap.com/
https://cloudinary.com/
https://www.mongodb.com/atlas/database
https://www.mapbox.com/