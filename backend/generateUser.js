let users = [];

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getRandom(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

createUser = numberToCreate => {
  for (let i = 0; i < numberToCreate; i++) {
    users.push({
      username: makeid(5),
      password: makeid(6),
      email: makeid(5) + "@email.com",
      messenger: makeid(5),
      role: getRandom(["frontend", "design", "backend"], getRandomInt(1, 3)),
      stack: getRandom(
        ["mean", "mern", "python", "lamp", "ruby", "net"],
        getRandomInt(1, 6)
      ),
      size: getRandomInt(1, 3),
      roleAssoc: getRandom(
        ["frontend", "design", "backend"],
        getRandomInt(1, 3)
      ),
      team: undefined,
      eventID: "gd9DgPcOUZRuCdazYMNcBYTmHoM2"
    });
  }
};

createUser(100);
console.log(users);
