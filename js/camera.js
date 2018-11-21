"use strict";

var gCtx = null;
var video = null;
var captureId = null;
var w = 800, h = 600;
var options = [
    {video: {facingMode: {exact: "environment"}}, audio: false},
    {video: {facingMode: "environment"}, audio: false},
    {video: {'deviceId': ''}, audio: false}
];

function isCanvasSupported() {
    var elem = $('#qr-canvas')[0];
    return !!(elem.getContext && elem.getContext('2d'));
}

function initCanvas() {
    var gCanvas = document.getElementById("qr-canvas");
    gCanvas.style.width = w + "px";
    gCanvas.style.height = h + "px";
    gCanvas.width = w;
    gCanvas.height = h;
    gCtx = gCanvas.getContext("2d");
}

function captureToCanvas() {
    try {
        gCtx.drawImage(video, 0, 0);
        qrcode.decode();
    }
    catch (e) {
        console.log(e);
    }
}

function startWebcam() {
    gCtx.clearRect(0, 0, w, h);
    var success = function (stream) {
        window.stream = stream;
        video.srcObject = stream;
        var camera = $('#camera');
        if (camera.children().length === 0) {
            camera.prepend(video);
            $(video).on('pause', function () {
                if (captureId !== null) {
                    clearInterval(captureId);
                    captureId = null;
                }
                window.stream.getTracks()[0].stop();
                $(video).remove();
            });
        }

        if (captureId === null) {
            captureId = setInterval(captureToCanvas, 500);
        }
    }, error = function (e) {
        var n = options.length;
        if (n > 1) {
            options.shift();
            if (n === 2) {
                options[0].video.deviceId = properties.videoinput[properties.inputIdx % properties.videoinput.length];
                $('#change').on('click', function () {
                    if (captureId !== null) {
                        clearInterval(captureId);
                        captureId = null;
                    }
                    window.stream.getTracks()[0].stop();
                    properties.inputIdx++;
                    options[0].video.deviceId = properties.videoinput[properties.inputIdx % properties.videoinput.length];
                    startWebcam();
                }).parent().removeClass('d-none');
            }
        } else {
            alertify.alert('启用摄像头失败');
            return;
        }
        startWebcam();
    };

    var n = navigator;
    if (n.mediaDevices.getUserMedia) {
        n.mediaDevices.getUserMedia(options[0]).then(function (stream) {
            success(stream);
        }).catch(function (e) {
            error(e);
        });
    }
    else if (n.getUserMedia) {
        n.getUserMedia(options[0], success, error);
    }
    else if (n.webkitGetUserMedia) {
        n.webkitGetUserMedia(options[0], success, error);
    }
}

function useWebcam() {
    if (captureId === null) {
        if (video === null) {
            video = document.createElement('video');
            video.width = 640;
            video.height = 480;
            video.setAttribute('autoplay', '');
        }
        startWebcam();
    }
}

function setwebcam() {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        try {
            navigator.mediaDevices.enumerateDevices().then(function (devices) {
                var videoinput = [], inputIdx = -1;
                devices.forEach(function (device) {
                    if (device.kind === 'videoinput') {
                        if (device.label.toLowerCase().search("back") > -1 || device.label.search("后") > -1) {
                            inputIdx = videoinput.length;
                        }
                        videoinput.push(device.deviceId);
                    }
                });
                if (videoinput.length > 0) {
                    qrcode.callback = function (a) {
                        if (isValidAddress(a)) {
                            if (captureId !== null) {
                                clearInterval(captureId);
                                captureId = null;
                            }
                            window.stream.getTracks()[0].stop();
                            $(video).remove();
                            var code = $('#code').text(a);
                            alertify.alert('已复制目标账号到剪贴板：<br>' + a + '<br><br>请返回“面对面功能页”并复制到目标地址框中', function(){
                                copy(code);
                            });
                        }
                    };
                    properties.videoinput = videoinput;
                    properties.inputIdx = inputIdx + videoinput.length;
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }
}

function Scan() {
    if (qrcode.callback) {
        useWebcam();
    } else {
        alertify.alert('不能启用摄像头');
    }
}

$(function () {
    if (isCanvasSupported() && window.File && window.FileReader) {
        initCanvas();
        setwebcam();
    }

    $('#scan').on('click', Scan);
});
