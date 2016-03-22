var TheHeadLines = new Array();

//May become deprecated
var IsThreeRows = undefined;
var IsMobile = false;
var Nperrow = 4;
var LeContentObjectID = "LeContent";
var FooterObjectID = "footer";

//New Variables
NavLocation = "resources.json";
Sitemap = undefined;

//May become deprecated
function SetUIVariables()
{
	if(IsMobile)
	{
		Nperrow = 1;
		LeContentObjectID = "Mobile-LeContent";
		FooterObjectID = "Mobile-Footer";
	}
}

var TheGrid = new Object();

function OnLoad()
{
	SetUIVariables();
	//Now we'll have to load from external JSON
	/*LoadResources();
	PutInGrid();
	OnResize();*/
	
	//Let's do just that
	//LoadPage(NavLocation);
	GetSitemap();
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


	document.getElementById(LeContentObjectID).appendChild(this.Obj);

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

//Grid might be different from now on.

function PutInGrid()
{
	TheGrid.table = document.createElement("table");
	TheGrid.table.style.width = "100%";

	document.getElementById(LeContentObjectID).appendChild(TheGrid.table);

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

//Might become deprecated
function OnResize()
{
	/*
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
	*/
	pageheight = Math.max( document.body.scrollHeight, document.body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
    document.getElementById(FooterObjectID).style.top = pageheight - 101;

}

//Might become deprecated
function SwitchToThreePerRow()
{
	document.getElementById(LeContentObjectID).style.left = "Calc(50% - 500px)";
	document.getElementById(LeContentObjectID).style.width = "1000px";
	//document.getElementById("backgroundcenter").style.backgroundPosition = "center";
	IsThreeRows = true;
}

//Might become deprecated
function SwitchToTwoPerRow()
{
	document.getElementById(LeContentObjectID).style.left = "Calc(50% - 332px)";
	document.getElementById(LeContentObjectID).style.width = "664px";
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

//Mobile specific

function OpenCompactMenu()
{
	document.getElementById("CompactMenuDrawer").className = "DrawerOpen";
	document.getElementById("CompactMenuModal").className = "";
}

function CloseCompactMenu()
{
	document.getElementById("CompactMenuDrawer").className = "DrawerClosed";
	document.getElementById("CompactMenuModal").className = "pseudo-hidden";
}

//Multi-page navigation

function LoadArticle(ArticleHTML)
{
	document.getElementById("LeContent").innerHTML = ArticleHTML;
	document.getElementById("LeMenu").className = "UpTitleAbsolute";
}

function GetJSON(url) {
	return new Promise(function(resolve, reject) {
		var req = new XMLHttpRequest();
		req.open('GET', url);
		req.onload = function() {
			if(req.status == 200) {
				resolve(JSON.parse(req.response));
			}
			else {
				reject(Error(req.statusText));
			}
		}
		req.onerror = function() {
			reject(Error("Network Error"));
		}
		req.send();
	});
}

function LoadPage(url) {
	NavLocation = url;
	ClearPage();
	GetJSON(NavLocation).then(function(response) {
		response.map(function(item, index) {
			switch(item.Type)
			{
				case "Picture":
					TheHeadLines.push(new HeadLine(item.Thumbnail, item.Caption, item.Picture, 0));
					break;
				case "Article":
					LoadArticle(item.HTML);
					break;
				case "PostIt":
					TheHeadLines.push(new HeadLine("", item.Caption, item.URL, 3));
					break;
				case "PolaroidLink":
					TheHeadLines.push(new HeadLine(item.Thumbnail, item.Caption, item.URL, 1));
					break;
			}
		});
	})
	.catch(function(response) {
		console.log("Failed to open page." + response);
	});
}

function ClearPage() {
	TheHeadLines = null;
	TheHeadLines = new Array();
	document.getElementById(LeContentObjectID).innerHTML = "";
	document.getElementById("LeMenu").className = "UpTitleAbsolute";
}

//Hash navigation

window.onhashchange = GoHash = function() {
	if(location.hash != "") {
		var hashvalue = location.hash.substring(1, location.hash.length);
		//LoadPage(hashvalue + "/index.json");
	}
	else {
		var hashvalue = "home";
	}
	if(Sitemap) {
		Sitemap.map(function(item, index) {
			if(item.name == hashvalue) {
				LoadPage(item.address);
			}
		});
	}
}

GetSitemap = function() {
	GetJSON("index_resources/sitemap.json").then(function(response) {
		Sitemap = response;
		GoHash();
	});
}








