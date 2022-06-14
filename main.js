//TODO:
//playhead表示
//イベントリスナ

//未使用
const playhead = {
    x: 0,//変更を適用するには、refresh()が必須
    width: 3,
    height: 60,
    color: "gray",
}



init(document.getElementById("multiRange_canvas"),{middleColor:"black"})

function init(canvasElm, config){
    const canvas = canvasElm;
    const ctx = canvas.getContext("2d");
    const clip = {};

    clip.startTime = config.startTime || 0;
    clip.leftThumbColor = config.leftThumbColor || "green";
    clip.middleColor = config.middleColor || "blue";
    clip.rightThumbColor = config.rightThumbColor || "red";
    clip.leftThumbWidth = config.leftThumbWidth || 5;
    clip.rightThumbWidth = config.rightThumbWidth || 5;
    clip.minDuration = config.minDuration || 5;
    clip.backgroundColor = config.backgroundColor || "wheat";
    clip.backgroundDuration = config.backgroundDuration || 500;
    clip.duration = config.duration || clip.backgroundDuration;
    clip.height = config.height || 30;
    
    canvas.width = clip.backgroundDuration;
    canvas.height = clip.height;

    //------------------------------------------------
    let leftResize = false;//左にマウスがいる
    let rightResize = false;
    let mousehover = false;
    let mousedown = false;
    let clipMove = false;

    canvas.addEventListener("mouseover",()=>{
        mousehover = true;
    });
    canvas.addEventListener("mouseout",()=>{
        mousehover = false;
    })

    canvas.addEventListener("mousedown", (e) => {
        mousedown = true;

        // マウスの座標をCanvas内の座標とあわせるため
        const rect = canvas.getBoundingClientRect();
        const point = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        
        const x = clip.startTime;
        const w = clip.duration;

        if(x <= point.x && point.x <= x + clip.leftThumbWidth){
            leftResize = true;
        }
        else if(x+w-clip.rightThumbWidth <= point.x && point.x <= x+w){
            rightResize = true;
        }
        else if(x <= point.x && point.x <= x + w){
            clipMove = true;
        }
    });


    window.addEventListener("mousemove",(e)=>{
        // マウスの座標をCanvas内の座標とあわせるため
        const rect = canvas.getBoundingClientRect();
        const point = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        //カーソル変更
        if(!mousedown){

            if(!mousehover){
                document.documentElement.style.cursor = "auto";
                return;
            }
        
            const x = clip.startTime;
            const w = clip.duration;

            if(x <= point.x && point.x <= x + clip.leftThumbWidth){
                document.documentElement.style.cursor = "e-resize";
            }
            else if(x+w-clip.rightThumbWidth <= point.x && point.x <= x+w){
                document.documentElement.style.cursor = "e-resize";
            }
            else if(x <= point.x && point.x <= x + w){
                document.documentElement.style.cursor = "grab";
            }
            else{
                document.documentElement.style.cursor = "auto";
            }


            return;
        }


        if(!leftResize && !rightResize && clipMove){
            //マウスに付いて移動
            clip.startTime = point.x;
        }
        else{
            //リサイズ
            if(leftResize){
                const duration = point.x - clip.startTime;
                clip.startTime = clip.startTime + duration;
                clip.duration = clip.duration - duration;

                if(clip.duration < clip.minDuration){
                    clip.duration = clip.minDuration;
                }
            }
            else{
                const duration = point.x - (clip.startTime + clip.duration);
                clip.duration = clip.duration + duration;

                if(clip.duration < clip.minDuration){
                    clip.duration = clip.minDuration;
                }
            }
        }
        
        refresh();
    });


    window.addEventListener("mouseup",(e)=>{
        mousedown = false;

        //クリップのstartがマイナスにいれば
        if(clip.startTime < 0){
            // const slide_duration = 0 - clip.startTime;
            // clip.startTime += slide_duration;
            clip.startTime = 0;
        }
        //クリップが右にはみ出していれば
        if(clip.startTime+clip.duration > clip.backgroundDuration){
            // const slide_duration = 0 - clip.startTime;
            // clip.startTime += slide_duration;
            clip.startTime = clip.backgroundDuration - clip.duration;
        }
        //クリップの長さが全体を超えていれば
        if(clip.duration > clip.backgroundDuration){
            clip.duration = clip.backgroundDuration;
            clip.startTime = 0;
        }

        refresh();

        leftResize = false;
        rightResize = false;
    });


    //クリップを描画
    function drawClip(){
        const x = clip.startTime;//*定数
        const y = 0;
        const w = clip.duration;
        const h = clip.height;

        ctx.fillStyle = clip.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = clip.middleColor;
        ctx.fillRect(x,y,w,h);

        ctx.fillStyle = clip.leftThumbColor;
        ctx.fillRect(x,y, clip.leftThumbWidth, h);

        ctx.fillStyle = clip.rightThumbColor;
        ctx.fillRect(x + w - clip.rightThumbWidth,  y,  clip.rightThumbWidth, h);
    }


    //画面を更新
    function refresh(){
        ctx.clearRect(0,0, canvas.clientWidth, canvas.height);
        
        drawClip();
        
        //playheadを描画
        // ctx.fillStyle = playhead.color;
        // ctx.fillRect(playhead.x, 0, playhead.width, playhead.height);
    }

    refresh();

    
    return clip;
}

