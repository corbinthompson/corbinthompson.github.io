var TheHeadLines = new Array();
var IsThreeRows = undefined;
var Nperrow = 4;

var TheGrid = new Object();

function OnLoad()
{
	LoadResources();
	PutInGrid();
	OnResize();
}

function HeadLine(imgsrc, msg, url, type)
{
	var that = this;
	this.imgsrc = imgsrc;
	this.msg = msg;
	this.url = url;
	this.type = type;

	this.Obj = document.createElement("div");

	if(this.type == undefined)
	{
		this.type = 0;
	}

	if(this.type == 0)
	{
		this.Obj.onclick = function() {
			OpenModal(that.url, that.msg);
		}
	}

	if(this.type == 1)
	{
		this.Obj.onclick = function() {
			var form = document.createElement("form");
			form.method = "GET";
			form.action = that.url;
			form.target = "_blank";
			document.body.appendChild(form);
			form.submit();
		}
	}if(this.type == 3)
	{
		this.Obj.onclick = function() {
			var form = document.createElement("form");
			form.method = "GET";
			form.action = that.url;
			form.target = "_blank";
			document.body.appendChild(form);
			form.submit();
		}
	}


	document.getElementById("LeContent").appendChild(this.Obj);

	this.Pic = document.createElement("div");
	this.Pic.className = "contentpic";
	this.Pic.style.background = "url(" + this.imgsrc + ")";
	this.Pic.style.backgroundSize = "cover";
	this.Pic.style.backgroundRepeat = "no-repeat";
	this.Pic.style.backgroundPosition = "center top";
	this.Obj.appendChild(this.Pic);

	this.Frame = document.createElement("img");
	this.Frame.draggable = false;
	this.Frame.className = "contentframe";
	this.Obj.appendChild(this.Frame);

	this.Label = document.createElement("div");
	this.Label.innerHTML = this.msg;
	this.Obj.appendChild(this.Label);

	if(this.type == 3)
	{
		this.Frame.src = "index_resources/postit.png";
		this.Frame.style.width = "250px";
		this.Frame.style.height = "250px";
		this.Obj.className = "PieceOfContentPostIt";
		this.Label.className = "contentlabelPostIt";
	}
	else
	{
		this.Frame.src = "index_resources/frame.png";
		this.Frame.style.width = "198px";
		this.Frame.style.height = "272px";
		this.Obj.className = "PieceOfContentPolaroid";
		this.Label.className = "contentlabelPolaroid";
	}

	this.Obj.style.webkitTransform = "rotate(" + (Math.random()*30 - 15) + "deg)"

}

function PutInGrid()
{
	TheGrid.table = document.createElement("table");
	TheGrid.table.style.width = "100%";

	document.getElementById("LeContent").appendChild(TheGrid.table);

	TheGrid.rows = new Array();
	TheGrid.cells = new Array();
	for(i=0;i<Math.ceil(TheHeadLines.length/Nperrow);i++)
	{
		TheGrid.rows[i] = document.createElement("tr");
		TheGrid.table.appendChild(TheGrid.rows[i]);
		TheGrid.cells[i] = new Array();

		for(j=0;j<Nperrow;j++)
		{

			TheGrid.cells[i][j] = document.createElement("td");
			TheGrid.rows[i].appendChild(TheGrid.cells[i][j]);
			if((i*Nperrow + j) < TheHeadLines.length)
			{
						TheGrid.cells[i][j].appendChild(TheHeadLines[i*Nperrow + j].Obj);
			}
		}
	}
}

function OnResize()
{
	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	if(w>h)
	{
		if(IsThreeRows == false || IsThreeRows == undefined)
		{
			SwitchToThreePerRow();
		}
	}
	else
	{
		if(IsThreeRows)
		{
			SwitchToTwoPerRow();
		}
	}
	var body = document.body,
    html = document.documentElement;

	var pageheight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
    document.getElementById("footer").style.top = pageheight - 201;

}

function SwitchToThreePerRow()
{
	document.getElementById("LeContent").style.left = "Calc(50% - 500px)";
	document.getElementById("LeContent").style.width = "1000px";
	//document.getElementById("backgroundcenter").style.backgroundPosition = "center";
	IsThreeRows = true;
}

function SwitchToTwoPerRow()
{
	document.getElementById("LeContent").style.left = "Calc(50% - 332px)";
	document.getElementById("LeContent").style.width = "664px";
	//document.getElementById("backgroundcenter").style.backgroundPosition = "Calc(50% - 166px)";
	IsThreeRows = false;
}

//Modal functions

function CloseModal()
{
	document.getElementById("ModalView").style.display = "none";
}

function OpenModal(imgUrl, imgCaption)
{
	document.getElementById("ModalView").style.display = "block";
	document.getElementById("modalcaption").innerHTML = imgCaption;
	document.getElementById("modalpic").style.background = "url(" + imgUrl + ")";
	document.getElementById("modalpic").style.backgroundPosition = "center center";
	document.getElementById("modalpic").style.backgroundSize = "contain";
	document.getElementById("modalpic").style.backgroundRepeat = "no-repeat";
}