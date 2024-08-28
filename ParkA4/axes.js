/* axes.js
** CS 425 Axes Class 
** Student Name: Hal Brynteson 
** Student NetID: hbrynt2
**
** Axes Class
** Draw XYZ axes. 
*/

class Axes{ 

	constructor( gl ) {
		
		// Save gl
		this.gl = gl;
		this.program = program;
        this.nAxesPoints = 6;
		
        // Establish arrays to hold vertex data for the axes.
        var axesPoints = [ ];	// Vertex location data for axes
        var axesColors = [ ];	// Vertex color data for axes
        var texCoords = [ ];

        for(var i = 0; i < this.nAxesPoints; i++)
        {
            texCoords.push(vec2(0,0));
        }

        
        // Generate Points and Colors
        // X axis - Red
        axesPoints.push( vec3( 0, 0, 0 ) );
        axesColors.push( vec3( 1, 0, 0 ) );

        axesPoints.push( vec3( 1, 0, 0 ) );
        axesColors.push( vec3( 1, 0, 0 ) );
        
        // Y axis - Green
        axesPoints.push( vec3( 0, 0, 0 ) );
        axesColors.push( vec3( 0, 1, 0 ) );

        axesPoints.push( vec3( 0, 1, 0 ) );
        axesColors.push( vec3( 0, 1, 0 ) );
        
        // Z axis - Blue
        axesPoints.push( vec3( 0, 0, 0 ) );
        axesColors.push( vec3( 0, 0, 1 ) );

        axesPoints.push( vec3( 0, 0, 1 ) );
        axesColors.push( vec3( 0, 0, 1 ) );
        
        // Push Axis Vertex Location Data to GPU
        // Hold off on connecting the data to the shader variables
        
        this.vertBufferID = gl.createBuffer( );	// Note:  All bufferIDs are globals
        gl.bindBuffer( gl.ARRAY_BUFFER, this.vertBufferID );
        gl.bufferData( gl.ARRAY_BUFFER, flatten( axesPoints ), gl.STATIC_DRAW );
        
        // Push Axis Vertex Color Data to GPU
        // Hold off on connecting the data to the shader variables
        
        this.colorBufferID = gl.createBuffer( );
        gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBufferID );
        gl.bufferData( gl.ARRAY_BUFFER, flatten( axesColors ), gl.STATIC_DRAW );

        //UV Coords
		this.tBufferID = gl.createBuffer( );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.tBufferID );
		gl.bufferData( gl.ARRAY_BUFFER, flatten( texCoords ), gl.STATIC_DRAW );
        
        // Unbind the buffer, for safety sake.
        gl.bindBuffer( gl.ARRAY_BUFFER, null );
		
		return;
	
	} 
	
	render( ) {
		
		// Connect the vertex data to the shader variables - First positions
		gl.bindBuffer( gl.ARRAY_BUFFER, this.vertBufferID );
			var vPositionLoc = gl.getAttribLocation( program, "vPosition" );
			gl.vertexAttribPointer( vPositionLoc, 3, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray( vPositionLoc );
		
		// Then the colors
		gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBufferID );
			var vColorLoc = gl.getAttribLocation( program, "vColor" );
			gl.vertexAttribPointer( vColorLoc, 3, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray( vColorLoc );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.tBufferID );
			var vTex = gl.getAttribLocation( program, "vTexCoords" );
			gl.vertexAttribPointer( vTex, 2, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray( vTex );

		gl.bindBuffer( gl.ARRAY_BUFFER, null );
	
		gl.drawArrays( gl.LINES, 0, this.nAxesPoints );
		
	} 

} 