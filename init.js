ID_TASKS_FOR_TEST = 0;


modal_tasks = [];
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
    {"value": -100, "text": "Завершено"},
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
                
                // for (let i = 0; i < 5; i++){
                //   if (tasks[i].task && tasks[i].task.id != -1){     // Типа чтобы не ломалось всё если создать второй таск с тем же from
                //     if (tasks[i].task.from == rect.id) return;
                //   }
              
                // }
                if (cant_be_first_pos.includes(rect.id))
                  return;


                let xhr = new XMLHttpRequest();
                let offset = 0;

                // могут быть баги
                
                CheckTasksState();
                for (let i = 0; i < 5; i++){
                  if (tasks[i].task && tasks[i].task.from == rect.id && tasks[i].task.id != -1){
                    offset += tasks[i].task.count;
                  }
                }

                xhr.open('GET', `/place/${rect.id}?offset=${offset}`, false);
                
                xhr.send();
                data = JSON.parse(xhr.response);
                
                console.log(data)
                console.log(data)
                console.log(typeof(data))
                if (data.count == 0){
                  alert("На этой позиции нет листов");
                  return;
                }
                    

                TEMP_DATA.from = rect.id;
                rect.setAttribute('fill', "green");
                CURRENT_STATE = states_task_create.SECOND_POS_STATE;


                if (rect_from_one_list.includes(TEMP_DATA.from)){
                    TEMP_DATA.count = 1;
                    TEMP_DATA.limit = 1;
                }
                else{
                    const count_field = tasks[TEMP_DATA.rowId].row.querySelector("input");
                    TEMP_DATA.count = data.count;
                    TEMP_DATA.limit = data.count;
                    count_field.setAttribute("value", data.count);
                    count_field.setAttribute("max", data.count);
                }

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
                fetch(
                  '/task/',
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from_: TEMP_DATA.from,
                        to: TEMP_DATA.to,
                        count: TEMP_DATA.count,
                      }
                    )
                  }
                ).then(response => {
                  if (!response.ok) {
                    throw new Error();
                  }
                  return response.json();
                }).then(
                  data => {
                    console.log(`Данные по созданию id: ${data.id}`);
                    if ( data.id && data.id >= 0){
                              TEMP_DATA.id = data.id;
                              TEMP_DATA.state = states_task_work.WAIT.value;
                              TEMP_DATA = null;


                              //Обновляем порядок задач
                              let order_task_id = [];
                              for (let i = 0; i < 5; i++)
                                if (tasks[i].task != null)
                                  order_task_id.push(tasks[i].task.id);
                                else
                                  order_task_id.push(-1);

                              console.log(order_task_id);
                              console.log("SEND ORDER SEND ORDER SEND ORDER SEND ORDER SEND ORDER");
                              fetch("/task/order",
                                {
                                  method: "PUT",
                                  headers: {
                                    'Content-Type': 'application/json'
                                  },
                                  body: JSON.stringify({
                                    tasks_id: order_task_id
                                  })
                                }

                              ).then(response => {
                                if (!response.ok) {
                                  throw new Error();
                                }
                                return response.json();
                              }).then(data => {
                                  let order_task_id = data.tasks_id;
                                  console.log(order_task_id);
                                  let flag = false;
                                  for (let i = 0; i < 5; i++){
                                      let t_id = -1;
                                      if (tasks[i].task!= null)
                                        t_id = tasks[i].task.id;

                                      if (t_id != order_task_id[i]){
                                        flag = True;
                                        break;
                                      }
                                  }
                                  if (flag){
                                    console.log(order_task_id);
                                    for (let i = 0; i < 5; i++){
                                      if (tasks[i].task == null) continue;
                                      if (tasks[i].task.id != order_task_id[i]){
                                        for (let j = 0; j < 5; j++){
                                          if (tasks[j].task == null) continue;
                                          if (tasks[j].task.id == order_task_id[i]){
                                            let temp_task = tasks[i].task;
                                            tasks[i].task = tasks[j].task;
                                            tasks[j].task = temp_task;
                                          }
                                        }
                                      }
                                    }
                                  }


                              });
                    }
                    else {
                      tasks[TEMP_DATA.rowId].task = null;
                      TEMP_DATA = null;
                      alert("Задание не создалось");
                      
                    }
                    setTimeout( ()=> {drawPage(rectsData, grayZone);}, 1000)
                    
                    normalizeTasks();
                  }
                );
                
                break;

            }
          }
          ); 


})

  
}


