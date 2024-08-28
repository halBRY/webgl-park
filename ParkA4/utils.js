/* utils.js
** CS 425 Axes Class 
** Student Name: Hal Brynteson 
** Student NetID: hbrynt2
** 
*/

/* Functions for Shaders */
function sendXformsToShaders()
{

    //model Xform
    var uModelXformLoc = gl.getUniformLocation( program, "uModelXform" );
	gl.uniformMatrix4fv( uModelXformLoc, false, flatten( uModelXform ) );

    //view xform
    var uViewXformLoc = gl.getUniformLocation( program, "uViewXform" );
	gl.uniformMatrix4fv( uViewXformLoc, false, flatten( uViewXform ) );

    //projection xform
    var uProjectionLoc = gl.getUniformLocation( program, "uProjection" );
	gl.uniformMatrix4fv( uProjectionLoc, false, flatten( uProjection ) );

    //normals xform 
    var uNormalXformLoc = gl.getUniformLocation( program, "uNormalXform" );
	gl.uniformMatrix3fv( uNormalXformLoc, false, flatten( calcNormalMatrix( uViewXform, uModelXform ) ) );

}

function materialsToShaders()
{
    //ambient material
    var uAmbientLoc = gl.getAttribLocation( program, "uAmbientMaterial" );
    gl.uniformMatrix3fv( uAmbientLoc, false, flatten( uAmbientMaterial ) );
    
    //diffuse material
    var uDiffuseLoc = gl.getAttribLocation( program, "uDiffuseMaterial" );
    gl.uniformMatrix3fv( uDiffuseLoc, false, flatten( uDiffuseMaterial ) );

    //specular material
    var uSpecularLoc = gl.getAttribLocation( program, "uSpecularMaterial" );
    gl.uniformMatrix3fv( uSpecularLoc, false, flatten( uSpecularMaterial) );
    
    //shininess coeff
    var uShinLoc = gl.getAttribLocation( program, "uShininess" );
    gl.uniform1f( uShinLoc, false, uShininess);
		
}


/* Camera Functions */
function cameraControls( event )
{
    switch (event.key) {
        // W = move forward
        case "w": 
            console.log("w");

            eye =  add(eye,mult(forwardDirection, vec3(.3,.3,.3)));

            break;

        // S = move backwards
        case "s":
            console.log("s");

            eye = subtract(eye,mult(forwardDirection, vec3(.3,.3,.3)));
            
            break;

        // A = slide left
        case "a":
            console.log("a");
            
            eye = add(eye, cross(up, mult(forwardDirection, vec3(.3,.3,.3))));

            break;

        // D = slide right
        case "d":
            console.log("d");

            eye = add(eye, cross(mult(forwardDirection, vec3(.3,.3,.3)), up));

            break;

        // Q = rotate left
        case "q":
            console.log("q");

            atDirection = vec3(mult(rotateY(5), vec4(atDirection, 1)));
            forwardDirection = normalize([atDirection[0], 0.0, atDirection[2]]);

            break;

        // E = rotate right
        case "e":
            console.log("e");

            atDirection = vec3(mult(rotateY(-5), vec4(atDirection, 1)));
            forwardDirection = normalize([atDirection[0], 0.0, atDirection[2]]);

            break;

        
        // Z = move up
        case "z":
            console.log("z");

            eye = add(eye, vec3(0, .3, 0));

            break;

        
        // C = move down
        case "c":
            console.log("z");

            eye = subtract(eye, vec3(0, .3, 0));

            break;
        
        // R = reset camera to default
        case "r":
            console.log("r");

            //reset
            eye = vec3( 1.75, 0.5, 1.75 );
            at = vec3( 0, 0, 0 );
            atDirection = normalize(negate(eye));
            forwardDirection = normalize([atDirection[0], 0.0, atDirection[2]]);

            viewAngle = 70;

            break;
    }
}

function addZoom()
{
	viewAngle -= 5;
}

function subZoom()
{
	viewAngle += 5;
}

/* Normal Functions */
function calcNormalMatrix( viewXform, modelXform ) 
{
	var modelView =( mult( viewXform, modelXform ) );
	var N = mat3( );
	for( var i = 0; i < 3; i++ )
		for( var j = 0; j < 3; j++ )
			N[ i ][ j ] = modelView[ i ][ j ];
	return transpose( inverse3( N ) );
}

//Work in progress. Ideally, will show the normals at each vertex.
function visualizeNormals( normals )
{
    var normalLineVerts = [ ];
    var lineLength = vec3(1,1,1);
    
    for(var i = 0; i < normals.length(); i++)
    { 
        normalLineVerts.push(normals[i]);
        normalLineVerts.push(add(normals[i], lineLength));
    } 
}

/* Lights */	
function sendLightsToGPU() 
{
    var uLightPositionLoc = gl.getUniformLocation( program, "uLightPosition" );
    gl.uniform3fv( uLightPositionLoc, flatten( uLightPosition ) );
    
    var uAmbientLightLoc = gl.getUniformLocation( program, "uAmbientLight" );
    gl.uniform3fv( uAmbientLightLoc, flatten( uAmbientLight ) );
    
    var uDiffuseLightLoc = gl.getUniformLocation( program, "uDiffuseLight" );
    gl.uniform3fv( uDiffuseLightLoc, flatten( uDiffuseLight ) );
    
    var uSpecularLightLoc = gl.getUniformLocation( program, "uSpecularLight" );
    gl.uniform3fv( uSpecularLightLoc, flatten( uSpecularLight ) );

    var uDirectionLoc = gl.getUniformLocation( program, "uDirectionalFlag" );
    gl.uniform1iv( uDirectionLoc, flatten( uDirectionalFlag ) );

} 


function makeNight()
{
	isNight = true;
    
    //Darken the sky
    theSky.changeColor(vec3(0.001, 0.0, 0.2, 0));
    
    //Darken the ambient light
    AmbientLight.updateLight(
        vec3( 0, 0, 0),
        vec3( .35, .35, .35), //ambient light color
        vec3( 0, 0, 0),    //diffuse light color
        vec3( 0, 0, 0)    //specular light color
    );

    //Move point light to lamp
    PointLight.updateLight(
        vec3(0, .85, .3),
        vec3( 0, 0, 0), //ambient light color
        vec3( .35, .35, .35),    //diffuse light color
        vec3( 1, 1, 1)    //specular light color
    );

}

function makeDay()
{
	isNight = false;
    
    //Lighten sky
    theSky.changeColor(vec3(0.0, 0.6, 0.85, 0));

    //Increase ambient light
    AmbientLight.updateLight(
        vec3( 0, 0, 0),
        vec3( .5, .5, .5), //ambient light color
        vec3( 0, 0, 0),    //diffuse light color
        vec3( 0, 0, 0)    //specular light color
    );

    //Move point to The Sun 
    PointLight.updateLight(
        vec3( 0, 2, -2),
        vec3( .25, .25, .20), //ambient light color
        vec3( .75, .75, .70),    //diffuse light color
        vec3( 1, 1, 1)    //specular light color
    );

}

function loadImage(texture_name)
{
    var image = new Image(  );
	image = document.getElementById( texture_name );	// File loaded in html code, accessed here.
	gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
	var texture = gl.createTexture( );
	gl.activeTexture( gl.TEXTURE0 );
	gl.bindTexture( gl.TEXTURE_2D, texture );
	gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
	gl.uniform1i( gl.getUniformLocation( program, "uTextureMap" ), 0 ); // Associate "uTextureMap" with TEXTURE0
	gl.generateMipmap( gl.TEXTURE_2D );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
}