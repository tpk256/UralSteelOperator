ID_TASKS = 0;


const TABLE_TASKS = {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null
};

WAIT = 0;
IN_PROGRESS = 1;
READY = 2;

COLOR_F_P = "green";
COLOR_S_P = "red";

MAIN_STATE = "main";
FIRST_POS_STATE = "fp";
SECOND_POS_STATE = "sp";
CREATE_TASK_STATE = "createT";
CURRENT_STATE = MAIN_STATE; // стейт установили

TEMP_DATA = null;

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
          rect.setAttribute('id', rectData.id);

          if (rectData.color){
            rect.setAttribute('stroke', '#838383');
            rect.setAttribute('fill', rectData.color);
          }

          svg.appendChild(rect);

          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

          const centerX = rectData.x + rectData.width / 2;
          const centerY = rectData.y + rectData.height / 2;

          text.setAttribute('x', centerX);
          text.setAttribute('y', centerY);
          text.setAttribute('text-anchor', 'middle');             // Центрировать по горизонтали
          text.setAttribute('alignment-baseline', 'middle');      // Центрировать по вертикали
          text.setAttribute('font-size', '6');                    // Размер шрифта, можешь поиграть
          text.setAttribute('fill', '#333');                      // Цвет шрифта
          text.textContent = `${rectData.name}`;                 // Текст в прямоугольнике

          svg.appendChild(text);


          rect.addEventListener('click', (e) => {     
            
            // TODO дописать обработку тех или иных стейтов

            switch (CURRENT_STATE){
              case MAIN_STATE:
                break;

              case FIRST_POS_STATE:
                TEMP_DATA["f_p"] = rect.id;
                rect.setAttribute('fill', COLOR_F_P);
                CURRENT_STATE = SECOND_POS_STATE;
                rectsData.forEach((place, _) => {
                  if (place.id == rect.id){
                      const field = TEMP_DATA['row'].querySelector(`#f_p${TEMP_DATA['rowId']}`);
                      field.innerText = place.name;
                  }
                });
                const field = TEMP_DATA['row'].querySelector(`#s_p${TEMP_DATA['rowId']}`);
                field.innerText = "...";
                break;
              
              case SECOND_POS_STATE:
                TEMP_DATA["s_p"] = rect.id;
                rect.setAttribute('fill', COLOR_S_P);
                CURRENT_STATE = CREATE_TASK_STATE;
                rectsData.forEach((place, _) => {
                  if (place.id == rect.id){
                      const field = TEMP_DATA['row'].querySelector(`#s_p${TEMP_DATA['rowId']}`);
                      field.innerText = place.name;
                  }
                });

                const count_field = TEMP_DATA['row'].querySelector(`#count${TEMP_DATA['rowId']}`);

                
                count_field.innerHTML = `<input type="text" placeholder="количество">`
                
                //TODO  делаем запрос на количество листов на первой позиции.
                const count_from_request = 0;
                count_field.querySelector("input").setAttribute("value", count_from_request);

                break;

            }
          }
          ); 


})

  
}


function initPage(rectsData, grayZone){
    

    TABLE = document.querySelector(".tasks tbody"); 
    const button_create = document.querySelector("#create");
    button_create.addEventListener("click", () => {


        // Проверка стейта на main
        if (CURRENT_STATE != MAIN_STATE){
          // Добавить при необходимости логику
          console.log("Не могу добавить задание, так как состояние не main")
          return;
        }
        
        let free_row = null;
        for (let i = 1; i <= 5; i++){
            if (TABLE_TASKS[i] == null){
              free_row = i;
              break;
            }
        }

        if (free_row == null){
          // Нужно сверху уведомление дать, что места для создания задачи нет.
        }
        else
          createTask(free_row);

    });
    data = null;
    
    // TODO 1)подгрузим текущие в процессе и тп задачи, а дальше создадим строку для добавления
    if (data == null){      //То есть задач созданных/в процессе НЕТ 

    }
    else{
        free_space = null;
    }
    drawPage(rectsData);
   }



  function createTask(rowId){
    console.log(rowId);
    CURRENT_STATE = FIRST_POS_STATE;
    const row = document.querySelector(`#t-${rowId}`);
    TEMP_DATA = {
      "row": row,
      "rowId": rowId
    };


    row.innerHTML = `
    <th>-</th>
    <th id="f_p${rowId}">Ожидаю</th>
    <th id="s_p${rowId}">-</th>
    <th id="count${rowId}">-</th>
    <th>-</th>
    <th>-</th>
    <th>-</th>
    <th><button class="save" id="save${rowId}">Save</th>
    `;
    row.querySelector("button").addEventListener("click", () => {
        if (CURRENT_STATE == CREATE_TASK_STATE){
            const count_field = row.querySelector(`#count${TEMP_DATA['rowId']} input`);

            TEMP_DATA['count'] = count_field.value; // TODO проверка на валидность ввода

            const data = {
              "from": TEMP_DATA['f_p'],
              "to": TEMP_DATA['s_p'],
              "count": TEMP_DATA['count'],
              "prioraty": TEMP_DATA['rowId'],
              "state": WAIT
            }

            //TODO отправляем post запрос с data
            ID_TASKS++;
            const resp = {
              "task_id": ID_TASKS,
            }
            if (resp.task_id != null){

              let from = "";
              let to = ""
              rectsData.forEach((place, _) => {
                if (place.id == TEMP_DATA['f_p']){
                    from = place.name;
                }
                if (place.id == TEMP_DATA['s_p']){
                  to = place.name;
                }
              });

              
              createRowData(TEMP_DATA['row'], resp.task_id, from, to, TEMP_DATA['count'], TEMP_DATA['rowId']);

              //todo нацепить обработчики на смену приоритета, edit-mode, remove.
              TABLE_TASKS[rowId] = data;
              TABLE_TASKS[rowId].task_id = resp.task_id; // обновляем инфу по
            }
            else{
              //TODO Как-нибудь уведомляем оператора, что задание не удалось создать
            }

            

            // восстановить цвета у ректанглов
            rectsData.forEach((rect, i) => {
                if (rect.id == TEMP_DATA['f_p'] || rect.id == TEMP_DATA['s_p']){
                  if (grayZone.includes(rect.id))
                    document.getElementById(rect.id).setAttribute("fill", "gray");
                  else
                    document.getElementById(rect.id).setAttribute("fill", "white");
                }
            });


            CURRENT_STATE = MAIN_STATE;
            TEMP_DATA = null;

        }
    });
    console.log(row);

  }
