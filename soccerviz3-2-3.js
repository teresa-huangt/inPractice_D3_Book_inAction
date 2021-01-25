// practice for 3.2.3 using thins
function createSoccerViz(){

	d3.dsv(",", "worldcup.csv").then(data => {
		overallTeamViz(data)
	})

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
			 	.attr("r", 10)

		     .style("fill", "pink")
	         .style("stroke", "black")
	         .style("stroke-width", "1px")
         // 3.2.2 end

	    console.log('The teamsG in function section:', document.getElementById('teamsG'))

	    // 3.2.3 this + node
	    d3.select("circle").each(function(d,i){
	    	console.log("check each d",d)
	    	console.log("check each d",i)
	    	console.log("compare with this", this)
	    })
	    console.log("check .node()", d3.select("circle").node())
	    
	    // 3.2.3 end

	    teamG.append("text")
	    		.attr("y", 60)
	    		.style("text-anchor", "middle")
	    		.style("font-size", "10px")
	    		.text(d=>d.team)

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
			console.log("check this in highlightRegion", this)
			d3.select(this).select("text").style("fill", "red").attr("y", 30)
			d3.selectAll("g.overallG")
				.select("circle")
				.style("fill", c=>{
					console.log("check c", c) //circleS对应<>
					console.log("check c.region", c.region)
					console.log("check md.region", md.region)
					console.log("check T|F", c.region === md.region)
					return c.region === md.region ? "red": "gray"
				})

		}

		teamG.on("mouseout", function(){
			d3.selectAll("g.overallG")
				.select("circle")
				.style("fill", "gray")
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

