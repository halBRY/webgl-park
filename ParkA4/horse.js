/* horse.js
** CS 425 Horse Class 
** Student Name: Hal Brynteson 
** Student NetID: hbrynt2
**
** Horse Class
** Draw a HORSE. 
*/

class Horse{ 

	/*
	** Constructor
	** color: color as a vec3
	*/
	constructor( gl, color ) {
		
		// Save gl, program, and nSectors as instance variables for use by render( )
		this.gl = gl;
		this.program = program;
        this.color = color;

		//create horse-specific axes
		this.theAxes = new Axes(gl);

		//create body cone
        this.bodyCone = new Cone(gl, 15, color, .25, 100, vec3(1, 1, 1));

		//shape body
		var HorseModelXform = scalem(.4,.4,.4);
		HorseModelXform = mult(HorseModelXform, rotateX(-90)); //tip over

		this.HorseModelXform = HorseModelXform; //save horse transform to be used in MGR class

		return;
	
	} 
	
	render( ) {

		//render body cone
        this.bodyCone.render();

		//render axes if checked
		if(visualAxesHorse.checked)
			this.theAxes.render();

	} 

} 