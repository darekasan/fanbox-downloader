var dlList = new Object();
dlList.items = new Array();
dlList.postCount = 0;
dlList.fileCount = 0;
var isIgnoreFree = false;

// 投稿の情報を個別に取得しない（基本true）
// 2022/03あたりのAPI仕様変更で投稿本文を個別に取得する必要が出てきた
var isEco = false;

function main() {
    if (window.location.origin == "https://downloads.fanbox.cc") {
        document.body.innerHTML = "";
        var tb = document.createElement("input");
        tb.type = "text";
        var bt = document.createElement("input");
        bt.type = "button";
        bt.value = "ok";
        document.body.appendChild(tb);
        document.body.appendChild(bt);
        bt.onclick = function(){
            JSON.parse(tb.value).items.forEach(dl => {
                createLink(dl.url, dl.filename);
            });
            startDownload();
        };
        
    } else if (window.location.origin.includes("fanbox.cc")) {
        var href = window.location.href;
        var isPosts = href.match(/https:\/\/.*\.fanbox.cc\/.*posts\/(\d*)/) == null;
        var creatorId = (href.match(/https:\/\/www\.fanbox.cc\/@(.*)\/posts/)??href.match(/https:\/\/(.*)\.fanbox.cc\/posts/))[1]

        if (isPosts) {
            dlList.items = new Array();

            isIgnoreFree = confirm("無料コンテンツを省く？");

            var limit = prompt("取得制限数(最大300)を入力 キャンセルで最後まで取得");
            if (limit == null){
                var count=1;
                var nextUrl="https://api.fanbox.cc/post.listCreator?creatorId=" + creatorId + "&limit=100";
                for(;nextUrl!=null;count++){
                    console.log(count+"回目");
                    var nextUrl = addByPostListUrl(nextUrl, isEco);
                }
            }else{
                // limit=300が限界らしい？
                var nextUrl = addByPostListUrl("https://api.fanbox.cc/post.listCreator?creatorId=" + id + "&limit=" + limit, isEco);
            }
        } else {
            var id = href.match(/https:\/\/(.*)\.fanbox.cc\/.*posts\/(\d*)/)[2];
            addByPostInfo(getPostInfoById(id));
        }
        var json=JSON.stringify(dlList);
        navigator.clipboard.writeText(json);
        console.log(json);
        alert("jsonをコピーしました。downloads.fanbox.ccで実行して貼り付けてね");
    } else {
        alert("ここどこですか");
    }
}

// 投稿リストURLからURLリストに追加
function addByPostListUrl(url, eco) {
    var postList = JSON.parse(fetchUrl(url));
    var items = postList.body.items;

    console.log("投稿の数:"+items.length);
    for (var i = 0; i < items.length; i++) {
        dlList.postCount++;
        // ecoがtrueならpostInfoを個別に取得しない
        if(eco==true){
            console.log(items[i]);
            addByPostInfo(items[i]);
        }else{
            addByPostInfo(getPostInfoById(items[i].id));
        }
        
    }

    return postList.body.nextUrl;
}

// HTTP GETするおまじない
function fetchUrl(url){
    var request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.withCredentials = true;
    request.send(null);
    return request.responseText;
}

// 投稿IDからpostInfoを得る
function getPostInfoById(postId) {
    return JSON.parse(fetchUrl("https://api.fanbox.cc/post.info?postId=" + postId)).body;
}

// postInfoオブジェクトからURLリストに追加する
function addByPostInfo(postInfo) {
    var title = postInfo.title;
    // クリエイター名より日付入ってたほうがうれしいのでかえた（きまぐれ）
    
    var date = postInfo.publishedDatetime;
    if(isIgnoreFree && (postInfo.feeRequired==0)){
        return;
    }

    if(postInfo.body==null){
        console.log("取得できませんでした(支援がたりない？)\n" + "feeRequired: " + postInfo.feeRequired + "@" + postInfo.id);
        return;
    }

    if (postInfo.type == "image") {
        var images = postInfo.body.images;
        for (var i = 0; i < images.length; i++) {
            addUrl(images[i].originalUrl, date + " " + title + " " + (i+1) + "." + images[i].extension);
        }
    } else if (postInfo.type == "file") {
        var files = postInfo.body.files;
        for (var i = 0; i < files.length; i++) {
            addUrl(files[i].url, date + " " + title + " " + files[i].name + "." + files[i].extension);
        }
    } else if (postInfo.type == "article") {
        var imageMap = postInfo.body.imageMap;
        var imageMapKeys = Object.keys(imageMap);
        for (var i = 0; i < imageMapKeys.length; i++) {
            addUrl(imageMap[imageMapKeys[i]].originalUrl, date + " " + title + " " + (i+1) + "." + imageMap[imageMapKeys[i]].extension);
        }

        var fileMap = postInfo.body.fileMap;
        var fileMapKeys = Object.keys(fileMap);
        for (var i = 0; i < fileMapKeys.length; i++) {
            addUrl(fileMap[fileMapKeys[i]].url, date + " " + title + " " + fileMap[fileMapKeys[i]].name + "." + fileMap[fileMapKeys[i]].extension);
        }
    } else {
        console.log("不明なタイプ\n" + postInfo.type + "@" + postInfo.id);
    }
}

// URLリストに追加
function addUrl(url, filename) {
    var dl = new Object();
    dl.url = url;
    dl.filename = filename;

    dlList.fileCount++;
    dlList.items.push(dl);
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
