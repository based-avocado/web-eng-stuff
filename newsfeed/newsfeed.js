/**
 * Handles loading a feed. Fetches the desired feed url from <select id="info-select">.
 */
function loadFeed() {
  feedSelection = document.getElementById("info-select").value;
  console.log("Attempting to load feed: " + feedSelection);
  loadWithAjax(`https://api.rss2json.com/v1/api.json?rss_url=${feedSelection}`, displayFeed);
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

/**
 * Callback used for displaying RSS feeds. Dynamically creates list items and
 * populates them with information from the RSS feed.
 *
 * @param {JSON} xhttp - Selected RSS feed, jsonified
 */
function displayFeed(xhttp) {
  var feed = document.getElementById('feed');

  // Clean up any existing children
  while (feed.hasChildNodes()) {
    feed.removeChild(feed.firstChild);
  }

  var data = JSON.parse(xhttp.responseText);
  var itemsContainer = document.createElement('DIV');
  if (data.status == 'ok') {
    data.items.forEach(item => {
      var itemContainer = document.createElement('DIV');
      itemContainer.setAttribute("style", "border-style: solid; margin: 15px;");
      var itemTitleElement = document.createElement('H5');
      var itemLinkElement = document.createElement('A');
      var itemDescriptionElement = document.createElement('P');

      itemLinkElement.setAttribute('href', item.link);
      itemLinkElement.innerText = item.title;
      itemTitleElement.appendChild(itemLinkElement);

      // note: make sure the feed is XSS safe before using innerHTML
      itemDescriptionElement.innerHTML = item.description;

      itemContainer.appendChild(itemTitleElement);
      itemContainer.appendChild(itemDescriptionElement);
      itemsContainer.appendChild(itemContainer);
    });

    var titleElement = document.createElement('H3');
    titleElement.innerText = data.feed.title;
    feed.appendChild(titleElement);
    feed.appendChild(itemsContainer);
  }
}

// Start up RSS feed using rss2json to handle conversions
loadWithAjax("https://api.rss2json.com/v1/api.json?rss_url=http://www.espn.com/espn/rss/mlb/news", displayFeed);
