(function() {
    var margin = { top: 50, left: 50, right: 50, bottom: 50 },
    height = 400 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

    var svg = d3.select("#map")
    .append("svg")
    // .attr("height", height + margin.top + margin.bottom)
    // .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .attr("id", "map")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.queue()
    .defer(d3.json, "world.topojson")
    .await(ready)
    // d3.json("world.topojson", function(data) {
    //     console.log(data);
        console.log("hi")
    // });

    // Mercator projection
    var projection = d3.geoMercator()
    .translate([ width/2, height/2 ]) //center it
    .scale(90) //zoom in out

    // create path using projection
    var path = d3.geoPath()
    .projection(projection) //make shape from dots

    function ready (error, data) {
        // console.log(data)
        var countries = topojson.feature(data, data.objects.countries).features

        // console.log(countries)

        svg.selectAll(".country")
        .data(countries)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path)
        .on('click', function(d) {
            d3.select(this).classed("selected", true)
            var child = this
            var parent = child.parentNode;
            var index = Array.prototype.indexOf.call(parent.children, child);
            // console.log(countries[index].properties.name)
            changeBook(countries[index].properties.name)
        })
        .on('mouseout', function(d) {
            d3.select(this).classed("selected", false)
        })
    }
}) ();


function changeBook(cname) {
    let card = document.getElementById("book")
    card.innerHTML = cname

    d3.csv("/books.csv", function (data) {
        for (var i = 0; i < data.length; i++) {
        //   document.getElementById("book").innerHTML = data[i].Country;
        //   console.log(data[i].Country);
        //   console.log(data[i].Book);
        if (data[i].Country == cname) {
            // card.innerHTML += data[i].Book1
            let books = data[i]
            // APICall(books.Title1, books.Author1)
            if (books.Title3 != "None") {
                APICall(books.Title3, books.Author3)
            }
            if (books.Title2 != "None") {
                APICall(books.Title2, books.Author2)
            }
            if (books.Title1 != "None") {
                APICall(books.Title1, books.Author1)
            }

        }
        }
      });
}

// AIzaSyCwOZ_Mai04gnxvoiEJTj0A6cQ9zft1LOs
// GET https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&key=yourAPIKey

function APICall(title, author) {
    // const userAction = async () => {
    //     const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&key=AIzaSyCwOZ_Mai04gnxvoiEJTj0A6cQ9zft1LOs');
    //     const myJson = await response.json(); //extract JSON from the http response
    //     // do something with myJson
    //     console.log(myJson)
    //   }
    const request = new XMLHttpRequest();
    console.log(`https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&key=AIzaSyCwOZ_Mai04gnxvoiEJTj0A6cQ9zft1LOs`)
    request.open("GET", `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&key=AIzaSyCwOZ_Mai04gnxvoiEJTj0A6cQ9zft1LOs`)
    request.send();
    request.onload = () => {
        if(request.status === 200) {
            console.log(request.response)
            // console.log(request.response.items)
            const obj = JSON.parse(request.response)
            // console.log(obj.items[0].volumeInfo.imageLinks)
            if (obj.totalItems != 0) {
                let card = document.getElementById("book")
            card.innerHTML += `
            <div class="card mb-3" style="max-width: 540px;">
              <div class="row g-0">
                <div class="col-md-4">
                  <img src="${obj.items[0].volumeInfo.imageLinks.thumbnail}" alt="...">
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${author}</p>
                  </div>
                </div>
              </div>
            </div>
            `
            } else {
                console.log("BOOK NOT FOUND")
            }
            
        } else {
            console.log("failed")
        }
    }
}


var card = `
<div class="card mb-3" style="max-width: 540px;">
  <div class="row g-0">
    <div class="col-md-4">
      <img src="..." alt="...">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
        <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
      </div>
    </div>
  </div>
</div>
`