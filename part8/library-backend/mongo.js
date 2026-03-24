require("dotenv").config();
const mongoose = require("mongoose");

const Author = require("./models/author");
const Book = require("./models/book");

const MONGODB_URI = process.env.MONGODB_URI;

const authors = [
  { name: "Robert Martin", born: 1952 },
  { name: "Martin Fowler", born: 1963 },
  { name: "Fyodor Dostoevsky", born: 1821 },
  { name: "Joshua Kerievsky" },
  { name: "Sandi Metz" },
];

const books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design",
    published: 2012,
    author: "Sandi Metz",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    genres: ["classic", "crime"],
  },
  {
    title: "Demons",
    published: 1872,
    author: "Fyodor Dostoevsky",
    genres: ["classic", "revolution"],
  },
];

const main = async () => {
  await mongoose.connect(MONGODB_URI);

  await Author.deleteMany({});
  await Book.deleteMany({});

  const createdAuthors = {};

  for (let a of authors) {
    const author = new Author(a);
    const saved = await author.save();
    createdAuthors[a.name] = saved;
  }

  for (let b of books) {
    const book = new Book({
      ...b,
      author: createdAuthors[b.author]._id,
    });
    await book.save();
  }

  console.log("Data inserted!");
  mongoose.connection.close();
};

main();
