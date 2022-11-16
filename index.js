const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace(
    "{%tempval%}",
    (orgVal.main.temp - 273).toFixed(2)
  );
  temperature = temperature.replace(
    "{%tempvalMin%}",
    (orgVal.main.temp_min - 273).toFixed(2)
  );
  temperature = temperature.replace(
    "{%tempvalMax%}",
    (orgVal.main.temp_max - 273).toFixed(2)
  );
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempStatus%}", orgVal.weather[0].main);
  //   console.log(temperature);
  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Butwal&appid=c27e4b41191a047acfe5e7e3fe1eebc7"
    )
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        // console.log(arrData);

        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
        // console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to error: " + err);
        res.end();
      });
  }
});

const port = 8000;
const host = "127.0.0.1";

server.listen(port, host, () => {
  console.log("listening to port:" + port);
});
