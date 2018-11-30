"use strict";
var abi = [
    {
        "constant": true,
        "inputs": [],
        "name": "getMinisterStatics",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            },
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
        "name": "getInfo",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint64"
            },
            {
                "name": "",
                "type": "uint64"
            },
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

var specialAbi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_code",
                "type": "address"
            },
            {
                "name": "_app",
                "type": "address"
            }
        ],
        "name": "active",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

function refreshData() {
    blockchain.getMinisterStatics().then(function (promises) {
        $('#s_num').text(promises[0].valueOf());
        $('#s_adopted').text(promises[1].valueOf());
        $('#s_profit').text(promises[2].div(properties.ether).valueOf());
    });
}

function onActiveButtonSubmit() {
    var code = $('#code').val();
    if (isValidAddress(code)) {
        properties.SpecialContract.active(code, 0x0, {gas: 400000}, makeTxnCallback(function () {
            blockchain.getInfo().then(function (promises) {
                if (promises) {
                    var now = Date.parse(new Date()) / 1000;
                    if (promises[4].gt(now)) {
                        $(document.body).addClass('actived');
                    } else {
                        alertify.alert('激活失败');
                    }
                }
            });
        }));
    } else {
        alertify.alert('无效的激活码');
    }
}

$(start(function (account) {
    properties.Contract = web3.eth.contract(abi).at(contractAddresses.Affiliate);
    properties.SpecialContract = web3.eth.contract(specialAbi).at(contractAddresses.MinisterSetter);

    return Promise.all([
        Promise.promisify(properties.SpecialContract.active),
        Promise.promisify(properties.Contract.getMinisterStatics),
        Promise.promisify(properties.Contract.getInfo)
    ]).then(function (_promisfied) {
        // store promisified functions
        blockchain.active = _promisfied[0];
        blockchain.getMinisterStatics = _promisfied[1];
        blockchain.getInfo = _promisfied[2];

        // hook dom interaction event listeners
        return Promise.all([
            $('#superior').on('input', function (e) {
                validateAddress(this);
            }),
            $('#activeSubmit').on('click', onActiveButtonSubmit),
            $('#address').text(account)
        ]);
    }).then(function () {
        $('#loadingSpinner').hide();
        return blockchain.getInfo();
    }).then(function (promises) {
        properties.ether = properties.Web3.toWei(1, 'ether');
        var now = Date.parse(new Date()) / 1000;
        if (promises[4].gt(now)) {
            $(document.body).addClass('actived');
        }
        setInterval(refreshData, 10000);
        refreshData();
    });
}));