var count;
var interval;
var step = 1;
document.getElementById("btn").onclick = function() {
			var val = document.getElementById("text").value;
			var width = val.length;
			console.log(width)
			if(val) {
				if(interval)
					clearInterval(interval)
				var div  = document.getElementById("div")
				div.innerHTML = val;
				count  = 0;
				interval = setInterval(function(){
					count+=step;
					if(count >= window.innerWidth-width) {
					console.log(window.innerWidth)
					console.log(width)
					console.log(count)
						step*=-1;
						//count= 0;
					}
					if(count <-step) {
						//count= 0;
						step*=-1;
					}
					div.style.marginLeft=count+"px";
				},5)
			} else {	
				alert("TextBox is empty");
			}
		}