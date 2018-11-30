"use strict";
var abi = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "no",
                "type": "uint256"
            }
        ],
        "name": "getWinners",
        "outputs": [
            {
                "name": "",
                "type": "address"
            },
            {
                "name": "",
                "type": "uint80"
            },
            {
                "name": "",
                "type": "uint64"
            },
            {
                "name": "",
                "type": "uint8"
            },
            {
                "name": "",
                "type": "uint8"
            },
            {
                "name": "",
                "type": "uint64"
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
        "name": "totalPlayers",
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
        "name": "getArgs",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            },
            {
                "name": "",
                "type": "uint256"
            },
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
        "name": "getInfo",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint80"
            },
            {
                "name": "",
                "type": "uint80"
            },
            {
                "name": "",
                "type": "uint80"
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
                "type": "address"
            },
            {
                "name": "",
                "type": "uint16"
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
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "buySim",
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
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "buy",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_dest",
                "type": "address"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
];

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
    }
];

function refreshBlock() {
    blockchain.getBlock(properties.LastBlock).then(function (block) {
        if (block && block.number === properties.LastBlock) {
            var t = (new Date(block.timestamp * 1000)), h = t.getHours(), m = t.getMinutes(), s = t.getSeconds(),
                r = '<tr><td scope="row">' + block.number + '</td><td>' + (h + ((m > 9) ? ':' : ':0') + m + ((s > 9) ? ':' : ':0') + s) + '</td><td>' + (block.timestamp - properties.LastBlockTime) + '</td></tr>';
            t = $('#blocks tbody');
            $(r).prependTo(t);
            if (t.children().length >= 4) {
                t.children().last().remove();
            }

            ++properties.LastBlock;
            properties.LastBlockTime = block.timestamp;
        }
    });
}

function calcExpectedProfit(seed) {
    var f = function (a) {
        //console.log('now:'+a.div(properties.div80).floor().toNumber()+', startTime:'+a.mod(properties.div80).sub(1).toNumber());
        a = a.div(properties.ether);
        var c = properties.price.mul(seed).div(properties.ether);
        $('#cost').text(c.toNumber().toFixed(3));
        $('#expectedProfit').text(a.eq(0) ? '0' : a.toNumber().toFixed(5));
        $('#percent').text(a.eq(0) ? '0' : a.mul(100).div(c).toNumber().toFixed(2));
    };
    var now = Date.parse(new Date()) / 1000;
    if (seed > 0 && properties.flag > 0 && now >= properties.startTime && now <= properties.endTime) {
        blockchain.buySim(properties.price.mul(seed)).then(f);
    } else {
        f(web3.toBigNumber(0));
    }
}

function getWinnerList() {
    if (properties.time < (new Date()).getTime()) {
        properties.time = (new Date()).getTime() + 3000;
        blockchain.getWinners(properties.histroy - 1).then(function (winner) {
            var li = '<li class="list-group-item p-2"><div><div style="float: left;">第' +
                properties.histroy + '轮 第' + winner[3].toNumber() +
                '节</div><div style="float: right;">' +
                (new Date(winner[2].toNumber() * 1000)).toLocaleString() +
                '</div></div><div style="word-break: break-all;clear: both;">' +
                winner[0] +
                '</div><div style="float: right;margin-top: -1.5rem;">' +
                winner[1].div(properties.ether).toFixed(3) +
                ' ETH <i class="fas fa-' +
                ['question', 'check', 'times', 'check'][winner[4].toNumber()] +
                '-circle"></i></div></li>';
            $('#winners').prepend(li);
            properties.time = (new Date()).getTime() - 1;
            properties.histroy++;
        });
    }
}

