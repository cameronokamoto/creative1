window.addEventListener("keydown", function (event) 
{
    if(activePiece != null)
    {
        switch(event.key.toLowerCase())
        {
	    case 'a' : 
                clear(activePiece);
		activePiece.pos[0] = clip(activePiece,[activePiece.pos[0] -1,0],9,0);
                draw(activePiece);
                break;
            case 'd' : 
		clear(activePiece);
		activePiece.pos[0] = clip(activePiece,[activePiece.pos[0] + 1,0],9,0);
		draw(activePiece);
                break;
	    case 'q' : 
                clear(activePiece);
		activePiece.shape = rotate(activePiece.shape,'left');
		activePiece.pos[0] = clip(activePiece,activePiece.pos,9,0);
		activePiece.pos[1] = clip(activePiece,activePiece.pos,19,1);
                draw(activePiece);
                break;
            case 'e' : 
                clear(activePiece);
		activePiece.shape = rotate(activePiece.shape);
		activePiece.pos[0] = clip(activePiece,activePiece.pos,9,0);
		activePiece.pos[1] = clip(activePiece,activePiece.pos,19,1);
                draw(activePiece);
                break;
        }
     }
});

var shapes =
{
    I : {pos1 : [0,0], pos2 : [1,0], pos3 : [2,0], pos4 : [3,0], Re : 1, name : 'I'},
    O : {pos1 : [0,0], pos2 : [1,0], pos3 : [0,1], pos4 : [1,1], R : 1, name : 'O'},
    T : {pos1 : [0,0], pos2 : [-1,1], pos3 : [0,1], pos4 : [1,1], R : 1, name : 'T'},
    S : {pos1 : [0,0], pos2 : [1,0], pos3 : [-1,1], pos4 : [0,1], R : 1, name : 'S'},
    Z : {pos1 : [0,0], pos2 : [1,0], pos3 : [1,1], pos4 : [2,1], R : 1, name : 'Z'},
    J : {pos1 : [0,0], pos2 : [0,1], pos3 : [1,1], pos4 : [2,1], R : 1, name : 'J'},
    L : {pos1 : [0,0], pos2 : [-2,1], pos3 : [-1,1], pos4 : [0,1], R : 1, name : 'L'},
    get : function(name)
    {
        return clone(this[name]);
    }
};
var  loop; 
var activePiece = null;  
var activeShapes = [];
for(var x = 0; x < 20; x++)
{
    activeShapes[x] = [];    
    for(var y = 0; y < 10; y++)
    { 
        activeShapes[x][y] = null;    
    }    
}

function generateTetrisGrid()
{
      document.getElementById('generate_button').disabled = true;
      var innerGridHTML = getGridHTML(20,10);
      var grid = document.createElement('table');
      var populateButton = document.createElement('button');
      populateButton.id = 'populateButton';
      populateButton.setAttribute('onClick', 'populateGrid()');
      populateButton.innerHTML = 'PopulateGrid';
      grid.innerHTML = innerGridHTML;
      grid.id = 'tetrisGrid'
      document.body.appendChild(grid);
      loop = setInterval(gameLoop,200);
}
function renderGrid()
{
    var grid = document.getElementById('tetrisGrid');
    var body = grid.children[0];
    for(var y = 0; y < 20; y++)
    {
        for(var x = 0; x < 10; x++)
        {
             body.children[y].children[x].className = activeShapes[y][x];
        }
    }

}
function draw(shape)
{
    if(shape != null)
    {
        var grid = document.getElementById('tetrisGrid');
        var body = grid.children[0];    
        for(var index = 1; index<=4; index++)
        {
            let shapePos = shape.shape['pos'+index];
            let x = shapePos[0] + shape.pos[0];
            let y = shapePos[1] + shape.pos[1];
            if((x>=0 && x<10) && (y>=0 && y<20))
            {  
               body.children[y].children[x].className = shape.shape.name;
            }
        }
    }
}
function clear(shape)
{
    if(shape != null)
    {
        var grid = document.getElementById('tetrisGrid');
        var body = grid.children[0];    
        for(var index = 1; index<=4; index++)
        {
            let shapePos = shape.shape['pos'+index];
            let x = shapePos[0] + shape.pos[0];
            let y = shapePos[1] + shape.pos[1];
            if((x>=0 && x<10) && (y>=0 && y<20))
            {  
               body.children[y].children[x].className = null;
            }
        }
    }
}
function rotate(shape,direction = 'right')
{
    var thetaX = 0;
    var thetaY = 1;
    if(direction == 'right')
    {
        thetaY = -1;
    }
    for(var index = 1; index <=4; index++)
    {
         let square = shape['pos'+index];
         let x = square[0];
         let y = square[1];
         square[0] = (x*thetaX) - (y*thetaY);
         square[1] = (y*thetaX) + (x*thetaY);
    }
    return shape;
}
 
