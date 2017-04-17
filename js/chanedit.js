function View() {
	//this.btnIndex = -1;
	this.div = null;
	this.index = 0;
}

View.prototype = {

	getDiv: function() {
		return this.div;
	},

	setFocus: function(focus) {

	},

	setVisible: function(visible) {
		this.div.style.display = visible ? "block" : "none";
	},

	hide: function() {
		this.setVisible(false);
	},

	show: function() {

		this.setVisible(true)
	},
	
	render: function() {

	},

	onKeyEvent: function(key) {

	},

	moveTo: function(t, l, r, b) {

		if (typeof(this.div) === "object") {
			if (t || t === 0) this.div.style.top = t + "px";
			if (l || l === 0) this.div.style.left = l + "px";
			if (r || r === 0) this.div.style.right = r + "px";
			if (b || b === 0) this.div.style.bottom = b + "px";
		}
	}
}

function ListView(div, data) {
	View.call(this);
	this.data = data;
	this.items = [];
	this.div = div;

	this.selected = 0;
	this.displaycount = 8;
	this.displaybase = 0;
	this.startY = 0;
	this.item_height = 50;
	this.ctrl = new Controller();
	this.focusDiv = document.getElementById("itemFocus");
/*	var i;
	var item;
	var itemDiv;*/

//	for (i = 0; i < this.data.length; i++) {
//		item = this.ctrl.getView(this, this.items[i], i);
//		item.moveTo(i * this.item_height, null, null, null);
//		this.items[i] = item;
//	}
	
	this.needRepaintFocus = false;
	this.needRepaintItems = true;
	this.repaintItemsDirect = true; 
	this.render();
	
	this.painterList(true);
	this.focusMove();
	
}

ListView.prototype = new View();

ListView.prototype.setVisible = function(visible) {

}

ListView.prototype.setFocus = function(focus) {
	var item = this.items[this.selected];
	if (item)
		item.setFocus(focus);
}

ListView.prototype.painterList = function(isUp) {
	var i;
	var sum;
	var startY = this.startY;
	var items = this.items;
	var len = this.data.length;
	sum = len < this.displaycount ? len : this.displaycount;
//	debugger;
	if (isUp) {
		var base = this.displaybase;
		for (i = base > 0 ? -1 : 0; i < sum; i++) {
			items[i + base] = this.ctrl.getView(this,items[i + base],i + base);
			items[i + base].moveTo(startY + i * this.item_height, null, null, null);	
		}
		
	} else {
		
		startY += (sum - 1) * this.item_height;
		var bottom = this.displaybase + sum - 1;
		for (i = bottom > this.displaycount - 2 ? - 1: 0; i < sum; i++) {
			items[bottom - i] = this.ctrl.getView(this,items[bottom - i],bottom - i);
			items[bottom - i].moveTo(startY - i * this.item_height, null, null, null);
		}
		
	}
}

ListView.prototype.focusMove = function() {
	var t = this.index * this.item_height + "px";
	var pos = this.selected - this.displaybase;
	if (pos > -1 && pos < 14) {
		//this.focusDiv.style.webkitTransition = 'top 0.3s';
		this.focusDiv.style.top = parseInt(this.startY + pos * this.item_height) + 'px';
	}
}

ListView.prototype.setSelected = function(postion) {
	
}

ListView.prototype.render = function() {
	if (this.needRepaintFocus) {
		this.focusMove();
	}
	if (this.needRepaintItems) {
		this.painterList(this.repaintItemsDirect);
	}
}

