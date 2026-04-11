const array = [1, 2, 3, 4, 5];

// array.pop();

// array.shift();

array.unshift();

console.log(array);

let newAray = [];

array.forEach((number)=>{
   number = number * 2;
   newAray.push(number);
})

console.log(newAray);

let result = array.reduce((accumulator, currentValue)=>{
    return accumulator + currentValue;
}, 1);

console.log(result);