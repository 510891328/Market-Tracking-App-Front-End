document.addEventListener('DOMContentLoaded', () => {

  const getDetail = favId => {
    fetch(`http://localhost:3000/api/v1/favorites/${favId}`)
    .then(resp => resp.json())
    .then(renderInfo)
  }


  const renderInfo = (companyData) => {
    renderCard(companyData.quote)
    // renderChart(fav)
    renderStories(companyData.news)
  }

  const renderStories = allNews => {
    const newsDiv = document.querySelector('#news')
    newsDiv.innerHTML = ''
    for(const news of allNews) {
      renderStory(news)
    }
  }

  const renderCard = quote => {
    const cardDeck = document.querySelector('#favs')
    cardDeck.innerHTML = ''
    cardDeck.class = 'col-3'

    const infoCard = document.createElement('div')
    infoCard.classList.add('card')

    infoCard.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${quote.company_name}</h5>
      <h6 class="card-subtitle text-muted">${quote.symbol}</h6>
      <ul>
        <li>Latest Price: ${quote.latest_price}</li>
        <li>Previous Close: ${quote.previous_close}</li>
        <li>${quote.change_percent_s}</li>
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

  const getSearch = symbol => {
    fetch(`http://localhost:3000/api/v1/stocks/${symbol}`)
      .then(resp => resp.json())
      .then(renderInfo)
  }

  const clickHandler = () => {
    const favList = document.querySelector('#fav-table')
    favList.addEventListener('click', e => {
      const favId = e.target.parentElement.dataset.favoriteId
      getDetail(favId)
      const addFav = document.querySelector('#add-fav')
      addFav.hidden = true
    })
    const top10Table = document.querySelector('#top10')
    top10Table.addEventListener('click', e => {
      getSearch(e.target.parentElement.dataset.symbol)
      const addFav = document.querySelector('#add-fav')
      addFav.hidden = false
    })
  }

  const submitHandler = () =>{
    const searchForm = document.querySelector('#search-form')
    searchForm.addEventListener('submit', e=>{
      getSearch(e.target.symbol.value)
      const addFav = document.querySelector('#add-fav')
      addFav.hidden = false
      e.preventDefault();
    })
  }

  submitHandler();
  clickHandler()
})
