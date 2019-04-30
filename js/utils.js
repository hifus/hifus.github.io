"use strict";

window.properties = {
    'Contract': null,
    'LastBlock': 0,
    'processedTxs': {},
    'conversationRates': {}
};

window.blockchain = {};

window.info = {};

function validateAddress(ipt) {
    var address = $(ipt).val(), l = 0;
    if (address[0] === '0') {
        ++l;
        if (address[1] === 'x') {
            ++l;
            if (address[2] === '0' && address[3] === 'x') {
                address = address.substr(2);
            }
            while (l < 42) {
                var c = address.charCodeAt(l);
                if ((c >= 0x30 && c <= 0x39) || (c >= 0x41 && c <= 0x46) || (c >= 0x61 && c <= 0x66)) {
                    ++l;
                } else {
                    break;
                }
            }
        }
    }
    $(ipt).val(address.substr(0, l));
}

function isValidAddress(address) {
    return /^0x[0-9a-fA-F]{40}$/.test(address);
}

function timestampString(t) {
    if (typeof t === 'number') {
        t = new Date(t * 1000);
    } else {
        t = new Date();
    }
    return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds();
}

function timestampTimeString(t) {
    if (typeof t === 'number') {
        t = new Date(t * 1000);
    } else {
        t = new Date();
    }
    return t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds();
}

function showTips(tips, time) {
    if (tips.css('margin-top') === '0px') {
        tips.css('margin-top', '-' + tips.outerHeight(true) + 'px');
    }
    tips.fadeIn("fast", function (e) {
        setTimeout(function (e) {
            tips.fadeOut("fast");
        }, time || 1500);
    });
}

function is_iOS() {
    return navigator.userAgent.match(/(iPhone|iPod|iPad);/i);
}

function is_android() {
    return navigator.userAgent.toLowerCase().indexOf('android') >= 0;
}

function is_chrome() {
    return navigator.userAgent.toLowerCase().indexOf('chrome') >= 0;
}

function is_firefox() {
    return navigator.userAgent.toLowerCase().indexOf('firefox') >= 0;
}

function copy($node) {
    if (is_iOS()) {//区分iPhone设备
        window.getSelection().removeAllRanges();//这段代码必须放在前面否则无效
        var range = document.createRange();
        // 选中需要复制的节点
        range.selectNode($node[0]);
        // 执行选中元素
        window.getSelection().addRange(range);
        // 执行 copy 操作
        var successful = document.execCommand('copy');

        // 移除选中的元素
        window.getSelection().removeAllRanges();
    } else {
        var i = $('<input type="text" style="position:absolute;top:-1000rem;">').appendTo(document.body).val($node.text());
        i.select();
        document.execCommand("Copy"); // 执行浏览器复制命令
        i.remove();
    }
}

function makeTxnCallback(callback, atOnce) {
    function _showError(err) {
        if (err !== 'cancelled') {
            alertify.error('发生错误，请查看控制台日志。');
            console.log('发生了错误: '+ JSON.stringify(err));
        }
    }

    return function (err, txHash) {
        if (atOnce) {
            atOnce();
        }
        if (err) {
            _showError(err);
        } else {
            alertify.logPosition('bottom left');
            alertify.log('请求已发出，请等待区块确认...');
            properties.interval = setInterval(function () {
                properties.Web3.eth.getTransactionReceipt(txHash, function (err, receipt) {
                    if (err) {
                        clearInterval(properties.interval);
                        _showError(err);
                    } else if (receipt) {
                        clearInterval(properties.interval);
                        if (receipt.status === '0x0') {
                            properties.Web3.eth.getTransaction(txHash, function (err, txn) {
                                if (err) {
                                    _showError(err);
                                } else if (txn) {
                                    if (txn.gas === receipt.gasUsed) {
                                        alertify.alert('Gas不足，请设置更高的Gas上限后再次尝试！');
                                    } else {
                                        alertify.alert('执行请求失败');
                                    }
                                }
                            });
                        } else if (callback) {
                            callback(receipt);
                        }
                    }
                });
            }, 1000);
        }
    }
}

