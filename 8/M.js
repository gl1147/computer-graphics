var M = {};
var sin = Math.sin;
var cos = Math.cos;



M.identity = function(m){

	m[0] = 1;
	m[1] = 0;
	m[2] = 0;
	m[3] = 0;
	m[4] = 0;
	m[5] = 1;
	m[6] = 0;
	m[7] = 0;
	m[8] = 0;
	m[9] = 0;
	m[10] = 1;
	m[11] = 0;
	m[12] = 0;
	m[13] = 0;
	m[14] = 0;
	m[15] = 1;	
} 


M_stack = [];

M.save = function(m) {
   var i, _m = [];
   for (i = 0 ; i < m.length ; i++)
      _m.push(m[i]);                 // MAKE A COPY OF MATRIX
   M_stack.push(_m);                // PUSH IT ONTO THE STACK
}

M.restore = function(m) {
   var i, _m = M_stack.pop();       // POP THE COPY OFF THE STACK
   for (i = 0 ; i < m.length ; i++)  // COPY ITS VALUES INTO MATRIX
      m[i] = _m[i];
}

M.rotateX = function(m, radians) {
	var xmatrix = [
		1,0,0,0,
		0,cos(radians),-sin(radians),0,
		0,sin(radians),cos(radians),0,
		0,0,0,1
	];
	M.matrixMultiply(m, xmatrix, m);
} 

M.rotateY = function(m, radians) {
	var ymatrix = [
		cos(radians),0,sin(radians),0,
		0,1,0,0,
		-sin(radians),0,cos(radians),0,
		0,0,0,1
	];
	M.matrixMultiply(m, ymatrix, m);
} 

M.rotateZ = function(m, radians) {
	var zmatrix = [
		cos(radians),-sin(radians),0,0,
		sin(radians),cos(radians),0,0,
		0,0,1,0,
		0,0,0,1
	];
	M.matrixMultiply(m, zmatrix, m);
} 



M.scale = function(m, v) {
	var x,y,z;
	if (v instanceof Array) {
      x = v[0];
      y = v[1];
      z = v[2];
   	}
   	else
      x = y = z = v;
	var scaleMatrix = [
		x,0,0,0,
		0,y,0,0,
		0,0,z,0,
		0,0,0,1
	];
	M.matrixMultiply(m, scaleMatrix, m);
} 



M.translate = function(m, v) {
   M.matrixMultiply(m, M.translationMatrix(v), m);
}

M.translationMatrix = function(v) {
   return [ 1,0,0,0, 0,1,0,0, 0,0,1,0, v[0],v[1],v[2],1 ];
}

M.matrixMultiply = function(a, b, dst) {
   var n, tmp = []; 

   // PUT THE RESULT OF a x b INTO TEMPORARY MATRIX tmp.

   for (n = 0 ; n < 16 ; n++)
      tmp.push( a[n&3     ] * b[    n&12] +
                a[n&3 |  4] * b[1 | n&12] +
                a[n&3 |  8] * b[2 | n&12] +
                a[n&3 | 12] * b[3 | n&12] );

   // COPY tmp VALUES INTO DESTINATION MATRIX dst.

   for (n = 0 ; n < 16 ; n++)
      dst[n] = tmp[n];
}

M.transform = function(m, v)  {

    // IF v[3] IS UNDEFINED, SET IT TO 1 (THAT IS, ASSUME v IS A POINT).

    var x = v[0], y = v[1], z = v[2], w = v[3] === undefined ? 1 : v[3];

    // RETURN RESULT OF TRANSFORMING v BY MATRIX m.

    return [ x * m[0] + y * m[4] + z * m[ 8] + w * m[12],
             x * m[1] + y * m[5] + z * m[ 9] + w * m[13],
             x * m[2] + y * m[6] + z * m[10] + w * m[14],
             x * m[3] + y * m[7] + z * m[11] + w * m[15] ];
}

