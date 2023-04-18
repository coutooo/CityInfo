var xhr = new XMLHttpRequest();
var url = "http://cityinfo-client:5000/send";
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        console.log(response);
    }
};
var data = JSON.stringify({"text": "Hello World!"});
xhr.send(data);
