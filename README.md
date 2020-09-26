# fanbox-downloader
pixiv FANBOXの投稿を自動でダウンロードする

自分用、性欲駆動開発

### 使い方
1. ブックマークに追加する
2. FANBOXのクリエイターページか投稿ページで実行する
3. URLのリストがjsonでクリップボードに吐き出される
4. download.fanbox.ccに遷移するのでそこでまた実行、jsonをコピペ
5. なんかいっぱいダウンロードはじまる

↓ブックマークレット
```
javascript:var dlList=new Array,isIgnoreFree=!1;function main(){if("https://downloads.fanbox.cc"==window.location.origin){document.body.innerHTML="";var e=prompt("jsonをコピペしてね");if(null==e)return;JSON.parse(e).forEach(e=>{createLink(e.url,e.filename)}),startDownload()}else if("https://www.fanbox.cc"==window.location.origin){if(null==window.location.href.match(/fanbox.cc\/@.*\/posts\/(\d*)/)){var o=window.location.href.match(/fanbox.cc\/@(.*)/)[1],n=prompt("取得制限数を入力");if(null==n)return;isIgnoreFree=confirm("無料コンテンツを省く？"),addByCreatorId(o,n)}else{addByPostId(o=window.location.href.match(/fanbox.cc\/@.*\/posts\/(\d*)/)[1])}navigator.clipboard.writeText(JSON.stringify(dlList)),alert("jsonをコピーしました。遷移先で実行して貼り付けてね"),window.location.href="https://downloads.fanbox.cc"}else alert("ここどこですか")}function addByCreatorId(e,o){var n=new XMLHttpRequest;n.open("GET","https://api.fanbox.cc/post.listCreator?creatorId="+e+"&limit="+o,!1),n.withCredentials=!0,n.send(null);for(var t=JSON.parse(n.responseText).body.items,r=0;r<t.length;r++)addByPostId(t[r].id)}function addByPostId(e){var o=new XMLHttpRequest;o.open("GET","https://api.fanbox.cc/post.info?postId="+e,!1),o.withCredentials=!0,o.send(null);var n=JSON.parse(o.responseText),t=n.body.title,r=n.body.user.name;if(!isIgnoreFree||0!=n.body.feeRequired)if(null!=n.body.body)if("image"==n.body.type)for(var a=n.body.body.images,i=0;i<a.length;i++)addUrl(a[i].originalUrl,r+" - "+t+" "+(i+1)+"."+a[i].extension);else if("file"==n.body.type){var d=n.body.body.files;for(i=0;i<d.length;i++)addUrl(d[i].originalUrl,r+" - "+t+" "+d[i].name+"."+d[i].extension)}else console.log("不明なタイプ\n"+n.body.type+"@"+e);else console.log("取得できませんでした(支援がたりない？)\nfeeRequired: "+n.body.feeRequired+"@"+e)}function addUrl(e,o){var n=new Object;n.url=e,n.filename=o,dlList.push(n)}function createLink(e,o){var n=document.createElement("a");document.body.appendChild(n),n.href=e,n.download=o}function startDownload(){var e=document.querySelectorAll("a"),o=0,n=setInterval(function(){e[o].click(),++o>=e.length&&clearInterval(n)},300)}main();
```
