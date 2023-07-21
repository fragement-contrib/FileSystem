var filelistEl = document.getElementById('filelist');

var i;
function updateFileList(path) {

    fetch("/handler/queryAll?path=" + path, {
        method: "get"
    })
        .then(function (response) {
            response.json()
                .then(function (res) {

                    var template = "<li onDblclick='openBtn(\"folder\",\"" + path.replace(/\/[^\/]+\/$/, "") + "\")'>..</li>";
                    for (i = 0; i < res.filelist.length; i++) {
                        var tag = res.filelist[i].isDirectory ? "folder" : "file";
                        template += "<li onDblclick='openBtn(\"" + tag + "\",\"" + path + res.filelist[i].name + "\")' class='" + tag + "'>" + res.filelist[i].name + "</li>";
                    }


                    filelistEl.innerHTML = template;
                });
        });

}

updateFileList("./");

function openBtn(tag, path) {
    if (path == './') return;

    // 打开文件
    if (tag == 'file') {

    }

    // 打开文件夹
    else {
        updateFileList(path + "/");
    }
}