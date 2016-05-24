var TheHeadLines = new Array();

//May become deprecated
var IsThreeRows = undefined;
var IsMobile = false;
var Nperrow = 4;
var LeContentObjectID = "LeContent";
var LeArticleObjectID = "LeArticle";
var FooterObjectID = "footer";

//For Headline function
var HeadLineSwitch = false;

//New Variables
NavLocation = "resources.json";
Sitemap = undefined;

didScroll = false;
ScrollRefPoint = null;

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
	imageMapResize();
	SetUIVariables();
	//Now we'll have to load from external JSON
	/*LoadResources();
	PutInGrid();
	OnResize();*/
	
	//Let's do just that
	//LoadPage(NavLocation);
	GetSitemap();
	setInterval(OnResize, 1000);
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
	
	if(this.type == 2)
	{
		this.Obj.onclick = function() {
			OpenMusicModal(that.url);
		}
	}


	if(this.type == 1 || this.type == 3 || this.type == 4)
	{
		this.Obj.onclick = function() {
			GoToURL(that.url);
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
	this.Obj.appendChild(this.Frame);

	this.Label = document.createElement("div");
	this.Label.innerHTML = this.msg;
	this.Obj.appendChild(this.Label);

	if(this.type == 3)
	{
		this.Frame.src = "index_resources/postit.png";
		this.Frame.className = "PostItframe";
		this.Obj.className = "PieceOfContentPostIt";
		this.Label.className = "contentlabelPostIt";
	}
	else
	{
		this.Frame.src = "index_resources/frame.png";
		this.Frame.className = "contentframe";
		this.Obj.className = "PieceOfContentPolaroid";
		this.Label.className = "contentlabelPolaroid";
	}
	
	this.Obj.style.webkitTransform = "rotate(" + (Math.random()*30 - 15) + "deg)"

	if(this.type == 4) {
		HeadLineSwitch = !HeadLineSwitch;
		
		this.UpperObj = document.createElement("div");
		document.getElementById(LeContentObjectID).appendChild(this.UpperObj);
		this.UpperObj.style.display = "flex";
		this.UpperObj.appendChild(this.Obj);
		
		this.SideText = document.createElement("div");
		this.UpperObj.appendChild(this.SideText);
		this.SideText.className = "PolaroidSideText";
		
		//next line will undo what we have done earlier this function
		this.Label.innerHTML = "";
		
		this.SideTextH1 = document.createElement("h1");
		this.SideTextH1.innerHTML = this.msg.Title;
		this.SideText.appendChild(this.SideTextH1);
		
		this.SideTextHR = document.createElement("hr");
		this.SideText.appendChild(this.SideTextHR);
		
		this.SideTextP = document.createElement("p");
		this.SideTextP.innerHTML = this.msg.Message;
		this.SideText.appendChild(this.SideTextP);
		
		if(HeadLineSwitch) {
			this.SideText.style.order = "1";
			this.Obj.style.order = "2";
		}
	}

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
	document.getElementById(FooterObjectID).style.top = -101;
	pageheight = Math.max(document.body.scrollHeight, document.body.offsetHeight);
    document.getElementById(FooterObjectID).style.top = pageheight - 101;
}

function OnScroll()
{
	didScroll = true;
}

setInterval(function() {
	if(didScroll && !ScrollRefPoint) {
		ScrollRefPoint = window.scrollY;	
	}
	else if(didScroll) {
		var ScrollDelta = window.scrollY - ScrollRefPoint;
		if(window.scrollY >= 200) {
			if(ScrollDelta >= 50) {
				//Hide menu
				document.getElementById("BackMenu").classList.add("NavUp");
				document.getElementById("Title").classList.add("NavUp");
				document.getElementById("CompactTitle").classList.add("NavUp");
				document.getElementById("WNCH").classList.add("NavUp");
				document.getElementById("NeonLL").classList.add("NavUp");
				document.getElementById("NeonRR").classList.add("NavUp");
				didScroll = false;
				ScrollRefPoint = null;
			}
			if(ScrollDelta <= -50) {
				//show menu
				document.getElementById("BackMenu").classList.remove("NavUp");
				document.getElementById("Title").classList.remove("NavUp");
				document.getElementById("CompactTitle").classList.remove("NavUp");
				document.getElementById("WNCH").classList.remove("NavUp");
				document.getElementById("NeonLL").classList.remove("NavUp");
				document.getElementById("NeonRR").classList.remove("NavUp");
				didScroll = false;
				ScrollRefPoint = null;
			}
		}
		else {
			//show menu
			document.getElementById("BackMenu").classList.remove("NavUp");
			document.getElementById("Title").classList.remove("NavUp");
			document.getElementById("CompactTitle").classList.remove("NavUp");
			document.getElementById("WNCH").classList.remove("NavUp");
			document.getElementById("NeonLL").classList.remove("NavUp");
			document.getElementById("NeonRR").classList.remove("NavUp");
			didScroll = false;
			ScrollRefPoint = null;
		}
	}
}, 250);

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
	document.body.classList.remove("ModalOpen");
	document.getElementById("ModalView").style.display = "none";
}

