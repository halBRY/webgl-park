/* park.js
** CS 425 Assignment 3 
** Student Name: Hal Brynteson 
** Student NetID: hbrynt2
**
** This WebGL program creates a 3D Amusement Park
** with simple camera controls and lighting
**
*/

//* General Global Variables*/ 

// Object-independent variables
var gl;				// WebGL graphics environment
var program;		// The shader program

// Camera variables
var aspectRatio;	// Aspect ratio of viewport
var viewAngle = 70; // Viewing Angle
var eye = vec3( 1.75, 1, 1.75 );
var at = vec3( 0, 0, 0 );
var up = vec3( 0, 1, 0 );
var atDirection = normalize(negate(eye));
var forwardDirection = normalize([atDirection[0], 0.0, atDirection[2]]);
var theta = 0;

// Misc. independent variables
var tick = 0.0;
var isNight = 0; 
var uProjection = mat4();
var uViewXform = mat4();
var uModelXform = mat4();
var uNormalXform = mat3();

// Lighting Variables
var AmbientLight;
var PointLight;
var uLightPosition = [];
var uAmbientLight = [];
var uDiffuseLight = [];
var uSpecularLight = [];
var uDirectionalFlag = [];

// Material Variables
var uAmbientMaterial;
var uDiffuseMaterial;
var uSpecularMaterial;
var uShininess;

// Axes-related  variables
var theAxes;

// Misc variables
var theGround;
var debugCone;
var debugHorse;
var debugCube;

// Sphere-related variables
var theSun;
var theSky;
var debugSphere;

// Merry-Go-Round variables
var theMGR; 
var nHorses = 8;

// Ferris Wheel variables
var theFerris;
var nCabs = 10;

// Lamp-related variables
var theLamp;

// Cube-related variables
var theCube;


function init( ) {
	
	// Set up the canvas, viewport, and clear color

	var canvas = document.getElementById( "gl-canvas" );
	gl=WebGLUtils.setupWebGL( canvas );
	if( !gl ) {
		alert( "No WebGL" );
	}
	
	gl.viewport( 0, 0, canvas.width, canvas.height );
	aspectRatio = canvas.width / canvas.height ;
	gl.clearColor( 0.0, 0.25, 0.5, 0.5 );
	
	// Load the shaders, create a GLSL program, and use it.
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	//create axes object
	theAxes = new Axes(gl);

	//create cone instance
	//theGround = new Cone(gl, 30, vec3(0.27, 0.45, 0.29, 0.6), 1, 100, vec4(0.27, 0.45, 0.29, 0.9));
	theGround = new Cube(gl, program, vec3(0.27, 0.45, 0.29, 0.6), 100000);

	//create MGR instance
	theMGR = new MGR(gl, nHorses);

	//create ferris wheel instance
	theFerris = new Ferris(gl, nCabs);

	//create lamps
	theLamp = new Lamp(gl);

	//create cube 
	theCube = new Cube(gl, program, vec3(.25,.25,.30), 1000000);

	//create the Sun (main light source) and Sky (background sphere)
	theSun = new Sphere(gl, program, 7, 7, vec3(1,1,1), 100);
	theSky = new Sphere(gl, program, 11, 11, vec3(0.0, 0.6, 0.85, 0));

	//debug objects
	debugCone = new Cone(gl, 7, vec3(1, .5, 0), 0, 100, vec3(1, 1, 1));
	debugHorse = new Horse(gl, vec3(.1, .5, 0) );
	debugSphere = new Sphere(gl, program, 9, 9, vec3(1, .5, 0), 100);
	debugCube = new Cube(gl, program, vec3(1.0,.5,0), 100);


	//lights
	AmbientLight = new Light(gl, vec3( 0, 0, 0),    //light position 
								 vec3( .5, .5, .5), //ambient light color
								 vec3( 0, 0, 0),    //diffuse light color
								 vec3( 0, 0, 0),    //specular light color
								 0,                 // Directional? = No 
								 0);                // LightID = 0

	
	PointLight = new Light(gl, vec3( 0, 2, -2),      //light position
							   vec3( .25, .25, .20), //ambient light color
							   vec3( .75, .75, .70), //diffuse light color
							   vec3( 1, 1, 1),       //specular light color
							   0,                    // Directional? = No
							   1);                   // LightID = 1                  

	sendLightsToGPU();

	gl.enable( gl.DEPTH_TEST );	


	//uniforms
	var uNormalXformLoc = gl.getUniformLocation( program, "uNormalXform" );
	gl.uniformMatrix3fv( uNormalXformLoc, false, flatten( uNormalXform ) );

	var uGouraudLoc = gl.getUniformLocation( program, "uGouraud" );
	gl.uniform1iv( uGouraudLoc, [ 0 ] );

	var uPhongLoc = gl.getUniformLocation( program, "uPhong" );
	gl.uniform1iv( uPhongLoc, [ 0 ] );

	var uIsTexLoc = gl.getUniformLocation( program, "uIsTex" );
	gl.uniform1iv( uPhongLoc, [ 0 ] );

	render( );
}

window.onload = init;

