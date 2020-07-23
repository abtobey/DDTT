        //get this variable from input
        var lineLength= 64;
        //this way the numbering system works with >100 chute per line, other wise there would be chutes with the same numbers. IRL the numbering system is different for every sorter but I'm not gonna program that in.
        var chuteNum=1;
        if(lineLength > 100){
            chuteNum=10;
        }
        //placeholder value if input box left blank
        var inductors =5;
        
        //get this variable from input
        var sweepSpeed=256;

        var trayCount=lineLength * 2 + 200;
        //PPH of 1800 corresponds to an inductSpeed variable of 6. 
        var inductSpeed=6;


        //default value is traycount because 0 is a position on the sorter, positions go from 0 - trayCount -1 so trayCount is first unused number
        const traysInner = new Array(trayCount).fill(trayCount);
        const recircInner = new Array(trayCount).fill(0);
        const traysOuter = new Array(trayCount).fill(trayCount);
        const recircOuter = new Array(trayCount).fill(0);
        
        //placeholder value for if input box left blank
        var noRead=0.05;

        var reject = lineLength -3;    
        var nrChute = lineLength -1;  
        var reject2 = lineLength * 2 + 97;
        var nrChute2 = lineLength * 2 + 99;      
        var j;
        var sweepers=0;
        var chute=0;
        var line=0;
        var txt="";
        var side = "";
        var bags=1;
        var pieceCount=0;
        var trayPos=0;
        var openTray=0;
        var PPH=0;
        var nrPieceCount=0;
        var swept = "";
        var assigned=0;
        var totalScans=0;
        var bagCount=0;
        var derates=0;
        var maxRecirc=0;
        var PPHtotal=0;
        var deratesTotal=0;
        var nrTotal=0;
        var maxRecircTotal=0;
        var bagCountTotal=0;
        var minutesElapsed=0;
        var sortSpan=60;
        var sorterType=0;
        var totalInductors=0;
        var CDsweep;
        const canInductIn= [];
        const canInductOut= [];
        const CanSweepIn= [];
        const currentLocIn= [];
        const CanSweepOut= [];
        const currentLocOut= [];
        


        function addRow(minute){
            minutesElapsed=minute;
            let stats= document.getElementById("stats");
            let row=stats.insertRow(stats.rows.length-1);
            let c1=row.insertCell(0);
            c1.innerHTML=minute;
            let c2=row.insertCell(1);
            c2.innerHTML=(PPH + derates);
            let c3=row.insertCell(2);
            c3.innerHTML=(PPH);
            PPHtotal += PPH;
            let c4=row.insertCell(3);
            c4.innerHTML=(PPH * 60);
            PPH=0;
            let c5=row.insertCell(4);
            c5.innerHTML=(derates);
            deratesTotal+= derates;
            derates=0;
            let c6=row.insertCell(5);
            c6.innerHTML=(nrPieceCount);
            nrTotal += nrPieceCount;
            nrPieceCount=0;
            let c7=row.insertCell(6);
            c7.innerHTML=(maxRecirc);
            maxRecircTotal += maxRecirc;
            maxRecirc=0;
            let c8=row.insertCell(7);
            c8.innerHTML=(bagCount);
            bagCountTotal += bagCount;
            bagCount=0;

        }
        function updateTotals(){
            let stats= document.getElementById("stats");
            let footer = stats.rows.length-1;
            stats.rows[footer].cells[1].innerHTML= PPHtotal + deratesTotal;
            stats.rows[footer].cells[2].innerHTML= PPHtotal;
            stats.rows[footer].cells[3].innerHTML= Math.floor(PPHtotal * 60/sortSpan);
            stats.rows[footer].cells[4].innerHTML= deratesTotal;
            stats.rows[footer].cells[5].innerHTML= nrTotal;
            stats.rows[footer].cells[6].innerHTML= maxRecircTotal;
            stats.rows[footer].cells[7].innerHTML= bagCountTotal;
        }
        function assign()
        {
            //a pre determined percentage of pieces will no read and go to a reject chute, this randomly assigns those. The range of chutes which can be assigned depends on the sorter type
            if (sorterType==0){
                if(Math.random() < noRead){
                    nrPieceCount ++;
                    return nrChute;
                }
                else{
                    assigned= Math.floor(Math.random() * (lineLength *2-4));
                    if(assigned >= lineLength - 4)
                    {
                        assigned += 104;
                    }
                    return assigned;
                }
            }else if (sorterType==1){
                if(Math.random() < noRead){
                    nrPieceCount ++;
                    return nrChute;
                }
                else{
                    assigned= Math.floor(Math.random() * ((lineLength -4)*2));
                    if(assigned >= lineLength - 4)
                    {
                        assigned += 104;
                    }
                    return assigned;
                }
            }
            else if (sorterType==2){
                if(Math.random() < noRead){
                    nrPieceCount ++;
                    return nrChute;
                }
                else{
                    assigned= Math.floor(Math.random() * (lineLength -4));
                    return assigned;
                }
            }
        }

        function moveTrays()
        {
            //get these variable from inputs
            if(document.getElementById("inductorsPerPlatform").value !=""){
                inductors =parseInt(document.getElementById("inductorsPerPlatform").value);
            }
                        
            switch(document.getElementById("sorterType").value){
            case "Two induct platforms":
                sorterType=0;
                totalInductors=inductors;
                CDsweep=lineLength;
                document.querySelector(".platform3").setAttribute("style","background: white");
                document.querySelector(".platform4").setAttribute("style","background: white");
                break;
            case "Four induct platforms with flow splitters":
                sorterType=1;
                totalInductors=inductors*2;
                CDsweep=lineLength-4;
                break;
            case "Four induct platforms with direct feeds":
                sorterType=2;
                totalInductors=inductors*2;
                CDsweep=lineLength-4;
                break;
            }
            for(let i=0; i<totalInductors; i++){
                canInductIn.push(0);
                canInductOut.push(0);
            }
            if(document.getElementById("nrPercent").value !=""){
                noRead =parseFloat(document.getElementById("nrPercent").value)/100;
            }
            else{
                noRead=0.05;
            }
            
            var intCheck=parseInt(document.getElementById("sweepersPerLine").value);
            if(Number.isInteger(intCheck)){
                sweepers=intCheck;
            }
            //default value is 2 
            else{
            sweepers=2;
            console.log(sweepers);
            document.getElementById("test").innerHTML="incorrect value entered for number of sweepers" + noRead + " " + sorterType + " " + document.getElementById("sorterType").value;}
            
            for(let i=0; i< sweepers*2; i++){
                CanSweepIn.push(0);
                CanSweepOut.push(0);
                currentLocIn.push(0);
                currentLocOut.push(0);
            }
            var separation= Math.floor(lineLength/sweepers);
            for(i=0; i< sweepers; i++)
            {
                currentLocIn[i]= separation* i;
                currentLocOut[i]= separation* i;
            }
            for(i=sweepers; i< sweepers * 2; i++)
            {
                currentLocIn[i]= separation* (i - sweepers);
                currentLocOut[i]= separation* (i - sweepers);
            }
            //get span
            if(document.getElementById("sortSpan").value !=""){
                sortSpan =parseInt(document.getElementById("sortSpan").value);
            }
            var minutesLeft=sortSpan;
            var timerInterval=setInterval(function(){
                minutesLeft--;
                oneMinute();

                if(minutesLeft ===0){
                    clearInterval(timerInterval);
                }

            }, 250);
        }
        
        function oneMinute(){
            //each time j increments is the amount of time for the sorter to move one tray length= approx. .25 seconds
            for (let j=0; j<=214; j++)
            {
                if(traysInner[(lineLength+2*(inductors+1)+trayPos)%trayCount] != trayCount)
                {
                    derates++;
                }
                if(traysOuter[(lineLength+2*(inductors+1)+trayPos)%trayCount] != trayCount)
                {
                    derates++;
                }
                //add row to table every minute
                if(j % 214==0 && j > 0){
                    addRow(j/214);
                }

                //tells me if the loop started
                trayPos +=1;
                //moves trays forward, resets when it gets to end of loop
                if(trayPos >= trayCount){
                    trayPos=0;
                }
                //sweepers: it takes about 50 seconds or 200 increments to sweep a bag, but this value can be adjusted
                //B Line
                for(let k=0; k< sweepers; k++)
                {
                    if(CanSweepIn[k] > 0)
                    {
                        CanSweepIn[k] -= 1;
                    }
                    else
                    {
                        for(let m=0; m< lineLength -4; m++)
                        {
                            if(CanSweepIn[k] ==0)
                            {
                                if(currentLocIn[k] + m < lineLength -4)
                                {
                                    if(document.getElementById("toprows").rows[2].cells[currentLocIn[k] + m].innerHTML >= 35)
                                    {
                                        document.getElementById("toprows").rows[2].cells[currentLocIn[k] + m].innerHTML =0;
                                        document.getElementById("toprows").rows[2].cells[currentLocIn[k] + m].style.backgroundColor="white";
                                        CanSweepIn[k] =sweepSpeed;
                                        console.log((currentLocIn[k] + m) + "sweeper # " + k);
                                        bagCount++;
                                    }
                                }
                                else if(currentLocIn[k] - m >= 0)
                                {
                                     if(document.getElementById("toprows").rows[2].cells[currentLocIn[k] - m].innerHTML >= 35)
                                    {
                                        document.getElementById("toprows").rows[2].cells[currentLocIn[k] - m].innerHTML =0;
                                        document.getElementById("toprows").rows[2].cells[currentLocIn[k] - m].style.backgroundColor="white";
                                        CanSweepIn[k] =sweepSpeed;
                                        console.log(currentLocIn[k] + m);
                                        bagCount++;
                                    }
                                }
                            }
                        }
                    }
                }
                //this is not ideal but just getting it to work
                //C Line
                for(k=sweepers; k< sweepers *2; k++)
                {
                    if(CanSweepIn[k] > 0)
                    {
                        CanSweepIn[k] -= 1;
                    }
                    else
                    {
                        //CDsweep variable is the amount of chutes the sweepers will use on the lower lines. For a 2 induct setup, the whole line is used, otherwise the last 4 are rejects and the sweepers don't sweep those
                        for(m=0; m< CDsweep; m++)
                        {
                            if(CanSweepIn[k] ==0)
                            {
                                if(currentLocIn[k] + m < CDsweep)
                                {
                                    if(document.getElementById("bottomrows").rows[1].cells[currentLocIn[k] + m].innerHTML >= 35)
                                    {
                                        document.getElementById("bottomrows").rows[1].cells[currentLocIn[k] + m].innerHTML =0;
                                        document.getElementById("bottomrows").rows[1].cells[currentLocIn[k] + m].style.backgroundColor ="white";
                                        CanSweepIn[k] =sweepSpeed;
                                        bagCount++;
                                    }
                                }
                                else if(currentLocIn[k] - m >= 0)
                                {
                                     if(document.getElementById("bottomrows").rows[1].cells[currentLocIn[k] - m].innerHTML >= 35)
                                    {
                                        document.getElementById("bottomrows").rows[1].cells[currentLocIn[k] - m].innerHTML =0;
                                        document.getElementById("bottomrows").rows[1].cells[currentLocIn[k] - m].style.backgroundColor = "white";
                                        CanSweepIn[k] =sweepSpeed;
                                        bagCount++;
                                    }
                                }
                            }
                        }
                    }
                }
                //A Line
                for(k=0; k< sweepers; k++)
                {
                    if(CanSweepOut[k] > 0)
                    {
                        CanSweepOut[k] -= 1;
                    }
                    else
                    {
                        for(m=0; m< lineLength -4; m++)
                        {
                            if(CanSweepOut[k] ==0)
                            {
                                if(currentLocOut[k] + m < lineLength -4)
                                {
                                    if(document.getElementById("toprows").rows[1].cells[currentLocOut[k] + m].innerHTML >= 35)
                                    {
                                        document.getElementById("toprows").rows[1].cells[currentLocOut[k] + m].innerHTML =0;
                                        document.getElementById("toprows").rows[1].cells[currentLocOut[k] + m].style.backgroundColor = "white";
                                        CanSweepOut[k] =sweepSpeed;
                                        swept= swept + " " +(currentLocOut[k] + m);
                                        bagCount++;
                                    }
                                }
                                else if(currentLocOut[k] - m >= 0)
                                {
                                     if(document.getElementById("toprows").rows[1].cells[currentLocOut[k] - m].innerHTML >= 35)
                                    {
                                        document.getElementById("toprows").rows[1].cells[currentLocOut[k] - m].innerHTML =0;
                                        document.getElementById("toprows").rows[1].cells[currentLocOut[k] - m].style.backgroundColor = "white";
                                        CanSweepOut[k] =sweepSpeed;
                                        swept= swept + " " +(currentLocOut[k] + m);
                                        bagCount++;
                                    }
                                }
                            }
                        }
                    }
                }
                //D Line
                for(k=sweepers; k< sweepers *2; k++)
                {
                    if(CanSweepOut[k] > 0)
                    {
                        CanSweepOut[k] -= 1;
                    }
                    else
                    {
                        for(m=0; m< CDsweep; m++)
                        {
                            if(CanSweepOut[k] ==0)
                            {
                                if(currentLocOut[k] + m < CDsweep)
                                {
                                    if(document.getElementById("bottomrows").rows[2].cells[currentLocOut[k] + m].innerHTML >= 35)
                                    {
                                        document.getElementById("bottomrows").rows[2].cells[currentLocOut[k] + m].innerHTML =0;
                                        document.getElementById("bottomrows").rows[2].cells[currentLocOut[k] + m].style.backgroundColor="white";
                                        CanSweepOut[k] =sweepSpeed;
                                        bagCount++;
                                    }
                                }
                                else if(currentLocOut[k] - m >= 0)
                                {
                                     if(document.getElementById("bottomrows").rows[2].cells[currentLocOut[k] - m].innerHTML >= 35)
                                    {
                                        document.getElementById("bottomrows").rows[2].cells[currentLocOut[k] - m].innerHTML =0;
                                        document.getElementById("bottomrows").rows[2].cells[currentLocOut[k] - m].style.backgroundColor="white";
                                        CanSweepOut[k] =sweepSpeed;
                                        bagCount++;
                                    }
                                }
                            }
                        }
                    }
                }
                //each inductor can run at PPH of about 1500, meaning if constant speed and all trays empty, they fill every 8th tray
                for(k=0; k<inductors; k++)
                {
                    //if tray open and inductor ready then fill tray
                    if(canInductIn[k]==0)
                    {
                        openTray=(lineLength + 2* k + trayPos) % trayCount;
                        if(traysInner[openTray] ==trayCount)
                        {
                            //because the extra induct actually feeds the low numbered chutes, the first induct needs to generate high numbers if each platform only feeds one
                            if(sorterType==2){
                                traysInner[openTray] = assign() + 100 + lineLength;   
                            }else{
                            traysInner[openTray] = assign();
                            }
                        }
                        //induct speed set to 6 by default, that = 1800 PPH
                        canInductIn[k]=inductSpeed;
                    }
                    else{
                        canInductIn[k] -=1;
                    }
                    //second set of inducts for if sorter has 4 platforms (all options except 0)
                    if(sorterType !=0)
                    {
                        if(canInductIn[k + inductors]==0)
                        {
                            openTray=(lineLength *2 + 2* k + trayPos +100) % trayCount;
                            if(traysInner[openTray] ==trayCount)
                            {
                                traysInner[openTray] = assign()
                            }
                            
                            canInductIn[k+ inductors]=inductSpeed;
                        }
                        else{
                            canInductIn[k + inductors] -=1;
                        }
                    }
                    //Repeat for Outer Loop
                    if(canInductOut[k]==0)
                    {
                        openTray=(lineLength + 2* k + trayPos) % trayCount;
                        if(traysOuter[openTray] ==trayCount)
                        {
                            if(sorterType==2){
                                traysOuter[openTray] = assign() + 100 + lineLength;   
                            }else{
                            traysOuter[openTray] = assign();
                            }
                        }
                        //induct speed set to 7 by default, that = 1800 PPH
                        canInductOut[k]=inductSpeed;
                    }
                    else{
                        canInductOut[k] -=1;
                    }
                    if(sorterType !=0)
                    {
                        if(canInductOut[k + inductors]==0)
                        {
                            openTray=(lineLength *2 + 2* k + trayPos +100) % trayCount;
                            if(traysOuter[openTray] ==trayCount)
                            {
                                if (sorterType==2){
                                    traysOuter[openTray] = assign();
                                }
                                else if (sorterType==1){
                                    traysOuter[openTray] = assign()
                                }
                            }
                            //induct speed set to 7 by default, that = 1800 PPH
                            canInductOut[k+ inductors]=inductSpeed;
                        }
                        else{
                            canInductOut[k + inductors] -=1;
                        }
                    }
                }
                //loop through trays to see if position matches up with destination of piece
                for(k=0; k<trayCount; k++)
                {
                    if((k + trayPos) % trayCount == traysInner[k]){
                        if (traysInner[k] < lineLength){
                            side="toprows";
                            line=2;
                            chute=traysInner[k];
                        }
                        //100 tray buffer between sides, must subtract 100 if on bottom side
                        else{
                            side="bottomrows";
                            line=1;
                            chute=traysInner[k] -(100 + lineLength);
                        }
                        //if < 35 pieces in the bag, it can drop the piece, otherwise chute is full and piece recircs
                        pieceCount=parseInt(document.getElementById(side).rows[line].cells[chute].innerHTML);
                        if(pieceCount < 35 && ((traysInner[k] != reject && traysInner[k] != nrChute && traysInner[k] != reject2 && traysInner[k] != nrChute2)||(sorterType==0 && (traysInner[k]== nrChute2 || traysInner[k]==reject2)))){
                            pieceCount ++;
                            document.getElementById(side).rows[line].cells[chute].innerHTML = pieceCount;
                            if(pieceCount== 35){
                                document.getElementById(side).rows[line].cells[chute].style.backgroundColor = "purple";
                            }
                            traysInner[k] =trayCount;
                            recircInner[k] =0;
                            PPH++;
                        }
                        //reject is the chute that catches max recirc pieces. The logic of a parcel sorter is that it tries to drop a piece 3 times and if chute is full 3 times in a row, it goes to max recirc bin
                        else if(traysInner[k]== reject){
                            document.getElementById(side).rows[line].cells[chute].innerHTML = pieceCount + 1;
                            traysInner[k] =trayCount;
                            recircInner[k] =0;
                            maxRecirc++;
                        }
                        else if(traysInner[k] == nrChute || traysInner[k]==nrChute2){
                            document.getElementById(side).rows[line].cells[chute].innerHTML = pieceCount + 1;
                            traysInner[k] =trayCount;
                            recircInner[k] =0;
                        }
                        else{
                            recircInner[k] ++;
                            //derates++;
                            if (recircInner[k] ==3){
                                traysInner[k]=reject;
                            }
                        }
                    }
                    if((k + trayPos) % trayCount == traysOuter[k]){
                        if (traysOuter[k] < lineLength){
                            side="toprows";
                            line=1;
                            chute=traysOuter[k];
                        }
                        //100 tray buffer between sides, must subtract 100 if on bottom side
                        else{
                            side="bottomrows";
                            line=2;
                            chute=traysOuter[k] -(100 + lineLength);
                        }
                        //if < 35 pieces in the bag, it can drop the piece, otherwise chute is full and piece recircs
                        pieceCount=parseInt(document.getElementById(side).rows[line].cells[chute].innerHTML);
                        if(pieceCount < 35 && traysOuter[k] != reject && traysOuter[k] != nrChute && traysOuter[k] != reject2 && traysOuter[k] != nrChute2){
                            pieceCount ++;
                            document.getElementById(side).rows[line].cells[chute].innerHTML = pieceCount;
                            if(pieceCount== 35){
                                document.getElementById(side).rows[line].cells[chute].style.backgroundColor = "purple";
                            }
                            traysOuter[k] =trayCount;
                            recircInner[k] =0;
                            PPH++;
                        }
                        //reject is the chute that catches max recirc pieces. The logic of a parcel sorter is that it tries to drop a piece 3 times and if chute is full 3 times in a row, it goes to max recirc bin
                        else if(traysOuter[k]== reject){
                            document.getElementById(side).rows[line].cells[chute].innerHTML = pieceCount + 1;
                            traysOuter[k] =trayCount;
                            recircOuter[k] =0;
                            maxRecirc++;
                        }
                        else if(traysOuter[k] == nrChute || traysOuter[k] == nrChute2){
                            document.getElementById(side).rows[line].cells[chute].innerHTML = pieceCount + 1;
                            traysOuter[k] =trayCount;
                            recircOuter[k] =0;
                        }
                        else{
                            recircOuter[k] ++;
                            //derates++;
                            if (recircOuter[k] ==3){
                                traysOuter[k]=reject;
                            }
                        }
                    }
                }

            }
            updateTotals();
            document.getElementById("test").innerHTML=txt +trayPos;
        }
        