function start(f) {
    return function () {
        var loadingText = $('#loadingText').removeClass("d-none");

        function work() {
            if (properties.Web3.eth.accounts.length > 0) {
                var account = properties.Web3.eth.accounts[0].toLowerCase();
                properties.Web3.eth.defaultAccount = account;
                properties.ether = web3.toBigNumber(properties.Web3.toWei(1, 'ether'));
                properties.GWei = web3.toBigNumber('1000000000');
                properties.bn0 = web3.toBigNumber('0');
                properties.bn2 = web3.toBigNumber('2');

                Promise.all([
                    Promise.promisify(properties.Web3.eth.getBlockNumber),
                    Promise.promisify(properties.Web3.eth.getBlock),
                    Promise.promisify(properties.Web3.eth.getGasPrice),
                    Promise.promisify(properties.Web3.eth.getBalance),
                ]).then(function (_promisfied) {
                    blockchain.getBlockNumber = _promisfied[0];
                    blockchain.getBlock = _promisfied[1];
                    blockchain.getGasPrice = _promisfied[2];
                    blockchain.getBalance = _promisfied[3];

                    var listeners = [];
                    var routines = [];
                    window.addBlockListener = function (fn, interval) {
                        if (typeof fn === 'function') {
                            interval = parseInt(interval);
                            if (isNaN(interval) || !isFinite(interval)) interval = 1;
                            if (interval > 0) {
                                listeners.push([fn, properties.LastBlock, interval]);
                            }
                        }
                    };

                    window.addIntervalRoutine = function (fn, interval) {
                        if (typeof fn === 'function') {
                            interval = parseInt(interval);
                            if (isNaN(interval) || !isFinite(interval)) interval = 1;
                            if (interval > 0) {
                                routines.push([fn, Math.floor((new Date()).getTime() / 1000), interval]);
                            }
                        }
                    };

                    window.updateToBlock = function (p, fn, fnGetBlock) {
                        if (typeof fnGetBlock !== 'function') {
                            var idx = (typeof fnGetBlock !== 'number') ? 0 : parseInt(fnGetBlock);
                            fnGetBlock = function (promises) {
                                return promises[idx].toNumber();
                            };
                        }
                        var blockNumber = 0;
                        var running = false;

                        var _f = function () {
                            if (running) return;
                            running = true;

                            p().then(function (promises) {
                                //(block.number, data[51], totalBonus[SafeMath.hash(msg.sender)], coToken(coTokenAddress).balanceOf(msg.sender), (dateBuy[statTime >> 64] << 64) + uint64(now));
                                var _blockNumber = fnGetBlock(promises);
                                if (_blockNumber > blockNumber) {
                                    blockNumber = _blockNumber;
                                    fn(promises);
                                    if (blockNumber < properties.LastBlock) {
                                        running = false;
                                        _f();
                                        return;
                                    }
                                }
                                running = false;
                            }).catch(function (err) {
                                running = false;
                                _f();
                            });
                        };

                        return _f;
                    };

                    f(account, loadingText).then(function () {
                        setInterval(function () {
                            if (listeners.length) {
                                blockchain.getBlockNumber().then(function (_blockNum) {
                                    if (_blockNum > properties.LastBlock) {
                                        properties.LastBlock = _blockNum;
                                        $.each(listeners, function (i, e) {
                                            var n = _blockNum - e[1];
                                            if (n >= e[2]) {
                                                e[1] += Math.floor(n / e[2]) * e[2];
                                                e[0]();
                                            }
                                        });
                                    }
                                });
                            }
                            var now = Math.floor((new Date()).getTime() / 1000);
                            $.each(routines, function (i, e) {
                                var n = now - e[1];
                                if (n >= e[2]) {
                                    e[1] += Math.floor(n / e[2]) * e[2];
                                    e[0]();
                                }
                            });
                        }, 1000);
                    }).catch(function (err) {
                        console.log("出错了", err);
                    });
                });
            } else {
                loadingText.removeClass("waiting").text("获取当前账号失败");
            }
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
    };
}