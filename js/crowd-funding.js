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
        "name": "lastError",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
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
                "type": "uint32"
            },
            {
                "name": "",
                "type": "uint64"
            },
            {
                "name": "",
                "type": "uint32"
            },
            {
                "name": "",
                "type": "int32"
            },
            {
                "name": "",
                "type": "uint16"
            },
            {
                "name": "",
                "type": "uint16"
            },
            {
                "name": "",
                "type": "uint24"
            },
            {
                "name": "",
                "type": "bool"
            },
            {
                "name": "",
                "type": "uint32"
            },
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
        "inputs": [],
        "name": "getInfoShort",
        "outputs": [
            {
                "name": "",
                "type": "uint32"
            },
            {
                "name": "",
                "type": "uint64"
            },
            {
                "name": "",
                "type": "uint32"
            },
            {
                "name": "",
                "type": "int32"
            },
            {
                "name": "",
                "type": "uint16"
            },
            {
                "name": "",
                "type": "uint16"
            },
            {
                "name": "",
                "type": "uint24"
            },
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
                "name": "_coin",
                "type": "uint24"
            }
        ],
        "name": "funding",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

var properties = {
    'Contract': null,
    'LastBlock': 0,
    'NewBlock': 0,
    'processedTxs': {},
    'conversationRates': {}
};

var blockchain = {};

var info = {};

function setInfo(promises) {
    info.totalCCoin = promises[0];
    info.nextTime = promises[1];
    info.interval = promises[2];
    info.times = promises[3];
    info.currentNumber = promises[4];
    info.numberPerTime = promises[5];
    info.coinPerAccount = promises[6];
    info.running = promises[7];
    if (promises.length > 8) {
        $('#info').removeClass('over').removeClass('finished');
        info.myFundingCoins = promises[8];
        info.isAllow = promises[9];
    }

    $('#totalCCoin').text(info.totalCCoin);
    $('#currentNumber').text(info.currentNumber);
    $('#coinPerAccount').text(info.coinPerAccount);
    $('#CCoinCount').attr('max', info.coinPerAccount);
    if (info.myFundingCoins > 0) {
        if (properties.waitingResult) delete properties.waitingResult;
        $('#info').addClass('over');
        $('#info .closed').text('恭喜，你已众筹成功，获得' + info.myFundingCoins.div(10) + '枚FUS！');
        $('#funding').hide();
    } else {
        var now = Date.parse(new Date()) / 1000;
        while (now > info.nextTime) {
            if (info.times < 0) break;
            info.running = true;
            info.times -= 1;
            info.nextTime = info.nextTime.add(info.interval);
            info.currentNumber = 0;
        }
        if (info.times < 0) {
            $('#info').addClass('over');
            if (now > info.nextTime) $('#info .closed').text('众筹已结束');
        } else if (!info.running) {
            $('#info').addClass('over');
        } else if (info.currentNumber < info.numberPerTime) {
            $('#left').text(info.numberPerTime - info.currentNumber);
            $('#info').removeClass('finished');
        } else {
            $('#info').addClass('finished');
            var n = info.nextTime - now;
            var s = n % 60;
            var m = ((n - s) / 60) % 60;
            var h = ((n - s) / 60 - m) / 60;
            $('#waiting').text(h + ((m >= 10) ? ':' : ':0') + m + ((s >= 10) ? ':' : ':0') + s);
        }
    }
}

function refreshData() {
    if (properties.waitingResult) {
        blockchain.getInfo().then(setInfo);
    } else {
        blockchain.getInfoShort().then(setInfo);
    }
}

function onFundingButtonSubmit() {
    var coinCount = parseInt($('#CCoinCount').val());
    if (!coinCount || coinCount <= 0 || coinCount > info.coinPerAccount) {
        alertify.alert('无效的C币数量...');
        return;
    }

    properties.Contract.funding(coinCount, {gas:800000}, function (err, txHash) {
        if (err) {
            if (err !== 'cancelled') {
                alertify.error('发生错误，请查看控制台日志。');
                console.log('发生错误', err);
            }
        } else {
            alertify.logPosition('bottom left');
            alertify.log('请求已发出，请等待区块确认...');
            properties.waitingResult = true;
        }
    });
}

jQuery(function () {
    var loadingText = $('#loadingText').removeClass("d-none");

    function work() {
        properties.Web3.eth.defaultAccount = properties.Web3.eth.accounts[0];

        properties.Contract = web3.eth.contract(abi).at(contractAddresses.CrowdFunding);

        Promise.all([
            Promise.promisify(properties.Contract.funding),
            Promise.promisify(properties.Contract.getInfo),
            Promise.promisify(properties.Contract.getInfoShort),
            Promise.promisify(properties.Contract.lastError)
        ]).then(function (_promisfied) {
            // store promisified functions
            blockchain.funding = _promisfied[0];
            blockchain.getInfo = _promisfied[1];
            blockchain.getInfoShort = _promisfied[2];
            blockchain.lastError = _promisfied[3];

            // hook dom interaction event listeners
            return Promise.all([
                //blockchain.lastError(properties.Web3.eth.defaultAccount),
                $('input[type=number]').on('keypress', function (e) {
                    return (e.charCode >= 0x30 && e.charCode <= 0x39);
                }),
                jQuery(".funding button").on('click', onFundingButtonSubmit),
                jQuery("#address").text(properties.Web3.eth.defaultAccount)
            ]);
        }).then(function (promises) {
            //console.log(promises[0]);
            return blockchain.getInfo();
        }).then(function (promises) {
            setInfo(promises);
            if (info.isAllow) {
                jQuery('#loadingSpinner').hide();
                return setInterval(refreshData, 1000);
            } else {
                loadingText.removeClass("waiting").text("此账号未曾参与LastWinner(现在参与已无效)");
                return false;
            }
        }).catch(function (err) {
            console.log("出错了", err);
        });
    }

    if (typeof ethereum !== 'undefined') {
        properties.Web3 = new Web3(ethereum);
        var a;
        try {
            // Request account access if needed
            a = ethereum.enable();
        } catch (error) {
            a = undefined;
        }
        if (a) a.then(work);
    } else if (typeof web3 !== 'undefined') {
        properties.Web3 = new Web3(web3.currentProvider);
        work();
    } else {
        loadingText.removeClass("waiting")[0].innerHTML = "未能连接到MetaMask！<br>请安装MetaMask并登录后再刷新页面！";
    }
});
