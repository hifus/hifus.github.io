"use strict";
var abi = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "success",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "frozenAccount",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_sender",
                "type": "address"
            }
        ],
        "name": "deposit",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_value",
                "type": "uint256"
            },
            {
                "name": "_to",
                "type": "address"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

function displayString2(v) {
    if (v >= 1) {
        return v.toPrecision(9);
    } else {
        return v.toFixed(9);
    }
}

function displayString(v) {
    return displayString2(web3.toBigNumber(v).div(properties.ether).toNumber());
}

function timestampString(t) {
    t = (new Date(t * 1000));
    return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds();
}

function onSendButtonSubmit() {
    var account = properties.Web3.eth.defaultAccount;
    var _send = function (dst, amount) {
        var f = function () {
            Promise.all([
                blockchain.balanceOfETH(account),
                blockchain.balanceOfCoToken(account)
            ]).then(function (promises) {
                if (promises) {
                    $('#eth').text(promises[0].div(properties.ether).toNumber());
                    $('#cotoken').text(promises[1].div(properties.ether).toNumber());
                }
            });
            showTips($('#sendOk'));
        };

        amount = properties.ether.mul(amount.toFixed(15));
        var gas = 200000;
        if ($('#srcCotoken').is(':checked')) {
            if ($('#dstCotoken').is(':checked')) {
                properties.Contract.transfer(dst, amount, {gas: gas}, makeTxnCallback(f));
            } else {
                properties.Contract.withdraw(amount, dst, {gas: gas}, makeTxnCallback(f));
            }
        } else {
            if ($('#dstCotoken').is(':checked')) {
                properties.Contract.deposit(dst, {
                    gas: gas,
                    value: amount
                }, makeTxnCallback(f));
            } else {
                properties.Web3.eth.sendTransaction({
                    to: dst,
                    gas: gas,
                    value: amount
                }, makeTxnCallback(f));
            }
        }
    };

    var dst = $('#target').val();
    if (isValidAddress(dst)) {
        var amount = $('#eth_amount').data('value');
        if (amount > 0) {
            if (amount >= 10) {
                alertify.confirm('发送数量为：' + amount + ' ETH，请注意风险！\n你确定发送吗？', function () {
                    _send(dst, amount);
                });
            } else {
                _send(dst, amount);
            }
        } else {
            alertify.alert('无效的数量');
        }
    } else {
        alertify.alert('无效的目标账号');
    }
}

function getRealTimePrice() {
    var amount = parseFloat($('#amount').val());
    var currency = $('#currency').val();
    properties.times++;
    if (amount === properties.amount && properties.currency === currency && properties.times < 10) {
        return;
    }
    properties.amount = amount;
    properties.currency = currency;
    properties.times = 0;
    var eth = $('#eth_amount');
    if (amount > 0) {
        var c = {};
        if (currency === 'ETH') {
            c.ETH = amount;
            eth.text(displayString2(c.ETH)).data('value', c.ETH);
        }
        $.map(properties.currencies, function (d, i) {
            var code = $(d).data('code');
            $.get('https://api.coinmarketcap.com/v2/ticker/1027/', {convert: code}, function (res, status) {
                if (status === 'success' && res.data.name === 'Ethereum') {
                    properties.prices[code] = res.data.quotes[code].price;
                    if (code === currency) {
                        c.ETH = amount / res.data.quotes[code].price;
                        eth.text(displayString2(c.ETH)).data('value', c.ETH);
                        $('span', d).text(amount);
                        for (var a in c) {
                            if (a !== 'ETH' && a !== code) {
                                $('span', c[a][1]).text(displayString2(c.ETH * c[a][0]));
                            }
                        }
                    } else if (typeof c.ETH !== "undefined") {
                        $('span', d).text(displayString2(c.ETH * res.data.quotes[code].price));
                    } else {
                        c[code] = [res.data.quotes[code].price, d];
                    }
                } else {
                    $('span', d).text('0');
                }
            });
        });
    } else {
        properties.currencies.find('span').text('0');
        c.ETH = 0;
        eth.text(displayString2(c.ETH)).data('value', c.ETH);
    }
}

function highLightMe() {
    $('#currencies>div').removeClass('high-light');
    $(this).addClass('high-light');
}

var gCtx = null;
var video = null;
var captureId = null;
var w = 800, h = 600;
var options = [
    {video: {facingMode: {exact: "environment"}}, audio: false},
    {video: {facingMode: "environment"}, audio: false},
    {video: {'deviceId': ''}, audio: false}
];

function isCanvasSupported() {
    var elem = $('#qr-canvas')[0];
    return !!(elem.getContext && elem.getContext('2d'));
}

function initCanvas() {
    var gCanvas = document.getElementById("qr-canvas");
    gCanvas.style.width = w + "px";
    gCanvas.style.height = h + "px";
    gCanvas.width = w;
    gCanvas.height = h;
    gCtx = gCanvas.getContext("2d");
}

function captureToCanvas() {
    try {
        gCtx.drawImage(video, 0, 0);
        qrcode.decode();
    }
    catch (e) {
        console.log(e);
    }
}

function startWebcam() {
    gCtx.clearRect(0, 0, w, h);
    var success = function (stream) {
        window.stream = stream;
        video.srcObject = stream;
        var camera = $('#camera');
        if (camera.children().length === 0) {
            camera.prepend(video);
            $(video).on('pause', function () {
                $('#ScanModal').modal('hide');
            });
        }

        if (captureId === null) {
            captureId = setInterval(captureToCanvas, 500);
        }
    }, error = function (e) {
        var n = options.length;
        if (n > 1) {
            options.shift();
            if (n === 2) {
                options[0].video.deviceId = properties.videoinput[properties.inputIdx % properties.videoinput.length];
                $('#change').on('click', function () {
                    if (captureId !== null) {
                        clearInterval(captureId);
                        captureId = null;
                    }
                    window.stream.getTracks()[0].stop();
                    properties.inputIdx++;
                    options[0].video.deviceId = properties.videoinput[properties.inputIdx % properties.videoinput.length];
                    startWebcam();
                }).parent().removeClass('d-none');
            }
        } else {
            alertify.alert('启用摄像头失败');
            return;
        }
        startWebcam();
    };

    var n = navigator;
    if (n.mediaDevices.getUserMedia) {
        n.mediaDevices.getUserMedia(options[0]).then(function (stream) {
            success(stream);
        }).catch(function (e) {
            error(e);
        });
    }
    else if (n.getUserMedia) {
        n.getUserMedia(options[0], success, error);
    }
    else if (n.webkitGetUserMedia) {
        n.webkitGetUserMedia(options[0], success, error);
    }
}

function useWebcam() {
    if (captureId === null) {

        if (video === null) {
            video = document.createElement('video');
            video.width = 640;
            video.height = 480;
            video.setAttribute('autoplay', '');
        }

        startWebcam();
    }
}

function setwebcam() {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        try {
            navigator.mediaDevices.enumerateDevices().then(function (devices) {
                var videoinput = [], inputIdx = -1;
                devices.forEach(function (device) {
                    if (device.kind === 'videoinput') {
                        if (device.label.toLowerCase().search("back") > -1 || device.label.search("后") > -1) {
                            inputIdx = videoinput.length;
                        }
                        videoinput.push(device.deviceId);
                    }
                });
                if (videoinput.length > 0) {
                    var mdl = $('#ScanModal');
                    qrcode.callback = function (a) {
                        $('#target').val(a);
                        mdl.modal('hide');
                    };
                    properties.videoinput = videoinput;
                    properties.inputIdx = inputIdx + videoinput.length;

                    mdl.on('hidden.bs.modal', function (e) {
                        window.stream.getTracks()[0].stop();
                        $(video).remove();
                        video = null;
                        if (captureId !== null) {
                            clearInterval(captureId);
                            captureId = null;
                        }
                    }).on('show.bs.modal', function (e) {
                        useWebcam();
                    })
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }
}

function Scan() {
    if (qrcode.callback) {
        $('#ScanModal').modal('show');
    } else {
        alertify.alert('不能启用摄像头');
    }
}

function makeReceiveList() {
    var account = properties.Web3.eth.defaultAccount;
    var r = $('#receives').empty(), n = properties.txsList.length, i, j, tx, s, v;
    for (i = 0, j = 0; i < n && j < 20; ++i) {
        tx = properties.txsList[i];
        if (tx.from === account) continue;
        if (tx.txnType === 0) {
            if (tx.status !== 1) continue;
        } else {
            if (tx.from === contractAddresses.coToken) continue;
        }

        ++j;
        v = web3.toBigNumber(tx.value);
        s = $('<div class="list-group-item list-group-item-action flex-column align-items-start p-1 mb-1"\n' +
            'style="font-size: 0.7em;" data-amount="' + tx.value + '">\n' +
            '<div class="row">\n' +
            '<div class="col-1 text-left font-weight-bold pr-0">' + j + '</div>\n' +
            '<div class="col-2 text-left font-weight-bold pr-0">' + timestampString(tx.timeStamp) + '</div>\n' +
            '<div class="col-8 text-right font-weight-bold pr-0">' + displayString(tx.value) + ((tx.txnType < 2) ? ' ETH' : ' coToken') + '</div>\n' +
            '<div class="col-12 text-left">' + tx.from + '</div>\n' +
            '<div class="col-4 text-left">比特币：<br>\n' +
            '<span>' + displayString(properties.prices['BTC'] * tx.value) + '</span>\n' +
            '</div>\n' +
            '<div class="col-4 text-left">美元：<br>\n' +
            '<span>' + displayString(properties.prices['USD'] * tx.value) + '</span>\n' +
            '</div>\n' +
            '<div class="col-4 text-left">欧元：<br>\n' +
            '<span>' + displayString(properties.prices['EUR'] * tx.value) + '</span>\n' +
            '</div>\n' +
            '<div class="col-4 text-left">人民币：<br>\n' +
            '<span>' + displayString(properties.prices['CNY'] * tx.value) + '</span>\n' +
            '</div>\n' +
            '<div class="col-4 text-left">港元：<br>\n' +
            '<span>' + displayString(properties.prices['HKD'] * tx.value) + '</span>\n' +
            '</div>\n' +
            '<div class="col-4 text-left">新台币：<br>\n' +
            '<span>' + displayString(properties.prices['TWD'] * tx.value) + '</span>\n' +
            '</div>\n' +
            '</div>\n' +
            '</div>').appendTo(r);
    }

    return j;
}

function getValidTxn() {
    var txsList = properties.txsList, n = txsList.length, i, j, tx, arr;
    properties.dealing = [];

    for (i = 0, j = 0, arr = []; i < n && j < 5; ++i) {
        tx = txsList[i];
        if (tx.txnType === 0) {
            if (typeof tx.status === "undefined") {
                properties.dealing.push(tx.hash);
                arr.push(blockchain.getReceipt(tx.hash));
                ++j;
            }
        } else {
            if (tx.from === contractAddresses.coToken) {
                properties.dealing.push(tx.hash);
                arr.push(blockchain.getTransaction(tx.hash));
                ++j;
            }
        }
    }

    Promise.all(arr).then(function (promises) {
        if (promises && promises.length > 0) {
            var i, tx, p;
            for (i = 0; i < 5; ++i) {
                tx = properties.txsSet[properties.dealing[i]];
                p = promises[i];
                if (tx.txnType === 0) {
                    tx.status = parseInt(p.status);
                } else {
                    tx.from = p.from;
                }
            }
        }

        i = makeReceiveList();
        if (i < properties.txsList.length && i < 20) {
            getValidTxn();
        }
    });
}

function queryRecive() {
    var apikey = '539FB26X6S5ZPTUQ8U6SIFYIFQC1FY8KUT';
    var account = properties.Web3.eth.defaultAccount;
    var prefix = 'https://api.etherscan.io/api?module=account&address=' + account + '&startblock=' + properties.blockNumber + '&page=1&offset=100&sort=desc&apikey=' + apikey + '&action=';

    //E2E
    var queryE2E = prefix + 'txlist';
    //C2E
    var queryC2E = prefix + 'txlistinternal';
    //E2C & C2C
    var queryX2C = prefix + 'tokentx&contractaddress=' + contractAddresses.coToken;

    Promise.all([
        $.get(queryE2E),
        $.get(queryC2E),
        $.get(queryX2C)
    ]).then(function (promises) {
        var txsList = [];
        $.each(promises, function (i, p) {
            if (p.status === '1' && p.result.length > 0) {
                var bn = parseInt(p.result[0].blockNumber);
                if (properties.blockNumber < bn) properties.blockNumber = bn;
                txsList = txsList.concat($.grep(p.result, function (tx, j) {
                    if (tx.to === account) {
                        tx.txnType = i;
                        tx.timeStamp = parseInt(tx.timeStamp);
                        properties.txsSet[tx.hash] = tx;
                        return true;
                    } else {
                        return false;
                    }
                }));
            }
        });

        txsList.sort(function (a, b) {
            if (b.timeStamp > a.timeStamp) return 1;
            if (b.timeStamp < a.timeStamp) return -1;
            return 0;
        });

        properties.txsList = txsList.concat(properties.txsList);
        properties.blockNumber++;

        getValidTxn();
    });
}

$(start(function (account) {
    $('#copy').on('click', function () {
        copy($('#app_link'));
        var tips = $('#copy_ok');
        tips.css('margin-left', '-' + tips.outerWidth() / 2 + 'px').fadeIn("fast", function (e) {
            setTimeout(function (e) {
                tips.fadeOut("fast");
            }, 1500);
        });
        return false;
    });

    var qrcode = $('#qrcode');
    new QRCode(qrcode[0], properties.Web3.eth.defaultAccount);  // 设置要生成二维码的链接
    qrcode.find('img').addClass('mx-auto');
    $('#address').text(properties.Web3.eth.defaultAccount);

    qrcode = $('#dlCode');
    new QRCode(qrcode[0], $('#app_link').text());
    qrcode.find('img').addClass('mx-auto');
    //初始化扫描二维码按钮，传入自定义的 node-type 属性
    var node = $('[node-type="qr-btn"]');
    Qrcode2.init(node);

    if (isCanvasSupported() && window.File && window.FileReader) {
        initCanvas();
        setwebcam();
    }

    properties.currencies = $('#currencies').children(':gt(0)');

    properties.Contract = web3.eth.contract(abi).at(contractAddresses.coToken);

    return Promise.all([
        Promise.promisify(properties.Web3.eth.getBalance),
        Promise.promisify(properties.Web3.eth.sendRawTransaction),

        Promise.promisify(properties.Contract.balanceOf),
        Promise.promisify(properties.Contract.deposit),
        Promise.promisify(properties.Contract.withdraw),
        Promise.promisify(properties.Contract.transfer),

        Promise.promisify(properties.Web3.eth.getTransactionReceipt),
        Promise.promisify(properties.Web3.eth.getTransaction),
    ]).then(function (_promisfied) {
        // store promisified functions
        blockchain.balanceOfETH = _promisfied[0];
        blockchain.sendRawTransaction = _promisfied[1];

        blockchain.balanceOfCoToken = _promisfied[2];
        blockchain.depositCoToken = _promisfied[3];
        blockchain.withdrawCoToken = _promisfied[4];
        blockchain.transferCoToken = _promisfied[5];

        blockchain.getReceipt = _promisfied[6];
        blockchain.getTransaction = _promisfied[7];

        // hook dom interaction event listeners
        return Promise.all([
            $('#target').on('input', function (e) {
                validateAddress(this);
            }),
            $('#sendBtn').on('click', onSendButtonSubmit),
            $('#currencies').on('click', 'div:not(:first)', highLightMe),
            $('#scan').on('click', Scan),
        ]);
    }).then(function () {
        return Promise.all([
            blockchain.balanceOfETH(account),
            blockchain.balanceOfCoToken(account),
        ]);
    }).then(function (promises) {
        $('#loadingSpinner').hide();
        properties.ether = web3.toBigNumber(properties.Web3.toWei(1, 'ether'));
        properties.amount = 0;
        properties.times = 10;
        properties.currency = 'ETH';
        if (promises) {
            $('#eth').text(displayString(promises[0]));
            $('#cotoken').text(displayString(promises[1]));
        }

        properties.prices = {};
        properties.blockNumber = 0;
        properties.txsList = [];
        properties.txsSet = {};
        setInterval(getRealTimePrice, 1000);
        setInterval(queryRecive, 10000);
        getRealTimePrice();
    });
}));
