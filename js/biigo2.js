"use strict";
var abi = [
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
        "name": "getSummary",
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
        "name": "getGames",
        "outputs": [
            {
                "name": "_games",
                "type": "uint256[13]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getMyHistories",
        "outputs": [
            {
                "name": "_histories",
                "type": "uint256[24]"
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
                "name": "_round",
                "type": "uint256"
            },
            {
                "name": "_pos",
                "type": "uint256"
            },
            {
                "name": "_no",
                "type": "uint256"
            }
        ],
        "name": "getGameHistory",
        "outputs": [
            {
                "name": "_result",
                "type": "uint256[10]"
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
            },
            {
                "name": "_no",
                "type": "uint256"
            },
            {
                "name": "_autoSelect",
                "type": "bool"
            },
            {
                "name": "_cleanNo",
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
    {
        "constant": true,
        "inputs": [],
        "name": "canAddOldSpent",
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
        "inputs": [],
        "name": "addOldSpent",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

function addEmployee() {
    var employee = $('#employee'), n = parseInt(employee.val() || 0) + parseInt($(this).text());
    employee.val(n);
    $('#cost').text(n / 100);
}

function setEmployee() {
    var n = $(this).text();
    $('#employee').val(n);
    $('#cost').text(parseInt(n) / 100);
}

function onWithdraw() {
    properties.Contract.withdraw(0x0, {gas: 1000000}, makeTxnCallback(function () {
        showTips($('#withdrawOk'));
    }));
}

function Mine(no, data) {
    this.no = no;
    this.playerCount = data.mod(properties.bn2p16).toNumber();
    data = data.div(properties.bn2p16).floor();
    this.blockNumber = data.mod(properties.bn2p48).toNumber();
    data = data.div(properties.bn2p48).floor();
    this.current = data.mod(properties.bn2p16).toNumber();
    this.round = data.div(properties.bn2p16).floor().toNumber();

    this.full = (this.current >= ((no < 6) ? 5000 : 2000));
    this.drawable = (this.blockNumber > 0 && properties.blockNumber >= this.blockNumber + ((no < 6) ? 3 : 2));
    if (this.drawable && this.current === 0) {
        this.drawable = false;
        if (this.round < properties.round) {
            this.blockNumber = 0;
            this.round = properties.round;
        } else {
            this.discarded = true;
        }
    }
}

function getSummaryFunc() {
    var next = 0;
    return function (force) {
        var now = (new Date()).getTime();
        if (force === true || now >= next) {
            next = now + 1000;
            blockchain.getSummary().then(function (promises) {
                next = (new Date()).getTime() + 5000;
                //(block.number, status.round, status.nextTime, isCheckCleaner, totalBonus[SafeMath.hash(msg.sender)], cleaners[msg.sender], coToken(coTokenAddress).balanceOf(msg.sender));
                var blockNumber = promises[0].toNumber();
                if (blockNumber > properties.blockNumber) {
                    properties.blockNumber = blockNumber;
                    properties.round = promises[1].toNumber();
                    properties.nextTime = promises[2].div(properties.bn2p64).floor().toNumber();
                    properties.refillInterval = promises[2].mod(properties.bn2p64).toNumber();
                    properties.rewards = promises[3];
                    properties.totalClean = promises[4].div(properties.bn2p32).floor().toNumber();
                    properties.unpaidClean = promises[4].mod(properties.bn2p32).toNumber();
                    properties.cotoken = promises[5];

                    if (properties.round > 0) {
                        blockchain.getGames().then(function (mines) {
                            var round = mines[12].div(properties.bn2p48).floor().toNumber(),
                                blockNumber = mines[12].mod(properties.bn2p48).toNumber(), i;
                            mines.length = 12;
                            if (blockNumber >= properties.blockNumber) {
                                for (i = 0; i < 12; ++i) {
                                    mines[i] = new Mine(i, mines[i]);
                                }
                                properties.mines = mines;
                            }
                        });
                        if (properties.histories === null) {
                            getMyHistories();
                        }
                    }
                    if (properties.updateViewId === null) {
                        properties.updateViewId = setInterval(updateView, 1000);
                    }
                }
            });
        }
    };
}

function _inSameHour() {
    if (properties.histories && properties.histories.length >= 2) {
        var now = new Date(), h = now.getHours(), s = now.toDateString();
        var t = new Date(properties.histories[0].time * 1000);
        if (t.getHours() === h && t.toDateString() === s) {
            t = new Date(properties.histories[1].time * 1000);
            if (t.getHours() === h && t.toDateString() === s) {
                return true;
            }
        }
    }
    return false;
}

function onMineSelected(e) {
    var target = $(e.currentTarget);
    if (target.hasClass('full')) {
        alertify.alert('此矿洞里已满员！');
    } else if (target.hasClass('discarded')) {
        alertify.alert('此矿洞已废弃！');
    } else if (target.hasClass('joined')) {
        alertify.alert('矿洞里已有您的矿工了。');
    } else if (_inSameHour()) {
        alertify.alert('本小时您已经雇佣过两批矿工了');
    } else {
        var no = parseInt(target.text());
        $('#mine_no').text(no);
        $('#mine_type').text((no > 6) ? '金银' : '宝石');
        $('#employee').val('');
        var drawable = $('#mines .drawable'), clean = $('#clean');
        if (drawable.length === 0) {
            clean.prop('checked', false).parent().hide();
        } else {
            clean.prop('checked', true).parent().show();
            $('#clean_no').text(parseInt(drawable.text()));
        }
        $('#HireModal').modal('show');
    }
}

function onConfirmButtonSubmit() {
    var seed = parseInt($('#employee').val());
    if (seed > 0 && seed <= 100) {
        var hole = parseInt($('#mine_no').text()) - 1;
        var autoSelect = $('#autoSelect').is(':checked');
        var cost = properties.price.mul(seed);
        var cleanNo = $('#clean').is(':checked') ? (parseInt($('#clean_no').text()) - 1) : 12;
        var gas = (cleanNo === 12) ? 1000000 : 2000000;

        var f = function (receipt) {
            if (receipt.gasUsed > 100000) {
                getMyHistories();
                $('#HireModal').modal('hide');
                alertify.alert('雇佣成功');
            } else {
                alertify.alert('雇佣失败！<br>资金返还到coToken中。');
            }
        };
        if (properties.cotoken.lt(cost)) {
            properties.Contract.buy(0, hole, autoSelect, cleanNo, {gas: gas, value: cost}, makeTxnCallback(f));
        } else {
            properties.Contract.buy(cost, hole, autoSelect, cleanNo, {gas: gas}, makeTxnCallback(f));
        }
    } else {
        showTips($('#invNumber'));
    }
}

function LuckyMan(packed) {
    this.to = packed.mod(properties.bn2p16).toNumber() - 1;
    this.from = packed.div(properties.bn2p16).floor().mod(properties.bn2p16).toNumber();
    this.player = '0x' + ('0000000000000000000000000000000000000000' + packed.div(properties.bn2p32).floor().toString(16)).substr(-40);
}

function HoleHistory(no, packed) {
    this.no = no;
    var p = packed[9];
    this.current = p.div(properties.bn2p64).floor().toNumber();
    this.blockNumber = p.div(properties.bn2p16).floor().mod(properties.bn2p48).toNumber();
    this.playerCount = p.mod(properties.bn2p16).toNumber();
    var luckyMen = [], arr, i, j, n = (no < 6) ? 3 : 2;
    for (j = 0; j < n; ++j) {
        arr = [];
        for (i = 0; i < 3; ++i) {
            arr.push(new LuckyMan(packed[i + j * 3]));
        }
        luckyMen.push(arr);
    }
    this.luckyMen = luckyMen;
}

function showMineHistory(e) {
    var history = $(e.currentTarget).data('history');
    var no = history.no, mine;

    mine = properties.mines[no];
    if (mine.round > history.round || (history.round === mine.round && mine.discarded)) {
        blockchain.getGameHistory(history.round, history.pos, no).then(function (promises) {
            if (promises.length === 10 && promises[9].gt(0)) {
                var history = new HoleHistory(no, promises), d = $('#details');
                var s = d.find('>h3 span');
                s.eq(0).text(no + 1);
                s.eq(1).text((no < 6) ? '宝石' : '金银');
                s = d.find('>div span');
                s.eq(0).text(history.playerCount);
                s.eq(1).text(history.current);
                s.eq(2).text(history.blockNumber - 1);

                var total = (history.current / 100 * 0.91 - ((no < 6) ? 3.2 : 1.7)) / 10;

                d.find('>table').remove();
                $('#DetailsModal').modal('show');

                var types = (no < 6) ? ['水晶', '宝石', '钻石'] : ['白银', '黄金'];
                var percent = (no < 6) ? [1, 3, 6] : [3, 7];
                var n = types.length, i, tbl, luckyMen;
                for (i = 0; i < n; ++i) {
                    luckyMen = history.luckyMen[i];

                    tbl = $('<table class="table table-sm table-bordered text-center"><thead class="thead-light">' +
                        '<tr><th>奖励类型</th><th>挖出区块</th><th>幸运矿工数</th><th>总收益(ETH)</th></tr>' +
                        '<tr><th></th><th></th><th></th><th></th></tr>' +
                        '<tr><th colspan="4">区块散列值 (k0)</th></tr><tr><th colspan="4" style="font-size: small;"></th></tr>' +
                        '</thead><tbody><tr><td colspan="4"></td></tr></tbody></table>').appendTo(d);

                    s = tbl.find('th');
                    s.eq(4).text(types[i]);
                    s.eq(5).text(history.blockNumber + 1 + i);
                    s.eq(7).text((total * percent[i]).toPrecision(6));

                    blockchain.getBlock(history.blockNumber + 1 + i).then(function (block) {
                        var i = block.number - history.blockNumber - 1, hash = block.hash;
                        var tbl = d.find('>table').eq(i);
                        var s = tbl.find('th');
                        var luckyMen = history.luckyMen[i];
                        var total2 = luckyMen[0].to - luckyMen[0].from + luckyMen[1].to - luckyMen[1].from + luckyMen[2].to - luckyMen[2].from + 3;
                        s.eq(6).text(total2);
                        s.eq(9).text(hash);
                        var td = tbl.find('td'), t, j = 0, man, n, k;

                        for (t = 1; j < 3; ++t) {
                            tbl = $('<table class="table table-sm table-bordered text-center table-striped"><tbody>' +
                                '<tr><td scope="col">#</td><td scope="col" colspan="3">散列值 (k' + t + '=Keccak256(k' + (t - 1) + '))</td></tr>' +
                                '<tr><td></td><td colspan="3" style="font-size: .9rem;"></td></tr>' +
                                '<tr><td scope="col">幸运数字</td><td scope="col" colspan="3">幸运玩家</td></tr>' +
                                '<tr><td></td><td colspan="3"></td></tr>' +
                                '<tr><td scope="col">矿工数量</td><td scope="col" colspan="2">矿工编号</td><td scope="col">收益(ETH)</td></tr>' +
                                '<tr><td></td><td colspan="2"></td><td></td></tr>' +
                                '</tbody></table>').appendTo(td);

                            s = tbl.find('td');
                            s.eq(2).text(t);
                            hash = web3.sha3(hash, {encoding: 'hex'});
                            s.eq(3).text(hash);
                            n = web3.toBigNumber(hash).mod(history.current).toNumber();
                            s.eq(6).text(n);
                            for (k = 0; k < 3; ++k) {
                                man = luckyMen[k];
                                if (n >= man.from && n <= man.to) {
                                    s.eq(7).text(man.player);
                                    s.eq(11).text(man.to - man.from + 1);
                                    s.eq(12).text((man.from === man.to) ? man.from : ('从 ' + man.from + ' 到 ' + man.to));
                                    if (k < j) {
                                        s.eq(13).text('已是幸运矿工，此次忽略');
                                    } else {
                                        ++j;
                                        s.eq(13).text(((total * percent[i]) / total2 * (man.to - man.from + 1)).toPrecision(6));
                                    }
                                    break;
                                }
                            }
                        }
                    });
                }

            } else {
                alertify.alert('未能获得记录！<br>请确认该矿洞已开挖并完成搬运，并在24轮以内。');
            }
        });
    } else {
        alertify.alert('该矿洞在开挖中……');
    }
}

function History(data, first) {
    this.round = data.div(properties.bn2p216).floor().toNumber();
    if (first) {
        this.rewards = data.mod(properties.bn2p8).div(properties.bn2p4).floor().toNumber();
        data = data.div(properties.bn2p112).floor();
    } else {
        this.rewards = data.mod(properties.bn2p4).toNumber();
        data = data.div(properties.bn2p8).floor();
    }
    this.n = data.mod(properties.bn2p8).toNumber();
    data = data.div(properties.bn2p8).floor();
    this.from = data.mod(properties.bn2p16).toNumber();
    data = data.div(properties.bn2p16).floor();
    this.no = data.mod(properties.bn2p8).toNumber();
    data = data.div(properties.bn2p8).floor();
    this.pos = data.mod(properties.bn2p8).toNumber();
    data = data.div(properties.bn2p8).floor();
    this.time = data.mod(properties.bn2p64).toNumber();
    this.to = this.from + this.n - 1;
}

function getMyHistories() {
    blockchain.getMyHistories().then(function (histories) {
        var i, arr = [];
        for (i = 0; i < 24; ++i) {
            arr.push(new History(histories[i], true));
            arr.push(new History(histories[i], false));
        }
        arr.sort(function (a, b) {
            if (a.time === b.time) return 0;
            return (a.time > b.time) ? -1 : 1;
        });
        properties.histories = arr;
    });
}

function updateView() {
    var now = Math.floor((new Date()).getTime() / 1000), countDown = $('#countdown');
    if (now >= properties.nextTime) {
        if (properties.round === 0) {
            countDown.remove();
            properties.getSummary(true);
        }
        properties.round++;
        properties.nextTime += properties.refillInterval;
    }

    $('#rewards').text(properties.rewards.div(properties.ether).toPrecision(7));
    $('#pay').text(properties.unpaidClean * 0.2);

    if (properties.round === 0) {
        var deta = properties.nextTime - now;
        var s = deta % 60;
        deta = (deta - s) / 60;
        var m = deta % 60;
        deta = (deta - m) / 60;
        countDown.removeClass('d-none').find('span').text(deta + ((m > 9) ? ':' : ':0') + m + ((s > 9) ? ':' : ':0') + s);
    } else {
        $('#next span').text((new Date(properties.nextTime * 1000)).toLocaleString());
    }

    var i, j, history;
    if (properties.mines.length > 0) {
        for (i = 0; i < 12; ++i) {
            var e = $('#mines .mine').eq(i), mine = properties.mines[i], bar = e.find('.progress-bar'),
                total = (i < 6) ? 5000 : 2000;
            bar.css('width', Math.round(mine.current * 100 / total) + '%').attr('aria-valuenow', mine.current).text(mine.current + '/' + total);
            e.removeClass('full drawable discarded join');
            if (mine.full) {
                e.addClass('full');
            }
            if (mine.drawable) {
                e.addClass('drawable');
            }
            if (mine.discarded) {
                e.addClass('discarded');
            }

            if (properties.histories) {
                for (j = 0; j < 48; ++j) {
                    history = properties.histories[j];
                    if (history.round < mine.round) {
                        break;
                    } else if (mine.round > 0 && history.no === mine.no) {
                        e.addClass('joined');
                        break;
                    }
                }
            }
        }
    }

    if (properties.histories && properties.histories[0].round > 0) {
        $('#never_mined').hide();
        var h = $('#history').empty();

        for (i = 0; i < 48; ++i) {
            history = properties.histories[i];
            if (history.time > 0) {
                mine = properties.mines[history.no];
                if (mine.round > history.round || (history.round === mine.round && mine.discarded)) {
                    var rewards = history.rewards;
                    if (rewards > 0) {
                        s = [];
                        if (history.no < 6) {
                            if (rewards >= 4) {
                                s.push('钻石');
                                rewards -= 4;
                            }
                            if (rewards >= 2) {
                                s.push('宝石');
                                rewards -= 2;
                            }
                            if (rewards >= 1) {
                                s.push('水晶');
                                rewards -= 1;
                            }
                        } else {
                            if (rewards >= 2) {
                                s.push('黄金');
                                rewards -= 2;
                            }
                            if (rewards >= 1) {
                                s.push('白银');
                                rewards -= 1;
                            }
                        }
                        s = s.join('、');
                    } else {
                        s = '没有收获';
                    }
                } else {
                    s = '开挖中……';
                }
                s = '<div><div style="float: left;">' + (new Date(history.time * 1000)).toLocaleString() + '</div><div style="float: right;">' + (history.no + 1) + '号' + ((history.no < 6) ? '宝石' : '金银') + '矿</div></div><br><div><div style="float: left;">矿工编号' + ((history.n === 1) ? history.from : ('从' + history.from + '到' + history.to)) + '</div><div style="float: right;">' + s + '</div></div>';
                $('<a class="list-group-item list-group-item-action mb-1"></a>').appendTo(h).html(s).data('history', history);
            }
        }
    }
}

function checkOldSpent() {
    blockchain.canAddOldSpent().then(function (b) {
        if (b) {
            alertify.confirm('您在旧版Biigo中有累积奖励，可导入到本版Biigo中，并获得与旧版Biigo奖励数量相同的FUS。<br><br>点击确定进行导入，点击取消暂不导入。<br><br><b>警告：在本版Biigo中消费满0.1ETH后，会失去导入资格，因此强烈建议您马上进行导入！</b>', function () {
                properties.Contract.addOldSpent({gas: 1000000}, makeTxnCallback(function () {
                    blockchain.canAddOldSpent().then(function (b) {
                        if (b) {
                            alertify.alert('导入失败！');
                        } else {
                            alertify.alert('导入成功，非常感谢您的支持！');
                        }
                    });
                }));
            });
        }
    });
}

$(start(function (account) {
    properties.Contract = web3.eth.contract(abi).at(contractAddresses.Biigo2);

    return Promise.all([
        Promise.promisify(properties.Contract.getSummary),
        Promise.promisify(properties.Contract.getGames),
        Promise.promisify(properties.Contract.getMyHistories),
        Promise.promisify(properties.Contract.getGameHistory),
        Promise.promisify(properties.Contract.buy),
        Promise.promisify(properties.Contract.withdraw),
        Promise.promisify(properties.Contract.canAddOldSpent),
        Promise.promisify(properties.Contract.addOldSpent),
        Promise.promisify(properties.Web3.eth.getBlock),
    ]).then(function (_promisfied) {
        // hook dom interaction event listeners
        blockchain.getSummary = _promisfied[0];
        blockchain.getGames = _promisfied[1];
        blockchain.getMyHistories = _promisfied[2];
        blockchain.getGameHistory = _promisfied[3];
        blockchain.buy = _promisfied[4];
        blockchain.withdraw = _promisfied[5];
        blockchain.canAddOldSpent = _promisfied[6];
        blockchain.addOldSpent = _promisfied[7];
        blockchain.getBlock = _promisfied[8];

        return Promise.all([
            $('#employee').on('keypress', function (e) {
                return (e.charCode >= 0x30 && e.charCode <= 0x39);
            }),
            $('#mines').on('click', '>div>div', onMineSelected),
            $('#withdraw').on('click', onWithdraw),
            $('#addBtns button').on('click', addEmployee),
            $('#employeeNum a').on('click', setEmployee),
            $('#confirm').on('click', onConfirmButtonSubmit),
            $('#history').on('click', 'a', showMineHistory),
        ]);
    }).then(function () {
        $('#loadingSpinner').hide();

		if (typeof coToken !== "undefined" && typeof coToken.setRotatable !== "undefined") {
			coToken.setRotatable(false);
            $('#DetailsModal').on('show.bs.modal', function () {
                coToken.setRotatable(true);
            }).on('hide.bs.modal', function () {
                coToken.setRotatable(false);
            });
        }
        
        properties.ether = web3.toBigNumber(properties.Web3.toWei(1, 'ether'));
        properties.bn2 = web3.toBigNumber('2');
        properties.bn2p4 = properties.bn2.pow(4);
        properties.bn2p8 = properties.bn2.pow(8);
        properties.bn2p16 = properties.bn2.pow(16);
        //properties.bn2p17 = properties.bn2.pow(17);
        //properties.bn2p24 = properties.bn2.pow(24);
        properties.bn2p32 = properties.bn2.pow(32);
        //properties.bn2p40 = properties.bn2.pow(40);
        properties.bn2p48 = properties.bn2.pow(48);
        properties.bn2p64 = properties.bn2.pow(64);
        //properties.bn2p104 = properties.bn2.pow(104);
        properties.bn2p112 = properties.bn2.pow(112);
        properties.bn2p216 = properties.bn2.pow(216);
        //properties.InvalidGame = web3.toBigNumber('0xffff0000');
        properties.InvalidTime = Math.pow(10, 18);

        properties.blockNumber = 0;
        properties.round = 0;
        properties.histories = null;
        properties.mines = [];
        properties.nextTime = web3.toBigNumber(properties.InvalidTime);
        properties.totalClean = 0;
        properties.unpaidClean = 0;
        properties.price = properties.ether.div(100);
        properties.updateGamesId = null;
        properties.updateViewId = null;

        checkOldSpent();
        properties.getSummary = getSummaryFunc();
        setInterval(properties.getSummary, 1000);
        properties.getSummary();
    });
}));