ListView.prototype.onKeyEvent = function(keycode) {
	var sel = this.selected;
	var ctrl = this.ctrl;
	var items = this.items;
	var old_sel = sel;
	var channelCount = this.data.length;
	if (keycode == 40) { //down
		
		if (channelCount > 0) {
			sel ++;
			if (sel > channelCount - 1) {
				sel = channelCount - 1
			}
			this.index = sel;
			if (sel < channelCount) {	
				this.selected = sel;
				if (this.displaybase + parseInt(this.displaycount / 2) < sel && this.displaybase + this.displaycount < channelCount) {
					this.displaybase ++;
					//this.painterList(true);
					this.needRepaintFocus = false;
					this.needRepaintItems = true;
					this.repaintItemsDirect = true; 
				} else {
					//this.focusMove();
					this.needRepaintFocus = true;  
					this.needRepaintItems = false; 
				}
				this.render(); 
			}
		}
		
		if (sel !== old_sel) {
		
			/*if (channelCount > this.displaycount) {
				var a;
				a = sel > parseInt(this.displaycount / 2) ? true : false;
				//this.repaintItemsDirect = false;  
				this.onItemSelected(this, items[sel], sel, items[old_sel], old_sel,a);
			}else {
				
				this.onItemSelected(this, items[sel], sel, items[old_sel], old_sel,false);
			}*/
			this.needRepaintItems = true;
			if (channelCount > this.displaycount) {
				this.repaintItemsDirect = sel > parseInt(this.displaycount / 2) ? true : false;
			} else{
				this.repaintItemsDirect = false;
			}
			this.onItemSelected(this, items[sel], sel, items[old_sel], old_sel);
		}
	} 
	else if (keycode == 38) { //up
		if (channelCount > 0) {
			sel--;
			if (sel < 0) sel = 0;
			this.index = sel;
			if (sel > -1) {
				this.selected = sel;
				if (this.displaybase + parseInt(this.displaycount / 2) > sel && this.displaybase > 0) {
					this.displaybase --;
				//	this.painterList(false);
					this.needRepaintFocus = false;
					this.needRepaintItems = true;
					this.repaintItemsDirect = false;
				} else {
				//	this.focusMove();
					this.needRepaintFocus = true;
					this.needRepaintItems = false;
				}
				
				this.render();  
			}
		}
		if (sel !== old_sel) {
			
			/*if (channelCount > this.displaycount) {
				var a;
				a = sel > parseInt(this.displaycount / 2) ? true : false;
				this.onItemSelected(this, items[sel], sel, items[old_sel], old_sel,a);
			} else{
				this.onItemSelected(this, items[sel], sel, items[old_sel], old_sel,false);
			}*/
			this.needRepaintItems = true;
			if (channelCount > this.displaycount) {
				this.repaintItemsDirect = sel > parseInt(this.displaycount / 2) ? true : false;
			} else{
				this.repaintItemsDirect = false;
			}
			this.onItemSelected(this, items[sel], sel, items[old_sel], old_sel);
		}
	} else {
		var item = ctrl.getView(this, items[sel], sel);
		
		if (this.needDescendKeyEvent) {
			
			item.onKeyEvent(keycode, sel);
		} else if (keycode == 13) { //enter
			this.onItemClicked(this, item, sel);
		}
	}
}

ListView.prototype.onItemClicked = function (listview, itemview, postion) {
	
}

ListView.prototype.onItemSelected = function (listview, itemview_now, postion_now, itemview_old, postion_old) {
	
}

function ItemView(listview, data) {
	View.call(this);

	var div = listview.div; // To DO getDiv
	var skip = data.skip;
	var favor = data.favor;

	var chanDiv = document.createElement('div');
	chanDiv.className = 'chan-item';

	var numDiv = document.createElement('div');
	numDiv.className = 'chan-num';

	if (data.no < 10) {
		data.no = "00" + data.no;
	} else if (data.no > 9 && data.no < 100) {
		data.no = "0" + data.no;
	}
	numDiv.innerHTML = skip ? "..." : data.no;

	var nameDiv = document.createElement('div');
	nameDiv.className = 'chan-name';
	nameDiv.innerHTML = data.name;

	var operDiv = document.createElement("div");
	operDiv.className = "chan-oper";

	var skipDiv = document.createElement("div");
	skipDiv.className = "skip operate-btn";
	skipDiv.style.backgroundImage = skip ? "url(images/hide.png)" : "url(images/hide1.png)";

	var favorDiv = document.createElement("div");
	favorDiv.className = "favor operate-btn";
	favorDiv.style.backgroundImage = favor ? "url(images/collect.png)" : "url(images/collect1.png)";

	var moveDiv = document.createElement("div");
	moveDiv.className = "move operate-btn";

	operDiv.appendChild(skipDiv);
	operDiv.appendChild(favorDiv);
	operDiv.appendChild(moveDiv);

	chanDiv.appendChild(numDiv);
	chanDiv.appendChild(nameDiv);
	chanDiv.appendChild(operDiv);

	this.div = chanDiv;
	this.numDiv = numDiv;
	this.nameDiv = nameDiv;
	this.operDiv = operDiv;
	this.skipDiv = skipDiv;
	this.favorDiv = favorDiv;
	this.moveDiv = moveDiv;
	this.moveDiv.isMove = false;
	this.listview = listview;
	this.operBtns = [skipDiv, favorDiv, moveDiv];
	this.btnIndex = -1;
	div.appendChild(chanDiv);
}

