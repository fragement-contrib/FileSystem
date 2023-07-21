document.getElementById('version').innerText = "系统版本：v" + window.systemInfo.version;

function doLogin() {

    fetch("/verification/login", {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        })
    }).then(function (response) {
        response.json().then(function (res) {
            if (res.code == '000000') {
                sessionStorage.setItem('isLogin', 'yes');
                window.location.href = './index.html';
            } else {
                alert(res.msg)
            }
        });
    });

}