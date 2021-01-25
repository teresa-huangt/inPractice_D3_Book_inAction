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
			.attr("transform", (d,i)=>{
				console.log("check incomingdata", incomingData)
				return "translate(" + (i*50) + ",50)"
			})

		var teamG = d3.selectAll("g.overallG")
		console.log(teamG)

		// color start
		fillColor = d3.rgb("pink")
			
			// test in text
		var colorScale = d3.scaleLinear()
						  .interpolate(d3.interpolateLab) //Hsl Hcl	Lab
						  .domain([0,20]).range(["yellow", "blue"])
			//	test in text		  
		 var tenColorScale = d3.scaleOrdinal()
		 						.domain(["UEFA", "AFC"])
		 						.range(d3.schemeCategory10)
		 						.unknown("gray")
		var CBcolorScale = d3.scaleQuantize() //同linear但是不用加差值那句
							.domain([0,10]).range(colorbrewer.Reds[3])
	    // color end 


		// teamG.append("circle")
		// 	 .attr("r", 10) //"10px" also right
		//      //.attr("cx", (d,i)=>{return } )
		//      .style("fill", "pink")
	 //         .style("stroke", "black")
	 //         .style("stroke-width", "1px")


	 	// 3.2.2 add transition
	 	teamG.append("circle")
			 .attr("r", 0) 
			 .transition()
			 	.delay((d,i)=> i*100)
			 	.duration(1000)
			 	.attr("r", 40)
		 	.transition()
			 	//.delay((d,i)=> i*100)
			 	.duration(500)
			 	.attr("r", 20)

		     .style("fill", (d,i)=> fillColor.brighter(i*0.1))
	         .style("stroke", "black")
	         .style("stroke-width", "2px")
         // 3.2.2 end

	    console.log('The teamsG in function section:', document.getElementById('teamsG'))

	    // 3.2.3 this + node ++ raise lower
	    d3.select("circle").each(function(d,i){
	    	console.log("check each d",d)
	    	console.log("check each i",i)
	    	console.log("compare with this", this)
	    })
	    console.log("check .node()", d3.select("circle").node())
	    
	   
	    // 3.2.3 end

	    teamG.append("text")
	    		.attr("y", 60)
	    		.style("text-anchor", "middle")
	    		.style("font-size", "12px")
	    		.text(d=>d.team)
	    		//.style("fill", (d,i)=>colorScale(i))
	    		// .style("fill", (d,i)=>tenColorScale(d.region))
	    		.style("fill", (d,i)=>CBcolorScale(i))
	    		

		// 3.2.1 .on(mouseover)
		// teamG.on("mouseover", m=>{
		// 	console.log("---------------")
		// 	console.log("check mouseover m", m)
		// 	return highlightRegion(m)
		// })
		teamG.on("mouseover", (m,md)=>{
			console.log("---------------")
			console.log("check mouseover m md", [m, md]) // 第一个是mouseover本身位置等，第二个返回是对应数据
			return highlightRegion([m, md])
		})
		function highlightRegion([m, md]){
			//console.log("check mouseover d ", d)
			d3.selectAll("g.overallG")
				.select("circle")
				// .attr("class", c=>{
				// 	console.log("check c", c) //circleS对应<>
				// 	console.log("check c.region", c.region)
				// 	console.log("check md.region", md.region)
				// 	console.log("check T|F", c.region === md.region)
				// 	//return c.region === md.region ? "active": "inactive"
				// })
				.style("fill", c=>{
					console.log("check c", c) //circleS对应<>
					console.log("check c.region", c.region)
					console.log("check md.region", md.region)
					console.log("check T|F", c.region === md.region)
					return c.region === md.region ? "red": fillColor.brighter(0.5)//.darker(0.5)//"gray"
				})
			d3.selectAll("g.overallG")
				.select("text")
				.attr("y", y=> {
					return y.team === md.team ? "20": "60"
				})
				.style("font-size", f=>{
					return f.team === md.team ? "30": "10"
				})
				.style("fill", t=>{
					console.log("===========")
					console.log("check t.team", t.team)
					console.log("check md.region", md.team)
					console.log("check T|F", t.team === md.team)
					return t.team === md.team ? "cornflowerblue": "gray"
				})
				.style("pointer-events", "none") //3.2.3 避免遮挡


		}

		teamG.on("mouseout", function(){
			d3.selectAll("g.overallG")
				.select("circle")
				.style("fill", (d,i)=>fillColor.darker(i*0.1))
				//.classed("inactive", false).classed("active",false)
		})

		// 3.2.1 event .on(click)
		var dataKeys = Object.keys(incomingData[0])
		console.log('check dataKeys', dataKeys)
		dataKeys = Object.keys(incomingData[0]).filter(d => d !== "team" && d !== "region")
		console.log('check dataKeys filter', dataKeys)

		 d3.select("#controls")
		 	.selectAll("button.teams")
         	.data(dataKeys)
         	.enter()
          	.append("button")
            .on("click", (d,i,e)=>buttonClick(i)) //rewrite
            .html(d =>{
            	//console.log("check d", d)
            	return d
            })

            function buttonClick(bunttonData){
        	console.log("---------")
        	var maxValue = d3.max(incomingData, d=>{
        		console.log("check d", d)
        		return d[bunttonData]
        	})
        	console.log("check maxValue", maxValue)

        	var radiusScale = d3.scaleLinear()
        						.domain([0, maxValue])
    							.range([2, 20])

			d3.selectAll("g.overallG")
				.select("circle")
				.attr("r", d=>radiusScale(d[bunttonData]))

        }
	}

	// Script section
	// Based on current experiment,
	// this script section is **ONLY** operated when the .js file being imported by <src> section in HTML
	console.log('The teamsG in script section:', document.getElementById('teamsG'))

	// Web browser platform
	// Google Chrome
    // 版本 87.0.4280.141（正式版本） (x86_64)
}

