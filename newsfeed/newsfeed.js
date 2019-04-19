/**
 * Handles loading an aggregate feed. Filters out desired feeds.
 */
function loadFeed() {
  const rss2json = "https://api.rss2json.com/v1/api.json?rss_url="

  var mlb = $.ajax({url: rss2json + "http://www.espn.com/espn/rss/mlb/news"});
  var nfl = $.ajax({url: rss2json + "http://www.espn.com/espn/rss/nfl/news"});
  var nhl = $.ajax({url: rss2json + "http://www.espn.com/espn/rss/nhl/news"});

  $.when(mlb, nfl, nhl).done(function(mlbResult, nflResult, nhlResult) {
    let aggregateFeed = []
    // Each returned resolve has the following structure:
    // [data, textStatus, jqXHR]
    // e.g. To access returned data, access the array at index 0

    if(document.getElementById("mlb").checked) {
      mlbResult[0].items.forEach(item => {
        aggregateFeed.push(item);
      });
    }

    if(document.getElementById("nfl").checked) {
      nflResult[0].items.forEach(item => {
        aggregateFeed.push(item);
      });
    }

    if(document.getElementById("nhl").checked) {
      nhlResult[0].items.forEach(item => {
        aggregateFeed.push(item);
      });
    }

    displayFeed(aggregateFeed);
  });
}

function loadWithAjax(url, callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callback(this, url);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

/**
 * WARNING: highly insecure, don't use this for anything real for the love of god
 *
 * Used for handling user signup - sends username and password to be added to "database" via
 * plain-text.
 */
function signup() {
  let username = document.getElementById("usr").value;
  let password = document.getElementById("pwd").value;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // could have a callback here if needed I guess
    }
  };
  xmlhttp.open("GET", "server.php?username=" + username + "&password=" + password, true);
  xmlhttp.send();
}

/**
 * Callback used for handling logins.
 *
 * @param {JSON} xhttp - The user database
 */
function login(xhttp) {
  let username = document.getElementById("usr").value;
  let password = document.getElementById("pwd").value;
  let data = JSON.parse(xhttp.responseText);
  let loggedIn = false;

  data.users.forEach(user => {
    if (user.username == username && user.password == password) {
      // Update displayed login status
      let login_status_str;
      if (localStorage.getItem(username) === null) {
        login_status_str = `Logged in as ${username}`;
      } else {
        login_status_str = `Logged in as ${username}; last login at ${localStorage.getItem(username)}`;
      }
      document.getElementById("login-status").innerText = login_status_str;

      // Set the active user for a session. Should be used for favorites.
      sessionStorage.setItem("activeUser", username);

      // Keep track of last login for each user
      let timestamp = new Date().toLocaleString();
      localStorage.setItem(username, timestamp);
      loggedIn = true;
    }
  });

  if (!loggedIn){
    alert("Login unsuccessful - check your credentials");
  }
}

/**
 * Callback used for fetching an RSS feed. Dynamically creates list items and
 * populates them with information from the RSS feed.
 *
 * @param {JSON} xhttp - Selected RSS feed, jsonified
 */
function displayFeed(aggFeed) {
  var displayAggFeed = document.getElementById('feed');

  // Clean up any existing children
  while (displayAggFeed.hasChildNodes()) {
    displayAggFeed.removeChild(feed.firstChild);
  }

  // Sort through items by date, preemptively
  aggFeed.sort(function(a, b) {
    var dateA = new Date(a.pubDate), dateB = new Date(b.pubDate);
    return dateB - dateA;
  });

  // The actual items that are going on the displayed feed
  var feedItems = document.createElement('DIV');

  for (const item of aggFeed) {
    var itemContainer = document.createElement('DIV');
    itemContainer.setAttribute("style", `border-style: solid;
      margin: 15px;
      background: white;
      padding: 10px;
      border-radius: 10px;`);
    var itemTitleElement = document.createElement('H5');
    var itemLinkElement = document.createElement('A');
    var itemDescriptionElement = document.createElement('P');
    var itemDateElement = document.createElement('I');

    itemLinkElement.setAttribute('href', item.link);
    itemLinkElement.innerText = item.title;
    itemTitleElement.appendChild(itemLinkElement);

    itemDescriptionElement.innerText = item.description;

    itemDateElement.innerText = `Published: ${item.pubDate}`;

    itemContainer.appendChild(itemTitleElement);
    itemContainer.appendChild(itemDescriptionElement);
    itemContainer.appendChild(itemDateElement);
    feedItems.appendChild(itemContainer);
  }

  displayAggFeed.appendChild(feedItems);
}
