document.addEventListener('DOMContentLoaded', () => {

  const clickHandler = () => {
    const favList = document.querySelector('#fav-table')
    favList.addEventListener('click', e => {
      const favId = e.target.parentElement.dataset.favoriteId
      getDetail(favId)
    })
    const top10Table = document.querySelector('#top10')
    top10Table.addEventListener('click', e => {

    })
  }

  const getDetail = favId => {
    fetch(`http://localhost:3000/api/v1/favorites/${favId}`)
    .then(resp => resp.json())
    .then(renderInfo)
  }


  const renderInfo = (fav) => {
    renderCard(fav)
    // renderChart(fav)
    renderStories(fav)
  }

  const renderStories = fav => {
    const newsDiv = document.querySelector('#news')
    newsDiv.innerHTML = ''
    for(const news of fav.news) {
      renderStory(news)
    }
  }

  const renderCard = fav => {
    const cardDeck = document.querySelector('#favs')
    cardDeck.innerHTML = ''
    cardDeck.class = 'col-3'

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

  const renderStory = news =>{
    const newsDiv = document.querySelector('#news')
    const card = document.createElement('div')
    card.classList.add('card')
    card.innerHTML = `
      <div class="card-header">
        ${news.related[0]}
      </div>
      <div class="card-body">
      <h5 class="card-title">${news.headline}</h5>
      <p class="card-text">${news.summary}</p>
      <a href=${news.url} class="btn btn-primary">More Detail</a>
      </div>
    `
    newsDiv.append(card)
  }


  clickHandler()
})
