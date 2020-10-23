document.addEventListener('DOMContentLoaded', () => {
  let allSymbols;

  const getDetail = favId => {
    fetch(`http://localhost:3000/api/v1/favorites/${favId}`)
    .then(resp => resp.json())
    .then(renderInfo)
  }


  const renderInfo = (companyData) => {
    renderCard(companyData.quote)
    renderChart(companyData.chart)
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
    const addFav = document.querySelector('#add-fav')
    console.log(addFav)
    addFav.symbol.value = quote.symbol
    addFav.company_name.value = quote.company_name

    const infoCard = document.createElement('div')
    infoCard.classList.add('card')
    infoCard.classList.add('mx-2')
    infoCard.classList.add('col-3')
    infoCard.dataset.companyName = quote.company_name

    let color
    if(quote.change_percent_s.charAt(0) === "-") {
      color = 'color-red'
    } else {
      color = 'color-green'
    }

    let ytdColor
    if(quote.ytd_change < 0) {
      ytdColor = 'color-red'
    } else {
      ytdColor = 'color-green'
    }


    const ytdChange = quote.ytd_change < 0 ? quote.ytd_change.toFixed(2) + '%' : '+' + quote.ytd_change.toFixed(2) + '%'

    infoCard.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${quote.company_name}</h5>
      <h6 class="card-subtitle text-muted mt-3">Primary Exchange: ${quote.primary_exchange}</h6>
      <h6 class="card-subtitle text-muted mt-3">Ticker: ${quote.symbol}</h6>
      <ul class="list-group list-group-flush mt-3">
        <li class="list-group-item">Latest: $${quote.latest_price}</li>
        <li class="list-group-item">Previous: $${quote.previous_close}</li>
        <li class="list-group-item"> Change: <span class="${color}">${quote.change_percent_s}</span></li>
        <li class="list-group-item">52-Wk High: $${parseFloat(quote.week_52_high).toFixed(2)}</li>
        <li class="list-group-item">52-Wk Low: $${parseFloat(quote.week_52_low).toFixed(2)}</li>
        <li class="list-group-item">YTD Change: <span class="${ytdColor}">${ytdChange}</span></li>
        <li class="list-group-item">P/E Ratio: ${quote.pe_ratio}</li>
        <li class="list-group-item">Market Cap: $${(parseInt(quote.market_cap)/1000000).toLocaleString()}M</li>
      <ul>
    </div>
    <div class="card-footer text-muted">
      Updated At: ${quote.latest_time}
    </div>
    `
    cardDeck.append(infoCard)

  }

  const renderChart = chart => {

    const canvas = document.createElement("CANVAS")
    let data = {}
    const date = chart.map(e=>e.date)
    const price = chart.map(e=>e.close)
    data.date = date
    data.price = price
    const ctx = canvas.getContext('2d');

    const lineChart = new Chart(ctx, {
      type: 'line',
      data: {
      labels: data.date,
      datasets: [{
        label: data.date,
        backgroundColor: '#66ccff',
        borderColor: 'black',
        data: data.price
      }]
    },
      options: {
        responsive: true,
        title: {
          display: false
        },
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data){
              return 'Close Price: $' + tooltipItem.value
            }
          }
        },
        scales: {
          xAxes: [{
            type: 'time',
            gridLines: {
              display:true
            },
            time: {
              minUnit: 'month'
            }
          }]
        }
      }
  });

  canvas.classList.add('myChart')
  canvas.classList.add('col-8')
  const cardDeck = document.querySelector('#favs')
  cardDeck.append(canvas)
  }

  const renderStory = news =>{
    const newsDiv = document.querySelector('#news')
    const card = document.createElement('div')
    const companyName = document.querySelector(`[data-company-name]`).dataset.companyName

    card.classList.add('card')
    card.innerHTML = `
      <div class="card-header">
        ${companyName} (${news.related[0]})
      </div>
      <div class="card-body">
      <h5 class="card-title">${news.headline}</h5>
      <p class="card-text">${news.summary.slice(0,300)}...</p>
      <a href=${news.url} class="btn btn-primary" target="_blank">More Detail</a>
      </div>
    `
    newsDiv.append(card)

  }

  const getSearch = symbol => {
    fetch(`http://localhost:3000/api/v1/stocks/${symbol}`)
      .then(resp => resp.json())
      .then(renderInfo)
  }

  const getSymbols = () => {
    fetch('http://localhost:3000/api/v1/companies')
    .then(resp => resp.json())
    .then(renderOptions)
  }

  const renderOptions = (companies) => {
    const datalist = document.querySelector('#symbols')
    for (const company of companies){
      const option = document.createElement('option')
      option.value = `${company.symbol}`
      option.innerText = `${company.name}`
      datalist.append(option)
    }
    const searchForm = document.querySelector('#search-form')
    searchForm.hidden = false
  }

  const clickHandler = () => {
    const favList = document.querySelector('#fav-table')
    favList.addEventListener('click', e => {
      const favId = e.target.parentElement.dataset.favoriteId
      const delForm = document.querySelector('#delete-fav')
      delForm.querySelector('button').hidden = false
      delForm.fav_id.value = favId
      const addFav = document.querySelector('#add-fav')
      addFav.querySelector('button').hidden = true

      getDetail(favId)
    })

    const top10Table = document.querySelector('#top10')
    top10Table.addEventListener('click', e => {
      const selectedSymbol = e.target.parentElement.dataset.symbol
      const addFav = document.querySelector('#add-fav')
      addFav.querySelector('button').hidden = false
      const delForm = document.querySelector('#delete-fav')
      delForm.querySelector('button').hidden = true
      getSearch(selectedSymbol)
    })

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
      fetch('http://localhost:3000/api/v1/favorites', options)
      .then(resp => resp.json())
      .then(renderFavs)

      e.preventDefault();
    })

    const delFav = document.querySelector('#delete-fav')
    delFav.addEventListener('click', e => {

      const favId = e.target.parentElement.fav_id.value

      fetch('http://localhost:3000/api/v1/favorites/' + favId, {method: "DELETE"})
        .then(resp => resp.json())
        .then(renderFavs)

      e.preventDefault()
    })
  }

  const submitHandler = () =>{
    const searchForm = document.querySelector('#search-form')
    searchForm.addEventListener('submit', e => {
      getSearch(e.target.symbol.value)
      const addFav = document.querySelector('#add-fav')
      addFav.querySelector('button').hidden = false
      const delForm = document.querySelector('#delete-fav')
      delForm.querySelector('button').hidden = true
      e.preventDefault();
    })
  }


  setTimeout(getSymbols(),1000)
  submitHandler();
  clickHandler();
})
