const http = require("http")
const uuid = require("uuid/v1")
const faker = require("faker")
const urlLib = require("url")
const fs = require("fs")

let arrBooks = []
if(fs.existsSync("./books.json")) {
    arrBooks = require("./books")
}

const saveBooksToFile = (filePath = 'books.json') => {
    fs.writeFileSync(filePath, JSON.stringify(arrBooks))
}

const server = http.createServer((req, res) => {

    // parse parameters from the query string of the URL
    let params = urlLib.parse(req.url, true).query

    // homepage route
    if(req.url === "/") {
        res.write("<h1>Homepage</h1>")
        res.write("<img src='//unsplash.it/300/300' />")
        res.write("<br />")
        res.write("<a href='/books'>Books</a>")
        return res.end()
    }

    // route for showing all books as HTML list
    else if(req.url === "/books") {
        // convert each book object in the array to an HTML list string
        // at the end join the array of LI strings to one single string 
        let strBookList = 
            "<ul>" +
            arrBooks.map(book => `
                <li>${book.id}: ${book.title}</li>`
            ).join("") + 
            "</ul>"
 
        res.write("<h1>Books</h1>")
        res.write(strBookList)
        res.write("<a href='/'>Back to Home</a>")
        return res.end()
    }

    // route for showing all books as JSON
    else if(req.url === "/api/books") {
        let strBooks = JSON.stringify(arrBooks)
        res.writeHead(200, {
            "Content-Type": "application/json"
        })
        return res.end(strBooks)
    }

    // route for adding books
    else if(req.url.startsWith("/api/books/add")) {

        if(!params.title) {
            res.statusCode = 400
            return res.end(
                "ERROR: No title parameter given. " +
                "Please provide a title parameter in the URL"
            )
        }

        // create new book in array
        let bookNew = {}
        bookNew.id = uuid()
        bookNew.title = params.title
        arrBooks.push(bookNew)

        // write array to file
        saveBooksToFile()

        return res.end(`<p>New book created: ${bookNew.title}</p>` +
            "<br />" +
            "<a href='/books' >Show all books</a>"
        )
    }

    // route for updating books
    else if(req.url.startsWith("/api/books/update")) {
        if(!params.id || !params.title_new) {
            res.statusCode = 404
            return res.end(
                "ERROR: Please provide 'id' and " + 
                "'title_new' as URL parameters"
            )
        }

        // find the book and update the title
        let bookToUpdate = arrBooks.find(book => book.id == params.id) 

        if(!bookToUpdate) {
            res.statusCode = 400
            return res.end(`Book with id ${params.id} does not exist`)
        }

        bookToUpdate.title = params.title_new
        saveBooksToFile() // save changes to "database"

        return res.end(`<p>Book with id: ${bookToUpdate.id} updated</p>` +
            "<br />" +
            "<a href='/books' >Show all books</a>"
        )
    }

    // route for deleting books
    else if(req.url.startsWith("/api/books/delete")) {
        if(!params.id) {
            res.statusCode = 404
            return res.end(
                "ERROR: Please provide 'id' as URL parameter"
            )
        }

        // delete the book with the given id by "filtering it out"
        let bookIndexToDelete = arrBooks.findIndex(book => book.id == params.id)
        if(bookIndexToDelete === -1) {
            res.statusCode = 400
            return res.end(`Book with id ${params.id} does not exist`)
        }
        arrBooks.splice(bookIndexToDelete, 1) // delete book
        saveBooksToFile() // save changes to database

        return res.end(`<p>Book with id ${params.id} deleted</p>` +
            "<br />" +
            "<a href='/books' >Show all books</a>"
        )
    }
    
    // handle all other routes with a 404
    else {
        res.statusCode = 404
        return res.end("This page does not exist")
    }
})

let port = 3000
server.listen(port, () => {
    console.log(`Server runs now on port ${port}`)
})
