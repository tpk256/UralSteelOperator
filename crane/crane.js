
SOURCE = null;

modal_tasks = [];

WAIT_STATE = 0;
WORK_STATE = 1;

FLAG_DOWNLOAD = 0;

CURRENT_STATE_TASK = WAIT_STATE;



const DATA = {
    button: null,
    sound: null,
    task: null,
}

const rectsNames = {
  1: "Склад №1",
  2: "Склад №3" ,
  3: "Склад №2" ,
  4: "Склад №4" ,
  5: "Склад №5" ,
  6: "Склад №6" ,

  7: "Стенд МОР" ,
  8: "Изолятор брака" ,
  9: "Кантователь" ,

  10: "Выход" ,
  11: "Вход" ,

  12: "Шлеппер Выход" ,
  13: "Шлеппер Вход",

  100: "...",
  101: "---"
}
function fillData(){
  let info = null;
//  const table = document.querySelector("table");
  const table_task = document.querySelector("#data-task");
  if ( DATA.task != null){
    info = DATA.task.info;
    table_task.querySelector('#number-task').innerText = DATA.task.id;
    table_task.querySelector('#from').innerText = rectsNames[DATA.task.from_];
    table_task.querySelector('#to').innerText = rectsNames[DATA.task.to];
    table_task.querySelector('#count-task').innerText = DATA.task.count;
  }

  if (!info) {
      info = {
        "number-order": "-",
        "steel-grade": "-",
        "number-melt": "-",
        "height": "-",
        "width": "-",
        "length": "-",
        "count": "-"
    }

    table_task.querySelector('#number-task').innerText = '-';
    table_task.querySelector('#from').innerText = '-';
    table_task.querySelector('#to').innerText = '-';
    table_task.querySelector('#count-task').innerText = '-';
  }
  
//  Object.keys(info).forEach(val => {
//        console.log(val)
//        const td = table.querySelector(`#${val}`);
//        td.innerText = info[val];
//  });

  

}

function drawPage(rectsData){
  svg.innerHTML = "";
  rectsData.forEach((rectData, index) => {

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

        rect.setAttribute('x', rectData.x);
        rect.setAttribute('y', rectData.y);
        rect.setAttribute('width', rectData.width);
        rect.setAttribute('height', rectData.height);
        rect.setAttribute('fill', 'white');
        rect.setAttribute('stroke', '#b6b171');
        rect.setAttribute('stroke-width', 0.5);
        rect.setAttribute('rx', 2);
        rect.setAttribute('ry', 2);
        rect.setAttribute('id', `place-${rectData.id}`);

        if (rectData.color){
          rect.setAttribute('stroke', '#838383');
          rect.setAttribute('fill', rectData.color);
        }

        svg.appendChild(rect);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

        const centerX = rectData.x + rectData.width / 2;
        const centerY = rectData.y + rectData.height * 0.85; //    / 2

        text.setAttribute('x', centerX);
        text.setAttribute('y', centerY);
        text.setAttribute('text-anchor', 'middle');             // Центрировать по горизонтали
        text.setAttribute('alignment-baseline', 'middle');      // Центрировать по вертикали
        text.setAttribute('font-size', '17');                    // Размер шрифта, можешь поиграть
        text.setAttribute("font-weight", "bold")
        text.setAttribute('fill', '#333');                      // Цвет шрифта
        text.textContent = `${rectData.name}`;                 // Текст в прямоугольнике

        svg.appendChild(text);

  }
  );
  fillData();
  if (!document.getElementById("arrow")) {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");

    marker.id = "arrow";
    marker.setAttribute("markerWidth", "6");  
    marker.setAttribute("markerHeight", "6"); 
    marker.setAttribute("refX", "5");  
    marker.setAttribute("refY", "3");  
    marker.setAttribute("orient", "auto");
    marker.setAttribute("markerUnits", "strokeWidth");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M 0 0 L 6 3 L 0 6 Z"); 
    path.setAttribute("fill", "black");

    marker.appendChild(path);
    defs.appendChild(marker);
    svg.appendChild(defs);
  }
  if (!DATA.task) return;
  const from_ = document.getElementById(`place-${DATA.task.from_}`);
    const to = document.getElementById(`place-${DATA.task.to}`);
    from_.setAttribute("fill", "green");
    to.setAttribute("fill", "red");
    const x0 = from_.getAttribute("x");
    const y0 = from_.getAttribute("y");

    const width0 = from_.getAttribute("width");
    const height0 = from_.getAttribute("height");

    const x1 = to.getAttribute("x");
    const y1 = to.getAttribute("y");

    const width1 = to.getAttribute("width");
    const height1 = to.getAttribute("height");

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.id = `line-${DATA.task.id}`;
    line.setAttribute("x1", Number(width0 / 2) + Number(x0) );
    line.setAttribute("y1", Number(y0) + Number(height0 / 2));
    line.setAttribute("x2", Number(x1) + Number(width1 / 2));
    line.setAttribute("y2", Number(y1)  + Number(height1 / 2));
    
    line.setAttribute("stroke-width", "5");
    line.setAttribute("marker-end", "url(#arrow)");
    if (CURRENT_STATE_TASK == WAIT_STATE) 
      line.setAttribute("stroke", "gray");
    else
      line.setAttribute("stroke", "yellow");
    
    svg.appendChild(line);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    console.log(line.x1)
    text.setAttribute('x', (line.x1.baseVal.value + line.x2.baseVal.value) / 2 + 5);
    text.setAttribute('y', (line.y1.baseVal.value + line.y2.baseVal.value) / 2 + 5);
    text.setAttribute('text-anchor', 'left');             // Центрировать по горизонтали
    text.setAttribute('alignment-baseline', 'middle');      // Центрировать по вертикали
    text.setAttribute('font-size', '17');                    // Размер шрифта, можешь поиграть
    text.setAttribute("font-weight", "bold")
    text.setAttribute('fill', 'blue');                      // Цвет шрифта
    text.textContent = `${DATA.task.count} штук`;                 // Текст в прямоугольнике

    svg.appendChild(text);
  

    

        

        
        
        
};



