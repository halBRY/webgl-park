/* lamp.js 
** CS 425 Lamp Class 
** Student Name: Hal Brynteson 
** Student NetID: hbrynt2
**
** Lamp Class
** Draw a Lamp. 
*/

class Lamp{ 

	/*
	** Constructor
	*/
	constructor( gl ) {
		
		// Save gl, program, and nHorses as instance variables for use by render( )
		this.gl = gl;
		this.program = program;

        //create body 
        this.bodyCone = new Cone(gl, 20, vec3(.2,.2,.2), 1, 100, vec3(1, 1, 1));

		//create bulb
		this.lightBulb = new Sphere(gl, program, 20, 20, vec3(1,1,1), 100);

		//create hat
		this.hatCone = new Cone(gl, 20, vec3(.2,.2,.2), .1, 100, vec3(1, 1, 1));
	
	} 
	
	render(location, lightID) {

		//paceholder model transformations
		var uModelXform = mat4( ); // Identity matrix unless changed otherwise.
		var uModelXformLoc = gl.getUniformLocation( program, "uModelXform" );
		gl.uniformMatrix4fv( uModelXformLoc, false, flatten( uModelXform ) );

		//Global rotation and transforation
		var GlobalModelXform = location;

		/* BODY */
		//shape base
		var baseModelXform = mult( translate(0.0, 0.0, 0.0), scalem(.2, .05, .2));

		//add Global 
		uModelXform = mult( GlobalModelXform, baseModelXform); 
		gl.uniformMatrix4fv( uModelXformLoc, false, flatten( uModelXform ) );

		//transform normals
		var uNormalXformLoc = gl.getUniformLocation( program, "uNormalXform" );
		gl.uniformMatrix3fv( uNormalXformLoc, false, flatten( calcNormalMatrix( uViewXform, uModelXform ) ) );

		//render
		this.bodyCone.render();

		//shape base
		baseModelXform = mult( translate(0.0, 0.0, 0.0), scalem(.15, .1, .15));

		//add Global 
		uModelXform = mult( GlobalModelXform, baseModelXform); 
		gl.uniformMatrix4fv( uModelXformLoc, false, flatten( uModelXform ) );

		//transform normals
		var uNormalXformLoc = gl.getUniformLocation( program, "uNormalXform" );
		gl.uniformMatrix3fv( uNormalXformLoc, false, flatten( calcNormalMatrix( uViewXform, uModelXform ) ) );

		//render
		this.bodyCone.render();

		//shape pole
		baseModelXform = mult( translate(0.0, 0.0, 0.0), scalem(.05, .8, .05));

		//add Global 
		uModelXform = mult( GlobalModelXform, baseModelXform); 
		gl.uniformMatrix4fv( uModelXformLoc, false, flatten( uModelXform ) );

		//transform normals
		var uNormalXformLoc = gl.getUniformLocation( program, "uNormalXform" );
		gl.uniformMatrix3fv( uNormalXformLoc, false, flatten( calcNormalMatrix( uViewXform, uModelXform ) ) );

		//render
		this.bodyCone.render();

		//shape lamp hat
		var hatModelXform =  mult( translate(0.0, .9, 0.0), scalem(.22, .08, .22));

		//add Global 
		uModelXform = mult( GlobalModelXform, hatModelXform); 
		gl.uniformMatrix4fv( uModelXformLoc, false, flatten( uModelXform ) );

		//transform normals
		var uNormalXformLoc = gl.getUniformLocation( program, "uNormalXform" );
		gl.uniformMatrix3fv( uNormalXformLoc, false, flatten( calcNormalMatrix( uViewXform, uModelXform ) ) );

		//render
		this.hatCone.render();

		//body of lamp complete

		/* LIGHT BULB */
		//light bulb
		uModelXform =  mult( translate(0, .85, .3), scalem(.09, .09, .09));
		gl.uniformMatrix4fv( uModelXformLoc, false, flatten( uModelXform ) );

		//transform normals
		var uNormalXformLoc = gl.getUniformLocation( program, "uNormalXform" );
		gl.uniformMatrix3fv( uNormalXformLoc, false, flatten( calcNormalMatrix( uViewXform, uModelXform ) ) );

		//If it is night, don't shade the light bulb
		var uGouraudLoc = gl.getUniformLocation( program, "uGouraud" );
		var uPhongLoc = gl.getUniformLocation( program, "uPhong");

		if(isNight)
		{
			gl.uniform1iv( uGouraudLoc, [ 0 ] );
			gl.uniform1iv( uPhongLoc, [ 0 ] );
		}
		
		//render
		this.lightBulb.render();
	} 

} 