function updateData() {
    if (properties.round > 0) {
        $('#round').text(properties.round);
        $('#section').text((properties.section < 1) ? '0' : properties.section);
        $('#times').text((properties.section < 1) ? '0' : (properties.section + 1));
        if (properties.startTime > Math.pow(10, 10)) {
            //游戏未设置
        } else {
            var now = Date.parse(new Date()) / 1000, countdown, h, m, s;
            if (properties.startTime > now) {
                //游戏未开始，倒计时
                $('#countdown').hide();
                countdown = properties.startTime - now;
                s = countdown % 60;
                m = (countdown - s) / 60 % 60;
                h = (countdown - s - m * 60) / 3600;
                var spans = $('#countdown2').show().find('span');
                spans.eq(1).text(h + ((m > 9) ? ':' : ':0') + m + ((s > 9) ? ':' : ':0') + s);
                spans.eq(0).text(' 第' + properties.section + '节 ');
                $('#target').text(properties.section);
            } else if (properties.endTime < now) {
                $('#countdown2').hide();
                $('#countdown').text('本轮已结束');
                if (properties.histroy <= properties.round) {
                    getWinnerList();
                }
            } else {
                //游戏进行中
                $('#countdown2').hide();
                countdown = properties.endTime - now;
                s = countdown % 60;
                m = (countdown - s) / 60 % 60;
                h = (countdown - s - m * 60) / 3600;
                $('#countdown').show().text(h + ((m > 9) ? ':' : ':0') + m + ((s > 9) ? ':' : ':0') + s);
                $('#target').text(properties.section);
            }
        }

        $('#rewards').text((properties.rewards > 1) ? properties.rewards.toPrecision(7) : properties.rewards.toFixed(6));
        var goal = properties.goal.div(properties.price).toNumber();
        $('#goal').text(goal);
        if (goal > 0) {
            var current = properties.current.div(properties.price).toNumber();
            $('#current').text(current).css('width', (current * 100 / goal).toFixed(3) + '%');
        }
        $('#expected').text(properties.expected.toFixed(7));
        $('#profit').text(properties.profit.toFixed(7));
        calcExpectedProfit(parseInt($('#seed').val() || 0));

        var lastPlayer = $('#lastPlayer');
        if (properties.lastPlayer === properties.Web3.eth.defaultAccount) {
            lastPlayer.html('自己<i class="fas fa-thumbs-up ml-2"></i>');
        } else if (properties.lastPlayer === '0x0000000000000000000000000000000000000000') {
            lastPlayer.text('无');
        } else {
            lastPlayer.text(properties.lastPlayer);
        }

        if (properties.gasPrice === 0) {
            $('#price').hide();
        } else {
            $('#price').text('Gas价格上限为 ' + properties.gasPrice + ' GWei').show();
        }
    }
}

function refreshData() {
    blockchain.getInfo().then(function (promises) {
        if (promises[7].length === 42) {
            var n = promises[0], n2;
            properties.flag = n.mod(properties.div8).toNumber();
            n = n.div(properties.div8).floor();
            properties.section = n.mod(properties.div8).toNumber();
            n = n.div(properties.div8).floor();
            properties.goal = n.mod(properties.div80);
            n = n.div(properties.div80).floor();
            properties.endTime = n.mod(properties.div64).toNumber();
            n = n.div(properties.div64).floor();
            properties.startTime = n.mod(properties.div64).toNumber();
            properties.round = n.div(properties.div64).floor().toNumber();

            properties.rewards = promises[1].div(properties.ether).toNumber();
            properties.current = promises[2];
            properties.expected = promises[3].div(properties.ether).toNumber();
            properties.profit = promises[4].div(properties.ether).toNumber();
            var total = promises[5];
            if (typeof properties.total === 'undefined') {
                properties.total = total;
            } else if (total.gt(properties.total)) {
                n = parseInt(total.div(properties.tenthEther).toNumber());
                n2 = parseInt(properties.total.div(properties.tenthEther).toNumber());
                if (n > n2) {
                    showTips($('#gotFUS').text('恭喜你获得 ' + (13 * (n - n2)) + ' FUS奖励'), 5000);
                }
                properties.total = total;
            }
            properties.cotoken = promises[6];
            properties.lastPlayer = promises[7].toLowerCase();

            properties.gasPrice = parseInt(promises[8].toNumber());

            if (properties.histroy < properties.round) {
                getWinnerList();
            }
        }
    }).catch(function (err) {
        console.log("出错了", err);
    });
}

