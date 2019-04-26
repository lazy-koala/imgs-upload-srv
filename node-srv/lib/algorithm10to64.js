/**
 * 10位 <=> 64 位
 */

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-'.split('');
const radix = 64;

/**
 * 10进制数字转64进制
 * @param number10
 * @returns {string}
 */
const number10to64 = number10 => {
    if (isNaN(number10)) return null;
    number10 = +number10;
    let arr = [];
    let mod;
    do {
        mod = number10 % radix;
        number10 = (number10 - mod) / radix;
        arr.unshift(chars[mod]);
    } while (number10);
    return arr.join('');
};


const string64to10 = string64 => {
    string64 = String(string64);
    let len = string64.length,
        i = 0,
        number = 0;
    while (i < len) {
        number += Math.pow(radix, i++) * chars.indexOf(string64.charAt(len - i) || 0);
    }
    return number;
};

module.exports = {
    number10to64: number10to64,
    string64to10: string64to10
};

// for (let i = 1000000; i < 1000083; i ++) {
//     process.stdout.write(number10to64(i)+',');
// }

// console.log(string64to10('D0KS'));

console.log(number10to64(1000163+1556245393552))