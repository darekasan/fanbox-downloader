var dlList = new Array();
var isIgnoreFree = false;

function main() {
    if (window.location.origin == "https://downloads.fanbox.cc") {
        document.body.innerHTML = "";
        var json = prompt("jsonをコピペしてね");
        if (json == null) return;
        var obj = JSON.parse(json);
        obj.forEach(dl => {
            createLink(dl.url, dl.filename);
        });
        startDownload();
    } else if (window.location.origin == "https://www.fanbox.cc") {
        if (window.location.href.match(/fanbox.cc\/@.*\/posts\/(\d*)/) == null) {
            var id = window.location.href.match(/fanbox.cc\/@(.*)/)[1];

            var limit = prompt("取得制限数を入力");
            if (limit == null) return;

            isIgnoreFree = confirm("無料コンテンツを省く？");

            addByCreatorId(id, limit);
        } else {
            var id = window.location.href.match(/fanbox.cc\/@.*\/posts\/(\d*)/)[1];
            addByPostId(id);
        }
        navigator.clipboard.writeText(JSON.stringify(dlList));
        alert("jsonをコピーしました。遷移先で実行して貼り付けてね");
        window.location.href = "https://downloads.fanbox.cc";
    } else {
        alert("ここどこですか");
    }
}

// クリエイターIDからURLリストに追加
function addByCreatorId(creatorId, limit) {
    var request = new XMLHttpRequest();
    request.open('GET', "https://api.fanbox.cc/post.listCreator?creatorId=" + creatorId + "&limit=" + limit, false);
    request.withCredentials = true;
    request.send(null);
    var postList = JSON.parse(request.responseText);
    var items = postList.body.items;

    for (var i = 0; i < items.length; i++) {
        addByPostId(items[i].id);
    }
}

// 投稿IDからURLリストに追加
function addByPostId(postId) {
    var request = new XMLHttpRequest();
    request.open('GET', "https://api.fanbox.cc/post.info?postId=" + postId, false);
    request.withCredentials = true;
    request.send(null);
    var postInfo = JSON.parse(request.responseText);
    var title = postInfo.body.title;
    var author = postInfo.body.user.name;
    if(isIgnoreFree && (postInfo.body.feeRequired==0)){
        return;
    }

    if(postInfo.body.body==null){
        console.log("取得できませんでした(支援がたりない？)\n" + "feeRequired: " + postInfo.body.feeRequired + "@" + postId);
        return;
    }

    if (postInfo.body.type == "image") {
        var images = postInfo.body.body.images;
        for (var i = 0; i < images.length; i++) {
            addUrl(images[i].originalUrl, author + " - " + title + " " + (i+1) + "." + images[i].extension);
        }
    } else if (postInfo.body.type == "file") {
        var files = postInfo.body.body.files;
        for (var i = 0; i < files.length; i++) {
            addUrl(files[i].originalUrl, author + " - " + title + " " + files[i].name + "." + files[i].extension);
        }
    } else {
        console.log("不明なタイプ\n" + postInfo.body.type + "@" + postId);
    }
}

// URLリストに追加
function addUrl(url, filename) {
    var dl = new Object();
    dl.url = url;
    dl.filename = filename;

    dlList.push(dl);
}

// ダウンロードリンクを作成
function createLink(url, filename) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = filename;
}

// ダウンロードリンクをクリックする
function startDownload() {
    var links = document.querySelectorAll("a");
    var idx = 0;
    var interval = setInterval(function () {
        links[idx].click();
        idx++;
        if (idx >= links.length) clearInterval(interval);
    }, 300);
}

main();
