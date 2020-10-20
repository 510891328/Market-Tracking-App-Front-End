document.addEventListener("DOMContentLoaded", ()=>{
  const getFav = function(){
    fetch('http://localhost:3000/api/v1/favorites')
    .then(resp => resp.json())
    .then(renderFavs)
  }

  const getHighLevel = () => {
    fetch('http://localhost:3000/api/v1/stocks')
    .then(resp => resp.json())
    .then(renderMetaData)
  }

  const renderMetaData = meta => {
    for(const hlKPI of meta.high_level_metrics ) {
      renderHighLevel(hlKPI)
    }
    for(const stock of meta.top_10) {
      renderTop10(stock)
    }
  }

  const renderTop10 = stock => {
    const top10Table = document.querySelector('#top10')
    const companyRow = document.createElement('tr')
    companyRow.dataset.symbol = stock.symbol
    companyRow.innerHTML = `
    <td>${stock.company_name} (${stock.symbol})</td>
    <td>${stock.change_percent_s}</td>
    `

    top10Table.querySelector('tbody').append(companyRow)
  }

  const renderHighLevel = hlKPI => {
    const cardDeck = document.querySelector('#kpi')
    const infoCard = document.createElement('div')
    infoCard.classList.add('card')
    infoCard.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${hlKPI.company_name}</h5>
      <h6 class="card-subtitle text-muted">${hlKPI.symbol}</h6>
      <ul>
        <li>${hlKPI.change_percent_s}</li>
      <ul>
    </div>
    `
    cardDeck.append(infoCard)
  }

  const renderFavs = (favs) => {
    for(const fav of favs){
      renderFav(fav)
      renderInfo(fav)
      renderNews(fav)
    }
  }

  const renderFav = (fav) => {
    const favTable = document.querySelector('#fav-table')
    const companyRow = document.createElement('tr')
    companyRow.dataset.favoriteId = fav.id
    companyRow.innerHTML = `
    <td>${fav.stock.company} (${fav.stock.ticker})</td>
    <td>${fav.quote.change_percent_s}</td>
    `

    favTable.querySelector('tbody').append(companyRow)
  }

  const renderInfo = (fav) => {
    const cardDeck = document.querySelector('#favs')
    const infoCard = document.createElement('div')
    infoCard.classList.add('card')
    infoCard.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${fav.stock.company}</h5>
      <h6 class="card-subtitle text-muted">${fav.stock.ticker}</h6>
      <ul>
        <li>Latest Price: ${fav.quote.latest_price}</li>
        <li>Previous Close: ${fav.quote.previous_close}</li>
        <li>${fav.quote.change_percent_s}</li>
      <ul>
    </div>
    `
    cardDeck.append(infoCard)
  }

  const renderNews = (fav) =>{
    const newsDiv = document.querySelector('#news')
    const card = document.createElement('div')
    card.classList.add('card')
    card.innerHTML = `
      <div class="card-header">
        ${fav.stock.company}
      </div>
      <div class="card-body">
      <h5 class="card-title">${fav.news[0].headline}</h5>
      <p class="card-text">${fav.news[0].summary}</p>
      <a href=${fav.news[0].url} class="btn btn-primary">More Detail</a>
      </div>
    `
    newsDiv.append(card)
  }

  getFav();
  getHighLevel();
})