function render( ) {

	// Animation tick
	tick += 1;

	// Place rides
	var MGRorigin = vec3(-.1, .5, -1);
	var FerrisOrigin = vec3(-.1, 0, 1);

	// Clear out the color buffers and the depth buffers.
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	

	// Prepare for lighting alterations
	var uGouraudLoc = gl.getUniformLocation( program, "uGouraud" );
	var uPhongLoc = gl.getUniformLocation( program, "uPhong");
	var uIsTexLoc = gl.getUniformLocation( program, "uIsTex" );

	/* CAMERA SET UP */
	//default view
	uViewXform = lookAt( eye, at, vec3( 0, 1, 0 ) );

	//Camera keyboard controls
	// W = move forward
	// S = move backwards
	// A = slide left
	// D = slide right
	// Q = rotate left
	// E = rotate right
	// Z = move up
	// C = move down
	// R = reset camera to default
	window.addEventListener("keydown", cameraControls); 

	//recalculate view transform
	at = add(eye, atDirection);
	uViewXform = lookAt( eye, at, up );
	
	//calculate projection transform
	uProjection = perspective( viewAngle, aspectRatio, 0.1, 300.0 );

	// Unbind the buffer, for safety sake.
	gl.bindBuffer( gl.ARRAY_BUFFER, null );

	/* OBJECT SET UP */
	//animation 
	requestAnimationFrame(render);

	// Shape and draw the lights
	gl.uniform1iv( uGouraudLoc, [ 0 ] );
	gl.uniform1iv( uPhongLoc, [ 0 ] );

	//If day, draw the Sun
	if(!isNight)
	{
		uModelXform = mult(translate( 0, 2, -2), scalem(.2,.2,.2));
		sendXformsToShaders();
		theSun.render();
	}

	// Draw the sky
	uModelXform = scalem(100, 100, 100);
	sendXformsToShaders();
	theSky.render();

	//debug shapes
	//debugCone.render();
	//debugSphere.render();

	// Draw the axes if checked
	uModelXform = scalem(1, 1, 1);
	sendXformsToShaders();
	if(visualAxesWorld.checked)
	{
		theAxes.render();
	}

	//Toggle proper lighting
	if(isGouraud.checked)
    {
        gl.uniform1iv( uGouraudLoc, [ 1 ] );
		gl.uniform1iv( uPhongLoc, [ 0 ] );
    }
    else if(isPhong.checked)
    {
        gl.uniform1iv( uGouraudLoc, [ 0 ] );
		gl.uniform1iv( uPhongLoc, [ 1 ] );
    }
	else if(isNone.checked) 
	{
		gl.uniform1iv( uGouraudLoc, [ 0 ] );
		gl.uniform1iv( uPhongLoc, [ 0 ] );
	}

	/*
	gl.uniform1iv( uIsTexLoc, [ 1 ] );
	uModelXform = scalem(.75,1,.65);
	sendXformsToShaders();
	debugCube.render();
	gl.uniform1iv( uIsTexLoc, [ 0 ] );	
	*/
	

	/* DRAW OBJECTS */
	// Shape and draw the ground
	uModelXform = mult(translate(-10, 0.0, -10), scalem(20, .002, 20));
	sendXformsToShaders();

	// Draw the ground plane
	gl.uniform1iv( uIsTexLoc, [ 1 ] );
	loadImage("ground");
	theGround.render();
	gl.uniform1iv( uIsTexLoc, [ 0 ] );

	//Shape and draw walls
	gl.uniform1iv( uIsTexLoc, [ 1 ] );
	loadImage("brickwall");

	//wall1
	for(var i = -6; i < 6; i+=2){
		uModelXform = mult(translate(-6,0,i), scalem(.25,.45, 2));
		sendXformsToShaders();
		theCube.render();
	}

	//wall2
	for(var i = -6; i < 6; i+=2){
		uModelXform = mult(translate(i,0,-6), scalem(2,.45, .25)); 
		sendXformsToShaders();
		theCube.render();
	}

	//wall3
	for(var i = -6; i < 6; i+=2){

		if( i == -2 )
		{
			uModelXform = mult(translate(6,0,i), scalem(.25,.45, 1.5));
			sendXformsToShaders();
		}
		else if( i == 0 )
		{
			uModelXform = mult(translate(6,0,i+.5), scalem(.25,.45, 1.5));
			sendXformsToShaders();
		}
		else
		{
			uModelXform = mult(translate(6,0,i), scalem(.25,.45, 2));
			sendXformsToShaders();
		}

		theCube.render();
	}

	//wall4
	for(var i = -6; i < 6; i+=2){
		uModelXform = mult(translate(i,0,6), scalem(2,.45, .25));
		sendXformsToShaders();
		theCube.render();
	}

	gl.uniform1iv( uIsTexLoc, [ 0 ] );
	
	// Draw the MGR
	var MGRspot = translate(MGRorigin);
	sendXformsToShaders();
	theMGR.render(tick, MGRspot);

	// Draw the ferris wheel 
	var FerrisSpot = translate(FerrisOrigin);
	sendXformsToShaders();
	theFerris.render(tick, FerrisSpot);

	// Draw the lamp
	sendXformsToShaders();
	var lampSpot = translate(0, 0, .3);
	theLamp.render(lampSpot, PointLight.lightID);

}

