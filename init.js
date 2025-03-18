ID_TASKS_FOR_TEST = 0;



tasks = {};
for (let i = 0; i < 5; i++){
  tasks[i] = {
    task: null,
    row: null
  }
}

rect_from_one_list = ["13", ];
cant_be_first_pos = ["12"];
states_task_work = {
  WAIT: 
    {"value": 0, "text": "Не начато"},
  IN_PROGRESS: 
    {"value": 1, "text": "Выполняется"},
  COMPLETED: 
    {"value": -100, "text": "Выполняется"},
}

states_task_create = {
  MAIN: 2,
  FIRST_POS_STATE: 3,
  SECOND_POS_STATE: 4,
  SAVE_TASK_STATE: 5

}

CURRENT_STATE = states_task_create.MAIN; // стейт установили

TEMP_DATA = {
  row: null,
  task: null
};

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
          const centerY = rectData.y + rectData.height * 0.85; //    / 2

          text.setAttribute('x', centerX);
          text.setAttribute('y', centerY);
          text.setAttribute('text-anchor', 'middle');             // Центрировать по горизонтали
          text.setAttribute('alignment-baseline', 'middle');      // Центрировать по вертикали
          text.setAttribute('font-size', '5');                    // Размер шрифта, можешь поиграть
          text.setAttribute("font-weight", "bold")
          text.setAttribute('fill', '#333');                      // Цвет шрифта
          text.textContent = `${rectData.name}`;                 // Текст в прямоугольнике

          svg.appendChild(text);


          rect.addEventListener('click', (e) => {     
            
            // TODO дописать обработку тех или иных стейтов

            switch (CURRENT_STATE){
              case states_task_create.MAIN:
                break;

              case states_task_create.FIRST_POS_STATE:

                if (cant_be_first_pos.includes(rect.id))
                  return;
                TEMP_DATA.from = rect.id;
                rect.setAttribute('fill', "green");
                CURRENT_STATE = states_task_create.SECOND_POS_STATE;


                if (rect_from_one_list.includes(TEMP_DATA.from)){
                    TEMP_DATA.count = 1;
                    TEMP_DATA.limit = true;
                }
                else{

                }
                //Todo запрос на сервер по количеству для позиции from
                //count


                
        
                console.log(` количество !!${TEMP_DATA.count}`)
                normalizeTasks();
                break;
              
              case states_task_create.SECOND_POS_STATE:
                if (TEMP_DATA.from == rect.id)
                  return; // не можем указать одну и ту же позиция как для from, так и to
                TEMP_DATA.to = rect.id;
                rect.setAttribute('fill', "red");


                let res_count = tasks[TEMP_DATA.rowId].row.querySelector("input").value;
                TEMP_DATA.count = res_count;


                normalizeTasks();

                const i = TEMP_DATA.rowId;
                const btn_cancel = tasks[TEMP_DATA.rowId].row.querySelector(`#cancel-${i}`);
                if (btn_cancel)
                  btn_cancel.disabled = true;

                tasks[TEMP_DATA.rowId].row.querySelector("input").disabled = true;

                


                CURRENT_STATE = states_task_create.MAIN;
                setTimeout( () => {
                    //TODO Запрос на создание таска
                    TEMP_DATA.id = ++ID_TASKS_FOR_TEST;
                    TEMP_DATA.state = states_task_work.WAIT.value;
                    TEMP_DATA = null;
                    drawPage(rectsData, grayZone);
                    normalizeTasks();


                }, 1500); 
                break;

            }
          }
          ); 


})

  
}


function initPage(rectsData, grayZone){
    
    TABLE = document.querySelector(".tasks tbody"); 
    //TODO подгружаем задачи со стейтами "not work" и "in working"
    const data_upload = null;


    for (let i = 0; i < 5; i++)
      tasks[i].row = document.querySelector(`#t-${i}`);

    if (data_upload){
        //Тут заполняются данные
    }
    else {
      for (let i = 0; i < 5; i++)
        tasks[i].task = null;
    }
    
    normalizeTasks();

    drawPage(rectsData);
}


