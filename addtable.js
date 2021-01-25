

// 3.3
function addtable(){
	console.log("addtable++++++++++++++++++")
	d3.text("modal.html").then(data => {
		console.log("addtable modal html data+++++++++++++!", data)
		var htmldata = d3.select("body").append("div").attr("id", "modal").append("html").html(data) //也可以不加append html，h5结构不同但显示形式相同
		//return htmldata
	  })


	var teamG = d3.selectAll("g.overallG")
	teamG.on("click", teamClick)

	function teamClick(d){
		console.log("check teamClick d+++++++++++++", d)
		d3.selectAll("td data")
			.data(d3.value(d))
			.html(p =>p)
	}

}