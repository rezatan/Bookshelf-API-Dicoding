const { nanoid } = require('nanoid')
const bookshelfs = require('./bookshelf')

const addBookshelfHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  if (!Object.prototype.hasOwnProperty.call(request.payload, 'name')) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    }).code(400)
  }
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
  }
  const id = nanoid(16)
  const finished = (pageCount === readPage)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const newBookshelf = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  }
  bookshelfs.push(newBookshelf)
  const isSuccess = bookshelfs.filter((bookshelf) => bookshelf.id === id).length > 0
  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    }).code(201)
  }
  return h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  }).code(500)
}

const getAllBookshelfHandler = (request, h) => {
  const arrBookshelfs = []
  let response = null
  let { name = '', reading = '', finished = '' } = request.query
  let result = -1
  if (bookshelfs.size === 0) response = h.response({ status: 'success', data: { books: [] } })
  else {
    for (let i = 0; i < bookshelfs.length; i++) {
      result = -1
      if (name !== '' || reading !== '' || finished !== '') {
        if (reading === '0') reading = false
        else if (reading === '1') reading = true
        if (finished === '0') finished = false
        else if (finished === '1') finished = true
        if (name === bookshelfs[i].name && reading === bookshelfs[i].reading && finished === bookshelfs[i].finished && finished !== '' && reading !== '') result = 1
        else if (name === bookshelfs[i].name && reading === bookshelfs[i].reading && reading !== '') result = 2
        else if (name === bookshelfs[i].name && finished === bookshelfs[i].finished && finished !== '') result = 3
        else if (reading === bookshelfs[i].reading && finished === bookshelfs[i].finished && finished !== '' && reading !== '') result = 4
        else if (bookshelfs[i].name.toLowerCase().includes(name.toLowerCase()) && name !== '') result = 5
        else if (reading === bookshelfs[i].reading && reading !== '') result = 6
        else if (finished === bookshelfs[i].finished && finished !== '') result = 7
      } else result = 0

      if (result >= 0) {
        arrBookshelfs.push({
          id: bookshelfs[i].id,
          name: bookshelfs[i].name,
          publisher: bookshelfs[i].publisher
        })
      }
    }
    response = h.response({ status: 'success', data: { books: arrBookshelfs } })
  }
  return response.code(200)
}

const getBookshelfByIdHandler = (request, h) => {
  const { bookId } = request.params
  const bookshelf = bookshelfs.filter((n) => n.id === bookId)[0]

  if (bookshelf !== undefined) {
    return h.response({
      status: 'success',
      data: {
        book: bookshelf
      }
    }).code(200)
  }
  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  }).code(404)
}

const editBookshelfByIdHandler = (request, h) => {
  const { bookId } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  if (!Object.prototype.hasOwnProperty.call(request.payload, 'name')) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }
  const finished = (pageCount === readPage)
  const updatedAt = new Date().toISOString()
  const index = bookshelfs.findIndex((bookshelf) => bookshelf.id === bookId)
  if (index !== -1) {
    const insertedAt = bookshelfs[index].insertedAt
    bookshelfs[index] = {
      ...bookshelfs[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}
const deleteBookshelfByIdHandler = (request, h) => {
  const { bookId } = request.params
  const index = bookshelfs.findIndex((bookshelf) => bookshelf.id === bookId)

  if (index !== -1) {
    bookshelfs.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}
module.exports = {
  addBookshelfHandler,
  getAllBookshelfHandler,
  getBookshelfByIdHandler,
  editBookshelfByIdHandler,
  deleteBookshelfByIdHandler
}
