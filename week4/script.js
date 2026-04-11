
// function processGreet(name, callBack){
//     return callBack(name);
// }

// function greet(name){
//  return `Hello ${name}`;
// }

// console.log(processGreet('Alice', greet));


function calculate(){
    function getSum(a, b){
        return a + b;
    }

     function getSub(a, b){
        return a - b;
    }
    return {getSum: getSum, getSub: getSub};
}



module.exports = calculate();
// module.exports = calculate().getSub;