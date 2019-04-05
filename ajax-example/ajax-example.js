function loadInfo() {
  loadWithAjax('good-info.json', displayInfo);
  loadWithAjax('bad-info.json', displayInfo);
}

function loadWithAjax(url, callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(this, url);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function displayInfo(xhttp, url) {
  const infoSelection = document.getElementById("info-select").value;
  try {
    const response = JSON.parse(xhttp.responseText);
    document.getElementById("info").innerHTML = response[infoSelection];
  } catch {
    console.error(`Failed to parse resource ${url} from server, expected valid json`);
  }
}

// Feed stuff
function displayFeed(xhttp) {
  var feed = document.getElementById('feed');
  var data = JSON.parse(xhttp.responseText);
  var itemsContainer = document.createElement('DIV');
  if (data.status == 'ok') {
    data.items.forEach(item => {
      var itemContainer = document.createElement('DIV');
      itemContainer.setAttribute("style", "border-style: solid; margin: 15px;");
      var itemTitleElement = document.createElement('H2');
      var itemLinkElement = document.createElement('A');
      var itemDescriptionElement = document.createElement('P');

      itemLinkElement.setAttribute('href', item.link);
      itemLinkElement.innerText = item.title;
      itemTitleElement.appendChild(itemLinkElement);

      // note : make sure the feed is XSS safe before using innerHTML
      itemDescriptionElement.innerHTML = item.description;

      itemContainer.appendChild(itemTitleElement);
      itemContainer.appendChild(itemDescriptionElement);
      itemsContainer.appendChild(itemContainer);
    });

    var titleElement = document.createElement('H1');
    titleElement.innerText = data.feed.title;
    feed.appendChild(titleElement);
    feed.appendChild(itemsContainer);
  }
}

// Start up RSS feed using rss2json to handle conversions
loadWithAjax("https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.ycombinator.com%2Frss", displayFeed);