function normalizeTasks(){
  for (let i = 0; i < 5; i++)
    if (tasks[i].task && tasks[i].task.state == states_task_work.COMPLETED.value)
      tasks[i].task = null;

  for (let i = 0; i < 5; i++)
      tasks[i].row.innerHTML = "";  
  
  //Теперь у нас идут подряд задачи
  for (let i = 0; i < 5; i++){
    if (tasks[i].task == null){
      for (let j = i + 1; j < 5; j++){
        if (tasks[j].task != null){
          tasks[i].task = tasks[j].task;
          tasks[j].task = null;
          break;
        }
      }
    }
  }

  console.log(`Для temp POSLE нормализации`);
  console.log(TEMP_DATA);
  
  for (let i = 0; i < 5; i++){
    if (tasks[i].task == null)
      break;

    if (tasks[i].task.id == -1)
      TEMP_DATA.rowId = i;
    
    const row = tasks[i].row;
    const task = tasks[i].task;


 
    

    temp_html = `
    <td>${task.id}</td>
    <td>${rectsNames[task.from]}</td>
    <td>${rectsNames[task.to]}</td>
    `;
    
    let disabled_count_field = false;
    if (task.from == 100)
      disabled_count_field = true;
    if (task.to != 101)
      disabled_count_field = true;

    if(task.limit == true)
      disabled_count_field = true;


    if (task.id == -1){
      //Таск только создается;
      temp_html += `
      <td><input type="number" id="quantity-${i}" name="quantity" min="1" max="1000" step="1" value="${task.count}" ${disabled_count_field? "disabled": ""}></td>
      <td>Не создано</td>
      <td>
        <button class="color" id ="cancel-${i}">
          <img src="cancel.svg">
        </button>
      </td>
      `;

    


    }
    else if (task.state == states_task_work.WAIT.value){
      temp_html += `
      <td><input type="number" id="quantity-${i}" name="quantity" min="1" max="1000" step="1" value="${task.count}" ${disabled_count_field? "disabled": ""}></td>
      <td>${states_task_work.WAIT.text}</td>
      <td>
        <button class="color" id ="remove-${i}"> 
          <img src="delete.svg">
        </button>
      </td>
      `;
    }
    else{
      temp_html += `
      <td><input type="number" id="quantity-${i}" name="quantity" min="1" max="1000" step="1" value="${task.count}" disabled></td>
      <td>${states_task_work.IN_PROGRESS.text}</td>
      `;
    }

    row.innerHTML = temp_html;

    const cancel_button = row.querySelector(`#cancel-${i}`);
    if (cancel_button){
      cancel_button.addEventListener("click", () => {
        tasks[i].task = null;
        TEMP_DATA = null;
        CURRENT_STATE = states_task_create.MAIN;
        drawPage(rectsData, null);
        normalizeTasks();

      });
    }
    const rem_button = row.querySelector(`#remove-${i}`);
    const input_field = row.querySelector(`#quantity-${i}`)
    if (rem_button != null){


      // Todo дописать обработчик
      input_field.addEventListener('input', () => {

      });

      rem_button.addEventListener('click', () => {

        const row_id = i;
        console.log(`УДаляем ${row_id}`);
        if (tasks[row_id].task.id != -1){
           // TODO отправляем запрос на удаление нашего таска
        }

        tasks[i].task = null;
        console.log(tasks);
        console.log(`Для temp DO нормализации`);
        console.log(TEMP_DATA);
  
        normalizeTasks();

    });

  }

  };

  if (CURRENT_STATE != states_task_create.MAIN)
    return;

  let empty_row  = -1;
  for (let i = 0; i < 5; i++){
    if (tasks[i].task == null){
      empty_row = i;
      break;
    }
  }
  if (empty_row < 0)
    return;


  const row_fill = tasks[empty_row].row;
  row_fill.innerHTML = `
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>
      <button id="add-${empty_row}">
        <img src="add.svg">
      </button>
    </td>`;
    
    row_fill.querySelector(`#add-${empty_row}`).addEventListener('click', () => {
        CURRENT_STATE = states_task_create.FIRST_POS_STATE;
        
        TEMP_DATA = {
          id: -1,
          rowId: empty_row,
          from: 100,
          to: 101,
          count: 1,
          state: -1,
          limit: false
        };
        tasks[empty_row].task = TEMP_DATA;
        console.log(empty_row);
        console.log(tasks);
        normalizeTasks();


    });
  

};




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