function OpenModal(imgUrl, imgCaption)
{
	document.body.classList.add("ModalOpen");
	document.getElementById("ModalView").style.display = "block";
	document.getElementById("modalcaption").innerHTML = imgCaption;
	document.getElementById("modalpic").style.background = "url(" + imgUrl + ")";
	document.getElementById("modalpic").style.backgroundPosition = "center center";
	document.getElementById("modalpic").style.backgroundSize = "contain";
	document.getElementById("modalpic").style.backgroundRepeat = "no-repeat";
	document.getElementById("modalpic").innerHTML = "";
}

function OpenMusicModal(songUrl)
{
	document.body.classList.add("ModalOpen");
	document.getElementById("ModalView").style.display = "block";
	document.getElementById("modalcaption").innerHTML = "";
	document.getElementById("modalpic").style.background = "";
	document.getElementById("modalpic").style.backgroundPosition = "center center";
	document.getElementById("modalpic").style.backgroundSize = "contain";
	document.getElementById("modalpic").style.backgroundRepeat = "no-repeat";
	document.getElementById("modalpic").innerHTML = '<iframe width="500" style="position: relative; top: calc(50vh - 50px - 150px);left: calc(50% - 250px);" height="300" scrolling="no" frameborder="no" src="' + songUrl + '"></iframe>';
}


//Mobile specific

function OpenCompactMenu()
{
	document.body.classList.add("ModalOpen");
	document.getElementById("CompactMenuDrawer").className = "DrawerOpen";
	document.getElementById("CompactMenuModal").className = "";
}

function CloseCompactMenu()
{
	document.body.classList.remove("ModalOpen");
	document.getElementById("CompactMenuDrawer").className = "DrawerClosed";
	document.getElementById("CompactMenuModal").className = "pseudo-hidden";
}

function DrawerGo(towhere)
{
	GoToURL(towhere);
	location.href = towhere;
	CloseCompactMenu();
}

//Multi-page navigation

function GoToURL(towhere)
{
	if(towhere.substring(0,1) == "#")
	{
		location.href = towhere;
	}
	else
	{
			var form = document.createElement("form");
			form.method = "GET";
			form.action = towhere;
			form.target = "_blank";
			document.body.appendChild(form);
			form.submit();
	}
}

function LoadArticle(ArticleHTML)
{
	document.getElementById(LeContentObjectID).innerHTML = "";
	document.getElementById(LeArticleObjectID).innerHTML = ArticleHTML;
	document.getElementById(LeArticleObjectID).style.display = "block";
	document.getElementById("LeMenu").className = "UpTitleAbsolute";
	OnResize();
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
	document.getElementById(FooterObjectID).style.top = -101;
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
				case "PolaroidMusic":
					TheHeadLines.push(new HeadLine(item.Thumbnail, item.Caption, item.SongURL, 2));
					break;
				case "PolaroidText":
					TheHeadLines.push(new HeadLine(item.Thumbnail, {Title: item.CaptionTitle, Message: item.Caption}, item.URL, 4));
					break;
			}
		});
		//Update the footer
		OnResize();
	})
	.catch(function(response) {
		console.log("Failed to open page." + response);
	});
}

function ClearPage() {
	TheHeadLines = null;
	TheHeadLines = new Array();
	document.getElementById(LeContentObjectID).innerHTML = "";
	document.getElementById(LeArticleObjectID).innerHTML = "";
	document.getElementById(LeArticleObjectID).style.display = "none";
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