function clone(shape)  
{
    var copy = {};
    for (var block in shape)  
    {
        typeof shape[block] == 'object' ? copy[block] = clone(shape[block]): copy[block] = shape[block];
    }
    return copy;
}
var gameLoop = function()
{
     renderGrid();
     if(activePiece != null)
     {
         if(pieceClip(activePiece))
         {
             draw(activePiece);
             if(activePiece.pos[1] == 0)
	     {
	         clearInterval(loop);
                 alert('you lose');
             }
             var piece = clone(activePiece);
	     for(var index = 1; index <= 4; index++)
             {
         	var current = piece.shape['pos'+index];
                activeShapes[piece.pos[1] + current[1]] [piece.pos[0]+current[0]] = piece.shape.name;
                
             }
             console.log(activeShapes.length);
             for(var a = 0; a < activeShapes.length; a++)
	     {
		console.log(a);
	 	if(!activeShapes[a].includes(null))
	        {
                    activeShapes.splice(a,1);
                    a--;
                    var nullArr = [];
                    for(var sIndex =0; sIndex < 10; sIndex++)
                    {
	                nullArr.push(null);
                    }
                    activeShapes.unshift(nullArr);
                    console.log(activeShapes.length)
                    console.log(activeShapes);
                }
             }
	     activePiece = null;
         }
	 else
	 {
	     activePiece.pos[1] = clip(activePiece,[0,activePiece.pos[1]+ 1],19,1);
             activePiece.pos[0] = clip(activePiece,activePiece.pos,9,0);
	 }
         
     }
     else
     {
         activePiece = {shape : generateRandomPiece(),pos: [4,0]};
         activePiece.pos[0] = clip(activePiece,activePiece.pos,9,0);
         activePiece.pos[1] = clip(activePiece,activePiece.pos,19,1);
     }
     draw(activePiece);
}

function generateRandomPiece()
{
    var keys = Object.keys(shapes);
    return shapes.get(keys[Math.floor(Math.random() * (keys.length-1))]);     
}

function clip(piece, pos, bound, i)
{
     pos = pos[i];
     maxI = 0;
     minI =0;
     for(var index = 1; index <= 4; index++)
     {
         var current = piece.shape['pos'+index];
         var currentI = current[i];
         if(currentI > maxI) maxI = currentI;
         if(currentI < minI)minI = currentI;
     }
     while(pos + minI< 0)
     {
         pos = pos+1;
     }
     while(pos + maxI > bound)
     {
         pos = pos-1;
     }
     return pos;
} 
function pieceClip(piece)
{
    var grid = document.getElementById('tetrisGrid');
    var body = grid.children[0];

    for(var index = 1; index <= 4; index++) 
     {
         var current = piece.shape['pos'+index];
         var next = [current[0]+piece.pos[0],current[1] + piece.pos[1] +1];
         if(next[1] == 20)
	 {
	     return true;
	 }
         if(body.children[next[1]].children[next[0]].className != 'null')
	 {
	     return true;
	 }
     }
     return false;
}