function createRowData(rowOb, task_id, from, to, count, rowId){

  rowOb.innerHTML = `
              <th>${task_id}</th>
              <th id="f_p${rowId}">${from}</th>
              <th id="s_p${rowId}">${to}</th>
              <th id="count${rowId}">${count}</th>
              <th id="prior-${rowId}"> 
                    <button class="up">⬆️</button>
                    <button class="down">⬇️</button>
              </th>
              <th id="state-${rowId}"> 
                ⏳
              </th>
              <th id="action-${rowId}">
                    <button id="edit-${rowId}">Edit-mode</button>
              </th>
              `;
  //TODO добавить обработчик для Edit-Mode

  // let from = "";
  //             let to = ""
  //             rectsData.forEach((place, _) => {
  //               if (place.id == TEMP_DATA['f_p']){
  //                   from = place.name;
  //               }
  //               if (place.id == TEMP_DATA['s_p']){
  //                 to = place.name;
  //               }
  //             });


  // const data = {
  //   "from": TEMP_DATA['f_p'],
  //   "to": TEMP_DATA['s_p'],
  //   "count": TEMP_DATA['count'],
  //   "prioraty": TEMP_DATA['rowId'],
  //   "state": WAIT
  // }

  rowOb.querySelector(".up").addEventListener("click" , () => {
    console.log(rowId - 1);
    console.log(TABLE_TASKS);
      if (rowId == 1 || TABLE_TASKS[rowId - 1].state != WAIT)
        return;

      //Todo запрос проверка на возможность смены приоритетов для этих двух тасков

      const row0 = document.querySelector(`#t-${rowId-1}`);
      const row1 = document.querySelector(`#t-${rowId}`);
      console.log("OKK")
      const task0 = TABLE_TASKS[rowId]; console.log(task0);
      const task1 =  TABLE_TASKS[rowId-1]; console.log(task1);
      
      createRowData(row0, task0.task_id, rectsNames[task0.from], rectsNames[task0.to], task0.count, rowId - 1);
      createRowData(row1, task1.task_id, rectsNames[task1.from], rectsNames[task1.to], task1.count, rowId);

      TABLE_TASKS[rowId] = task1;
      TABLE_TASKS[rowId-1] = task0;


  });
  rowOb.querySelector(".down").addEventListener("click", () => {

    //Todo запрос проверка на возможность смены приоритетов для этих двух тасков
      if (rowId == 5 || TABLE_TASKS[rowId + 1] == null)
        return; 

    

      const row0 = document.querySelector(`#t-${rowId+1}`);
      const row1 = document.querySelector(`#t-${rowId}`);

      const task0 = TABLE_TASKS[rowId]; console.log(task0);
      const task1 =  TABLE_TASKS[rowId+1]; console.log(task1);
      
      createRowData(row0, task0.task_id, rectsNames[task0.from], rectsNames[task0.to], task0.count, rowId + 1);
      createRowData(row1, task1.task_id, rectsNames[task1.from], rectsNames[task1.to], task1.count, rowId);

      TABLE_TASKS[rowId] = task1;
      TABLE_TASKS[rowId+1] = task0;

  });


}


function normalizeRowsData(){

}
  function editModeON(){}