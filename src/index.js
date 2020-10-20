document.addEventListener("DOMContentLoaded", ()=>{
  const getFav = function(){
    fetch('http://localhost:3000/api/v1/favorites')
    .then(resp => resp.json())
    .then(renderFavs)
  }

  const renderFavs = (favs) => {
    for(const fav of favs){
      renderFav(fav)
      renderInfo(fav)
      renderNews(fav)
    }
  }

  const renderFav = (fav) => {
    const favList = document.querySelector('#fav-list')
    const li = document.createElement('li')
    li.innerText = fav.stock.ticker
    favList.append(li)
  }

  const renderInfo = (fav) => {
    const cardDeck = document.querySelector('.card-deck')
    const infoCard = document.createElement('div')
    infoCard.classList.add('card')
    infoCard.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${fav.stock.company}</h5>
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
})
