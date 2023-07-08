require('dotenv').config();
const http = require("http");
const fs = require("fs");
var requests = require("requests");


const homeFile = fs.readFileSync("index.html", "utf-8");

const convertToCelsius = (temp) => {
  return (temp - 273.15).toFixed(2);
};


const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", convertToCelsius(orgVal.main.temp));
  temperature = temperature.replace("{%tempmin%}", convertToCelsius(orgVal.main.temp_min));
  temperature = temperature.replace("{%tempmax%}", convertToCelsius(orgVal.main.temp_max));
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      `https://api.openweathermap.org/data/2.5/weather?q=bahawalpur&appid=986c6e110f6d0d1ec4a857e0687ebc26`
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        // console.log(arrData[0].main.temp);
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
        // console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});

server.listen(3000,"127.0.0.1", () => {
  console.log("Listening to port 3000");
});
 