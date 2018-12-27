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
        "constant": false,
        "inputs": [
            {
                "name": "_amount",
                "type": "uint256"
            },
            {
                "name": "_no",
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
        "constant": true,
        "inputs": [],
        "name": "isCheckCleaner",
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
                "name": "_no",
                "type": "uint256"
            },
            {
                "name": "_order",
                "type": "uint256"
            }
        ],
        "name": "clean",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
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
        "inputs": [
            {
                "name": "_n",
                "type": "uint256"
            }
        ],
        "name": "getGame",
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
                "name": "_n",
                "type": "uint256"
            }
        ],
        "name": "getGameHistories",
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

var viewerAbi = [
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
        "inputs": [
            {
                "name": "_id",
                "type": "uint256"
            }
        ],
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
            },
            {
                "name": "",
                "type": "uint256"
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
        "inputs": [
            {
                "name": "_games",
                "type": "uint256[10]"
            }
        ],
        "name": "getGamesStatus",
        "outputs": [
            {
                "name": "",
                "type": "uint256[10]"
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
                "name": "_id",
                "type": "uint256"
            },
            {
                "name": "_offset",
                "type": "uint256"
            }
        ],
        "name": "getValidGames",
        "outputs": [
            {
                "name": "_games",
                "type": "uint256[10]"
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
    }
];

function History(round, packed, rewards) {
    this.round = round.toNumber();
    this.time = packed.div(properties.bn2p64).floor().toNumber();
    var n = packed.div(properties.bn2p40).floor().mod(properties.bn2p24);
    this.pos = n.div(properties.bn2p17).floor().toNumber();
    n = n.mod(properties.bn2p17).toNumber();
    if (n >= properties.MaxCount) {
        this.no = n - properties.MaxCount;
        this.small = 1;
    } else {
        this.no = n;
        this.small = 0;
    }
    this.from = packed.div(properties.bn2p24).floor().mod(properties.bn2p16).toNumber();
    n = packed.div(properties.bn2p16).floor().mod(properties.bn2p8).toNumber();
    this.to = this.from + n - 1;
    this.order = packed.mod(properties.bn2p16).toNumber();
    this.rewards = rewards.toNumber();
}

function Mine(packed, small) {
    this.current = packed.mod(properties.bn2p16).toNumber();
    this.no = packed.div(properties.bn2p16).floor().mod(properties.bn2p16).toNumber();
    this.small = small;
    this.round = packed.div(properties.bn2p32).floor().mod(properties.bn2p32).toNumber();
    this.blockNumber = packed.div(properties.bn2p64).floor().toNumber();
}

function hasEmployeesIn(mine, clean) {
    if (clean && properties.blockNumber < mine.blockNumber + (mine.small ? 2 : 3)) {
        return false;
    }
    var i, n = properties.histories.length, h;
    for (i = 0; i < n; ++i) {
        h = properties.histories[i];
        if (h.no === mine.no && h.small === mine.small && h.round >= mine.round) {
            return true;
        }
    }
    return false;
}

function _inSameHour() {
    if (properties.histories.length >= 2) {
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
    if (target.hasClass('available')) {
        if (hasEmployeesIn(target.data('mine'), false)) {
            alertify.alert('矿洞里已有您的矿工了。');
        } else if (_inSameHour()) {
            alertify.alert('本小时您已经雇佣过两批矿工了');
        } else {
            $('#mine_no').text(target.find('span').eq(0).text());
            $('#mine_type').text(properties.small ? '金银' : '宝石');
            $('#employee').val('');
            $('#HireModal').modal('show');
        }
    } else if (target.hasClass('cleanable')) {
        alertify.confirm('您要帮忙搬运宝贝吗？', function () {
            var no = parseInt(target.find('span').eq(0).text()) - 1, small = properties.small;
            if (properties.checkCleaner) {
                var round = target.data('mine').round, i, n = properties.histories.length, h;
                for (i = 0; i < n; ++i) {
                    h = properties.histories[i];
                    if (h.no === no && h.small === small && h.round >= round) {

                        properties.Contract.clean((small ? properties.MaxCount : 0) + no, h.order, {gas: 2000000}, makeTxnCallback(function () {
                            alertify.alert('感谢您的帮忙！');
                        }));
                        break;
                    }
                }
            } else {
                properties.Contract.clean((small ? properties.MaxCount : 0) + no, 0, {gas: 2000000}, makeTxnCallback(function () {
                    alertify.alert('感谢您的帮忙！');
                }));
            }
        });
    } else {
        alertify.alert('矿洞里已满员！');
    }
}

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

function getMyHistories() {
    blockchain.getMyHistories().then(function (promises) {
        var arr = [], i, h, p, r;
        for (i = 0; i < 24; ++i) {
            p = promises[i];
            r = p.div(properties.bn2p216).floor();
            h = new History(r, p.div(properties.bn2p112).floor().mod(properties.bn2p104), p.div(properties.bn2p4).floor().mod(properties.bn2p4));
            if (h.time > 0) arr.push(h);
            h = new History(r, p.div(properties.bn2p8).floor().mod(properties.bn2p104), p.mod(properties.bn2p4));
            if (h.time > 0) arr.push(h);
        }
        arr.sort(function (a, b) {
            if (a.time === b.time) return 0;
            return (a.time > b.time) ? -1 : 1;
        });
        properties.histories = arr;
    });
}

function getSummaryFunc() {
    var ts = 0;
    return function () {
        var ts2 = (new Date()).getTime();
        if (ts2 - ts >= 5000) {
            blockchain.getSummary(ts2).then(function (promises) {
                var ts2 = promises[0].toNumber();
                if (ts2 > ts) {
                    ts = ts2;
                    properties.limits = [promises[1].div(properties.bn2.pow(16)).floor().toNumber(), promises[1].mod(properties.bn2.pow(16)).toNumber()];
                    properties.nextTime = promises[2];
                    properties.validRewards = promises[3];
                    properties.totalClean = promises[4].div(properties.bn2.pow(32)).floor().toNumber();
                    var unpaid = promises[4].mod(properties.bn2.pow(32)).toNumber();
                    if (unpaid > properties.unpaidClean && properties.blockNumber > 0) {
                        alertify.alert('获得' + (0.1 * (unpaid - properties.unpaidClean)) + ' ETH报酬');
                    }
                    properties.unpaidClean = unpaid;
                    properties.cotoken = promises[5];
                    properties.blockNumber = promises[6].toNumber();
                    properties.checkCleaner = promises[7];
                    if (properties.mines[properties.small].length === 0 && properties.nextTime.lt(properties.InvalidTime)) {
                        properties.getValidGames();
                        if (properties.getHistoryId === null) {
                            properties.getHistoryId = setInterval(getMyHistories, 3000);
                        }
                    }
                }
            });
        }
    };
}

function _showMines(n) {
    if (n === 0) {
        $('#waiting').show().siblings().addClass('invisible');
        if (properties.getStatusId !== null) {
            clearInterval(properties.getStatusId);
            properties.getStatusId = null;
        }
        if (properties.countdownId === null) {
            properties.countdownId = setInterval(function () {
                var className = 'd-none';
                var h = properties.nextTime.toNumber() - Date.parse(new Date()) / 1000;
                if (h > 0) {
                    $('#countdown2').removeClass(className);
                    $('#searching').removeClass(className);
                    $('#found').addClass(className);
                    var s = h % 60;
                    h = (h - s) / 60;
                    var m = h % 60;
                    h = (h - m) / 60;
                    $('#countdown').text(h + ((m > 9) ? ':' : ':0') + m + ((s > 9) ? ':' : ':0') + s);
                } else {
                    $('#countdown2').addClass(className);
                    $('#searching').addClass(className);
                    $('#found').removeClass(className);
                }
            }, 1000);
        }
    } else {
        $('#waiting').hide().siblings().removeClass('invisible');
        if (properties.countdownId !== null) {
            clearInterval(properties.countdownId);
            properties.countdownId = null;
        }
        if (properties.getStatusId === null) {
            properties.getStatusId = setInterval(properties.getGamesStatus, 3000);
        }
    }
}

function getValidGamesFunc() {
    var id = [0, 0];
    return function () {
        blockchain.getValidGames(id[properties.small] * 2 + properties.small, properties.offset[properties.small]).then(function (promises) {
            var id2 = promises[9].toNumber();
            var small = id2 % 2;
            id2 = (id2 - small) / 2;
            if (id2 >= id[small]) {
                id[small] = id2 + 1;
                var arr = properties.mines[small], p;
                for (var i = 0; i < 9; ++i) {
                    p = promises[i];
                    if (!p.mod(properties.bn2p32).eq(properties.InvalidGame)) {
                        arr.push(new Mine(p, small));
                    }
                }
                var n = arr.length, j, no;
                for (i = 1; i < n; ++i) {
                    no = arr[i].no;
                    for (j = 0; j < i; ++j) {
                        if (no === arr[j].no) {
                            arr.splice(i, 1);
                            --i;
                            --n;
                        }
                    }
                }
                if (n > 9) arr.length = 9;
                properties.mines[small] = arr;

                _showMines(n);
            }
        });
    };
}

function onTypeSelected(e) {
    var tab = $($(e.target).attr('href'));
    $('#waiting').prependTo(tab);
    $('#specify').appendTo(tab);
    properties.small = $(e.target).closest('li').index();
    var n = properties.mines[properties.small].length;
    if (properties.nextTime.lt(properties.InvalidTime)) {
        _showMines(n);
        if (n === 0) {
            properties.getValidGames();
        }
    }
}

function getGamesStatusFunc() {
    var id = [0, 0];
    return function () {
        var arr = properties.mines[properties.small], arr2 = [], n = arr.length, i;
        for (i = 0; i < n; ++i) {
            arr2.push(web3.toBigNumber(arr[i].no).mul(properties.bn2p16));
        }
        for (; i < 9; ++i) {
            arr2.push(properties.InvalidGame);
        }
        arr2[9] = id[properties.small] * 2 + properties.small;
        blockchain.getGamesStatus(arr2).then(function (promises) {
            var id2 = promises[9].toNumber();
            var small = id2 % 2;
            id2 = (id2 - small) / 2;
            if (id2 >= id[small]) {
                id[small] = id2 + 1;
                var arr = [];
                for (var i = 0; i < 9; ++i) {
                    var p = promises[i];
                    if (!p.mod(properties.bn2p32).eq(properties.InvalidGame)) {
                        arr.push(new Mine(p, small));
                    }
                }
                properties.mines[small] = arr;
            }
        });
    };
}

function getRandom() {
    return Math.floor(Math.random() * 1000000);
}

function updateView() {
    var small = properties.small;
    var limit = properties.limits[small];
    var ipt = $('#no');
    if (limit > 0) {
        ipt.attr('max', limit).attr('placeholder', '1-' + limit).prop('disabled', false);
    } else {
        ipt.attr('placeholder', '0').prop('disabled', true);
    }
    var holes = $('#mine_holes').children().eq(small).children('div').children('div').addClass('invisible');
    var hrs = $('#mine_holes hr').addClass('invisible');
    var mines = properties.mines[small];
    var n = mines.length;
    var mine, hole, s;
    for (var i = 0; i < n; ++i) {
        if (i > 1 && i % 3 === 1) {
            hrs.eq((i - 1) / 3 - 1).removeClass('invisible');
        }
        mine = mines[i];
        hole = holes.eq(i).removeClass('invisible').data('mine', mine);
        s = hole.find('span');
        s.data('round', mine.round);
        s.eq(0).text(mine.no + 1);
        s.eq(1).text(mine.current);
        if (mine.current >= (mine.small ? 2000 : 5000)) {
            hole.addClass('dirty').removeClass('available');
            if (properties.blockNumber >= mine.blockNumber + (small ? 2 : 3) && (properties.checkCleaner === false || properties.blockNumber >= mine.blockNumber + 50 || hasEmployeesIn(mine, true))) {
                hole.addClass('cleanable');
            } else {
                hole.removeClass('cleanable');
            }
        } else {
            hole.addClass('available').removeClass('dirty cleanable');
        }
    }
    $('#rewards').text(properties.validRewards.add(properties.ether.div(10).mul(properties.unpaidClean)).div(properties.ether).toPrecision(7));
    n = properties.histories.length;
    if (n > 0) {
        $('#never_mined').hide();
        var h = $('#history').empty();
        for (i = 0; i < n; ++i) {
            mine = properties.histories[i];
            var rewards = mine.rewards;
            if (rewards > 0) {
                s = [];
                if (mine.small) {
                    if (rewards >= 2) {
                        s.push('黄金');
                        rewards -= 2;
                    }
                    if (rewards >= 1) {
                        s.push('白银');
                        rewards -= 1;
                    }
                } else {
                    if (rewards >= 4) {
                        s.push('钻石');
                        rewards -= 2;
                    }
                    if (rewards >= 2) {
                        s.push('宝石');
                        rewards -= 2;
                    }
                    if (rewards >= 1) {
                        s.push('水晶');
                        rewards -= 1;
                    }
                }
                s = s.join('、');
            } else {
                s = '未有收获';
            }
            s = '<div style="float: left; margin: .2rem;">' + (new Date(mine.time * 1000)).toLocaleString() + '</div><div style="float: left; margin: .2rem;">' + (mine.no + 1) + '号' + (mine.small ? '金银' : '宝石') + '矿</div><div style="float: left; margin: .2rem;">矿工号从' + mine.from + '到' + mine.to + '</div><div style="float: left; margin: .2rem;">' + s + '</div>';
            hole = $('<a class="list-group-item list-group-item-action mb-1"></a>').appendTo(h).html(s).data('mine', mine);
        }
    }
}

function onConfirmButtonSubmit() {
    var seed = parseInt($('#employee').val());
    if (seed > 0 && seed <= 100) {
        var cost = properties.price.mul(seed);
        var f = function (receipt) {
            if (receipt.gasUsed > 100000) {
                showTips($('#hireOk'));
            } else {
                showTips($('#hireFail'), 2500);
            }
        };
        var hole = parseInt($('#mine_no').text()) - 1;
        if (properties.small !== 0) {
            hole += properties.MaxCount * 2;
        }
        if ($('#autoSelect').is(':checked')) {
            hole += properties.MaxCount;
        }
        if (properties.cotoken.lt(cost)) {
            properties.Contract.buy(0, hole, {gas: 3000000, value: cost}, makeTxnCallback(f));
        } else {
            properties.Contract.buy(cost, hole, {gas: 3000000}, makeTxnCallback(f));
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

function HoleHistory(no, small, packed) {
    this.no = no;
    this.small = small;
    var p = packed[9];
    this.current = p.div(properties.bn2p48).floor().toNumber();
    this.blockNumber = p.div(properties.bn2p16).floor().mod(properties.bn2p16).toNumber();
    this.playerCount = p.mod(properties.bn2p16).toNumber();
    var luckyMen = [], arr, i, j, n = small ? 2 : 3;
    for (j = 0; j < n; ++j) {
        arr = [];
        for (i = 0; i < 3; ++i) {
            arr.push(new LuckyMan(packed[i + j * 3]));
        }
        luckyMen.push(arr);
    }
    this.luckyMen = luckyMen;
}

function showHoleHistory(e) {
    var mine = $(e.currentTarget).data('mine'), small = mine.small;
    var mines = properties.mines[small], n = mines.length, i, m;
    for (i = 0; i < n; ++i) {
        m = mines[i];
        if (m.no === mine.no && mine.round >= m.round) {
            if (m.current < (small ? 2000 : 5000) || properties.blockNumber < m.blockNumber + 3) {
                alertify.alert('该矿洞未开挖完成。');
                return;
            }
            break;
        }
    }

    blockchain.getGameHistory(mine.round, mine.pos, mine.no + (small ? properties.MaxCount : 0)).then(function (promises) {
        if (promises.length === 10 && promises[9].gt(0)) {
            var history = new HoleHistory(mine.no, small, promises), d = $('#details');
            var s = d.find('>h3 span');
            s.eq(0).text(history.no + 1);
            s.eq(1).text(history.small ? '金银' : '宝石');
            s = d.find('>div span');
            s.eq(0).text(history.playerCount);
            s.eq(1).text(history.current);
            s.eq(2).text(history.blockNumber - 1);

            var total = (history.current / 100 * 0.91 - (small ? 1.6 : 3.1)) / 10;

            d.find('>table').remove();
            $('#DetailsModal').modal('show');

            var types = small ? ['白银', '黄金'] : ['水晶', '宝石', '钻石'];
            var percent = small ? [3, 7] : [1, 3, 6];
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
                            '<tr><td></td><td colspan="3"></td></tr>' +
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
            alertify.alert('未能获得记录！<br>请确认该矿洞已开挖并完成搬运，并在24小时以内。');
        }
    });
}

function setDetailModelMode(e) {
    var m = $('#DetailsModal'), t = $('#tips'), d = $('#details');
    var lg0 = 'bd-example-modal-lg', lg1 = 'modal-lg', sm0 = 'bd-example-modal-sm', sm1 = 'modal-sm';
    if (window.orientation === 0 || window.orientation === 180) {
        m.removeClass(lg0).addClass(sm0).children().removeClass(lg1).addClass(sm1);
        t.show();
        d.hide();
    } else {
        m.removeClass(sm0).addClass(lg0).children().removeClass(sm1).addClass(lg1);
        t.hide();
        d.show();
    }
}

function plusSpecified() {
    var no = parseInt($('#no').val());
    if (isNaN(no) || i < no || no > 65000) {
        alertify.alert('无效的矿洞号');
    } else {
        --no;
        var small = properties.small, mines = properties.mines[small], n = mines.length, i;
        for (i = 0; i < n; ++i) {
            if (mines[i].no === no) {
                break;
            }
        }
        if (i > 0) {
            if (i >= n) {
                blockchain.getGame(no + (small ? properties.MaxCount : 0)).then(function (g) {
                    var mine = new Mine(web3.toBigNumber('0'), small);

                    mine.round = g.div(properties.bn2.pow(144)).floor().mod(properties.bn2p32).toNumber();
                    if (mine.round > 0) {
                        mine.no = no;
                        mine.current = g.div(properties.bn2.pow(176)).floor().mod(properties.bn2p16).toNumber();
                        mine.blockNumber = g.div(properties.bn2.pow(112)).floor().mod(properties.bn2p32).toNumber();

                        properties.mines[small].unshift(mine);

                        var i;
                        for (i = properties.mines[small].length; i >= 1; --i) {
                            if (properties.mines[small][i].no === no) {
                                properties.mines[small].splice(i, 1);
                                break;
                            }
                        }

                        if (properties.mines[small].length > 9) properties.mines[small].length = 9;
                    }
                });
            } else {
                properties.mines[small].unshift(mines[i]);
                properties.mines[small].splice(i + 1, 1);
            }
        }
    }
}

function refresh() {
    properties.offset[properties.small] = getRandom();
    properties.getValidGames();
}

$(start(function (account) {
    properties.Contract = web3.eth.contract(abi).at(contractAddresses.Biigo);
    properties.ViewerContract = web3.eth.contract(viewerAbi).at(contractAddresses.BiigoViewer);

    return Promise.all([
        Promise.promisify(properties.ViewerContract.getSummary),
        Promise.promisify(properties.ViewerContract.getValidGames),
        Promise.promisify(properties.ViewerContract.getGamesStatus),
        Promise.promisify(properties.ViewerContract.getMyHistories),
        Promise.promisify(properties.ViewerContract.getGameHistory),
        Promise.promisify(properties.Contract.buy),
        Promise.promisify(properties.Contract.clean),
        Promise.promisify(properties.Contract.withdraw),
        Promise.promisify(properties.Web3.eth.getBlock),
        Promise.promisify(properties.Contract.getGame),
        Promise.promisify(properties.Contract.getGameHistories),
    ]).then(function (_promisfied) {
        // hook dom interaction event listeners
        blockchain.getSummary = _promisfied[0];
        blockchain.getValidGames = _promisfied[1];
        blockchain.getGamesStatus = _promisfied[2];
        blockchain.getMyHistories = _promisfied[3];
        blockchain.getGameHistory = _promisfied[4];
        blockchain.buy = _promisfied[5];
        blockchain.clean = _promisfied[6];
        blockchain.withdraw = _promisfied[7];
        blockchain.getBlock = _promisfied[8];
        blockchain.getGame = _promisfied[9];
        blockchain.getGameHistories = _promisfied[10];

        return Promise.all([
            $('#employee').on('keypress', function (e) {
                return (e.charCode >= 0x30 && e.charCode <= 0x39);
            }),
            $('#big, #small').on('click', '>div>div', onMineSelected),
            $('#withdraw').on('click', onWithdraw),
            $('#addBtns button').on('click', addEmployee),
            $('#employeeNum a').on('click', setEmployee),
            $('#bigTab,#smallTab').on('shown.bs.tab', onTypeSelected),
            $('#confirm').on('click', onConfirmButtonSubmit),
            $('#history').on('click', 'a', showHoleHistory),
            $('#plus').on('click', plusSpecified),
            $('#refresh').on('click', refresh),
            $(window).on('orientationchange', setDetailModelMode),
        ]);
    }).then(function () {
        $('#loadingSpinner').hide();

        setDetailModelMode();
        properties.small = 0;
        properties.ether = web3.toBigNumber(properties.Web3.toWei(1, 'ether'));
        properties.bn2 = web3.toBigNumber('2');
        properties.bn2p4 = properties.bn2.pow(4);
        properties.bn2p8 = properties.bn2.pow(8);
        properties.bn2p16 = properties.bn2.pow(16);
        properties.bn2p17 = properties.bn2.pow(17);
        properties.bn2p24 = properties.bn2.pow(24);
        properties.bn2p32 = properties.bn2.pow(32);
        properties.bn2p40 = properties.bn2.pow(40);
        properties.bn2p48 = properties.bn2.pow(48);
        properties.bn2p64 = properties.bn2.pow(64);
        properties.bn2p104 = properties.bn2.pow(104);
        properties.bn2p112 = properties.bn2.pow(112);
        properties.bn2p216 = properties.bn2.pow(216);
        properties.InvalidGame = web3.toBigNumber('0xffff0000');
        properties.InvalidTime = Math.pow(10, 18);

        properties.blockNumber = 0;
        properties.histories = [];
        properties.offset = [getRandom(), getRandom()];
        properties.mines = [[], []];
        properties.validMines = [0, 0];
        properties.limits = [0, 0];
        properties.nextTime = web3.toBigNumber(properties.InvalidTime);
        properties.validRewards = web3.toBigNumber('0');
        properties.totalClean = 0;
        properties.unpaidClean = 0;
        properties.checkCleaner = false;

        properties.price = properties.ether.div(100);
        properties.MaxCount = 65536;
        properties.countdownId = null;
        properties.getStatusId = null;
        properties.getHistoryId = null;
        properties.getValidGames = getValidGamesFunc();
        properties.getGamesStatus = getGamesStatusFunc();

        var getSummary = getSummaryFunc();
        getSummary();
        $('#smallTab').click();
        setInterval(getSummary, 1000);
        setInterval(updateView, 2000);
    });
}));