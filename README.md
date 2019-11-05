# HTTP Server - Exercise #4

## PART 1

- Update your /api/book/add route
- Fetch the title now from the url
- Use the URL library for getting the url params as an object
- If no title param is given: 
    - Return with an error code 400 (= bad request) and a message that informs the user how he needs to call this route
- If a title is given: Use the given title instead of a faker title
- Provide an HTML link which brings you back to the /books route. So we can directly check if our new book was created


## PART 2

- Delete all your hardcoded books from the books array (make it an empty array)
- On each book adding of a book: 
    - Write the books array to a file "books.json"
- On startup of our script: 
    - Fill the books array with the contents of the books.json file (if it exists!). Otherwise start with
    an empty array
- Now add again some books via the /api/books/add route
- Check if the books.json file gets updated
- Great. Now we got a permanent storage for our books

## PART 3

- Update the /books route: 
    - Display the UUID of the book next to the title

- Add two more routes for editing and deleting a book
    - The edit route expects two parameters: id and title_new
        - It should find and update the given book
    - The delete route expexts one param: id
        - It should delete the book with the given id (uuid)
    - Test your routes. Get the id values from your book list
    - If the user does not call the routes with that params
        - send a response with a code 400 and a corresponding error message
- On each update / delete
    - update the books.json file too!

Congratulations!
You just have built a fully functional CRUD API
(which - by the way - is the most classical backend task)