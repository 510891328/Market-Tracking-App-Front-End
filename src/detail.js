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
    const addFav = document.querySelector('#add-fav')
    addFav.symbol.value = quote.symbol
    addFav.company_name.value = quote.company_name
    addFav.querySelector('button').hidden = false

    const infoCard = document.createElement('div')
    infoCard.classList.add('card')
    infoCard.classList.add('mx-2')
    infoCard.dataset.companyName = quote.company_name

    let color
    if(quote.change_percent_s.charAt(0) === "-") {
      color = 'color-red'
    } else {
      color = 'color-green'
    }

    infoCard.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${quote.company_name}</h5>
      <h6 class="card-subtitle text-muted">${quote.symbol}</h6>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Latest: $${quote.latest_price}</li>
        <li class="list-group-item">Previous: $${quote.previous_close}</li>
        <li class="list-group-item ${color}">${quote.change_percent_s}</li>
      <ul>
    </div>
    `
    cardDeck.append(infoCard)
    const canvas = document.createElement("CANVAS")
    canvas.classList.add('myChart')
    canvas.setAttributes('width', 200)
    canvas.setAttributes('height', 100)
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
      const delForm = document.querySelector('#delete-fav')
      delForm.querySelector('button').hidden = false
      delForm.fav_id.value = favId

      getDetail(favId)
      const addFav = document.querySelector('#add-fav')
      addFav.querySelector('button').hidden = true
    })
    const top10Table = document.querySelector('#top10')
    top10Table.addEventListener('click', e => {
      const selectedSymbol = e.target.parentElement.dataset.symbol
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
    searchForm.addEventListener('submit', e=>{
      getSearch(e.target.symbol.value)
      e.preventDefault();
    })
  }

  const chart = {"chart": [
      {
        "date": "2020-04-21",
        "close": 167.82,
        "volume": 56203749,
        "change": 0,
        "change_percent": 0,
        "change_percent_s": "0.00%",
        "change_over_time": 0
      },
      {
        "date": "2020-04-22",
        "close": 173.52,
        "volume": 34651604,
        "change": 5.7,
        "change_percent": 3.3965,
        "change_percent_s": "+3.40%",
        "change_over_time": 0.033965
      },
      {
        "date": "2020-04-23",
        "close": 171.42,
        "volume": 32790804,
        "change": -2.1,
        "change_percent": -1.2102,
        "change_percent_s": "-1.21%",
        "change_over_time": 0.021452
      },
      {
        "date": "2020-04-24",
        "close": 174.55,
        "volume": 34305320,
        "change": 3.13,
        "change_percent": 1.8259,
        "change_percent_s": "+1.83%",
        "change_over_time": 0.040102
      },
      {
        "date": "2020-04-27",
        "close": 174.05,
        "volume": 33194384,
        "change": -0.5,
        "change_percent": -0.2865,
        "change_percent_s": "-0.29%",
        "change_over_time": 0.037123
      }]}
      const price = chart.chart.map(e=>e.close)
      const date = chart.chart.map(e=>e.date)
      console.log(price, date)
    var ctx = document.getElementById('myChart').getContext('2d');
    var scatterChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: date,
        datasets: [{
          label: 'First Data',
          backgroundColor: '#66ccff',
          borderColor: 'black',
          data: price
        }]
      },
        options: {}
    });

  submitHandler();
  clickHandler()
})

const chart = {"chart": [
    {
      "date": "2020-04-21",
      "close": 167.82,
      "volume": 56203749,
      "change": 0,
      "change_percent": 0,
      "change_percent_s": "0.00%",
      "change_over_time": 0
    },
    {
      "date": "2020-04-22",
      "close": 173.52,
      "volume": 34651604,
      "change": 5.7,
      "change_percent": 3.3965,
      "change_percent_s": "+3.40%",
      "change_over_time": 0.033965
    },
    {
      "date": "2020-04-23",
      "close": 171.42,
      "volume": 32790804,
      "change": -2.1,
      "change_percent": -1.2102,
      "change_percent_s": "-1.21%",
      "change_over_time": 0.021452
    },
    {
      "date": "2020-04-24",
      "close": 174.55,
      "volume": 34305320,
      "change": 3.13,
      "change_percent": 1.8259,
      "change_percent_s": "+1.83%",
      "change_over_time": 0.040102
    },
    {
      "date": "2020-04-27",
      "close": 174.05,
      "volume": 33194384,
      "change": -0.5,
      "change_percent": -0.2865,
      "change_percent_s": "-0.29%",
      "change_over_time": 0.037123
    },

  ]
}
