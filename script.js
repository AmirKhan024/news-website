const API_KEY = "bcff12ebac7140a19fa2459b4b802aa5";
const BASE_URL = "https://newsapi.org/v2/everything";
const DEFAULT_QUERY = "India";

const cardsContainer = document.getElementById('cards-container');
const newsCardTemplate = document.getElementById('template-news-card');
const searchButton = document.getElementById("search-btn");
const searchText = document.getElementById("search-text");

let curSelectedNav = null;
let currentQuery = DEFAULT_QUERY;

window.addEventListener('load', initializeApp);
searchButton.addEventListener("click", handleSearch);

function initializeApp() {
    fetchNews(DEFAULT_QUERY);
}

async function fetchNews(query) {
    currentQuery = query;
    const url = `${BASE_URL}?q=${query}&apiKey=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Fetched data:", data);
        
        if (data.status === "ok") {
            bindData(data.articles);
        } else {
            console.error("Error fetching news:", data.message);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}

function bindData(articles) {
    clearCardsContainer();
    
    articles.forEach(article => {
        if (isValidArticle(article)) {
            const cardClone = createCardClone();
            fillDataInCard(cardClone, article);
            appendCardToContainer(cardClone);
        }
    });
}

function clearCardsContainer() {
    cardsContainer.innerHTML = "";
}

function isValidArticle(article) {
    return article.urlToImage !== null && article.urlToImage !== undefined;
}

function createCardClone() {
    return newsCardTemplate.content.cloneNode(true);
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    setImageSource(newsImg, article.urlToImage);
    setTextContent(newsTitle, article.title);
    setTextContent(newsDesc, article.description);

    const formattedDate = formatPublishDate(article.publishedAt);
    setTextContent(newsSource, `${article.source.name} - ${formattedDate}`);

    addClickEventToCard(cardClone, article.url);
}

function setImageSource(imgElement, src) {
    imgElement.src = src;
}

function setTextContent(element, content) {
    element.textContent = content;
}

function formatPublishDate(dateString) {
    const options = {
        timeZone: "Asia/Jakarta",
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleString("en-US", options);
}

function addClickEventToCard(cardClone, url) {
    cardClone.firstElementChild.addEventListener('click', () => {
        window.open(url, "_blank");
    });
}

function appendCardToContainer(cardClone) {
    cardsContainer.appendChild(cardClone);
}

function onNavItemClick(id) {
    fetchNews(id);
    updateActiveNavItem(id);
}

function updateActiveNavItem(id) {
    const navItem = document.getElementById(id);
    
    if (curSelectedNav) {
        curSelectedNav.classList.remove('active');
    }
    
    curSelectedNav = navItem;
    curSelectedNav.classList.add('active');
}

function handleSearch() {
    const query = searchText.value.trim();
    
    if (isValidSearchQuery(query)) {
        fetchNews(query);
        resetActiveNavItem();
    }
}

function isValidSearchQuery(query) {
    return query !== "";
}

function resetActiveNavItem() {
    if (curSelectedNav) {
        curSelectedNav.classList.remove('active');
        curSelectedNav = null;
    }
}