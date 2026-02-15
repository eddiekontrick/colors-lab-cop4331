const urlBase = 'http://mycolorapp.xyz/LAMPAPI'; // make sure this matches your domain
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// ---------------- Login ----------------
function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    // Hash the password using MD5 before sending
    let hash = md5(password);

    document.getElementById("loginResult").innerHTML = "";

    let tmp = { login: login, password: hash };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();
                window.location.href = "color.html";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

// ---------------- Cookies ----------------
function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");

    for (let i = 0; i < splits.length; i++) {
        let tokens = splits[i].trim().split("=");
        if (tokens[0] === "firstName") firstName = tokens[1];
        else if (tokens[0] === "lastName") lastName = tokens[1];
        else if (tokens[0] === "userId") userId = parseInt(tokens[1].trim());
    }

    if (userId < 0) window.location.href = "index.html";
}

// ---------------- Logout ----------------
function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

// ---------------- Add Color ----------------
function addColor() {
    let newColor = document.getElementById("colorText").value;
    document.getElementById("colorAddResult").innerHTML = "";

    // Fixed JSON payload
    let tmp = { color: newColor, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddColor.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                document.getElementById("colorAddResult").innerHTML = "Color has been added";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("colorAddResult").innerHTML = err.message;
    }
}

// ---------------- Search Colors ----------------
function searchColor() {
    let srch = document.getElementById("searchText").value;
    document.getElementById("colorSearchResult").innerHTML = ""; // clear previous result
    document.getElementById("colorList").innerHTML = ""; // clear the <p> list

    let tmp = { search: srch, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchColors.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error && jsonObject.error !== "") {
                    document.getElementById("colorSearchResult").innerHTML = jsonObject.error;
                    return;
                }

                let colorList = "";
                for (let i = 0; i < jsonObject.results.length; i++) {
                    colorList += jsonObject.results[i];
                    if (i < jsonObject.results.length - 1) colorList += "<br />\r\n";
                }

                // Show the actual list in the <p id="colorList">
                document.getElementById("colorList").innerHTML = colorList;

                // Optional: show a short message in the span
                document.getElementById("colorSearchResult").innerHTML = "Color(s) retrieved successfully";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("colorSearchResult").innerHTML = err.message;
    }
}
