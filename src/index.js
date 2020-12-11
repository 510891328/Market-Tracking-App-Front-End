document.addEventListener("DOMContentLoaded", ()=>{

  const getFav = function(){
    fetch('https://market-tracking-app.herokuapp.com/api/v1/favorites')
    .then(resp => resp.json())
    .then(renderFavs)
  }

  const getHighLevel = () => {
    fetch('https://market-tracking-app.herokuapp.com/api/v1/stocks')
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
    companyRow.dataset.symbol = stock.quote.symbol
    companyRow.innerHTML = `
    <td>${stock.quote.company_name} (${stock.quote.symbol})</td>
    <td class="percent">${stock.quote.change_percent_s}</td>
    `

    top10Table.querySelector('tbody').append(companyRow)
    renderTicker(stock)
    colorize();
  }

  const renderTicker = stock => {
    const ticker = document.querySelector('#ticker')
    ticker.innerHTML += `<span class="mx-3"><img src=${stock.logo.url} alt="logo" class="ticker" height="25" width="25">  ${stock.quote.symbol} ${stock.quote.change_percent_s}</span>`
  }

  const renderHighLevel = hlKPI => {
    const cardDeck = document.querySelector('#kpi')
    const infoCard = document.createElement('div')

    const percentChg = ((hlKPI.latest_price - hlKPI.previous_close) / hlKPI.previous_close) * 100
    const formattedPct = percentChg > 0 ? `+${percentChg.toFixed(2)}` : percentChg.toFixed(2)

    infoCard.classList.add('card')
    infoCard.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${hlKPI.company_name}</h5>
      <h6 class="card-subtitle text-muted">${hlKPI.symbol}</h6>
      <ul class="list-group list-group-flush mt-3">
        <li class="list-group-item">Latest: $${hlKPI.latest_price}</li>
        <li class="list-group-item">Previous: $${hlKPI.previous_close}</li>
        <li class="list-group-item percent">${formattedPct}%</li>
      <ul>
    </div>
    `
    cardDeck.append(infoCard)
    colorize();
  }

  const renderFavs = (favs) => {
    const favTable = document.querySelector('#fav-table')
    favTable.querySelector('tbody').innerHTML = ""
    const favCard = document.querySelector('#favs')
    favCard.innerHTML = ""
    const newsDiv = document.querySelector('#news')
    newsDiv.innerHTML = ""
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
    <td class="percent">${fav.quote.change_percent_s}</td>
    `

    favTable.querySelector('tbody').append(companyRow)

    colorize();
  }


  const renderInfo = (fav) => {
    const cardDeck = document.querySelector('#favs')
    const infoCard = document.createElement('div')

    infoCard.classList.add('card')
    infoCard.classList.add('mx-2')
    infoCard.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${fav.stock.company}</h5>
      <h6 class="card-subtitle text-muted">${fav.stock.ticker}</h6>
      <ul class="list-group list-group-flush mt-3">
        <li class="list-group-item">Latest: $${fav.quote.latest_price}</li>
        <li class="list-group-item">Previous: $${fav.quote.previous_close}</li>
        <li class="list-group-item percent">${fav.quote.change_percent_s}</li>
      <ul>
    </div>
    `
    cardDeck.append(infoCard)
    colorize();
  }

  const renderNews = (fav) =>{
    const newsDiv = document.querySelector('#news')
    const card = document.createElement('div')
    card.classList.add('card')
    card.innerHTML = `
      <div class="card-header">
        ${fav.stock.company} (${fav.stock.ticker})
      </div>
      <div class="card-body">
      <h5 class="card-title">${fav.news[0].headline}</h5>
      <p class="card-text">${fav.news[0].summary.slice(0,300)}...</p>
      <a href=${fav.news[0].url} class="btn btn-primary" target="_blank" >More Detail</a>
      </div>
    `
    newsDiv.append(card)
  }

  const colorize = () => {
    const percents = document.querySelectorAll('.percent')
    for(const percent of percents){
      if(percent.innerText.charAt(0) === "-"){
        percent.classList.add('color-red')
      } else {
        percent.classList.add('color-green')
      }
    }
  }

  const clickHandler = () =>{
    const addFav = document.querySelector('#add-fav')
    addFav.addEventListener('click', e => {
      const options = {
        method: 'POST',
        headers: {
          'content-type':'application/json',
          'accept':'application/json'
        },
        body: JSON.stringify({user_id: addFav.user.value, symbol:addFav.symbol.value, company_name: addFav.company_name.value})
      }

      fetch('https://market-tracking-app.herokuapp.com/api/v1/favorites', options)
      .then(resp => resp.json())
      .then(getFav)
      addFav.querySelector('button').hidden = true
      e.preventDefault();
    })

    const delFav = document.querySelector('#delete-fav')
    delFav.addEventListener('click', e => {

      const favId = e.target.parentElement.fav_id.value

      fetch('https://market-tracking-app.herokuapp.com/api/v1/favorites/' + favId, {method: "DELETE"})
        .then(resp => resp.json())
        .then(getFav)
      delFav.querySelector('button').hidden = true
      e.preventDefault()
    })

  }

  clickHandler();
  getFav();
  getHighLevel();
})
