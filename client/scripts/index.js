var filelistEl = document.getElementById('filelist');
var currentPath;

function isZipFile(filename) {
    var temp = filename.split('.');
    if (temp.length < 2) return false;
    return ['zip'].indexOf(temp.pop()) > -1;
}

var i;
function updateFileList(path) {

    fetch("/handler/queryAll?path=" + path, {
        method: "GET"
    })
        .then(function (response) {
            response.json()
                .then(function (res) {

                    var template = "<li onDblclick='openBtn(\"folder\",\"" + path.replace(/\/[^\/]+\/$/, "") + "\")'>..</li>";
                    for (i = 0; i < res.filelist.length; i++) {
                        var tag = res.filelist[i].isDirectory ? "folder" : "file";
                        var zipClass = isZipFile(res.filelist[i].name) ? " zip" : "";
                        template += "<li tag='" + tag + "' draggable='true' onDragstart='doDragstart(event,\"" + tag + "\",\"" + res.filelist[i].name + "\",\"" + (path + res.filelist[i].name) + "\")' onDblclick='openBtn(\"" + tag + "\",\"" + path + res.filelist[i].name + "\")' class='" + tag + zipClass + "'>" + res.filelist[i].name + "</li>";
                    }

                    filelistEl.innerHTML = template;
                });
        });

}

function openBtn(tag, path) {
    if (path == './') return;

    // 打开文件
    if (tag == 'file') {
        alert("打开文件研发中，敬请期待！");
    }

    // 打开文件夹
    else {
        updateFileList(path + "/");
        window.location.href = '#' + path.replace(/^\./, '');

        currentPath = path + "/";
    }
}

function doDragstart(event, type, filename, url) {
    event.dataTransfer.effectAllowed = "copyMove";

    if (type == 'file') {
        event.dataTransfer.setData("DownloadURL", "text/plain:" + filename + ":" + window.location.origin + url.replace(/^\./, '/userspace'));
        console.log("<文件>下载：" + window.location.origin + url.replace(/^\./, '/userspace'));
    } else {
        // 文件夹下载先不支持
    }

}

function doFresh() {
    updateFileList(currentPath);
    alert("列表刷新完毕～");
}

// 初始化打开
var url = window.location.hash.replace(/^#/, ".").trim();
if (url.length > 0) {
    updateFileList(url + "/");
    currentPath = url + "/";
} else {
    updateFileList("./");
    currentPath = "./";
}

// 上传单个文件
function doUpload(file, callback) {

    var filepath = file.webkitRelativePath || file.name;
    var formData = new FormData();

    formData.append('file', file);
    formData.append('path', currentPath);
    formData.append('filename', encodeURIComponent(file.name));
    formData.append('filepath', encodeURIComponent(filepath));

    fetch("/handler/upload", {
        method: "POST",
        body: formData
    }).then(function (response) {
        response.json().then(function (res) {
            if (!callback) {
                setTimeout(function () {
                    doFresh();
                }, 200);
            } else {
                callback(res, filepath);
            }
        });
    });
}

// 上传多文件
function doUploads(files) {
    var index = -1;

    var hadLen = 0;
    var processLog = function (res, filepath) {
        hadLen += 1;
        console.log("#"+hadLen+" [上传成功] " + (hadLen / files.length * 100).toFixed(2) + "% " + filepath);
    };

    var doUploadCallback = function () {
        index += 1;

        //  文件
        if (files[index].type) {
            // console.error(files[index]);

            if (index == files.length - 1) {
                doUpload(files[index], processLog);
                doFresh();
            } else {
                doUpload(files[index], function (res, filepath) {
                    processLog(res, filepath);
                    doUploadCallback();
                });
            }
        }

        // 文件夹
        else {
            // 文件夹上传先不支持
            if (index < files.length - 1) {
                doUploadCallback();
            }
        }
    };

    if (files.length > 0) {
        doUploadCallback();
    }
}

// 拖拽上传
document.addEventListener('dragover', function (event) { event.preventDefault(); });
document.addEventListener('drop', function (event) {
    event.preventDefault();
    doUploads(event.dataTransfer.files);
});

// 点击上传
function uploadFile(event) {
    doUploads(event.target.files);
}

// 鼠标右键
var rightMenuEl = document.getElementById('rightMenu');
var rightMenuBlankEl = document.getElementById('rightMenu-blank');
var rightMenuItemEl = document.getElementById('rightMenu-item');

document.body.addEventListener('click', function () {
    rightMenuEl.style.display = "none";
});
document.body.addEventListener("contextmenu", function (event) {
    event.preventDefault();

    rightMenuEl.style.display = "inline-block";
    rightMenuEl.style.left = event.clientX + "px";
    rightMenuEl.style.top = (event.clientY - 5) + "px";

    var tagType = event.target.getAttribute('tag');
    var filename = (event.target.innerText + "").trim();

    // 条目上
    if (tagType) {
        rightMenuBlankEl.style.display = 'none';
        rightMenuItemEl.style.display = '';

        var template = "";

        template += "<li>复制</li>";
        template += "<li>剪切</li>";
        if (tagType == 'folder' || !isZipFile(filename)) template += "<li>打开</li>";
        if (tagType == 'file' && !isZipFile(filename)) template += "<li>保存到本地</li>";
        if (tagType == 'folder') template += "<li>压缩文件夹</li>";
        if (tagType == 'file' && isZipFile(filename)) template += "<li>解压</li>";
        template += "<li class='line'></li>";
        template += "<li>删除</li>";

        rightMenuItemEl.innerHTML = template;
    }

    // 空白位置
    else {
        rightMenuItemEl.style.display = 'none';
        rightMenuBlankEl.style.display = '';
    }

});