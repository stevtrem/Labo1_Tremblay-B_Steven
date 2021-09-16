const url = require('url');
const queryString = require('query-string');
const { parse } = require('path');
const { memoryUsage } = require('process');

exports.getMaths = function(req, res) {
  const reqUrl = url.parse(req.url, true)
  const parsed = queryString.parse(reqUrl.search)
  let response = []
  let isValid = true

  switch(parsed.op){
    case " ": case "-": case "*": case "/": case "%":
      isValid = ValidateParams(parsed, "xyop")
      if (Object.keys(parsed).length == 3 && isValid){
        let x = parsed.x
        let y = parsed.y
        let op = parsed.op == " " ? "+": parsed.op
        let nanArray = []
        
        if (isNaN(x)){
          nanArray.push(x)
        }
        if (isNaN(y)){
          nanArray.push(y)
        }
        if (nanArray.length != 0){ // S'il y a 'au moins' un paramètre non numérique
          response = [
            {
              "op": op,
              "x": x,
              "y": y,
              "error": "'" + nanArray.join(" ") + "'" + " parameter is not a number"
            }
          ];
          res.statusCode = 422;
        }else{
          let value = eval(x + " " + op + " " + y)
          response = [
            {
              "op": op,
              "x": x,
              "y": y,
              "value": value
            }
          ];
          res.statusCode = 200;
        }
      }else{
        res.statusCode = 422;
        res.end("invalid parameters")
        return
      }
    break;
    case "!": case "p": case "np":
      isValid = ValidateParams(parsed, "nop")
      if (Object.keys(parsed).length == 2 && isValid){
        let n = parsed.n
        let op = parsed.op
        let result

        if (isNaN(n)){
          response = [
            {
              "n": n,
              "op": op,
              "error": "'" + n + "'" + " parameter is not a number"
            }
          ];
          res.statusCode = 422;
        }else{
          if (op == "!"){
            result = -n
          }else if (op == "p"){
            result = CheckIfPrime(n)
          }else{
            if (n < 0){
              result = "invalid parameter"
            }else{
              result = SieveOfEratosthenes(n)
            }
          }
          response = [
            {
              "n": n,
              "op": op,
              "value": result
            }
          ];
          res.statusCode = 200;
        }
      }else{
        res.statusCode = 422;
        res.end("invalid parameters")
        return
      }
    break;
    default:
      res.statusCode = 422;
      res.end("invalid parameters")
      return
  }
  res.setHeader('content-Type', 'Application/json');
  res.end(JSON.stringify(response))
}

function ValidateParams(str, validParams){
  let isValid = false
  Object.keys(str).forEach(key => {
    isValid = validParams.indexOf(key) === -1 ? false: true
  });
  return isValid;
}

function CheckIfPrime(number){
  let isPrime = false
  if (number === '1') {
    isPrime = true
  }
  else if (number > '1') {
    isPrime = true
    for (let i = 2; i < number; i++) {
      if (number % i == 0) {
        isPrime = false
        break;
      }
    }
  }
  return isPrime
}

function SieveOfEratosthenes(index){
  let maxSize = 1000005
  let isPrime = []
  isPrime.length = maxSize
  isPrime.fill(true, 0, isPrime.length)
  let primes = []
  
  for (let p = 2; p * p < maxSize; p++){
    if (isPrime[p]){
      for (let i = p * p; i < maxSize; i += p){
        isPrime[i] = false
      }
    }
  }
  for (let p = 1; p < maxSize; p++){
    if (isPrime[p]){
      primes.push(p)
    }
  }
  return primes[index]
}

exports.invalidUrl = function(req, res) {
   var response = [
     {
       "message": "Endpoint incorrect. Les options possibles sont "
     },
     availableEndpoints
   ]
   res.statusCode = 404;
   res.setHeader('content-Type', 'Application/json');
   res.end(JSON.stringify(response))
}
 
const availableEndpoints = [
  {
    method: "GET",
    getMaths: "api/maths"
  }
]