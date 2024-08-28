/* light.js
** CS 425 Light Class 
** Student Name: Hal Brynteson 
** Student NetID: hbrynt2
**
** Light Class
** Create a light of various types. 
*/

class Light{ 

	constructor( gl, lightPos, amb, diff, spec, flag, lightID ) {
		
		// Save gl
		this.gl = gl;
		this.program = program;
		this.lightID = lightID;
		
		uLightPosition[lightID] = lightPos;
		
		uAmbientLight[lightID] = amb;
		
		uDiffuseLight[lightID] = diff;

		uSpecularLight[lightID] = spec;

		uDirectionalFlag[lightID] = flag;
		
		return;
	
	} 

	
	updateLight(lightPos, amb, diff, spec)
	{
		uLightPosition[this.lightID] = lightPos;

		uAmbientLight[this.lightID] = amb;
		
		uDiffuseLight[this.lightID] = diff;

		uSpecularLight[this.lightID] = spec;

		sendLightsToGPU();
	}

} 