"use strict";
var abi = [
    {
        "constant": true,
        "inputs": [],
        "name": "total",
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
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
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
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getValidMinisterCount",
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
                "name": "_addr",
                "type": "address"
            }
        ],
        "name": "isRegistered",
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
                "name": "_superior",
                "type": "address"
            }
        ],
        "name": "register",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
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

function refreshData() {
    blockchain.getInfo().then(function (promises) {
        $('#inferior_count').text(promises[0].valueOf());
        $('#inferior2_count').text(promises[1].valueOf());
        var c = $('#contribute'), color;
        c.text(promises[2].div(properties.ether).valueOf());
        if (promises[2].gte(properties.ether * 8 / 10)) {
            color = 'green';
        } else if (promises[2].gte(properties.ether * 5 / 10)) {
            color = 'orange';
        } else {
            color = 'red';
        }
        c.css('color', color);
        properties.tips = $('#tip_' + color);
        $('#profit').text(promises[3].div(properties.ether).valueOf());
        $('#adopt_count').text(promises[5].valueOf());
        $('#adopt_profit').text(promises[6].div(properties.ether).valueOf());
        var expire = new Date();
        expire.setTime(promises[4].toNumber() * 1000);
        $('#adopt_end').text((expire.getTime() > (new Date()).getTime()) ? expire.toLocaleString() : '未进行收养');
    }).catch(function (err) {
        console.log("出错了", err);
    });
}

function onJoinButtonSubmit() {
    var address = $('#superior').val();
    if (isValidAddress(address)) {
        blockchain.isRegistered(address).then(function (isRegistered) {
            if (isRegistered) {
                properties.Contract.register(address, {gas: 400000}, makeTxnCallback(function () {
                    var account = properties.Web3.eth.accounts[0];
                    blockchain.isRegistered(account).then(function (promises) {
                        if (promises) {
                            $(document.body).addClass('registered');
                            setInterval(refreshData, 10000);
                            refreshData();
                        } else {
                            alertify.alert('请求加入失败');
                        }
                    });
                }));
            } else {
                alertify.alert('推荐人账号未加入层级！');
            }
        });
    } else {
        alertify.alert('无效的推荐人账号');
    }
}

function onWithdrawButtonSubmit() {
    properties.Contract.withdraw(makeTxnCallback(function () {
        alertify.alert('提取收益成功');
    }));
}

$(function () {
    var search = location.search;
    if (/^\?0x[0-9a-fA-F]{40}$/.test(search)) {
        search = search.substr(1);
    } else {
        search = '';
    }

    start((function () {
        var superior = $('#superior').val(search);

        var recommend = $('#recommend');
        recommend.click(function () {
            copy(recommend);
            var tips = $('#copy_ok');
            tips.css('margin-left', '-' + tips.outerWidth() / 2 + 'px').fadeIn("fast", function (e) {
                setTimeout(function (e) {
                    tips.fadeOut("fast");
                }, 1500);
            });
        });

        $('#contribute').click(function () {
            var tips = properties.tips;
            tips.css('margin-top', '-' + tips.outerHeight(true) + 'px').fadeIn("fast", function (e) {
                setTimeout(function (e) {
                    properties.tips.fadeOut("fast", function () {
                        tips.removeAttr('style');
                    });
                }, 5000);
            });
        });

        return function (account) {
            properties.Contract = web3.eth.contract(abi).at(contractAddresses.Affiliate);

            return Promise.all([
                Promise.promisify(properties.Contract.total),
                Promise.promisify(properties.Contract.getInfo),
                Promise.promisify(properties.Contract.getValidMinisterCount),
                Promise.promisify(properties.Contract.isRegistered),
                Promise.promisify(properties.Contract.register),
                Promise.promisify(properties.Contract.withdraw)
            ]).then(function (_promisfied) {
                // store promisified functions
                blockchain.total = _promisfied[0];
                blockchain.getInfo = _promisfied[1];
                blockchain.getValidMinisterCount = _promisfied[2];
                blockchain.isRegistered = _promisfied[3];
                blockchain.register = _promisfied[4];
                blockchain.withdraw = _promisfied[5];

                // hook dom interaction event listeners
                return Promise.all([
                    superior.on('input', function (e) {
                        validateAddress(this);
                    }),
                    $('#joinSubmit').on('click', onJoinButtonSubmit),
                    $('#account').text(account),
                    recommend.text(location.origin + location.pathname + '?' + account),
                    $('#withdraw').on('click', onWithdrawButtonSubmit),
                ]);
            }).then(function () {
                $('#loadingSpinner').hide();
                return blockchain.isRegistered(account);
            }).then(function (promises) {
                properties.ether = properties.Web3.toWei(1, 'ether');
                if (promises) {
                    $(document.body).addClass('registered');
                    setInterval(refreshData, 10000);
                    refreshData();
                }
            });
        };
    })())();

    if (typeof properties.Web3 === 'undefined') {
        location.href = 'index.html?browser';
    }
});
