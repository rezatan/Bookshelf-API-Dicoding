const {
  addBookshelfHandler,
  getAllBookshelfHandler,
  getBookshelfByIdHandler,
  editBookshelfByIdHandler,
  deleteBookshelfByIdHandler
} = require('./handler')

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookshelfHandler
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBookshelfHandler
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookshelfByIdHandler
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookshelfByIdHandler
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookshelfByIdHandler
  }
]
module.exports = routes
