# fanbox-downloader
pixiv FANBOXの投稿を自動でダウンロードする

自分用、性欲駆動開発

### 使い方
1. ブックマークに追加する
2. FANBOXのクリエイターページか投稿ページで実行する
3. URLのリストがjsonでクリップボードに吐き出される
4. download.fanbox.ccでまた実行、jsonをコピペ
5. なんかいっぱいダウンロードはじまる

### 既知の問題
- ecoモードだと取りこぼしがある？
- type: textに対応してない
- 画像とファイルだけじゃなくて文章も保存したいね

↓ブックマークレット
```
javascript:var dlList=new Object;dlList.items=new Array,dlList.postCount=0,dlList.fileCount=0;var isIgnoreFree=!1,isEco=!1;function main(){if("https://downloads.fanbox.cc"==window.location.origin){document.body.innerHTML="";var e=document.createElement("input");e.type="text";var o=document.createElement("input");o.type="button",o.value="ok",document.body.appendChild(e),document.body.appendChild(o),o.onclick=function(){JSON.parse(e.value).items.forEach(e=>{createLink(e.url,e.filename)}),startDownload()}}else if("https://www.fanbox.cc"==window.location.origin){if(null==window.location.href.match(/fanbox.cc\/@.*\/posts\/(\d*)/)){dlList.items=new Array;var t=window.location.href.match(/fanbox.cc\/@(.*)/)[1];isIgnoreFree=confirm("無料コンテンツを省く？"),isEco=confirm("ecoモードにする？");var n=prompt("取得制限数(最大300)を入力 キャンセルで最後まで取得");if(null==n)for(var i=1,l="https://api.fanbox.cc/post.listCreator?creatorId="+t+"&limit=100";null!=l;i++){console.log(i+"回目");l=addByPostListUrl(l,isEco)}else l=addByPostListUrl("https://api.fanbox.cc/post.listCreator?creatorId="+t+"&limit="+n,isEco)}else{addByPostInfo(getPostInfoById(t=window.location.href.match(/fanbox.cc\/@.*\/posts\/(\d*)/)[1]))}var r=JSON.stringify(dlList);navigator.clipboard.writeText(r),console.log(r),alert("jsonをコピーしました。downloads.fanbox.ccで実行して貼り付けてね"),dlList.items.window.open("https://downloads.fanbox.cc")}else alert("ここどこですか")}function addByPostListUrl(e,o){var t=JSON.parse(fetchUrl(e)),n=t.body.items;console.log("投稿の数:"+n.length);for(var i=0;i<n.length;i++)dlList.postCount++,1==o?(console.log(n[i]),addByPostInfo(n[i])):addByPostInfo(getPostInfoById(n[i].id));return t.body.nextUrl}function fetchUrl(e){var o=new XMLHttpRequest;return o.open("GET",e,!1),o.withCredentials=!0,o.send(null),o.responseText}function getPostInfoById(e){return JSON.parse(fetchUrl("https://api.fanbox.cc/post.info?postId="+e)).body}function addByPostInfo(e){var o=e.title,t=e.user.name;if(!isIgnoreFree||0!=e.feeRequired)if(null!=e.body)if("image"==e.type)for(var n=e.body.images,i=0;i<n.length;i++)addUrl(n[i].originalUrl,t+" - "+o+" "+(i+1)+"."+n[i].extension);else if("file"==e.type){var l=e.body.files;for(i=0;i<l.length;i++)addUrl(l[i].url,t+" - "+o+" "+l[i].name+"."+l[i].extension)}else if("article"==e.type){var r=e.body.imageMap,a=Object.keys(r);for(i=0;i<a.length;i++)addUrl(r[a[i]].originalUrl,t+" - "+o+" "+(i+1)+"."+r[a[i]].extension);var s=e.body.fileMap,d=Object.keys(s);for(i=0;i<d.length;i++)addUrl(s[d[i]].url,t+" - "+o+" "+s[d[i]].name+"."+s[d[i]].extension)}else console.log("不明なタイプ\n"+e.type+"@"+e.id);else console.log("取得できませんでした(支援がたりない？)\nfeeRequired: "+e.feeRequired+"@"+postId)}function addUrl(e,o){var t=new Object;t.url=e,t.filename=o,dlList.fileCount++,dlList.items.push(t)}function createLink(e,o){var t=document.createElement("a");document.body.appendChild(t),t.href=e,t.download=o}function startDownload(){var e=document.querySelectorAll("a"),o=0,t=setInterval(function(){e[o].click(),++o>=e.length&&clearInterval(t)},300)}main();
```
