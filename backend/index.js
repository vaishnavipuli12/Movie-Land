const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());


const cors = require('cors');

app.use(cors());

app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&fields=key,title,author_name,editions`);
        const books = response.data.docs.map(book => ({
            title: book.title,
            author: book.author_name ? book.author_name[0] : 'Unknown Author',
            publication_date: book.editions?.docs[0]?.title || 'Unknown',
            editions: book.editions?.docs || [],
        }));
        const dogImageRequests = books.map(() => axios.get('https://dog.ceo/api/breeds/image/random'));
        const dogImages = await Promise.all(dogImageRequests);
        const booksWithImages = books.map((book, index) => ({
            ...book,
            image: dogImages[index].data.message
        }));

        res.json(booksWithImages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from Open Library' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});