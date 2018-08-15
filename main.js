var selectElement = null;
var regStr = '';
var patterns = [
    {'transaction' : '+', 'reg': 'Prinimay popolnenie (?<СУММА>\\d+(.[0-9]+)?) BYN. Bank, eba (?<ДАТА>\\d{2}/\\d{2}) 11:45 Ostatok (?<ОСТАТОК>\\d+(.[0-9]+)?) BYN'},
    {'transaction' : '-', 'reg': 'Spisanie (?<СУММА>\\d+(.[0-9]+)?) BYN. Bank, eba (?<ДАТА>\\d{2}/\\d{2}) 11:45 Ostatok (?<ОСТАТОК>\\d+(.[0-9]+)?) BYN'}
]

function getSmsInfo(text){
    var retObj = {
        'transaction' : '',
        'data' : ''
    }
    for (var i = 0; i < patterns.length; i++) {
        try {
            var data = new RegExp(patterns[i].reg, 'g').exec(text).groups
            retObj.transaction = patterns[i].transaction;
            retObj.data = data;
            console.log(retObj);
        } catch (err) {
        }
    }
}

function getConstructText(input) {
    var splitText = input.split(' ');
    var elemConstText = document.getElementById('textConstruct');
    console.log(splitText)
    elemConstText.innerHTML = '';
    for (var i = 0; i < splitText.length; i++){
        elemConstText.innerHTML = elemConstText.innerHTML + `<span id='char${i}' def = '${splitText[i]}' class='char' ondblclick='selectChar(this)'>${splitText[i]}</span>`
    }
}

function selectChar(elem){
    selectElement = elem;
    // console.log(`id = ${elem.id}, text = ${elem.getAttribute('def')}`)
    document.getElementById('defText').innerHTML = selectElement.getAttribute('def');
}

function setPattern(elem){
    if (elem.getAttribute('id') == 'defText'){
        selectElement.innerHTML = `${elem.innerHTML}`;
    } else {
        selectElement.innerHTML = `${elem.innerHTML.toUpperCase()}`;
    }
    selectElement.setAttribute('style', elem.getAttribute('style'));

    var elemConstText = document.getElementById('textConstruct');
    var patternString = ''
    for (var i = 0; i < elemConstText.childNodes.length; i++) {
        patternString = patternString + elemConstText.childNodes[i].innerHTML + ' ';
    }

    regStr = parseSms(patternString.trim());
    console.log(regStr)
}

function parseSms(pattern) {
    const moneyAmountRegExp = '\\d+(\.[0-9]+)?';
    const textRegExp = '\\w+';
    const dateRegExp = '\\d{2}\/\\d{2}';
    const attributes = [
        {
            symbol: 'СУММА',
            replacement: moneyAmountRegExp,
        },
        {
            symbol: 'ОСТАТОК',
            replacement: moneyAmountRegExp,
        },
        {
            symbol: 'ПОПОЛНЕНИЕ',
            replacement: textRegExp,
        },
        {
            symbol: 'СПИСАНИЕ',
            replacement: textRegExp,
        },
        {
            symbol: 'ДАТА',
            replacement: dateRegExp,
        },
    ];
    let regExp = attributes.reduce(
        (tmpRegExp, attribute) => tmpRegExp.replace(attribute.symbol, `(?<${attribute.symbol}>${attribute.replacement})`),
        pattern
);
    return regExp;
}