const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = 1000
const height = 1000

class Point{
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
}

ctx.fillRect(width/2,height/2,2,2);


function drawQuadrilateral(...vertices){
	if(vertices.length !== 4){
		throw new Error('wrong number of arguments')
		return;
	}
	if(!vertices.reduce((accumulator,vertex)=> accumulator + !(vertex instanceof Point))){
		throw new TypeError('vertex is not a point')
		return;
	}
	for(let i = 0, len = 4; i<len ; i++){
		ctx.beginPath()
		ctx.moveTo(vertices[i].x, vertices[i].y)
		ctx.lineTo(vertices[(i+1)%len].x, vertices[(i+1)%len].y)
		ctx.stroke()
		ctx.closePath()
	}
}



function drawRandomQuadrilateral(){
	const points = new Array(4);
	for(let i = 0, len = 4; i<len ; i++){
		points[i] = new Point(Math.floor(Math.random()*width), Math.floor(Math.random()*height));
	}
	const middlePoint = new Point(Math.floor(width/2),Math.floor(height/2));
	drawPerspectiveQuadrilateral(middlePoint, ...points);
}

// drawQuadrilateral(new Point(100,200),
// 				  new Point(600,300),
// 				  new Point(600,700),
// 				  new Point(200,600))








function getPrimePoint(point, viewPoint, widthCoefficient){
	let a = (point.y-viewPoint.y) / (point.x-viewPoint.x);
	let b = point.y - a*point.x;
	let x1 = (viewPoint.x-point.x)*widthCoefficient + point.x;
	let y1 = a*x1+b;
	return new Point(x1,y1);

}

function drawPerspectiveQuadrilateral(viewPoint,...vertices){

	drawQuadrilateral(...vertices)

	const primePoints = vertices.map(vertex=>getPrimePoint(vertex, viewPoint, 0.15))

	drawQuadrilateral(...primePoints)

	for(let i = 0, len = 4; i<len ; i++){
		ctx.beginPath()
		ctx.moveTo(vertices[i].x, vertices[i].y)
		ctx.lineTo(primePoints[i].x, primePoints[i].y)
		ctx.stroke()
		ctx.closePath()
	}
}

function drawCube(mouse){

	const halfEdge = 50;

	drawPerspectiveQuadrilateral(new Point(Math.floor(width/2),Math.floor(height/2)),
							 	 new Point(mouse.x-halfEdge,mouse.y-halfEdge),
				  			 	 new Point(mouse.x+halfEdge,mouse.y-halfEdge),
				  			 	 new Point(mouse.x+halfEdge,mouse.y+halfEdge),
				  			 	 new Point(mouse.x-halfEdge,mouse.y+halfEdge))
}


canvas.onmousemove = event =>{
	ctx.clearRect(0,0,width,height)
	const widthCoefficient = width/canvas.clientWidth
	const mouse = new Point(event.offsetX*widthCoefficient, event.offsetY*widthCoefficient);
	drawCube(mouse);
}
console.log(canvas.clientWidth, canvas.clientHeight);

// drawPerspectiveQuadrilateral(
// 							 new Point(Math.floor(width/2),Math.floor(height/2)),
// 							 new Point(300,300),
// 				  			 new Point(800,300),
// 				  			 new Point(800,700),
// 				  			 new Point(300,700))