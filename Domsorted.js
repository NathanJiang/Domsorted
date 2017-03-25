(function () {
	var options = {
		tableID: '',
		tbodyID: '',
		sortedID: '',
	};
	
	var keyNumber = function(dom,sortedID){
		var nodesList = dom.getElementsByTagName('td'),
			res;
		for(var i = 0; i < nodesList.length; i++){
			(function(arg){   
  				if(nodesList[i].getAttribute("id") == sortedID){
					res = i;
				}
 			})(i);
		}
		return res;
	};

	var sortByColumn = function(key, desc){
		return function(x, y){
			if(desc == true){
				return x[key] - y[key];
			} else {
				return y[key] - x[key];
			}
		}
	};

	function coreTable(tag, tableID, tbodyID, sortedID) {
		document.getElementById(sortedID).addEventListener('click',function(){
			var arr = [],
				sortedIdIndex = keyNumber(document.getElementById(sortedID).parentNode, sortedID)
			var tbody = document.getElementById(tbodyID).cloneNode(true).getElementsByTagName('tr');
			for (var index=0; index<tbody.length; index++){
				var tmpArr = {
					content: parseFloat( tbody[index].getElementsByTagName('td')[sortedIdIndex].innerHTML),
					index : index
				};
				arr.push(tmpArr);
			}
			var desc = document.getElementById(sortedID).getAttribute("reverse")!="false" ? false : true;
			arr.sort(sortByColumn("content",desc));
			document.getElementById(sortedID).setAttribute("reverse",desc);
			document.getElementById(tbodyID).innerHTML = '';
			for(var item in arr){
				var tmp = tbody[arr[item].index].cloneNode(true);
				document.getElementById(tbodyID).appendChild(tmp);
			}
			tbody = null;
		},false);
	}

	function coreMain(tag, tableID, tbodyID, sortedID) {
		if (sortedID == 'all'){
			var tds = document.querySelectorAll("#" + tableID + " thead tr td");
			var count = 0;
			tds.forEach(function(e){
				var tmpIdName = "Domsorted_" + tableID + "_" + String(++count);
				e.setAttribute("id", tmpIdName);
				coreTable(tag, tableID, tbodyID, tmpIdName)
			})
		} else {
			coreTable(tag, tableID, tbodyID, sortedID)
		}

	}

	var api = {
		config: function (opts) {
			if(!opts) return options;
			for(var key in opts) {
				options[key] = opts[key];
			}
			return this;
		},

		listen: function listen(elem) {
			if (typeof elem === 'string') {
				var elems = document.querySelectorAll(elem),
					i = elems.length;
					if(i==0){
						console.log("no Dom bind");
						return;
					}
					while (i--) {
						listen(elems[i]);
					}
					if( document.getElementById(options.sortedID) || options.sortedID == 'all' ) {
						coreMain(elem, options.tableID, options.tbodyID, options.sortedID);
					} else {
						console.log("This dom '#"+options.tableID + "' does not exists.")
					}
					return;
			}
			return this;
		}
	}
	this.Domsorted = api;
})();