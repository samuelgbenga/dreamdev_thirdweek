const {getSum, getSub} = require('./script');

test('adds 1 + 2 to equal 3', () => {

    const digitOne = 4;
    const digitTwo = 5;

    const result = getSum(digitOne, digitTwo);

    expect(result).toBe(9);
});

test("subtract 5 from 10 to equal 5", () => {

    const digitOne = 10;
    const digitTwo = 5;

    const result = getSub(digitOne, digitTwo);

    expect(result).toBe(5);
});