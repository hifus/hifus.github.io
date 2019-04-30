"use strict";
var abi = [
    {
        "constant": false,
        "inputs": [],
        "name": "register",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x1aa3a008"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_player",
                "type": "bytes32"
            }
        ],
        "name": "totalSpent",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xca5dbdb8"
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
        "type": "function",
        "signature": "0xf8704355"
    }
];

function onRegisterButtonSubmit() {
    properties.lw2f.register(makeTxnCallback(function () {
        $('#register').hide();
        $('#message').text('成功获得分红资格！').show();
    }));
}

$(start(function (account) {
    var msg = $('#message'), btn = $('#register').hide();
    properties.lw2 = web3.eth.contract(abi).at(contractAddresses.LastWinner2);
    properties.lw2b = web3.eth.contract(abi).at(contractAddresses.LastWinner2b);
    properties.lw2e = web3.eth.contract(abi).at(contractAddresses.LastWinner2e);
    properties.lw2f = web3.eth.contract(abi).at(contractAddresses.LastWinner2f);

    return Promise.all([
        Promise.promisify(properties.lw2.totalSpent),
        Promise.promisify(properties.lw2b.totalSpent),
        Promise.promisify(properties.lw2e.totalSpent),
        Promise.promisify(properties.lw2f.totalSpent),
        Promise.promisify(properties.lw2f.canTakeFusDividends),
        Promise.promisify(properties.lw2f.register),
    ]).then(function (_promisfied) {
        // store promisified functions
        blockchain.totalSpent = _promisfied[0];
        blockchain.totalSpent1 = _promisfied[1];
        blockchain.totalSpent2 = _promisfied[2];
        blockchain.totalSpent3 = _promisfied[3];
        blockchain.canTakeFusDividends = _promisfied[4];
        blockchain.register = _promisfied[5];

        // hook dom interaction event listeners
        return Promise.all([
            btn.on('click', onRegisterButtonSubmit),
        ]);
    }).then(function () {
        var hash = properties.Web3.sha3(account, {encoding: 'hex'});
        return Promise.all([
            blockchain.totalSpent(hash),
            blockchain.totalSpent1(hash),
            blockchain.totalSpent2(hash),
            blockchain.canTakeFusDividends(),
        ]);
    }).then(function (p) {
        $('#loadingSpinner').hide();

        if (p[3] === false) {
            if (p[0].add(p[1]).add(p[2]).gte(properties.ether.div(10))) {
                btn.show();
                msg.hide();
            } else {
                msg.text('您未能获得分红资格');
            }
        } else {
            msg.text('您已获得分红资格');
        }
    });
}));
