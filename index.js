const http = require("http");
const fs = require("fs");
var requests = require("requests")
const PORT = process.env.PORT || 8000;

const homeFile = fs.readFileSync("index.html", "utf-8");


const replaceval = (tempval, orgval) => {
    let temperature = tempval.replace("{%tempval%}", orgval.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgval.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgval.main.temp_max);
    temperature = temperature.replace("{%location%}", orgval.name);
    temperature = temperature.replace("{%country%}", orgval.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgval.weather[0].main);
    return temperature;
};




const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("http://api.openweathermap.org/data/2.5/weather?q=Ambikapur&appid=9814c3491923157b3d027035297b2157")
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrdata = [objdata];
                //console.log(arrdata[0].main.temp);
                const realTimeData = arrdata.map((val) => replaceval(homeFile, val))
                    .join("");

                res.write(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);

                res.end();
            });
    }
});

server.listen(PORT, () => {
    console.log(`listining to the port no at ${port}`);
});