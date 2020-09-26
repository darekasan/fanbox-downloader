function main(){
    document.body.innerHTML="";

    if(window.location.origin!="https://downloads.fanbox.cc"){
        alert("https://downloads.fanbox.ccで実行してね");
        window.location.href = "https://downloads.fanbox.cc";
    }

    if(confirm("クリエイターページからダウンロードする？")){
        var id = prompt("www.fanbox.cc/@ 以降を入力");
        if(id==null) return;

        var limit = prompt("取得制限数を入力");
        if(limit==null) return;

        addByCreatorId(id, limit);
    }else{
        var id = prompt("www.fanbox.cc/@hoge/posts/ 以降を入力");
        if(id==null) return;
        addByPostId(id);
    }

    startDownload();
}

// クリエイターIDからダウンロードリンクを作成
function addByCreatorId(creatorId, limit){
    var request = new XMLHttpRequest();
    request.open('GET', "https://api.fanbox.cc/post.listCreator?creatorId=" + creatorId + "&limit=" + limit, false);
    request.send(null);
    var postList = JSON.parse(request.responseText);
    var items = postList.items;
    
    for(var i=0;i<items;i++){
        addByPostId(items[i].id);
    }
}

// 投稿IDからダウンロードリンクを作成
function addByPostId(postId){
    var request = new XMLHttpRequest();
    request.open('GET', "https://api.fanbox.cc/post.info?postId=" + postId, false);
    request.send(null);
    var postInfo = JSON.parse(request.responseText);
    var title = postInfo.body.title;
    var author = postInfo.body.user.name;

    if(postInfo.body.type=="image"){
        var images = postInfo.body.body.images;
        for(var i=0;i<images.length;i++){
            addUrl(images[i].originalUrl, author + " - " + title + " " + i + "." + images[i].extension);
        }
    }else if(postInfo.body.type=="file"){
        var files = postInfo.body.body.files;
        for(var i=0;i<files.length;i++){
            addUrl(files[i].originalUrl, author + " - " + title + " " + files[i].name + "." + files[i].extension);
        }
    }
    
}

// ダウンロードリンクを作成
function addUrl(url, filename) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = filename;
}

// ダウンロードリンクをクリックする
function startDownload(){
    var links = document.querySelectorAll("a");
    var idx = 0;
    var interval = setInterval(function () {
        links[idx].click();
        idx++;
        if (idx >= links.length) clearInterval(interval);
    }, 300);
}

main();
