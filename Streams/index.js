const express = require("express");
const fs = require("fs");
const zlib = require('zlib');

const app = express();
const PORT = 3000;

// Stream read (sample.txt) --> Zipper --> fs write stream
fs.createReadStream('./sample.txt')
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream('./sample.txt.gz'));


app.get("/", (req, res) => {
    // fs.readFile("./sample.txt", (err, data) => {
    //     res.end(data);
    // });

    const stream = fs.createReadStream("./sample.txt", "utf-8");
    stream.on('data', (chunk) => res.write(chunk));
    stream.on('end', () => res.end());
});

app.listen(PORT, () => {
    console.log(`Server start at ${PORT}`)
})

/**
 * chunked
        Data is sent in a series of chunks. The Content-Length header is omitted in this case and at the beginning of each chunk you need 
        to add the length of the current chunk in hexadecimal format, followed by '\r\n' and then the chunk itself, followed by 
        another '\r\n'. The terminating chunk is a regular chunk, with the exception that its length is zero. It is followed by the 
        trailer, which consists of a (possibly empty) sequence of header fields.
 */