ItemView.prototype = new View();

ItemView.prototype.choiceBtn = function() { 
	var operate = this.operBtns;
	var i;
	for (i = 0; i < operate.length; i++) {
		operate[i].style.border = '';
	}
	operate[this.btnIndex].style.border = "1px solid red";
}

ItemView.prototype.setFocus = function(focus) {
	var timer = null;
	var that = this;
	/*if (focus) {
		timer = setTimeout (function () {
			that.operDiv.style.display = "block";
		},150)
	} else {
		this.operDiv.style.display = "none";
	}*/
	this.operDiv.style.display = focus ? "block" : "none";
	if (!focus && this.btnIndex != -1) {
		this.operBtns[this.btnIndex].style.border = "";
		this.btnIndex = -1;
	}
}

ItemView.prototype.onEnterDown = function(data) {
	var btnindex = this.btnIndex;
	switch (btnindex) {
		case 0:
			data.skip = !data.skip;
			break;
		case 1:
			data.favor = !data.favor;
			break;
		case 2:
			this.moveDiv.isMove = !this.moveDiv.isMove;
			this.moveDiv.style.backgroundImage = this.moveDiv.isMove ? "url(images/move.png)" : "url(images/move1.png)";
			break;
		default:
			break;
	}
}

ItemView.prototype.onKeyEvent = function(keycode, index) {
	switch (keycode) {
		case 37:
			this.btnIndex--;
			if (this.btnIndex < 0) {
				this.btnIndex = 0;
			}
			this.choiceBtn();
			break;
		case 39:
			this.btnIndex++;
			if (this.btnIndex > this.operBtns.length - 1) {
				this.btnIndex = this.operBtns.length - 1;
			}
			this.choiceBtn();
			break;
		case 13:
			this.onEnterDown(itemArr[index]);
			this.update(itemArr[index]);
			break;
		default:
			break;
	}
}

ItemView.prototype.update = function(data) {
	this.nameDiv.innerHTML = data.name;
	this.numDiv.innerHTML = data.skip ? "..." : data.no;
	this.skipDiv.style.backgroundImage = data.skip ? "url(images/hide.png)" : "url(images/hide1.png)";
	this.favorDiv.style.backgroundImage = data.favor ? "url(images/collect.png)" : "url(images/collect1.png)";
	this.moveDiv.style.backgroundImage = this.moveDiv.isMove ? "url(images/move.png)" : "url(images/move1.png)";
}

function Controller() {

}

Controller.prototype = {
	getView: function(listview, itemview, position) {
		if (!itemview) {
			var item = new ItemView(listview, listview.data[position]);
			itemview = item;
		} else {
			itemview.update(listview.data[position]);
		}
		return itemview;
	}
}

function Model(data) {
	this.data = data;
}

Model.prototype = {
	getItems: function() {

	},
	getDate: function() {

	}
}

function init_listview() {
	
	var listview = new ListView(document.getElementById("chan_list"), itemArr);
	listview.onItemClicked = function() {
		// for play	or open page
		
	};
	
	listview.needDescendKeyEvent =  true;

	listview.onItemSelected = function(listview, itemview_now, postion_now, itemview_old, postion_old) {
		// for play	or open page
		
		itemview_now.setFocus(true);
		itemview_old.setFocus(false);
		
		if(itemview_old.moveDiv.isMove)
		{
			var temp = this.data[postion_now];
			this.data[postion_now] = this.data[postion_old];
			this.data[postion_old] = temp;
			
			itemview_now.moveDiv.isMove = true;
			itemview_old.moveDiv.isMove = false;
			
			//this.painterList(isMoving);
			
			this.render();

		}
	};
	
	
	listview.show();

	listview.setFocus(true);

	document.onkeydown = function(e) {
		var key = e.keyCode;
		listview.onKeyEvent(key);
	}
}

init_listview();