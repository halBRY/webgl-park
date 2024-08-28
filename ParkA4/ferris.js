/* ferris.js
** CS 425 Ferris Wheel Class 
** Student Name: Hal Brynteson 
** Student NetID: hbrynt2
**
** Ferris Wheel Class
** Draw and animate a Ferris Wheel. 
*/

class Ferris{ 

	/*
	** Constructor
	** nCabs: number of Cabs to generate.
	*/
	constructor( gl, nCabs) {
		
		// Save gl, program, and nHorses as instance variables for use by render( )
		this.gl = gl;
		this.program = program;
		this.nCabs = nCabs;
		this.theta = 0;

        //create base 
        this.baseCone = new Cone(gl, 4, vec3(.25, .25, .35), 0, 100, vec3(1, 1, 1));

		//create bar
		this.centerBar = new Cone(gl, 7, vec3(.75, .75, .85), 1, 200, vec3(1, 1, 1));

		//create cabs
        this.cabs = [];
		for(var i = 0; i < nCabs; i++)
		{
			//randomize color 
			var r = Math.random();
			var g = Math.random(); 
			var b = Math.random(); 

			var cabColor = (vec3(r,g,b));

			var shinyVal = 0;
			if(i % 2 == 0)
				shinyVal = 100;
			else
				shinyVal = 10; 

			this.cabs.push(new Sphere(gl, program, 9, 9, cabColor, shinyVal));
			//this.cabs.push(new Cube(gl, program, cabColor, shinyVal));
		}    
		
		return;
	
	} 
	
	render(tick, location) {

		//placeholder model transformations
		var uModelXform = mat4( ); // Identity matrix unless changed otherwise.
		var uModelXformLoc = gl.getUniformLocation( program, "uModelXform" );
		gl.uniformMatrix4fv( uModelXformLoc, false, flatten( uModelXform ) );

		//Global rotation and transforation
		var GlobalModelXform = rotateX(tick);
		GlobalModelXform = mult(location,GlobalModelXform);
		GlobalModelXform = mult(translate(0, .6, 0), GlobalModelXform);

		/* BASE STRUCTURE */
		//shape right and left bases
		var rightModelXform = mult( translate(.3, 0.0, 0.0), scalem(.2, .6, .5));
		rightModelXform = mult(location, rightModelXform);

		uModelXform = rightModelXform; 
		gl.uniformMatrix4fv( uModelXformLoc, false, flatten( uModelXform ) );
		var uNormalXformLoc = gl.getUniformLocation( program, "uNormalXform" );
		gl.uniformMatrix3fv( uNormalXformLoc, false, flatten( calcNormalMatrix( uViewXform, uModelXform ) ) );
		
		this.baseCone.render();
		
		var leftModelXform = mult( translate(-.3, 0.0, 0.0), scalem(.2, .6, .5));
		leftModelXform = mult(location, leftModelXform);

		uModelXform = leftModelXform;
		gl.uniformMatrix4fv( uModelXformLoc, false, flatten( uModelXform ) );
		var uNormalXformLoc = gl.getUniformLocation( program, "uNormalXform" );
		gl.uniformMatrix3fv( uNormalXformLoc, false, flatten( calcNormalMatrix( uViewXform, uModelXform ) ) );

		this.baseCone.render();

		//center bar
		var centerBarXform = mult(rotateZ(90), rotateY(90));
		centerBarXform = mult(scalem(.6, .02, .02), centerBarXform);
		centerBarXform = mult(translate(.3, .5, 0), centerBarXform);
		centerBarXform = mult(location, centerBarXform);

		uModelXform = centerBarXform;
		gl.uniformMatrix4fv( uModelXformLoc, false, flatten( uModelXform ) );
		var uNormalXformLoc = gl.getUniformLocation( program, "uNormalXform" );
		gl.uniformMatrix3fv( uNormalXformLoc, false, flatten( calcNormalMatrix( uViewXform, uModelXform ) ) );

		this.centerBar.render();

		/* CABS */
		var dTheta = 2 * Math.PI / this.nCabs; // In radians
		for(var i = 0; i < this.nCabs; i++)
		{
			//math
			var theta = i * dTheta;

			//Place and render Cabs
			var PlaceCabModelXform = mult(translate(0, 0, .5), scalem(.15, .15, .15));
			PlaceCabModelXform = mult(rotateX(theta * (180/Math.PI)), PlaceCabModelXform); //rotate evenly around base
		
			uModelXform = mult(GlobalModelXform, PlaceCabModelXform);

			uModelXformLoc = gl.getUniformLocation( program, "uModelXform" );
			gl.uniformMatrix4fv( uModelXformLoc, false, flatten( uModelXform ) );

			var uNormalXformLoc = gl.getUniformLocation( program, "uNormalXform" );
			gl.uniformMatrix3fv( uNormalXformLoc, false, flatten( calcNormalMatrix( uViewXform, uModelXform ) ) );
			
			this.cabs[i].render(); //render cab

		}

	} 

} 