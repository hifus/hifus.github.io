"use strict";
var coTokenAbi = [
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

var FusAbi = [
    {
        "constant": true,
        "inputs": [],
        "name": "startDay",
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
        "constant": true,
        "inputs": [],
        "name": "nextPayTime",
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
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
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
        "constant": true,
        "inputs": [],
        "name": "isTransferable",
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
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "dividends",
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
        "constant": true,
        "inputs": [],
        "name": "payDayInterval",
        "outputs": [
            {
                "name": "",
                "type": "uint32"
            }
        ],
        "payable": false,
        "stateMutability": "view",
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
        "name": "validHolders",
        "outputs": [
            {
                "name": "total",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "address"
            },
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "receipts",
        "outputs": [
            {
                "name": "app",
                "type": "address"
            },
            {
                "name": "dividends",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "dailyHolder",
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
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "globalHolders",
        "outputs": [
            {
                "name": "timestamp",
                "type": "uint64"
            },
            {
                "name": "payTime",
                "type": "uint64"
            }
        ],
        "payable": false,
        "stateMutability": "view",
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
        "name": "lastPay",
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
        "constant": true,
        "inputs": [],
        "name": "totalHolder",
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
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "pays",
        "outputs": [
            {
                "name": "provider",
                "type": "address"
            },
            {
                "name": "dividends",
                "type": "uint256"
            },
            {
                "name": "validFus",
                "type": "uint256"
            },
            {
                "name": "dividendsPerFus",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "payTimes",
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
                "name": "_holder",
                "type": "address"
            },
            {
                "name": "_peer",
                "type": "address"
            }
        ],
        "name": "getHolderStartTime",
        "outputs": [
            {
                "name": "",
                "type": "uint64"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_holder",
                "type": "address"
            },
            {
                "name": "_peer",
                "type": "address"
            }
        ],
        "name": "getHolderStartPay",
        "outputs": [
            {
                "name": "",
                "type": "uint64"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "payCount",
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
        "constant": true,
        "inputs": [
            {
                "name": "_time",
                "type": "uint256"
            }
        ],
        "name": "payContributionCount",
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
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

var delegateAbi = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "peers",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "peerCount",
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
        "constant": true,
        "inputs": [],
        "name": "getValidFus",
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
];

var appAbi = [
    {
        "constant": true,
        "inputs": [],
        "name": "getFusDividends",
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
        "constant": true,
        "inputs": [],
        "name": "canTakeFusDividends",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

function onCotokenConfirm() {
    var amount = web3.toBigNumber($('#amount').val());
    if (amount.gt(0)) {
        var target = $('#targetAccount').val();
        if (target === '' || isValidAddress(target)) {
            var account = properties.Web3.eth.defaultAccount, atOnce = function () {
                $('#cotokenModal').modal('hide');
            }, f = function () {
                Promise.all([
                    blockchain.balanceOfETH(account),
                    blockchain.balanceOfCoToken(account)
                ]).then(function (promises) {
                    $('#eth').text(promises[0].div(properties.ether).toNumber());
                    $('#cotoken').text(promises[1].div(properties.ether).toNumber());
                    $('#total').text(promises[0].add(promises[1]).div(properties.ether).toNumber());
                });
                showTips($('#exchangeOk'));
            };

            if (target === '') target = account;
            if ($('#cotokenModal').data('action') === 'buy') {
                properties.CoTokenContract.deposit(target, {
                    gas: 400000,
                    value: amount.mul(properties.ether)
                }, makeTxnCallback(f, atOnce));
            } else {
                properties.CoTokenContract.withdraw(amount.mul(properties.ether), target, {gas: 1000000}, makeTxnCallback(f, atOnce));
            }
        } else {
            showTips($('#invTarget'));
        }
    } else {
        showTips($('#invAmount'));
    }
}

function fillDividendsTable(promises) {
    var c = $('#tbl').children(), total = web3.toBigNumber(0);
    c.filter(':not(:last)').each(function (i, tr) {
        if (promises[i * 2 + 1]) {
            var v = $(tr).data('fus');
            if (v.gt(0)) {
                v = promises[i * 2].mul(properties.fus).div(v).div(properties.ether);
            }
            total = total.add(v);
            $(tr).children(':last').text(v.gt(1) ? v.toPrecision(10) : v.toFixed(9));
        } else {
            $(tr).children(':last').empty().append('<a class="NoDividends">未能获得分红</a>');
        }
    });
    c.filter(':last').children(':last').text(total.gt(1) ? total.toPrecision(10) : total.toFixed(9));
}

function onFusConfirm() {
    var amount = web3.toBigNumber($('#FusAmount').val());
    if (amount.gt(0)) {
        var target = $('#FusTargetAccount').val();
        if (isValidAddress(target)) {
            var account = properties.Web3.eth.defaultAccount, atOnce = function () {
                $('#FusModal').modal('hide');
            }, f = function () {
                var arr = $.makeArray($.map(blockchain.apps, function (p, i) {
                    return p();
                }));
                arr.unshift(blockchain.balanceOfFUS(account));

                Promise.all(arr).then(function (promises) {
                    if (promises) {
                        properties.fus = promises[0];
                        $('#fus').text(properties.fus.div(properties.ether).toNumber());
                        promises.shift();
                        fillDividendsTable(promises);
                    }
                });

                showTips($('#moveOk'));
            };
            properties.FusContract.transfer(target, amount.mul(properties.ether), {gas: 1000000}, makeTxnCallback(f, atOnce));
        } else {
            showTips($('#invFusTarget'));
        }
    } else {
        showTips($('#invFusAmount'));
    }
}

function onBuyButtonSubmit() {
    $('#cotokenModalLabel').text('ETH -> coToken');
    $('#cotokenModal').data('action', 'buy').modal('show');
}

function onSellButtonSubmit() {
    $('#cotokenModalLabel').text('coToken -> ETH');
    $('#cotokenModal').data('action', 'sell').modal('show');
}

function onTradeButtonSubmit() {
    alertify.alert('交易所即将上线');
}

function onMoveButtonSubmit() {
    if (properties.isTransferableFUS) {
        $('#FusModal').modal('show');
    } else {
        alertify.alert('暂不允许转移');
    }
}

function onWithdrawButtonSubmit() {
    properties.FusContract.withdraw({gas: 1000000}, makeTxnCallback(function () {
        showTips($('#withdrawOk'));
    }));
}

$(start(function (account) {
    properties.CoTokenContract = web3.eth.contract(coTokenAbi).at(contractAddresses.coToken);
    properties.FusContract = web3.eth.contract(FusAbi).at(contractAddresses.Fus);
    properties.DelegateContract = web3.eth.contract(delegateAbi).at(contractAddresses.FusPeerDelegate);

    function f(promises) {
        if (promises) {
            properties.flag++;
            switch (properties.flag) {
                case 1:
                    var len = promises.length;
                    for (var i = 0; i < len; ++i) {
                        var tr = properties.trs[i];
                        tr.data('fus', promises[i]);
                        var a = promises[i].div(properties.ether).toNumber();
                        tr.find('td').eq(1).text((a > 1) ? a.toPrecision(10) : a.toFixed(9));
                    }
                    return Promise.all(properties.apps);
                case 2:
                    blockchain.apps = promises;
                    return Promise.all($.makeArray($.map(promises, function (p, i) {
                        return p();
                    })));
                case 3:
                    fillDividendsTable(promises);
            }
        }
    }

    return Promise.all([
        Promise.promisify(properties.Web3.eth.getBalance),

        Promise.promisify(properties.CoTokenContract.balanceOf),
        Promise.promisify(properties.CoTokenContract.deposit),
        Promise.promisify(properties.CoTokenContract.withdraw),
        Promise.promisify(properties.CoTokenContract.transfer),
        Promise.promisify(properties.CoTokenContract.frozenAccount),

        Promise.promisify(properties.FusContract.balanceOf),
        Promise.promisify(properties.FusContract.isTransferable),
        Promise.promisify(properties.FusContract.dividends),
        Promise.promisify(properties.FusContract.withdraw),
        Promise.promisify(properties.FusContract.transfer),
        Promise.promisify(properties.FusContract.frozenAccount),
        Promise.promisify(properties.FusContract.nextPayTime),
        Promise.promisify(properties.FusContract.validHolders),

        Promise.promisify(properties.DelegateContract.getValidFus),
    ]).then(function (_promisfied) {
        // store promisified functions
        blockchain.balanceOfETH = _promisfied[0];

        blockchain.balanceOfCoToken = _promisfied[1];
        blockchain.depositCoToken = _promisfied[2];
        blockchain.withdrawCoToken = _promisfied[3];
        blockchain.transferCoToken = _promisfied[4];
        blockchain.isFrozenCoToken = _promisfied[5];

        blockchain.balanceOfFUS = _promisfied[6];
        blockchain.isTransferableFUS = _promisfied[7];
        blockchain.dividendsFUS = _promisfied[8];
        blockchain.withdrawFUS = _promisfied[9];
        blockchain.transferFUS = _promisfied[10];
        blockchain.isFrozenFUS = _promisfied[11];
        blockchain.nextPayTime = _promisfied[12];
        blockchain.validHolders = _promisfied[13];

        blockchain.getValidFus = _promisfied[14];

        // hook dom interaction event listeners
        return Promise.all([
            $('#buyAccount').on('input', function () {
                validateAddress(this);
            }),
            $('#buy').on('click', onBuyButtonSubmit),
            $('#sell').on('click', onSellButtonSubmit),
            $('#cotokenConfirm').on('click', onCotokenConfirm),
            $('#trade').on('click', onTradeButtonSubmit),
            $('#move').on('click', onMoveButtonSubmit),
            $('#FusConfirm').on('click', onFusConfirm),
            $('#withdraw').on('click', onWithdrawButtonSubmit),
            $('#tbl').on('click', '.NoDividends', function () {
                alertify.alert('此项目要求至少消费 0.1 coToken，才能获得分红');
            })
        ]);
    }).then(function () {
        $('#loadingSpinner').hide();
        return Promise.all([
            blockchain.balanceOfETH(account),
            blockchain.balanceOfCoToken(account),
            blockchain.balanceOfFUS(account),
            blockchain.dividendsFUS(account),
            blockchain.nextPayTime(),
            blockchain.getValidFus(),
            blockchain.isTransferableFUS(),
        ]);
    }).then(function (promises) {
        properties.ether = web3.toBigNumber(properties.Web3.toWei(1, 'ether'));
        if (promises) {
            $('#eth').text(promises[0].div(properties.ether).toNumber());
            $('#cotoken').text(promises[1].div(properties.ether).toNumber());
            $('#total').text(promises[0].add(promises[1]).div(properties.ether).toNumber());
            properties.fus = promises[2];
            $('#fus').text(promises[2].div(properties.ether).toNumber());
            $('#dividends').text(promises[3].div(properties.ether).toNumber());
            $('#dividend_date').text(promises[4].gt(Math.pow(10, 20)) ? '未确定' : timestampString(promises[4].toNumber()));
            properties.validFus = promises[5];
            properties.isTransferableFUS = promises[6];
            var tbl = $('#tbl');
            tbl.children(':not(:last)').remove();
            var last = tbl.children();
            var apps = [];
            properties.appContracts = [];
            var validHolders = [];
            properties.validHolderCount = 0;
            properties.trs = [];

            var len = items.length;
            for (var i = 0; i < len; ++i) {
                var it = items[i];

                it[1] = contractAddresses[it[1]];
                var tr = $('<tr><td></td><td></td><td></td></tr>').insertBefore(last);
                it.push(tr);
                var tds = tr.find('td');
                if (it[3]) {
                    $('<a></a>').attr('href', it[3]).text(it[0]).appendTo(tds[0]);
                } else {
                    tds.eq(0).text(it[0]);
                }

                if (it[2]) {
                    tr.data('fus', properties.validFus);
                    var a = properties.validFus.div(properties.ether).toNumber();
                    tds.eq(1).text((a > 1) ? a.toPrecision(10) : a.toFixed(9));
                } else {
                    properties.validHolderCount++;
                    validHolders.push(blockchain.validHolders(it[1]));
                    properties.trs.push(tr);
                }
                var contract = web3.eth.contract(appAbi).at(it[1]);
                properties.appContracts.push(contract);
                apps.push(Promise.promisify(contract.getFusDividends));
                apps.push(Promise.promisify(contract.canTakeFusDividends));
            }

            if (properties.validHolderCount) {
                properties.apps = apps;
                properties.flag = 0;
                return Promise.all(validHolders);
            } else {
                properties.flag = 1;
                return Promise.all(apps);
            }
        }
    }).then(f).then(f).then(f);
}));
