function InitPage(rectsData, grayZone){
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
      }
    ); 
  
  
  })}