function initPage(rectsData, grayZone){
    
    TABLE = document.querySelector(".tasks tbody"); 
    
    
    const data_upload = null;


    for (let i = 0; i < 5; i++)
      tasks[i].row = document.querySelector(`#t-${i}`);

    for (let i = 0; i < 5; i++)
      tasks[i].task = null;

   
    fetch("/task/?count=5",
            {
              method: "GET",
            }

          ).then(response => {
            if (!response.ok) {
              throw new Error();
            }
            return response.json();
          }).then( data => {
                  if (data.count != 0)
                    for( let i = 0; i < data.count; i++){
                      const task_data = data.tasks[i];
                      tasks[i].task = {
                        id: task_data.id,
                        to: task_data.to,
                        from: task_data.from_,
                        state: task_data.state,
                        count: task_data.count
                      }
                    }
                  normalizeTasks();
              }
          )
    setInterval(CheckTasksState, 3000);
    

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


 
    
    // <td>${task.id}</td>
    temp_html = `
    
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
      <td><input type="number" id="quantity-${i}" name="quantity" min="1" max="${task.limit? task.limit: 1000}" step="1" value="${task.count}" ${disabled_count_field? "disabled": ""}></td>
      <td>Не создано</td>
      <td>
        <button class="color" id ="cancel-${i}">
          <img src="/static/cancel.svg">
        </button>
      </td>
      `;

    


    }
    else if (task.state == states_task_work.WAIT.value){
      let count_task = 0;
      for( let i =0; i < 5; i++)
        if (tasks[i].task != null)
          count_task++;
      temp_html += `
      <td><input type="number" id="quantity-${i}" name="quantity" min="1" max="1000" step="1" value="${task.count}" ${disabled_count_field? "disabled": ""}></td>
      <td>${states_task_work.WAIT.text}</td>
      <td ${CURRENT_STATE != states_task_create.MAIN || count_task == 5? "": 'class="tyt"' }>
        <button class="color" id ="remove-${i}"> 
          <img src="/static/delete.svg">
        </button>
      </td>
      `;
    }
    else{
      temp_html += `
      <td><input type="number" id="quantity-${i}" name="quantity" min="1" max="1000" step="1" value="${task.count}" disabled></td>
      <td>${states_task_work.IN_PROGRESS.text}</td>
      <td></td>
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

    if (rem_button == null){
      input_field.addEventListener('input', () => {
        TEMP_DATA.count = input_field.value;
        console.log("INPUT FLAG!!!")

    });
    }
    if (rem_button != null){



      

      rem_button.addEventListener('click', () => {

        const row_id = i;
        console.log(`УДаляем ${row_id}`);
        if (tasks[row_id].task.id != -1){
           fetch(`/task/${tasks[row_id].task.id}`,
              {
                method: "DELETE" 
              }

            ).then(response => {
              if (!response.ok) {
                throw new Error();
              }
              return response.json();
            }).then( data => {
                if (data.id == tasks[row_id].task.id){
                  tasks[i].task = null;
                }
                normalizeTasks();

                
            })
        }

        
        console.log(tasks);
        console.log(`Для temp DO нормализации`);
        console.log(TEMP_DATA);
  
        

    });

  }
  
  };

  if (CURRENT_STATE != states_task_create.MAIN)
    return;


  let flag = 0;
  let in_progss = false;

  for (let i = 0; i < 5; i++){
      if (tasks[i].task == null){
        flag += 1;
      }
      else
        if (tasks[i].task.state == states_task_work.IN_PROGRESS.value)
            in_progss = true;
      
  }

  if (flag == 0 )
    return;

  
  if (flag == 5 || (flag == 4 && in_progss)){

    let rId = 0;
    if (flag == 4 && in_progss)
      rId = 1;
    const row_fill = tasks[rId].row;
        row_fill.innerHTML = `
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <button class="tyt" id="add-${rId}">
              <img src="/static/add.svg">
            </button>
          </td>`;

          row_fill.querySelector(`#add-${rId}`).addEventListener('click', () => {
            CURRENT_STATE = states_task_create.FIRST_POS_STATE;
            
            TEMP_DATA = {
              id: -1,
              rowId: rId,  
              from: 100,
              to: 101,
              count: 1,
              state: -1,
              limit: false
            };
            //Сдвигаем все задачи на 1
            // for(let j = 4; j > 0 + 1; j--){
            //   tasks[j].task = tasks[j - 1].task;
            // }


            tasks[rId].task = TEMP_DATA;
            console.log(rId);
            console.log(tasks);
            normalizeTasks();
  }) }

 
  else {
    
  

    for (let i = 0; i < 5; i++){
      if ((tasks[i].task != null) && (tasks[i].task.state == 0)){
        const row_fill = tasks[i].row;

        const button_add = document.createElement('button');
        button_add.innerHTML = '<img src="/static/add.svg">';
        button_add.id = `add-${i}`;
        row_fill.querySelector('.tyt').appendChild(button_add);

          row_fill.querySelector(`#add-${i}`).addEventListener('click', () => {
            CURRENT_STATE = states_task_create.FIRST_POS_STATE;
            
            TEMP_DATA = {
              id: -1,
              rowId: i + 1,  //Заполнается задача после этой
              from: 100,
              to: 101,
              count: 1,
              state: -1,
              limit: false
            };
            //Сдвигаем все задачи на 1
            for(let j = 4; j > i + 1; j--){
              tasks[j].task = tasks[j - 1].task;
            }


            tasks[i + 1].task = TEMP_DATA;
            console.log(i + 1);
            console.log(tasks);
            normalizeTasks();
    
    
        });

     }


  }
}

};



