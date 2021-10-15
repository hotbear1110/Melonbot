// https://github.com/DatGuy1/common_badwords_twitch
exports.racism1 = /(?:(?:\b(?<![-=\.])(?<!\.com\/)|monka)(?:[Nn\x{00F1}]|[Ii7]V)|\/\\\/)[\s\.]*?[liI1y!j\/]+[\s\.]*?(?:[GgbB6934Q🅱qğĜƃ၅5\*][\s\.]*?){2,}(?!arcS|l|Ktlw|ylul|ie217|64|\d? ?times)/;
exports.racism2 = /(?<!monte)negr[o|u]s?(?<!ni)/;
exports.racism3 = /knee grow/;
exports.racism4 = /gibson.*dog/;
/**/
exports.racism5= new RegExp(/(?:(?:\b(?<![-=\.])|monka)(?:[Nnñ]|[Ii7]V)|[\/|]\\[\/|])[\s\.]*?[liI1y!j\/|]+[\s\.]*?(?:[GgbB6934Q🅱qğĜƃ၅5\*][\s\.]*?){2,}(?!arcS|l|Ktlw|ylul|ie217|64|\d? ?times)/);
exports.url = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
exports.invisChar = new RegExp(/[\u034f\u2800\u{E0000}\u180e\ufeff\u2000-\u200d\u206D]/gu);