// The method of creating soccer visualization,
// it is designed for being operated as being required
function createSoccerViz(){
	// Say-hi section
	console.log('Hi there, createSoccerViz is called.')

	// For some unknown stupid design in JS runtime,
	// it will operate **Script** and **Say-hi** section firstly,
	// and then operate d3.dsv function, which is slow,
	// and ignore the coding order of the scripts.

	// D3 dsv section
	d3.dsv(",", "worldcup.csv").then(data => {
		overallTeamViz(data)
	})

	// Function section
	// Being called in D3 dsv section
	function overallTeamViz(incomingData){
		d3.select("svg")
			.append("g")
			.attr("id", "teamsG")
			.attr("transform", "translate(20,20)")
			.selectAll("g")
			.data(incomingData)
			.enter()
			.append("g")
			.attr("class", "overallG")
			.attr("transform", (d,i)=>{return "translate(" + (i*50) + ",50)"})

		var teamG = d3.selectAll("g.overallG")
		console.log(teamG)
		teamG.append("circle")
			 .attr("r", 10) //"10px" also right
		     //.attr("cx", (d,i)=>{return } )
		     .style("fill", "pink")
	         .style("stroke", "black")
	         .style("stroke-width", "1px")

	    console.log('The teamsG in function section:', document.getElementById('teamsG'))

	    teamG.append("text")
	    		.attr("y", 60)
	    		.style("text-anchor", "middle")
	    		.style("font-size", "10px")
	    		.text(d=>d.team)
	}

	// Script section
	// Based on current experiment,
	// this script section is **ONLY** operated when the .js file being imported by <src> section in HTML
	console.log('The teamsG in script section:', document.getElementById('teamsG'))

	// Web browser platform
	// Google Chrome
    // 版本 87.0.4280.141（正式版本） (x86_64)
}

