/* mgr.js 
** CS 425 Merry-Go-Round Class 
** Student Name: Hal Brynteson 
** Student NetID: hbrynt2
**
** Merry-Go-Round Class
** Draw and animate a Merry-Go-Round. 
*/

class MGR{ 

	/*
	** Constructor
	** nHorses: number of Horses to generate.
	*/
	constructor( gl, nHorses) {
		
		// Save gl, program, and nHorses as instance variables for use by render( )
		this.gl = gl;
		this.program = program;
		this.nHorses = nHorses;
		this.theta = 0;

        //create top 
        this.topCone = new Cone(gl, 20, 0, 0, 10, vec3(1, 1, 1));

        //create bottom
        this.baseCone = new Cone(gl, 20, 0, 1, 10, vec3(1, 1, 1));

        //create horses and poles
        //array of cone instances
        this.horses = [];
		this.poles = [];
		this.poleBases = [];
		for(var i = 0; i < nHorses; i++)
		{
			//randomize color 
			var r = Math.random();
			var g = Math.random(); 
			var b = Math.random(); 

			var horseColor = (vec3(r,g,b));
			this.horses.push(new Horse(gl, horseColor, 0));

			var poleColor = vec3(.7,.7,.7);
			this.poles.push(new Cone(gl, 10, poleColor, 1, 200, vec3(1, 1, 1)));

			var poleBaseColor = vec3(.8, .6, 0);
			this.poleBases.push(new Sphere(gl, program, 4, 5, poleBaseColor, 200));
		}    
		
		return; 
	
	} 
	
	render(tick, location) {

		//paceholder model transformations
		var uModelXform = mat4( ); // Identity matrix unless changed otherwise.
		var uModelXformLoc = gl.getUniformLocation( program, "uModelXform" );
		gl.uniformMatrix4fv( uModelXformLoc, false, flatten( uModelXform ) );

		//Global rotation and transforation
		var GlobalModelXform = rotateY(tick);
		GlobalModelXform = mult(location,GlobalModelXform);

		//shape top
		var topModelXform = mult( translate(0.0, .5, 0.0), scalem(2, .25, 2));

		//add Globl for compound motion
		uModelXform = mult( GlobalModelXform, topModelXform); 
		gl.uniformMatrix4fv( uModelXformLoc, false, flatten( uModelXform ) );

		var uNormalXformLoc = gl.getUniformLocation( program, "uNormalXform" );
		gl.uniformMatrix3fv( uNormalXformLoc, false, flatten( calcNormalMatrix( uViewXform, uModelXform ) ) );

		this.topCone.render();
		
		//shape base
		var baseModelXform = mult( translate(0.0, -.5, 0.0), scalem(2, .08, 2));

		//add Globl for compound motion
		uModelXform = mult( GlobalModelXform, baseModelXform);
		gl.uniformMatrix4fv( uModelXformLoc, false, flatten( uModelXform ) );

		var uNormalXformLoc = gl.getUniformLocation( program, "uNormalXform" );
		gl.uniformMatrix3fv( uNormalXformLoc, false, flatten( calcNormalMatrix( uViewXform, uModelXform ) ) );

		this.baseCone.render();

		/* HORSES */
		var dTheta = 2 * Math.PI / this.nHorses; // In radians
		for(var i = 0; i < this.nHorses; i++)
		{
			//math
			var theta = i * dTheta;

			var x = 0.5 * Math.cos(theta);
			var z = 0.5 * Math.sin(theta);
			var y = 0.2 * Math.sin((tick)/15 + (theta*2));
	

			//Place and render Horses
			var PlaceHorseModelXform = translate(.75, y, 0.0); //move to edge
			PlaceHorseModelXform = mult(rotateY(theta * (180/Math.PI)), PlaceHorseModelXform); //rotate evenly around base
			
			PlaceHorseModelXform = mult(PlaceHorseModelXform, this.horses[i].HorseModelXform); //apply Global
			uModelXform = mult(GlobalModelXform, PlaceHorseModelXform);

			uModelXformLoc = gl.getUniformLocation( program, "uModelXform" );
			gl.uniformMatrix4fv( uModelXformLoc, false, flatten( uModelXform ) );


			var uNormalXformLoc = gl.getUniformLocation( program, "uNormalXform" );
			gl.uniformMatrix3fv( uNormalXformLoc, false, flatten( calcNormalMatrix( uViewXform, uModelXform ) ) );
			
			this.horses[i].render(); //render horse

			//Place and render poles
			x = 0.5 * Math.cos(theta + (dTheta/1.6));
			z = 0.5 * Math.sin(theta + (dTheta/1.6));

			var PoleModelXform = translate(x*1.6, -0.5, z*1.6); //move to edge
			PoleModelXform = mult(PoleModelXform, scalem(.05, 1, .05)); //shape cylinder

			uModelXform = mult(GlobalModelXform, PoleModelXform); //apply Global

			uModelXformLoc = gl.getUniformLocation( program, "uModelXform" );
			gl.uniformMatrix4fv( uModelXformLoc, false, flatten( uModelXform ) );

			var uNormalXformLoc = gl.getUniformLocation( program, "uNormalXform" );
			gl.uniformMatrix3fv( uNormalXformLoc, false, flatten( calcNormalMatrix( uViewXform, uModelXform ) ) );

			this.poles[i].render(); //render poles

			//place and render pole bases
			var PoleBaseModelXform = translate(x*1.6, -.4, z*1.6); //move to edge
			PoleBaseModelXform = mult(PoleBaseModelXform, scalem(.1, .05, .1)); //shape base

			uModelXform = mult(GlobalModelXform, PoleBaseModelXform); //apply Global

			uModelXformLoc = gl.getUniformLocation( program, "uModelXform" );
			gl.uniformMatrix4fv( uModelXformLoc, false, flatten( uModelXform ) );

			var uNormalXformLoc = gl.getUniformLocation( program, "uNormalXform" );
			gl.uniformMatrix3fv( uNormalXformLoc, false, flatten( calcNormalMatrix( uViewXform, uModelXform ) ) );

			this.poleBases[i].render(); //render bases

			PoleBaseModelXform = translate(x*1.6, .5, z*1.6); //move to edge
			PoleBaseModelXform = mult(PoleBaseModelXform, scalem(.1, .04, .1)); //shape base

			uModelXform = mult(GlobalModelXform, PoleBaseModelXform); //apply Global

			uModelXformLoc = gl.getUniformLocation( program, "uModelXform" );
			gl.uniformMatrix4fv( uModelXformLoc, false, flatten( uModelXform ) );

			var uNormalXformLoc = gl.getUniformLocation( program, "uNormalXform" );
			gl.uniformMatrix3fv( uNormalXformLoc, false, flatten( calcNormalMatrix( uViewXform, uModelXform ) ) );

			this.poleBases[i].render(); //render poles
		}

	} 

} 