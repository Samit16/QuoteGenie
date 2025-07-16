const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote');
const tagSelect = document.getElementById('tag-select');
const copyBtn = document.getElementById('copy');
const saveBtn = document.getElementById('save');
const viewFavsBtn = document.getElementById('view-favs');
const favoritesSection = document.getElementById('favorites-section');
const favsList = document.getElementById('favs-list');

// Load saved favorites from localStorage
let favorites = JSON.parse(localStorage.getItem('favoriteQuotes')) || [];
let lastQuoteIndex = -1; // Track last quote to avoid repetition
let currentCategory = ''; // Track current category

// Fallback quotes database organized by category
const quotesDatabase = {
    inspirational: [
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
        { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" }
    ],
    wisdom: [
        { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
        { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
        { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
        { text: "Yesterday is history, tomorrow is a mystery, today is a gift.", author: "Eleanor Roosevelt" },
        { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
        { text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", author: "Albert Einstein" }
    ],
    technology: [
        { text: "Technology is nothing. What's important is that you have a faith in people.", author: "Steve Jobs" },
        { text: "The advance of technology is based on making it fit in so that you don't really even notice it.", author: "Bill Gates" },
        { text: "Any sufficiently advanced technology is indistinguishable from magic.", author: "Arthur C. Clarke" },
        { text: "The real problem is not whether machines think but whether men do.", author: "B.F. Skinner" },
        { text: "Technology is a useful servant but a dangerous master.", author: "Christian Lous Lange" },
        { text: "The Internet is becoming the town square for the global village of tomorrow.", author: "Bill Gates" }
    ],
    life: [
        { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
        { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
        { text: "Life is 10% what happens to you and 90% how you react to it.", author: "Charles R. Swindoll" },
        { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", author: "Martin Luther King Jr." },
        { text: "Life is short, and it's up to you to make it sweet.", author: "Sarah Louise Delany" },
        { text: "The biggest adventure you can take is to live the life of your dreams.", author: "Oprah Winfrey" }
    ]
};

// Get all quotes for "All" category
function getAllQuotes() {
    return Object.values(quotesDatabase).flat();
}

async function fetchQuote() {
    try {
        const selectedTag = tagSelect.value;
        
        // Try API first with CORS proxy
        let apiUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://zenquotes.io/api/random');
        
        try {
            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                if (data && data[0]) {
                    displayQuote(data[0].q, data[0].a);
                    return;
                }
            }
        } catch (apiError) {
            console.log('API failed, using fallback quotes');
        }
        
        // Fallback to local quotes
        let quotesToUse;
        if (selectedTag && quotesDatabase[selectedTag]) {
            quotesToUse = quotesDatabase[selectedTag];
        } else {
            quotesToUse = getAllQuotes();
        }
        
        const randomQuote = quotesToUse[Math.floor(Math.random() * quotesToUse.length)];
        displayQuote(randomQuote.text, randomQuote.author);
        
    } catch (error) {
        quoteText.textContent = 'Error fetching quote. Please try again later.';
        quoteAuthor.textContent = "";
        console.error('Error fetching quote:', error);
    }
}

function displayQuote(text, author) {
    // Remove animation classes
    quoteText.classList.remove('fade-in');
    quoteAuthor.classList.remove('fade-in');

    // Force reflow
    void quoteText.offsetWidth;
    void quoteAuthor.offsetWidth;

    // Update quote content
    quoteText.textContent = `"${text}"`;
    quoteAuthor.textContent = `— ${author}`;

    // Add animation classes
    quoteText.classList.add('fade-in');
    quoteAuthor.classList.add('fade-in');
    
    // Store current quote for saving
    window.currentQuote = {
        text: text,
        author: author
    };
}

// Copy quote to clipboard
function copyQuote() {
    if (window.currentQuote) {
        const quoteString = `"${window.currentQuote.text}" — ${window.currentQuote.author}`;
        navigator.clipboard.writeText(quoteString).then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy quote:', err);
        });
    }
}

// Save quote to favorites
function saveQuote() {
    if (window.currentQuote) {
        const quoteExists = favorites.some(fav => 
            fav.text === window.currentQuote.text && fav.author === window.currentQuote.author
        );
        
        if (!quoteExists) {
            favorites.push(window.currentQuote);
            localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
            saveBtn.textContent = 'Saved!';
            setTimeout(() => {
                saveBtn.textContent = 'Save';
            }, 2000);
        } else {
            saveBtn.textContent = 'Already saved!';
            setTimeout(() => {
                saveBtn.textContent = 'Save';
            }, 2000);
        }
    }
}

// Toggle favorites display
function toggleFavorites() {
    if (favoritesSection.style.display === 'none') {
        displayFavorites();
        favoritesSection.style.display = 'block';
        viewFavsBtn.textContent = 'Hide Favorites';
    } else {
        favoritesSection.style.display = 'none';
        viewFavsBtn.textContent = '❤️Favorites';
    }
}

// Display favorites list
function displayFavorites() {
    favsList.innerHTML = '';
    favorites.forEach((quote, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div style="margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 5px;">
                <p style="margin: 0; font-style: italic;">"${quote.text}"</p>
                <p style="margin: 5px 0 0 0; font-weight: bold;">— ${quote.author}</p>
                <button onclick="removeFavorite(${index})" style="margin-top: 5px; padding: 5px 10px; background: #ff4444; color: white; border: none; border-radius: 3px; cursor: pointer;">Remove</button>
            </div>
        `;
        favsList.appendChild(li);
    });
}

// Remove favorite quote
function removeFavorite(index) {
    favorites.splice(index, 1);
    localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
    displayFavorites();
}

// Event listeners
window.onload = function() {
    // Show initial message instead of fetching quote
    quoteText.textContent = 'Select a category and click "New Quote" to get inspired!';
    quoteAuthor.textContent = '';
};
newQuoteBtn.addEventListener('click', fetchQuote);
tagSelect.addEventListener('change', function() {
    // Reset last quote index when category changes
    lastQuoteIndex = -1;
    currentCategory = tagSelect.value;
    // Only fetch quote if category is selected
    if (tagSelect.value) {
        fetchQuote();
    } else {
        quoteText.textContent = 'Select a category and click "New Quote" to get inspired!';
        quoteAuthor.textContent = '';
        window.currentQuote = null;
    }
});
copyBtn.addEventListener('click', copyQuote);
saveBtn.addEventListener('click', saveQuote);
viewFavsBtn.addEventListener('click', toggleFavorites);