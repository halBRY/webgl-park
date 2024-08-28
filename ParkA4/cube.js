/* cube.js 
** CS 425 Cube Class 
** Student Name: Hal Brynteson 
** Student NetID: hbrynt2
**
** Cube Class 
** Draw a Cube
** 
** Modified from cube class provided 
*/


// The following parameters are passed in to the constructor:

//var gl;			// A WebGLRenderingContext
//var program;		// The shaders program
//var color;		// A solid colored sphere if this color is valid.  Otherwise random colors for each vertex.

class Cube { 

	constructor( gl, program, color, shinyVal ) {
		
		this.program = program;
		this.gl = gl;
		this.shinyVal = shinyVal;
		
		this.positions = [ ];	// Vertex position data 
		this.colors    = [ ];	// Vertex color data
		this.normals = [ ];     // Vertex normals
		this.texCoords = [ ];   // Vertex UV coordinates

		this.ambientMaterial = [ ];
		this.diffuseMaterial = [ ];
		this.specularMaterial = [ ];
		this.shiny = [ ]; 

		var validColor = false;
		
		if ( Array.isArray( color ) && color.length == 3 
			&& color[0] >= 0 && color[1] >= 0 && color[2] >=0
			&& color[0] <= 1 && color[1] <= 1 && color[2] <=1 ) {
				validColor = true;
		}
		
		// All the colors can be calculated in a single loop
		for( var i = 0; i < 24; i++ ) {
			if( validColor )
			{ 
				this.colors.push( vec3( color ) );
				this.ambientMaterial.push(vec3(color));
				this.diffuseMaterial.push(vec3(color));
			}
			else
			{
				var r = Math.random();
				var g = Math.random(); 
				var b = Math.random();

				this.colors.push(vec4(r, g, b));
				this.ambientMaterial.push(vec3(r, g, b));
				this.diffuseMaterial.push(vec3(r, g, b));
			}

			this.specularMaterial.push(vec3(1, 1, 1));
			this.shiny.push(this.shinyVal);
		}
	
		// Now to generate the vertex coordinates

		//Front 
		this.positions.push(vec3(0,0,0));
		this.positions.push(vec3(1,0,0));
		this.positions.push(vec3(1,1,0));
		this.positions.push(vec3(0,1,0));

		this.normals.push(vec3(0,0,-1));
		this.normals.push(vec3(0,0,-1));
		this.normals.push(vec3(0,0,-1));
		this.normals.push(vec3(0,0,-1));

		this.texCoords.push(vec2(0.0, 0.0));
		this.texCoords.push(vec2(1.0, 0.0));
		this.texCoords.push(vec2(1.0, 1.0));
		this.texCoords.push(vec2(0.0, 1.0));

		//Back 
		this.positions.push(vec3(0,0,1));
		this.positions.push(vec3(1,0,1));
		this.positions.push(vec3(1,1,1));
		this.positions.push(vec3(0,1,1));

		this.normals.push(vec3(0,0,1));
		this.normals.push(vec3(0,0,1));
		this.normals.push(vec3(0,0,1));
		this.normals.push(vec3(0,0,1));

		this.texCoords.push(vec2(0.0, 0.0));
		this.texCoords.push(vec2(1.0, 0.0));
		this.texCoords.push(vec2(1.0, 1.0));
		this.texCoords.push(vec2(0.0, 1.0));

		//Top
		this.positions.push(vec3(0,1,0));
		this.positions.push(vec3(0,1,1));
		this.positions.push(vec3(1,1,1));
		this.positions.push(vec3(1,1,0));

		this.normals.push(vec3(0,1,0));
		this.normals.push(vec3(0,1,0));
		this.normals.push(vec3(0,1,0));
		this.normals.push(vec3(0,1,0)); 

		this.texCoords.push(vec2(0.0, 0.0));
		this.texCoords.push(vec2(1.0, 0.0));
		this.texCoords.push(vec2(1.0, 1.0));
		this.texCoords.push(vec2(0.0, 1.0));

		//Bottom
		this.positions.push(vec3(0,0,0));
		this.positions.push(vec3(0,0,1));
		this.positions.push(vec3(1,0,1));
		this.positions.push(vec3(1,0,0));

		this.normals.push(vec3(0,-1,0));
		this.normals.push(vec3(0,-1,0));
		this.normals.push(vec3(0,-1,0));
		this.normals.push(vec3(0,-1,0));

		this.texCoords.push(vec2(0.0, 0.0));
		this.texCoords.push(vec2(1.0, 0.0));
		this.texCoords.push(vec2(1.0, 1.0));
		this.texCoords.push(vec2(0.0, 1.0));

		//Left
		this.positions.push(vec3(0,0,0));
		this.positions.push(vec3(0,0,1));
		this.positions.push(vec3(0,1,1));
		this.positions.push(vec3(0,1,0));

		this.normals.push(vec3(1,0,0));
		this.normals.push(vec3(1,0,0));
		this.normals.push(vec3(1,0,0)); 
		this.normals.push(vec3(1,0,0));

		this.texCoords.push(vec2(0.0, 0.0));
		this.texCoords.push(vec2(1.0, 0.0));
		this.texCoords.push(vec2(1.0, 1.0));
		this.texCoords.push(vec2(0.0, 1.0));


		//Right 
		this.positions.push(vec3(1,0,0));
		this.positions.push(vec3(1,0,1));
		this.positions.push(vec3(1,1,1));
		this.positions.push(vec3(1,1,0));

		this.normals.push(vec3(-1,0,0));
		this.normals.push(vec3(-1,0,0));
		this.normals.push(vec3(-1,0,0));
		this.normals.push(vec3(-1,0,0));

		this.texCoords.push(vec2(0.0, 0.0));
		this.texCoords.push(vec2(1.0, 0.0));
		this.texCoords.push(vec2(1.0, 1.0));
		this.texCoords.push(vec2(0.0, 1.0));
 

		// Push Vertex Location Data to GPU
		this.vBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.vBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( this.positions ), gl.STATIC_DRAW );
		