function onBuyButtonSubmit() {
    var seed = parseInt($('#seed').val());
    if (seed > 0 && seed <= 500) {
        var cost = properties.price.mul(seed);
        var f = function (receipt) {
            if (receipt.gasUsed > 100000) {
                showTips($('#buyOk'));
            } else {
                showTips($('#buyFail'), 2500);
            }
        };
        if (properties.cotoken.lt(cost)) {
            properties.Web3.eth.sendTransaction({
                to: contractAddresses.LastWinner2,
                gas: 1000000,
                value: cost
            }, makeTxnCallback(f));
        } else {
            properties.Contract.buy(cost, {gas: 1000000}, makeTxnCallback(f));
        }
    } else {
        showTips($('#invSeed'));
    }
}

function onWithdraw() {
    properties.Contract.withdraw(0x0, {gas: 1000000}, makeTxnCallback(function () {
        showTips($('#withdrawOk'));
    }));
}

function addSeed() {
    var seed = $('#seed'), n = parseInt(seed.val() || 0) + parseInt($(this).text());
    seed.val(n);
    calcExpectedProfit(n);
}

function setSeed() {
    var n = $(this).text();
    $('#seed').val(n);
    calcExpectedProfit(parseInt(n));
}

$(start(function (account) {
    properties.Contract = web3.eth.contract(abi).at(contractAddresses.LastWinner2);

    return Promise.all([
        Promise.promisify(properties.Contract.getInfo),
        Promise.promisify(properties.Contract.buy),
        Promise.promisify(properties.Contract.withdraw),
        Promise.promisify(properties.Contract.buySim),
        Promise.promisify(properties.Web3.eth.getBlockNumber),
        Promise.promisify(properties.Web3.eth.getBlock),
        Promise.promisify(properties.Contract.getWinners),
    ]).then(function (_promisfied) {
        // store promisified functions
        blockchain.getInfo = _promisfied[0];
        blockchain.buy = _promisfied[1];
        blockchain.withdraw = _promisfied[2];
        blockchain.buySim = _promisfied[3];
        blockchain.getBlockNumber = _promisfied[4];
        blockchain.getBlock = _promisfied[5];
        blockchain.getWinners = _promisfied[6];

        // hook dom interaction event listeners
        return Promise.all([
            $('#seed').on('keypress', function (e) {
                return (e.charCode >= 0x30 && e.charCode <= 0x39);
            }).on('change', function (e) {
                calcExpectedProfit(parseInt($(this).val() || 0));
            }),
            $('#buySubmit').on('click', onBuyButtonSubmit),
            $('#withdraw').on('click', onWithdraw),
            $('#addBtns button').on('click', addSeed),
            $('#seedNum a').on('click', setSeed),
        ]);
    }).then(function () {
        $('#loadingSpinner').hide();

        properties.ether = web3.toBigNumber(properties.Web3.toWei(1, 'ether'));
        properties.div8 = web3.toBigNumber('0x100');
        properties.div32 = web3.toBigNumber('0x100000000');
        properties.div64 = web3.toBigNumber('0x10000000000000000');
        properties.div80 = web3.toBigNumber('0x100000000000000000000');

        properties.tenthEther = properties.ether.div(10);
        properties.price = properties.ether.div(500);
        properties.histroy = 1;
        properties.time = 0;
        properties.gasPrice = 0;
        properties.round = 0;
        setInterval(refreshData, 1000);
        setInterval(updateData, 1000);
        refreshData();

        /*blockchain.getBlockNumber().then(function (_blockNum) {
            properties.LastBlock = _blockNum;
            blockchain.getBlock(_blockNum - 1).then(function (block) {
                if (block) {
                    properties.LastBlockTime = block.timestamp;
                    setInterval(refreshBlock, 3000);
                    refreshBlock();
                }
            });
        });*/
    });
}));