function init(){
    DATA.button = document.querySelector("button#start");

    DATA.button.innerText = 'Начать задание';
    DATA.button.id = "not_task";
    DATA.button.disabled = true
    DATA.button.addEventListener('click', changeStateTask);
    getSoundTask();
    drawPage(rectsData);
    setInterval(checkTask, 3000);
    setInterval(getSoundTask, 500);
}



function getSoundTask(){
    if (CURRENT_STATE_TASK == WAIT_STATE){
      if (DATA.task != null && FLAG_DOWNLOAD == 0){
          FLAG_DOWNLOAD = 2;
  
          fetch(
            `/task/audio/${DATA.task.id}`,
            {
              method: 'GET',
            }
          ).then(response => {
            if (!response.ok) {
              return {};
            }
            return response.json();
          }).then(
              data => {
                if (data.id == -1)
                  throw Error("error");

                
                  const base64 = data.audio;
                  console.log(base64)
  
                  // Преобразуем в бинарный буфер
                  const binaryString = atob(base64); // раскодировать base64 → бинарная строка
                  const len = binaryString.length;
                  const bytes = new Uint8Array(len);
  
                  for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                  }
  
                
                  const audioContext =  new (window.AudioContext || window.webkitAudioContext)();
                  DATA.sound = {
                    audioBuffer: null,
                    audioContext: audioContext
                  };
                  return bytes.buffer;
              }
  
          ).then((buffer) => { return DATA.sound.audioContext.decodeAudioData(buffer);}).then(
            (arrBuff) => {
              DATA.sound.audioBuffer = arrBuff;
              FLAG_DOWNLOAD = 1;
            }
          )
          
        }
      }
  }

 


function playSoundTask(){

  if (CURRENT_STATE_TASK == WAIT_STATE){
      if (SOURCE) return;

      if (FLAG_DOWNLOAD != 1) return;
      console.log("play");
      SOURCE = DATA.sound.audioContext.createBufferSource();
      SOURCE.buffer = DATA.sound.audioBuffer;
      SOURCE.connect(DATA.sound.audioContext.destination);
      SOURCE.start();

      SOURCE.onended = () => {
        SOURCE = null;
      };

  }
  
}

function changeStateTask(){


  let new_state = 0;
  if (!DATA.task) return; // задания нет
  if (DATA.task.state == 0){
    // FLAG_DOWNLOAD = 0
    new_state = 1;
  }
    
  else if (DATA.task.state == 1){
    new_state = -100;
    DATA.button.id = "start";
    DATA.button.innerText = 'Начать задание';
    
  }
      
  if (SOURCE)
    SOURCE.stop();

  fetch(
        `/task/${DATA.task.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              state: new_state
            }
          )
        }
      ).then(response => {
        if (!response.ok) {
          return {};
        }
        return response.json();
      }).then(data => {

        if (data.id != DATA.task.id)
          return;

        if (new_state == -100){
            DATA.task = null;
            SOURCE = null;
            DATA.sound = null;
            FLAG_DOWNLOAD = 0;
            CURRENT_STATE_TASK = WAIT_STATE;
            drawPage(rectsData);
            DATA.button.innerText = 'Начать задание';
            DATA.button.id = "not_task";
        }
        else {
            SOURCE = null;
            DATA.sound = null;
            CURRENT_STATE_TASK = WORK_STATE;
            DATA.task.state = WORK_STATE;

            DATA.button.id = "stop";
            DATA.button.innerText = 'Закончить задание';
            drawPage(rectsData);


        }

      })



}

function checkTask(){
    fetch(
        `/task/?count=1&info=1`,
        {
          method: 'GET',
        }
      ).then(response => {
        if (!response.ok) {
          return {};
        }
        return response.json();
      }).then(
        new_data => {
          if (new_data.count == 0){
              DATA.task = null;
              DATA.sound = null;
              FLAG_DOWNLOAD = 0;
              DATA.button.innerText = 'Начать задание';
              DATA.button.id = "not_task";

          }
          else{
            const task_backend = new_data.tasks[0];
            if (DATA.task == null){ //Пришёл новый таск
               FLAG_DOWNLOAD = 0;
                DATA.task = task_backend;
                DATA.sound = null;

                 if (DATA.task.state == WAIT_STATE){
                    DATA.button.id = "start";
                    DATA.button.innerText = 'Начать задание';
                    CURRENT_STATE_TASK = WAIT_STATE;
                }
                else if( DATA.task.state == WORK_STATE){

                  CURRENT_STATE_TASK = WORK_STATE;
                  if (SOURCE)
                      SOURCE.stop();

                  DATA.button.id = "stop";
                  DATA.button.innerText = 'Закончить задание';
              
                }
            }
            else{     //наш текущий удален или тот же
                if (DATA.task.id != task_backend.id){
                  FLAG_DOWNLOAD = 0;
                  // TODO обновить информацию текстовую о задании
                  DATA.task = task_backend;
                  DATA.sound = null;
                }
            }
            
          }
          drawPage(rectsData);

          if (DATA.task)
            DATA.button.disabled = false;
          else
            DATA.button.disabled = true;

          fillData();
        }
      )
}