		// Push Vertex Color Data to GPU
		this.cBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.cBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( this.colors ), gl.STATIC_DRAW );

		// Push Vertex Normals to GPU
		this.nBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.nBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( this.normals ), gl.STATIC_DRAW );

		/* Push Vertex material properties to GPU */
		this.ambientBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.ambientBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( this.ambientMaterial ), gl.STATIC_DRAW );

		this.diffuseBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.diffuseBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( this.diffuseMaterial ), gl.STATIC_DRAW );

		this.specularBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.specularBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( this.specularMaterial ), gl.STATIC_DRAW );

		this.shininessBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.shininessBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( this.shiny ), gl.STATIC_DRAW );

		//UV Coords
		this.tBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.tBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( this.texCoords ), gl.STATIC_DRAW );
		
		// Unbind the buffer, for safety sake.
		
		gl.bindBuffer( gl.ARRAY_BUFFER, null );
	
	} // Constructor

	render( ) {
		
		var gl = this.gl;
		
		// Attach the data in the buffers to the variables in the shaders
		
		gl.bindBuffer( gl.ARRAY_BUFFER, this.vBufferID );
			var vPositionLoc = gl.getAttribLocation( this.program, "vPosition" );
			gl.vertexAttribPointer( vPositionLoc, 3, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray( vPositionLoc );
		
		gl.bindBuffer( gl.ARRAY_BUFFER, this.cBufferID );
			var vColorLoc = gl.getAttribLocation( this.program, "vColor" );
			gl.vertexAttribPointer( vColorLoc, 3, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray( vColorLoc );
		
		gl.bindBuffer( gl.ARRAY_BUFFER, this.nBufferID );
			var vNormalsLoc = gl.getAttribLocation( this.program, "vNormal" );
			gl.vertexAttribPointer( vNormalsLoc, 3, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray( vNormalsLoc );

		/* Material Properties */
		gl.bindBuffer( gl.ARRAY_BUFFER, this.ambientBufferID );
			var vAmbientLoc = gl.getAttribLocation( program, "vAmbientMaterial" );
			gl.vertexAttribPointer( vAmbientLoc, 3, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray( vAmbientLoc );

		gl.bindBuffer( gl.ARRAY_BUFFER, this.diffuseBufferID );
			var vDiffuseLoc = gl.getAttribLocation( program, "vDiffuseMaterial" );
			gl.vertexAttribPointer( vDiffuseLoc, 3, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray( vDiffuseLoc );

		gl.bindBuffer( gl.ARRAY_BUFFER, this.specularBufferID );
			var vSpecularLoc = gl.getAttribLocation( program, "vSpecularMaterial" );
			gl.vertexAttribPointer( vSpecularLoc, 3, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray( vSpecularLoc );

		gl.bindBuffer( gl.ARRAY_BUFFER, this.shininessBufferID );
			var vShinLoc = gl.getAttribLocation( program, "vShininess" );
			gl.vertexAttribPointer( vShinLoc, 1, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray( vShinLoc );

		//UV Coords
		gl.bindBuffer( gl.ARRAY_BUFFER, this.tBufferID );
			var vTex = gl.getAttribLocation( program, "vTexCoords" );
			gl.vertexAttribPointer( vTex, 2, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray( vTex );


		gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
		gl.drawArrays( gl.TRIANGLE_FAN, 4, 4 );
		gl.drawArrays( gl.TRIANGLE_FAN, 8, 4 );
		gl.drawArrays( gl.TRIANGLE_FAN, 12, 4 );
		gl.drawArrays( gl.TRIANGLE_FAN, 16, 4 );
		gl.drawArrays( gl.TRIANGLE_FAN, 20, 4 );

		
		
	} // render

	//Function to alter the color of a sphere
	changeColor(color)
	{
		while(this.colors.length > 0) 
		{	
			this.colors.pop();
		}

		var validColor = false;
		
		if ( Array.isArray( color ) && color.length == 3 
			&& color[0] >= 0 && color[1] >= 0 && color[2] >=0
			&& color[0] <= 1 && color[1] <= 1 && color[2] <=1 ) {
				validColor = true;
		}
		
		// All the colors can be calculated in a single loop
		for( var i = 0; i < 2 * ( this.nLong + 1 ) * ( this.nLat - 1 ) + 2; i++ ) {
			if( validColor )
			{ 
				this.colors.push( vec3( color ) );
				this.ambientMaterial.push(color);
				this.diffuseMaterial.push(color);
			}
			else
			{
				var r = Math.random();
				var g = Math.random(); 
				var b = Math.random();

				this.colors.push(vec4(r, g, b));
				this.ambientMaterial.push(vec3(r, g, b));
				this.diffuseMaterial.push(vec3(r, g, b));
			}

			this.specularMaterial.push(vec3(1, 1, 1));
			this.shiny.push(this.shinyVal);
		}
		
		this.cBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.cBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( this.colors ), gl.STATIC_DRAW );
		
		/* Push Vertex material properties to GPU */
		this.ambientBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.ambientBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( this.ambientMaterial ), gl.STATIC_DRAW );

		this.diffuseBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.diffuseBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( this.diffuseMaterial ), gl.STATIC_DRAW );

		this.specularBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.specularBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( this.specularMaterial ), gl.STATIC_DRAW );

		this.shininessBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.shininessBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( this.shiny ), gl.STATIC_DRAW );

		//UV Coords
		this.tBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.tBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( this.texCoords ), gl.STATIC_DRAW );

	}
	
} 