function CheckTasksState(){
  
            fetch("/task/?count=5",
            {
              method: "GET",
            }

          ).then(response => {
            if (!response.ok) {
              throw new Error();
            }
            return response.json();
          }).then( data => {
                    let task_active = [];
                    let flag_changes = false;

                    if (tasks[0].task && tasks[0].task.id != -1){


                        // && (tasks[0].task.state == states_task_work.IN_PROGRESS)
                        if (data.count == 0 || (data.tasks[0].id != tasks[0].task.id)){
                            //setTimeout(async () => window.parent.SendMoved(tasks[0].task.from, tasks[0].task.to, tasks[0].task.count), 100);

                            
                            fetch(`/task/${tasks[0].task.id}`,
                            {
                              method: "GET",
                            }
                
                                  ).then(response => {
                                    if (!response.ok) {
                                      throw new Error();
                                    }
                                    return response.json();
                                  }).then( data => {

                                      if (data.id != 0 && data.state == -100){
                                        data.from = data.from_;
                                        modal_tasks.push(data);
                                      }
                                      

                                  })
                            
                      

                        }

                    }
                   if (modal_tasks.length != 0 && document.getElementById("modal").style.display != "block")
                          showModal();

                    for( let i = 0; i < 5; i++){
                      for (let j = 0; j < data.count; j++){
                          info_task = data.tasks[j];
                          if (tasks[i].task && (tasks[i].task.id == info_task.id)){
                              task_active.push(tasks[i].task.id);

                              console.log(`СОСТОЯНИЕ СЕЙЧАС ${tasks[i].task.state}`);
                              if (tasks[i].task.state != info_task.state)
                                flag_changes = true;
                              tasks[i].task.state = info_task.state;
                              console.log(`СОСТОЯНИЕ ПОСЛЕ ${tasks[i].task.state}`);
                              if (tasks[i].task.state == states_task_work.COMPLETED.value){
                                tasks[i].task = null;
                                
                                console.log("СТЕЙТЫ АПДЕЙТ!!!")
                              }

                          }

                      }
                    }
                    for (let i = 0; i < 5; i++){
                        if (tasks[i].task == null) continue;
                        if (!task_active.includes(tasks[i].task.id) && (tasks[i].task.id != -1 )){
                          flag_changes = true;
                          tasks[i].task = null;
                        }
                    }
                    if (flag_changes)   //если что поменялось, то надо перерисовать
                        normalizeTasks();
              }
          )

}
  


