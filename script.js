const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote');

async function fetchQuote() {
    try {
        const response = await fetch('https://zenquotes.io/api/random');
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        quoteText.classList.remove('fade-in');
        quoteAuthor.classList.remove('fade-in');

        void quoteText.offsetWidth;
        void quoteAuthor.offsetWidth;

        quoteText.textContent = `"${data.content}"`;
        quoteAuthor.textContent = `—${data.author}`;

        quoteText.classList.add('fade-in');
        quoteAuthor.classList.add('fade-in');
    } catch (error) {
        quoteText.textContent = 'Error fetching quote. Please try again later.';
        quoteAuthor.textContent = "";
        console.error('Error fetching quote.', error);
    }
}
window.onload = fetchQuote;
newQuoteBtn.addEventListener('click', fetchQuote);