/* sphere.js 
** CS 425 Sphere Class 
** Student Name: Hal Brynteson 
** Student NetID: hbrynt2
**
** Sphere Class 
** Draw a Sphere
** 
** Modified from sphere class provided 
** with the lighting lab.
*/


// The following parameters are passed in to the constructor:

//var gl;			// A WebGLRenderingContext
//var program;		// The shaders program
//var nLong;		// Number of longitudinal sections ( points around equator )
//var nLat;			// Number of latitudinal sections ( top to bottom, including two fans and nLat - 2 strips
//var color;		// A solid colored sphere if this color is valid.  Otherwise random colors for each vertex.

class Sphere { 

	constructor( gl, program, nLat, nLong, color, shinyVal ) {
		
		this.program = program;
		this.gl = gl;
		this.nLat = nLat;
		this.nLong = nLong;
		this.shinyVal = shinyVal;
		
		this.positions = [ ];	// Vertex position data 
		this.colors    = [ ];	// Vertex color data
		this.normals = [ ];       // Vertex normals
		this.texCoords = [ ];

		this.ambientMaterial = [ ];
		this.diffuseMaterial = [ ];
		this.specularMaterial = [ ];
		this.shiny = [ ]; 

		for(var i = 0; i < 2 * ( this.nLong + 1 ) * ( this.nLat - 1 ) + 2; i++)
        {
            this.texCoords.push(vec2(0,0));
        }

		var validColor = false;
		
		if ( Array.isArray( color ) && color.length == 3 
			&& color[0] >= 0 && color[1] >= 0 && color[2] >=0
			&& color[0] <= 1 && color[1] <= 1 && color[2] <=1 ) {
				validColor = true;
		}
		
		// All the colors can be calculated in a single loop
		// Top and bottom fans require 2 * ( ( nLong + 1 ) + 1 )
		// Strips require ( nLat - 2 ) * ( 2 * ( nLong + 1 ) )
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
	
		// Now to generate the vertex coordinates

		var R = 1.0;			// Radius of the sphere
		var phi = 0.0;			// "Vertical" angle. 0 = straight up, PI = straight down
		var theta = 0.0;		// "horizontal" angle, circular around the "equator"
		
		// Top triangle fan, starting with the "North Pole"
		
		this.positions.push( vec3( 0.0, R, 0.0 ) ); // Top of sphere
		this.normals.push(vec3( 0.0, R, 0.0 ));
		
		phi =  Math.PI / nLat;
		var rSinPhi = R * Math.sin( phi );		// Height above equator
		var rCosPhi = R * Math.cos( phi );		// Radius of a horizontal section at height rSinPhi
		var dTheta = 2.0 * Math.PI / nLong;		// Increment around circle for each point
	
		for( var i = 0; i < nLong + 1; i++ ) {	// Loop around the circle
			theta = i * dTheta;
			this.positions.push( vec3(  rSinPhi * Math.cos( theta ), rCosPhi, rSinPhi * Math.sin( theta ) ) );
			this.normals.push( vec3(  rSinPhi * Math.cos( theta ), rCosPhi, rSinPhi * Math.sin( theta ) ) );

		} // Loop for top triangle fan.
		
		// Bottom triangle fan, starting with the "South Pole"
		
		this.positions.push( vec3( 0.0, -R, 0.0 ) ); // Bottom of sphere
		this.normals.push(vec3( 0.0, -R, 0.0 ));
	
		for( var i = 0; i < nLong + 1; i++ ) {	// Loop around the circle
			theta = i * dTheta;
			this.positions.push( vec3(  rSinPhi * Math.cos( theta ), -rCosPhi, rSinPhi * Math.sin( theta ) ) );
			this.normals.push( vec3(  rSinPhi * Math.cos( theta ), -rCosPhi, rSinPhi * Math.sin( theta ) ) );

		} // Loop for bottom triangle fan.
	
		// Now for the center strips
		// To use triangle strips, two rows of points need to be interleaved.
		
		var phi1, phi2, rSinPhi1, rSinPhi2, rCosPhi1, rCosPhi2;	// Top and bottom of strip variables.
		var dPhi = Math.PI / nLat;	// Increment "down" the sphere, from top to bottom
		
		for( var i = 0; i < nLat - 2; i++ ) {	// Loop through strips
		
			phi1 = ( i + 1 ) * dPhi;		// Calc trig functions of phi once only per strip.
			phi2 = phi1 + dPhi;
			rSinPhi1 = R * Math.sin( phi1 );
			rCosPhi1 = R * Math.cos( phi1 );
			rSinPhi2 = R * Math.sin( phi2 );
			rCosPhi2 = R * Math.cos( phi2 );
			
			for( var j = 0; j < nLong + 1; j++ ) {	// Loop around circles
			
				theta = j * dTheta;
				
				// First a point on the top edge of the strip
				this.positions.push( vec3(  rSinPhi1 * Math.cos( theta ), -rCosPhi1, rSinPhi1 * Math.sin( theta ) ) );
				this.normals.push( vec3 (rSinPhi1 * Math.cos( theta ), -rCosPhi1, rSinPhi1 * Math.sin( theta ) ));
				
				// Then a corresponding point on the bottom edge of the strip
				this.positions.push( vec3(  rSinPhi2 * Math.cos( theta ), -rCosPhi2, rSinPhi2 * Math.sin( theta ) ) );
				this.normals.push(vec3(  rSinPhi2 * Math.cos( theta ), -rCosPhi2, rSinPhi2 * Math.sin( theta ) ) );
				
			} // Loop for points on a single strip
		} // loop through strips

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

		this.tBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.tBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( this.texCoords ), gl.STATIC_DRAW );
		
		// Unbind the buffer, for safety sake.
		
		gl.bindBuffer( gl.ARRAY_BUFFER, null );
	
	} // Constructor

	render( ) {
		
		var gl = this.gl;
		var nLat = this.nLat;
		var nLong = this.nLong;
		
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

		gl.bindBuffer( gl.ARRAY_BUFFER, this.tBufferID );
			var vTex = gl.getAttribLocation( program, "vTexCoords" );
			gl.vertexAttribPointer( vTex, 2, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray( vTex );
		// ( For the special case of a unit sphere centered at the origin,
		//   the positions data could also be pushed to the vNormal shader variable. )
		
		// Draw points and lines for diagnostic and explanatory purposes
		// var nPoints = 2 * ( nLong + 1 ) * ( nLat - 1 ) + 2;
		//gl.drawArrays( gl.POINTS, 0, nPoints );
		//gl.drawArrays( gl.LINE_LOOP, 0, nPoints );
	
		// Now draw the top and bottom fans.
		// Last two arguments are the index of the first data point to use, and the number of points to draw
		// Note that the last point in the "circle" is the same as the first, hence nLong + 1 points / circle.
		
		gl.drawArrays( gl.TRIANGLE_FAN, 0, nLong + 2 );
		gl.drawArrays( gl.TRIANGLE_FAN, nLong + 2, nLong + 2 );
		
		// And finally to draw the middle strips
		// For each strip, skip over the vertices for the two fans, plus preceding strips
		// Each strip has nLong + 1 vertices per circle, times two circles per strip
		
		for( var i = 0; i < nLat - 2; i++ ) {
			var firstIndex = 2 * ( nLong + 2 ) + i * ( 2 * ( nLong + 1 ) ) ; 
			gl.drawArrays( gl.TRIANGLE_STRIP, firstIndex, 2 * ( nLong + 1 ) );
		}
		
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

	}
	
} // sphere class