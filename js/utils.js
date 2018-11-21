"use strict";

window.properties = {
    'Contract': null,
    'LastBlock': 0,
    'NewBlock': 0,
    'processedTxs': {},
    'conversationRates': {}
};

window.blockchain = {};

window.info = {};

function validateAddress(ipt) {
    var address = $(ipt).val(), l = 0, len = address.length;
    if (address[0] === '0') {
        ++l;
        if (address[1] === 'x') {
            ++l;
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
            console.log('发生错误', err);
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
                            callback();
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
                var account = properties.Web3.eth.accounts[0];
                properties.Web3.eth.defaultAccount = account;

                f(account, loadingText).catch(function (err) {
                    console.log("出错了", err);
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