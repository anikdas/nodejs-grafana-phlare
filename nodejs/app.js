const express = require("express");
const pprof = require("@datadog/pprof");
const fs = require("fs");
const app = express();
const port = 8080;

// The average number of bytes between samples.
const intervalBytes = 512 * 1024;

// The maximum stack depth for samples collected.
const stackDepth = 64;

pprof.heap.start(intervalBytes, stackDepth); 


app.get("/debug/pprof/profile", async (req, res) => {
  const seconds = req.query.seconds;
  console.log("asking for profile", seconds);
  try {
    const profile = await pprof.time.profile({
      durationMillis: seconds * 1000, // time in milliseconds for which to
      // collect profile.
    }); 
    const buf = await pprof.encode(profile);
    res.set('Content-Type', 'application/octet-stream');
    res.send(buf);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get("/debug/pprof/allocs", async (req, res) => {
  const seconds = req.query.seconds;
  console.log("asking for mem profile", seconds);
  try {
    const profile = await pprof.heap.profile(); 
    const buf = await pprof.encode(profile);
    res.set('Content-Type', 'application/octet-stream');
    res.send(buf);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/update_wait", (req, res) => {
  wait_time = parseInt(req.query.w, 10);
});

app.get("/prime", (req, res) => {
  res.send(isPrime(req.query.number))
});

app.get("/start", async (req, res) => {
  const profile = await pprof.time.profile({
    durationMillis: 10000, // time in milliseconds for which to
    // collect profile.
  });
  const buf = await pprof.encode(profile);
  fs.writeFile("wall.pb.gz", buf, (err) => {
    if (err) throw err;
  });
  res.send("Completed");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// JavaScript program to display Prime numbers till N

// function to check if a given number is prime
function isPrime(n) {
  // since 0 and 1 is not prime return false.
  if (n == 1 || n == 0) return false;

  // Run a loop from 2 to n-1
  for (var i = 2; i < n; i++) {
    // if the number is divisible by i, then n is not a prime number.
    if (n % i == 0) return false;
  }
  // otherwise, n is prime number.
  return true;
}

let wait_time = 0.01;
function wait (s) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, s*1000)
  })
}


(async () => {
  while (true) {
    // Driver code
    isPrime(4596143);
    await wait(wait_time);
  }
})();
