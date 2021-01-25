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

		// 3.3.1
		 d3.selectAll("g.overallG")
		 	.insert("image", "text")
            .attr("xlink:href", d => `./image/${d.team}.png`) //esc下面的~·
            .attr("width", "45px").attr("height", "20px")
            .attr("x", "-22").attr("y", "-10");
	    		

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

        // 添加表格，点选再添加数字
        d3.text("modal.html").then(data => {
		console.log("addtable modal html data+++++++++++++!", data)
		var htmldata = d3.select("body").append("div").attr("id", "modal").append("html").html(data) //也可以不加append html，h5结构不同但显示形式相同
		//return htmldata
	  	})

	  	//var teamG = d3.selectAll("g.overallG")
		teamG.on("click", (c,cmd)=>{
			console.log("---------------")
			console.log("check click c,cmd", [c,cmd])
			return teamClick(c,cmd)
			})

		function teamClick(c,cmd){
			var selectValue = Object.values(cmd)
			console.log("check selectValue:", [selectValue])
			//console.log("check teamClick c+++++++++++++", [c,cmd])
			d3.selectAll("td.data")
				.data(selectValue)
				//.enter()
				//.append("td")
				.html(p =>{
					console.log("check p:", p)
					return p
				})
		}

		// 添加SVG icon
		d3.html("icon.svg").then(svgData=>{
			console.log("check svgData ***********", svgData)
			return loadSVG(svgData)
		})

		// way1
		// function loadSVG(svgData){
		// 	console.log("check enter loadSVG function")
		// 	while(!d3.select(svgData).selectAll("path").empty()) {
		// 	  	d3.select("svg").node().appendChild(
		// 	    d3.select(svgData).select("path").node()
		// 	    )
		//     }
		//     d3.selectAll("path").attr("transform", "translate(50,250)")
		// }

		// way2
		// function loadSVG(svgData) {
	 //    d3.select(svgData).selectAll("path").each(function() {
	 //    	//console.log("check svgData each this", this)
	 //        d3.select("svg").node().appendChild(this);
	 //    })
	 //    d3.selectAll("path").attr("transform", "translate(50,50)");
		// }


		//way3
		function loadSVG(svgData) {
		    d3.selectAll("g").each(function() {
		    var gParent = this;
		    d3.select(svgData).selectAll("path").each(function() {
		          gParent.appendChild(this.cloneNode(true))
		      })
		    })
		    // change svg path color way1
			// d3.selectAll("path").style("fill", "darkred")
			// .style("stroke", "black").style("stroke-width", "1px");

			// change svg path color way2
			d3.selectAll("g.overallG").each(function(d) {
			    d3.select(this).selectAll("path").datum(d)
			});

			var tenColorScale = d3.scaleOrdinal()
			 						.domain(["UEFA", "CONMEBOL", "CAF", "AFC"])
			 						.range(d3.schemeCategory10)
			 						.unknown("gray")

			d3.selectAll("path").style("fill", function(p) {
				console.log("???????????????",p)
			    return tenColorScale(p.region)
			}).style("stroke", "black").style("stroke-width", "2px");
		}

	}

	// Script section
	// Based on current experiment,
	// this script section is **ONLY** operated when the .js file being imported by <src> section in HTML
	console.log('The teamsG in script section:', document.getElementById('teamsG'))


}



