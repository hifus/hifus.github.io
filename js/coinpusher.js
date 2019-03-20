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
        "name": "getDims",
        "outputs": [
            {
                "name": "",
                "type": "uint256[12]"
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
                "name": "_no",
                "type": "uint256"
            }
        ],
        "name": "getHistory",
        "outputs": [
            {
                "name": "",
                "type": "uint256[21]"
            },
            {
                "name": "",
                "type": "uint256[21]"
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
                "type": "uint256[51]"
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
        "name": "getDailyBuy",
        "outputs": [
            {
                "name": "",
                "type": "uint256[5]"
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
                "name": "_cell",
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

function _setCoin(n) {
    var tds = $('#coins tr').first().find('td:gt(0)').removeClass('profitable'), i;
    if (isFinite(n)) {
        $('#coin').val(n);
        $('#cost').text(properties.price.mul(n).div(properties.ether).toNumber());
        var pusher = properties.pushers[properties.selected];
        $.each(pusher.map, function (i, col) {
            var notfull = -1;
            $.each(col, function (j, cell) {
                if (cell < 100) {
                    if (notfull === -1) {
                        notfull = j;
                    } else {
                        notfull = -2;
                        return false;
                    }
                }
            });
            if (notfull === -2 || col[notfull] + n < 100) {
                tds.eq(i).text('0');
            } else {
                var a = col.length - 1;
                if (notfull === a) {
                    a = col[a] + n;
                } else {
                    a = col[a];
                }
                a = Math.floor((col[0] + ((notfull === 0) ? n : 0)) * (a - 80) / a);
                tds.eq(i).text(a);
                if (a * 10 >= n * 12) {
                    tds.eq(i).addClass('profitable');
                }
            }
        });
    } else {
        $('#cost').text('0');
        tds.text('0');
    }
}

function addCoin() {
    _setCoin(parseInt($('#coin').val() || 0) + parseInt($(this).text()));
}

function setCoin() {
    _setCoin(parseInt($(this).text()));
}

function onWithdraw() {
    properties.Contract.withdraw(0x0, {gas: 500000}, makeTxnCallback(function () {
        showTips($('#withdrawOk'));
    }));
}

function onPusherSelected(e) {
    var target = $(e.currentTarget);
    properties.selected = target.data('no');
    $('#PlayModalLabel').text(target.children('.name').text().trim());
    $('#coin').val('');
    $('#PlayModal').modal('show');
}

var VailableTime = 1800, BeforeSet = 600, SetTime = 1800, AfterSet = 600;

function showPusherCoins() {
    var pusher = properties.pushers[properties.selected];
    var tbl = $('#coins');
    tbl.empty();
    var col = pusher.map.length;
    if (col) {
        var tr = $('<tr><td class="tips" style="font-size:xx-small;line-height:1rem;" rowspan="2">可能推出</td></tr>').appendTo(tbl);
        for (var j = 0; j < col; ++j) {
            $('<td class="tips top">0</td>').appendTo(tr);
        }
        tr = $('<tr></tr>').appendTo(tbl);
        for (j = 0; j < col; ++j) {
            $('<td class="tips bottom" style="font-size:xx-large">↑</td>').appendTo(tr);
        }

        var row = pusher.map[0].length;
        for (j = 0; j < row; ++j) {
            $('<tr><td class="tips left">' + (row - j) + '</td></tr>').appendTo(tbl);
        }
        var trs = tbl.children();
        $.each(pusher.map, function (i, c) {
            $.each(c, function (r, e) {
                var cls;
                if (e < 80) {
                    cls = 'few';
                } else if (e < 100) {
                    cls = 'some';
                } else if (e < 200) {
                    cls = 'several';
                } else if (e < 500) {
                    cls = 'many';
                } else {
                    cls = 'huge';
                }
                $('<td>' + e + '</td>').appendTo(trs.eq(r + 2)).addClass(cls);
            });
        });
        tr = $('<tr><td class="tips">&nbsp;</td></tr>').appendTo(tbl);
        for (j = 0; j < col; ++j) {
            $('<td class="tips bottom">' + String.fromCharCode(65 + j) + '</td>').appendTo(tr);
        }
    }
}

var refreshMap = true;

function updateView() {
    var tables = $('#pushers table');

    if (refreshMap) {
        refreshMap = false;

        var i, pusher, tbl;
        for (i = 0; i < 12; ++i) {
            pusher = properties.pushers[i];
            tbl = tables.eq(i);
            tbl.empty();
            var col = pusher.map.length;
            if (col > 0) {
                var row = pusher.map[0].length, j;
                for (j = 0; j < row; ++j) {
                    $('<tr></tr>').appendTo(tbl);
                }
                var trs = tbl.children();
                $.each(pusher.map, function (i, c) {
                    $.each(c, function (r, e) {
                        var cls;
                        if (e < 80) {
                            cls = 'few';
                        } else if (e < 100) {
                            cls = 'some';
                        } else if (e < 200) {
                            cls = 'several';
                        } else if (e < 500) {
                            cls = 'many';
                        } else {
                            cls = 'huge';
                        }
                        $('<td>&nbsp;</td>').appendTo(trs.eq(r)).addClass(cls);
                    });
                });
                col = '<tr class="invisible"><td colspan="' + col + '">&nbsp;</td></tr>';
                for (; j < 8; ++j) {
                    $(col).prependTo(tbl);
                }
            }
        }

        $('#rewards').text(properties.rewards.div(properties.ether).toNumber());

        if (properties.selected >= 0) {
            showPusherCoins();
            _setCoin(parseInt($('#coin').val()));
        }
    }

    var now = Math.floor((new Date()).getTime() / 1000), txt;
    for (i = 0; i < 12; ++i) {
        pusher = properties.pushers[i];
        if (pusher.flag === 0) {
            if (now >= pusher.time) {
                txt = '';
            } else {
                txt = (pusher.time - now) + '秒后开始';
            }
        } else {
            if (now >= pusher.time) {
                if (now >= pusher.time + SetTime + AfterSet) {
                    txt = '';
                } else if (now >= pusher.time + SetTime) {
                    txt = (pusher.time + SetTime + AfterSet - now) + '秒后开始';
                } else {
                    txt = (pusher.time + SetTime + AfterSet - now) + '秒内结束维护';
                }
            } else {
                txt = (pusher.time - now) + '秒后维护';
            }
        }

        tables.eq(i).parent().children().last().text(txt);
        if (properties.selected === i) {
            $('#info').text(txt);
        }
    }
}

function Pusher() {
    this.map = [];
    this.flag = 0;
    this.time = 0;

    this.setFlagAndTime = function (a) {
        if (a.gte(properties.bn2p63)) {
            this.flag = 1;
            this.time = a.sub(properties.bn2p63).toNumber();
        } else {
            this.flag = 0;
            this.time = a.toNumber();
        }
    }
}

function getPushers(promises) {
    var bn2p16 = properties.bn2p16;
    var data = promises[1];
    for (var n = 0; n < 6; ++n) {
        var pusher = properties.pushers[n];
        var pusher2 = properties.pushers[n + 6];
        pusher.map = [];
        pusher2.map = [];

        for (var c = 0; c < 8; ++c) {
            var d = data[n * 8 + c], col = null, col2 = null;

            for (var r = 0; r < 8; ++r) {
                var a = d.mod(bn2p16);
                d = d.sub(a).div(bn2p16);
                a = a.toNumber();
                if (a < 65535) {
                    if (r === 0) {
                        col = [a];
                    } else {
                        col.unshift(a);
                    }
                }

                a = d.mod(bn2p16);
                d = d.sub(a).div(bn2p16);
                a = a.toNumber();
                if (a < 65535) {
                    if (r === 0) {
                        col2 = [a];
                    } else {
                        col2.unshift(a);
                    }
                }
            }

            if (col !== null) {
                pusher.map.push(col);
            }
            if (col2 !== null) {
                pusher2.map.push(col2);
            }
        }
    }

    var bn2p64 = properties.bn2p64;
    for (n = 0; n < 3; ++n) {
        d = data[n + 48];
        c = n * 4;
        for (r = 3; r >= 0; --r) {
            a = d.mod(bn2p64);
            d = d.sub(a).div(bn2p64);
            properties.pushers[c + r].setFlagAndTime(a);
        }
    }
    properties.rewards = promises[2];
    properties.cotoken = promises[3];

    properties.now = promises[4].mod(bn2p64).toNumber();
    properties.dailyAmount = promises[4].div(bn2p64).toNumber();

    refreshMap = true;
}

function onCellSelected(e) {
    var td = $(e.currentTarget);
    if (td.index() === 0 || td.parent().index() === 0 || isNaN(parseInt(td.text()))) return;
    if (!td.hasClass('selected')) {
        $('#coins td.selected').removeClass('selected');
        td.addClass('selected');
    }
}

function onConfirmButtonSubmit() {
    var coin = parseInt($('#coin').val());
    if (coin > 0 && coin <= 100) {
        var goal = $('#coins td.selected');
        if (goal.length) {
            var cost = properties.price.mul(coin);

            var f = function (receipt) {
                if (receipt.gasUsed > 100000) {
                    $('#coin').val('');
                    alertify.alert('投币成功');
                } else {
                    alertify.alert('投币失败！<br>资金返还到coToken中。');
                }
            };
            var col = goal.index() - 1, tr = goal.parent(), row = tr.parent().children().length - 2 - tr.index(),
                pos = row * (tr.children().length - 1) + col;
            if (properties.cotoken.lt(cost)) {
                properties.Contract.buy(0, properties.selected, pos, {
                    gas: 1000000,
                    value: cost
                }, makeTxnCallback(f));
            } else {
                properties.Contract.buy(cost, properties.selected, pos, {gas: 1000000}, makeTxnCallback(f));
            }
        } else {
            showTips($('#noGoal'));
        }
    } else {
        showTips($('#invNumber'));
    }
}

function History(history, player) {
    var bn2p6 = properties.bn2p6, bn2p8 = properties.bn2p8, bn2p20 = properties.bn2p20, bn2p32 = properties.bn2p32,
        bn2p64 = properties.bn2p64, bn2p104 = properties.bn2p104, c;

    c = player.mod(bn2p32);
    this.blockNumber = c.toNumber();
    player = player.sub(c).div(bn2p32);
    c = player.mod(bn2p64);
    this.timestamp = c.toNumber();
    this.player = '0x' + ('0000000000000000000000000000000000000000' + player.sub(c).div(bn2p64).toString(16)).substr(-40, 40);

    c = history.mod(bn2p104);
    this.hash = ('00000000000000000000000000' + c.toString(16)).substr(-26, 26);
    history = history.sub(c).div(bn2p104);
    c = history.mod(bn2p20);
    this.buy = c.toNumber();
    history = history.sub(c).div(bn2p20);
    c = history.mod(bn2p6);
    this.target = c.toNumber();
    history = history.sub(c).div(bn2p6);
    c = history.mod(bn2p20);
    this.rewards = c.toNumber();
    history = history.sub(c).div(bn2p20);
    c = history.mod(bn2p6);
    this.position = c.toNumber();
    history = history.sub(c).div(bn2p6);
    c = history.mod(bn2p8);
    this.cellCount = c.toNumber();
    history = history.sub(c).div(bn2p8);
    c = history.mod(bn2p8);
    this.columnCount = c.toNumber();
    history = history.sub(c).div(bn2p8);
    c = history.mod(bn2p8);
    this.flag = c.toNumber();
    this.rowCount = this.cellCount / this.columnCount;
}

History.prototype.positionName = function () {
    return (Math.floor(this.position / this.columnCount) + 1) + String.fromCharCode(65 + (this.position % this.columnCount));
};

History.prototype.targetName = function () {
    return (Math.floor(this.target / this.columnCount) + 1) + String.fromCharCode(65 + (this.target % this.columnCount));
};

History.prototype.show = function (ul) {
    if (this.timestamp) {
        var li = $('<li class="list-group-item p-1" style="font-size: x-small;"><div style="float: left">第' + this.blockNumber + '块</div><div style="float: right">' + (new Date(this.timestamp * 1000)).toLocaleString() + '</div><div style="clear: both;word-break: break-all">' + ((this.player === properties.account) ? '<b>自己</b>' : this.player) + '</div></li>').appendTo(ul).data('history', this);
        if (this.flag === 0) {
            $('<div style="float: left">向' + this.targetName() + '投入' + this.buy + '币</div><div style="float: right">落在' + this.positionName() + '，推出' + this.rewards + '币</div><div style="clear: both;float: left">0x' + this.hash + '</div><div style="float: right"><button type="button" class="btn btn-link">展示计算过程</button></div>').appendTo(li);
        } else {
            $('<div style="float: left">增加了' + this.buy + '币</div><div style="float: right">设置为' + this.rowCount + '行' + this.columnCount + '列</div><div style="clear: both;float: left">0x' + this.hash + '</div><div style="float: right">随机种子不变</div>').appendTo(li);
        }
    }
};

function showHistory() {
    $('#PlayModal').addClass('showHistory');
    $('#histories').empty();
    blockchain.getHistory(properties.selected).then(function (promises) {
        var players = promises[1], first = promises[2].toNumber(), histories = [];
        $.each(promises[0], function (i, history) {
            histories.push(new History(history, players[i], i));
        });

        var ul = $('#histories');
        for (var i = 0; i < 20; ++i) {
            first = (first + 20) % 21;
            histories[first].prev = histories[(first + 20) % 21].hash;
            histories[first].show(ul);
        }
    });
}

function hideHistory() {
    $('#PlayModal').removeClass('showHistory');
}

function showDailyBuy() {
    var tbody = $('#dailyBuy').empty();
    $('#DailyBuyModal').modal('show');
    blockchain.getDailyBuy().then(function (promises) {
        var p = promises[4], n, bn2p64 = properties.bn2p64, bn2p32 = properties.bn2p32, ether = properties.ether,
            price = properties.price, i, j;
        var startTime = p.mod(bn2p64), first = p.sub(startTime).div(bn2p64).toNumber(), dailyBuy = [];
        for (j = 0; j < 4; ++j) {
            p = promises[j];
            for (i = 0; i < 8; ++i) {
                n = p.mod(bn2p32);
                dailyBuy.push(n.toNumber());
                p = p.sub(n).div(bn2p32);
            }
        }
        dailyBuy.length = 30;
        startTime = startTime.toNumber();
        for (j = first; j >= 0; --j) {
            startTime -= 86400;
            $('<tr><td>' + (new Date(startTime * 1000)).toLocaleDateString() + '</td><td>' + price.mul(dailyBuy[j]).div(ether) + '</td></tr>').appendTo(tbody);
        }

        for (j = 29; j > first; --j) {
            startTime -= 86400;
            $('<tr><td>' + (new Date(startTime * 1000)).toLocaleDateString() + '</td><td>' + price.mul(dailyBuy[j]).div(ether) + '</td></tr>').appendTo(tbody);
        }
    });
}

var blockMiners = {};

function _showHistoryDetails(s, history, block, li) {
    s = ('00000000' + history.timestamp.toString(16)).substr(-8, 8) + s;
    var h1 = ('00000000' + web3.toBigNumber(web3.sha3(block.miner, {encoding: 'hex'})).mod(history.timestamp).toString(16)).substr(-8, 8);
    s = h1 + s;
    s = ('00' + history.target.toString(16)).substr(-2, 2) + s;
    s = properties.selected.toString(16) + s;
    s = ('00000000000' + block.difficulty.mod(properties.bn2p44).toString(16)).substr(-11, 11) + s;
    s = ('00000000' + history.blockNumber.toString(16)).substr(-8, 8) + s;
    var h2 = web3.sha3('0x' + s, {encoding: 'hex'});
    var pos = web3.toBigNumber(h2).mod(history.cellCount + 2).toNumber();
    //console.log(pos, history.position);

    $('<hr>').appendTo(li);
    $('<div>块号no=0x' + history.blockNumber.toString(16) + ', 时间戳ts=0x' + history.timestamp.toString(16) + ', 块难度d=0x' + block.difficulty.toString(16) + ', 矿工m= ' + block.miner + '</div>').appendTo(li);
    $('<div>散列值h1=(keccak256(m)%ts)&0xFFFFFFFF= 0x' + h1 + '</div>').appendTo(li);
    $('<div>组合值s=0x <a>' + s.substr(0, 8) + '</a> <a>' + s.substr(8, 11) + '</a> <a>' + s.substr(19, 1) + '</a> <a>' + s.substr(20, 2) + '</a> <a>' + s.substr(22, 8) + '</a> <a>' + s.substr(30, 8) + '</a> <a>' + s.substr(38) + '</a></div>').appendTo(li);
    $('<div>散列值h2=keccak256(s)=<span>' + h2 + '</span></div>').appendTo(li);
    $('<div>最终落点=h2%(单元格总数+2)=' + pos + ' (' + history.positionName() + ((pos < history.cellCount) ? '' : ', 期望位置') + ')</div>').appendTo(li);
    $('<div>随机种子=h2&0xFFFFFFFFFFFFFFFFFFFFFFFFFF= 0x' + h2.substr(-26, 26) + '</div>').appendTo(li);

    var names = ['块号no', '块难度d&0xFFFFFFFFFFF', '推币机编号', '期望位置(' + history.targetName() + ')的编号', '散列值h1', '时间戳ts', '上一个随机种子'];
    $('a', li).each(function (i, e) {
        $(e).data({
            toggle: "popover",
            placement: "top",
            trigger: "focus",
            content: names[i]
        }).attr('tabindex', '0').popover({
            trigger: 'focus'
        });
    });
}

function showHistoryDetails(e) {
    var btn = $(e.target), li = btn.closest('li'), t = '展示计算过程';
    if (btn.text() === t) {
        btn.text('隐藏计算过程');
        var history = li.data('history'), s = history.prev, block = blockMiners[history.blockNumber];
        if (block === undefined) {
            blockchain.getBlock(history.blockNumber).then(function (block) {
                blockMiners[history.blockNumber] = block;
                if (btn.text() !== t && $('hr', li).length === 0) {
                    _showHistoryDetails(s, history, block, li);
                }
            });
        } else {
            _showHistoryDetails(s, history, block, li);
        }
    } else {
        btn.text(t);
        var hr = $('hr', li);
        hr.nextAll().remove();
        hr.remove();
    }
}

$(start(function (account) {
    properties.Contract = web3.eth.contract(abi).at(contractAddresses.CoinPusher);

    return Promise.all([
        Promise.promisify(properties.Contract.getInfo),
        Promise.promisify(properties.Contract.buy),
        Promise.promisify(properties.Contract.withdraw),
        Promise.promisify(properties.Contract.getDailyBuy),
        Promise.promisify(properties.Contract.getHistory),
        Promise.promisify(properties.Web3.eth.getBlock),
    ]).then(function (_promisfied) {
        // hook dom interaction event listeners
        blockchain.getInfo = _promisfied[0];
        blockchain.buy = _promisfied[1];
        blockchain.withdraw = _promisfied[2];
        blockchain.getDailyBuy = _promisfied[3];
        blockchain.getHistory = _promisfied[4];
        blockchain.getBlock = _promisfied[5];

        var modal = $('#PlayModal');
        return Promise.all([
            $('#coin').on('keypress', function (e) {
                return (e.charCode >= 0x30 && e.charCode <= 0x39);
            }).on('change', function (e) {
                _setCoin(parseInt($(this).val()));
            }),
            $('#withdraw').on('click', onWithdraw),
            $('#pushers').on('click', '.map', onPusherSelected),
            $('#addBtns button').on('click', addCoin),
            $('#coinNum a').on('click', setCoin),
            modal.on('hidden.bs.modal', function () {
                modal.removeClass('showHistory');
                properties.selected = -1;
            }),
            modal.on('shown.bs.modal', showPusherCoins),
            $('#coins').on('click', 'td', onCellSelected),
            $('#confirm').on('click', onConfirmButtonSubmit),
            $('#showHistories').on('click', showHistory),
            $('#back').on('click', hideHistory),
            $('#DailyBuyButton').on('click', showDailyBuy),
            $('#histories').on('click', 'button', showHistoryDetails),
        ]);
    }).then(function () {
        $('#loadingSpinner').hide();
        properties.account = account;
        properties.price = properties.ether.div(10000).mul(120);
        properties.bn2p6 = properties.bn2.pow(6);
        properties.bn2p8 = properties.bn2.pow(8);
        properties.bn2p16 = properties.bn2.pow(16);
        properties.bn2p20 = properties.bn2.pow(20);
        properties.bn2p32 = properties.bn2.pow(32);
        properties.bn2p44 = properties.bn2.pow(44);
        properties.bn2p63 = properties.bn2.pow(63);
        properties.bn2p64 = properties.bn2.pow(64);
        properties.bn2p104 = properties.bn2.pow(104);
        properties.pushers = [];
        for (var i = 0; i < 12; ++i) {
            properties.pushers.push(new Pusher());
        }
        properties.rewards = properties.bn0;
        properties.cotoken = properties.bn0;
        properties.selected = -1;

        addBlockListener(updateToBlock(blockchain.getInfo, getPushers));
        addIntervalRoutine(updateView);
    });
}));