/* cone.js 
** CS 425 Cone Class 
** Student Name: Hal Brynteson 
** Student NetID: hbrynt2
**
** Cone Class 
** Draw a truncated cone. 
*/

class Cone{ 

	/*
	** Constructor
	** nSectors: number of sectors of base "circles".
	**    color: vec3 containing an RGB color
    **    ratio: ratio of top to base from 0-1. 
	**           0 = true cone
	**           1 = cylinder     
	*/
	constructor( gl, nSectors, color, ratio, shinyVal, shinyCol ) {
		
		// Save gl, program, and nSectors as instance variables for use by render( )
		this.gl = gl;
		this.program = program;
		this.nSectors = nSectors;
		this.ratio = ratio;
		this.shinyVal = shinyVal;
		this.shinyCol = shinyCol;

		var numPoints = ((nSectors*2)+4)*2;

		var positions = [ ];	// Vertex location data 
		var colors    = [ ];	// Vertex color data
		var normals   = [ ];    // Vertex normal data 
		
		var ambientMaterial = [ ];
		var diffuseMaterial = [ ];
		var specularMaterial = [ ];
		var shiny = [ ]; 

		var texCoords = [ ];

        for(var i = 0; i < numPoints; i++)
        {
            texCoords.push(vec2(0,0));
        }

		// If the color passed in is invalid, then we will use random colors later.
		var validColor = false;
		
		if ( Array.isArray( color ) && color.length == 3 
			&& color[0] >= 0 && color[1] >= 0 && color[2] >=0
			&& color[0] <= 1 && color[1] <= 1 && color[2] <=1 ) {
			
			validColor = true;
		}
						
		for( var i = 0; i < numPoints ; i++ ) {
			if( validColor ) {
				// Push the passed-in valid color here, as a vec3
				colors.push(color);
				ambientMaterial.push(color);
				diffuseMaterial.push(color);

			} else {
				// Push a random color here as a vec3
				var r = Math.random();
				var g = Math.random(); 
				var b = Math.random();

				colors.push(vec4(r, g, b));
				ambientMaterial.push(vec3(r, g, b));
				diffuseMaterial.push(vec3(r, g, b));
			}

			specularMaterial.push(shinyCol);
			shiny.push(shinyVal);

		}
		

		//draw the bottom
		positions.push(vec3(0, 0, 0));
		normals.push(vec3(0, -1.0, 0));

		var dTheta = 2 * Math.PI / this.nSectors; // In radians
		for( i = 0; i < this.nSectors + 1; i++ ) { 
			var theta = i * dTheta;
	
			var x = 0.5 * Math.cos(theta);
			var y = 0;
			var z = 0.5 * Math.sin(theta);
			
			positions.push(vec3(x, y, z));
			normals.push(vec3(0, -1.0, 0));
		}	

		//draw the top
		positions.push(vec3(0, 1.0, 0));
		normals.push(vec3(0, 1.0, 0));

		dTheta = 2 * Math.PI / this.nSectors; // In radians
		for( i = 0; i < this.nSectors + 1; i++ ) { 
			var theta = i * dTheta;
	
			var x = (0.5 * Math.cos(theta)) * ratio;
			var y = 1.0;
			var z = 0.5 * Math.sin(theta) * ratio;
			
			positions.push(vec3(x,y,z));
			normals.push(vec3(0, 1.0, 0));
		}	

		//draw sides
		var dTheta = 2 * Math.PI / this.nSectors; // In radians
		for( i = 0; i < (this.nSectors + 1); i++ ) { 
			var theta = i * dTheta;
	
			var x = 0.5 * Math.cos(theta);
			var y = 1.0;
			var z = 0.5 * Math.sin(theta);
			
			positions.push(vec3((x*ratio),y,(z*ratio))); //top

			var vertNormal = vec3((x*ratio),(1-ratio),(z*ratio));
			normals.push(normalize(vertNormal));
			
			positions.push(vec3(x,0,z)); //bottom

			vertNormal = vec3((x*ratio),(1-ratio),(z*ratio));
			normals.push(normalize(vertNormal));
		}	
		
		// Push vertex position data to GPU
		// Hold off on connecting the data to the shader variables
		
		this.positionBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.positionBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( positions ), gl.STATIC_DRAW );
		
		this.colorBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( colors ), gl.STATIC_DRAW );

		this.normalBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.normalBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( normals ), gl.STATIC_DRAW );

		this.ambientBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.ambientBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( ambientMaterial ), gl.STATIC_DRAW );

		this.diffuseBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.diffuseBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( diffuseMaterial ), gl.STATIC_DRAW );

		this.specularBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.specularBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( specularMaterial ), gl.STATIC_DRAW );

		this.shininessBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.shininessBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten(shiny), gl.STATIC_DRAW );

		this.tBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.tBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( texCoords ), gl.STATIC_DRAW );
		
		// Unbind the buffer, for safety sake.
		
		gl.bindBuffer( gl.ARRAY_BUFFER, null );
		
		return;
	
	} 
	
	render( ) {
		
		// Connect the vertex data to the shader variables - First positions
		gl.bindBuffer( gl.ARRAY_BUFFER, this.positionBufferID );
			var vPositionLoc = gl.getAttribLocation( program, "vPosition" );
			gl.vertexAttribPointer( vPositionLoc, 3, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray( vPositionLoc );
		
		// Then the colors
		gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBufferID );
			var vColorLoc = gl.getAttribLocation( program, "vColor" );
			gl.vertexAttribPointer( vColorLoc, 3, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray( vColorLoc );

		// Normals
		gl.bindBuffer( gl.ARRAY_BUFFER, this.normalBufferID );
			var vNormalLoc = gl.getAttribLocation( program, "vNormal" );
			gl.vertexAttribPointer( vNormalLoc, 3, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray( vNormalLoc );

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

		gl.bindBuffer( gl.ARRAY_BUFFER, this.tBufferID );
			var vTex = gl.getAttribLocation( program, "vTexCoords" );
			gl.vertexAttribPointer( vTex, 2, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray( vTex );
		
		gl.bindBuffer( gl.ARRAY_BUFFER, null );
	
		//bottom
		gl.drawArrays( gl.TRIANGLE_FAN, 0, this.nSectors + 2);	

		//top
		gl.drawArrays( gl.TRIANGLE_FAN, this.nSectors + 2, this.nSectors + 2);	

		//sides	
		gl.drawArrays(gl.TRIANGLE_STRIP, (this.nSectors*2) + 4, (this.nSectors*2)+2);

	} 

} 