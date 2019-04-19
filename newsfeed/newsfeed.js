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
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callback(this, url);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

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
  username = document.getElementById("usr").value;
  password = document.getElementById("pwd").value;
  console.log(`[DEBUG] Attempting to login with username ${username} and password ${password}`);

  let data = JSON.parse(xhttp.responseText);
  console.log("[DEBUG] database is: ", data);

  let loggedIn = false;
  data.users.forEach(user => {
    if (user.username == username && user.password == password) {
      alert("Login successful");
      document.getElementById("login-status").innerText = `Logged in as ${username}`
      document.cookie = `username=${username}`;
      loggedIn = true;
    }
  });

  if (!loggedIn){
    alert("Login unsuccessful - check your credentials");
  }
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
      itemContainer.setAttribute("style", `border-style: solid;
        margin: 15px;
        background: white;
        padding: 10px;
        border-radius: 10px;`);
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
